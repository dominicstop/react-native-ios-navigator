import React, { ReactElement } from 'react';
import { StyleSheet, findNodeHandle, processColor } from 'react-native';

import { RNINavigatorView } from '../native_components/RNINavigatorView';
import { RNINavigatorViewModule } from '../native_modules/RNINavigatorViewModule';

import { NavigatorRouteView } from './NavigatorRouteView';

import type { onNavRouteDidPopPayload, onNavRouteViewAddedPayload, onNavRouteWillPopPayload } from '../native_components/RNINavigatorView';
import type { RouteContentProps } from '../components/NavigatorRouteView';

import * as Helpers from '../functions/Helpers';
import { EventEmitter } from '../functions/EventEmitter';


//#region - Type Definitions
/** Represents the current status of the navigator */
enum NavStatus {
  IDLE        = "IDLE"       , // nav. is idle, not busy
  IDLE_INIT   = "IDLE_INIT"  , // nav. just finished init.
  IDLE_ERROR  = "IDLE_ERROR" , // nav. is idle due to error
  NAV_PUSHING = "NAV_PUSHING", // nav. is busy pushing
  NAV_POPPING = "NAV_POPPING", // nav. is just popping
};

enum NavEvents {
  onNavRouteViewAdded = "onNavRouteViewAdded"
};

type RouteOptions = {
  routeTitle?: string;
};

/** Represents a route in the navigation stack. */
type NavRouteItem = {
  routeKey     : string;
  routeProps  ?: object;
  routeOptions?: RouteOptions;
};

export type NavRouteConfigItem = {
  routeKey     : string;
  routeProps  ?: object;
  routeOptions?: RouteOptions;
  renderRoute  : (routeItem: NavRouteItem, routeIndex: number) => ReactElement<RouteContentProps>;
};

/** `NavigatorView` comp. props */
type NavigatorViewProps = {
  routes: Array<NavRouteConfigItem>;
  initialRouteKey: string;
  // navigation bar props
  navigationBarStyle?: string;
  navigationBarTintColor?: string;
  navigationBarIsTranslucent?: boolean;
};

/** `NavigatorView` comp. state */
type NavigatorViewState = {
  activeRoutes: Array<NavRouteItem>,
};
//#endregion


export class NavigatorView extends React.PureComponent<NavigatorViewProps, NavigatorViewState> {
  //#region - Property Declarations
  state: NavigatorViewState;
  navStatus: NavStatus;
  emitter: EventEmitter<NavEvents>;

  /** A ref to the `RNINavigatorView` native component. */
  nativeRef: React.Component;
  //#endregion

  constructor(props: NavigatorViewProps){
    super(props);
  
    this.navStatus = NavStatus.IDLE_INIT;

    this.emitter = new EventEmitter<NavEvents>();

    const initialRoute = props.routes.find(item => (
      item.routeKey == props.initialRouteKey
    ));

    this.state = {
      activeRoutes: [initialRoute],
    };
  };

  //#region - Private Functions
  private getMatchingRoute = (routeItem: NavRouteItem) => {
    return this.props.routes.find(item => (
      item.routeKey == routeItem.routeKey
    ));
  };

  /** Add route to `state.activeRoutes` and wait for it to be added in
    * the native side as a subview (i.e. `RNINavigatorView`) */
  private addRoute = (routeItem: NavRouteItem) => {
    //#region - 🐞 DEBUG 🐛
    LIB_GLOBAL.debugLog && console.log(
        `LOG/JS - NavigatorView, addRoute`
      + ` - with routeKey: ${routeItem.routeKey}`
      + ` - current activeRoutes: ${this.state.activeRoutes.length}`
    );
    //#endregion

    return Promise.all([
      // -----------------------------------------------------
      // 1. Wait for the new route to be added in native side.
      //    note: This promise will reject if `onNavRouteViewAdded` fails to fire
      //    within 500 ms (i.e. if it takes to long for the promise to be fulfilled).
      // ----------------------------------------------------------------------------
      Helpers.promiseWithTimeout(500, new Promise<void>(resolve => {
        this.emitter.once(NavEvents.onNavRouteViewAdded, () => {
          resolve();
        })
      })),
      // --------------------------------------
      // 2. Append new route to `activeRoutes`.
      //    The new route will be "received" from `RNINavigatorView`.
      // ------------------------------------------------------------
      Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
        activeRoutes: [...prevState.activeRoutes, {
          routeKey    : routeItem.routeKey    ,
          routeProps  : routeItem.routeProps  ,
          routeOptions: routeItem.routeOptions,
        }]
      }))
    ]);
  };

  /** Remove route to `state.activeRoutes` */
  private removeRoute = (params: { routeKey: string, routeIndex: number }) => {
    //#region - 🐞 DEBUG 🐛
    LIB_GLOBAL.debugLog && console.log(
        `LOG/JS - NavigatorView, removeRoute`
      + ` - with routeKey: ${params.routeKey}`
      + ` - routeIndex: ${params.routeIndex}`
      + ` - current activeRoutes: ${this.state.activeRoutes.length}`
    );
    //#endregion

    // Remove route from `activeRoutes`.
    // The route will be "removed" from `RNINavigatorView`'s subviews.
    return Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
      activeRoutes: prevState.activeRoutes.filter((route, index) => !(
        (index          == params.routeIndex) &&
        (route.routeKey == params.routeKey  )
      ))
    }));
  };

  private _handleGetRefToNavigator = (): NavigatorView => {
    return this;
  };
  //#endregion

  //#region - Public Functions
  public push = async (routeItem: NavRouteItem) => {
    const routeDefault = this.getMatchingRoute(routeItem);

    if(!routeDefault){
      throw new Error("`NavigatorView` failed to do: `push`: Invalid `routeKey`");
    };
    
    // TEMP, replace with queue - skip if nav. is busy
    if(NavigatorViewUtils.isNavStateBusy(this.navStatus)) return;

    try {

      // update nav status to busy
      this.navStatus = NavStatus.NAV_PUSHING;

      // add new route, and wait for it be added
      await this.addRoute({
        routeKey  : routeItem.routeKey,
        routeProps: routeItem.routeProps ?? {},
        routeOptions: {
          routeTitle: (
            routeItem   .routeOptions?.routeTitle ?? 
            routeDefault.routeOptions?.routeTitle ??
            routeItem   .routeKey
          ),
        }
      });

      // forward "push" request to native module
      await Helpers.promiseWithTimeout(1000,
        RNINavigatorViewModule.push(
          findNodeHandle(this.nativeRef),
          routeItem.routeKey
        )
      );
      
      // update nav status to idle
      this.navStatus = NavStatus.IDLE;

    } catch(error){
      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, push`
        + ` - error message: ${error}`
      );
      //#endregion

      this.navStatus = NavStatus.IDLE_ERROR;
      throw new Error("`NavigatorView` failed to do: `push`");
    };
  };

  public pop = async () => {
    // TEMP, replace with queue - skip if nav. is busy
    if(NavigatorViewUtils.isNavStateBusy(this.navStatus)) return;

    try {
      // update nav status to busy
      this.navStatus = NavStatus.NAV_POPPING;

      // forward "pop" request to native module
      const result = await Helpers.promiseWithTimeout(1000,
        RNINavigatorViewModule.pop(
          findNodeHandle(this.nativeRef)
        )
      );

      // remove popped route from `activeRoutes`
      await this.removeRoute(result);

      // update nav status to idle
      this.navStatus = NavStatus.IDLE;

    } catch(error){
      this.navStatus = NavStatus.IDLE_ERROR;
      throw new Error("`NavigatorView` failed to do: `pop`");
    };
  };

  public setNavigationBarHidden = async (isHidden: boolean, animated: boolean) => {
    try {
      await Helpers.promiseWithTimeout(1000,
        RNINavigatorViewModule.setNavigationBarHidden(
          findNodeHandle(this.nativeRef),
          isHidden, animated
        )
      );

    } catch(error){
      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, setNavigationBarHidden`
        + ` - error message: ${error}`
      );
      //#endregion

      throw new Error("`NavigatorView` failed to do: `setNavigationBarHidden`");
    };
  };
  //#endregion

  //#region - Native Event Handlers
  /** Handler for native event: `onNavRouteViewAdded` */
  private _handleOnNavRouteViewAdded = ({nativeEvent}: onNavRouteViewAddedPayload) => {
    // emit event: nav. route was added to `RNINavigatorView`'s subviews
    this.emitter.emit(NavEvents.onNavRouteViewAdded, {
      target    : nativeEvent.target,
      routeKey  : nativeEvent.routeKey,
      routeIndex: nativeEvent.routeIndex,
    });
  };

  /** Handler for native event: `onNavRouteWillPop` */
  private _handleOnNavRouteWillPop = ({nativeEvent}: onNavRouteWillPopPayload) => {
    // a route is about to be removed either through a tap on the "back" button,
      // or through a swipe back gesture.
    if(nativeEvent.isUserInitiated){
      // TODO
    };
  };

  /** Handler for native event: `onNavRouteDidPop` */
  private _handleOnNavRouteDidPop = ({nativeEvent}: onNavRouteDidPopPayload) => {
    // A: A route has been removed either through a tap on the "back" 
    //    button, or through a swipe back gesture.
    if(nativeEvent.isUserInitiated){
      // A1: Remove route
      this.removeRoute({
        routeKey  : nativeEvent.routeKey,
        routeIndex: nativeEvent.routeIndex
      });
    };
  };
  //#endregion
  
  render(){
    const props = this.props;
    const { activeRoutes } = this.state;

    const routes = activeRoutes.map((route, index) => (
      <NavigatorRouteView
        key={`${route.routeKey}-${index}`}
        routeIndex={index}
        routeKey={route.routeKey}
        routeProps={route.routeProps}
        getRefToNavigator={this._handleGetRefToNavigator}
        initialRouteTitle={(
          route.routeOptions?.routeTitle ??
          route.routeKey
        )}
        renderRouteContent={() => {
          const routeItem = this.getMatchingRoute(route);
          return routeItem.renderRoute(routeItem, index);
        }}
      />
    ));

    return (
      <RNINavigatorView 
        ref={r => this.nativeRef = r}
        style={styles.navigatorView}
        navigationBarStyle={props.navigationBarStyle}
        navigationBarTintColor={processColor(props.navigationBarTintColor)}
        navigationBarIsTranslucent={props.navigationBarIsTranslucent}
        // event handlers
        onNavRouteWillPop={this._handleOnNavRouteWillPop}
        onNavRouteDidPop={this._handleOnNavRouteDidPop}
        onNavRouteViewAdded={this._handleOnNavRouteViewAdded}
      >
        {routes}
      </RNINavigatorView>
    );
  };
};

/** Utilities for `NavigatorView` */
class NavigatorViewUtils {
  static isNavStateIdle(navStatus: NavStatus){
    return (
      navStatus == NavStatus.IDLE       ||
      navStatus == NavStatus.IDLE_INIT  ||
      navStatus == NavStatus.IDLE_ERROR
    );
  };

  static isNavStateBusy(navStatus: NavStatus){
    return !NavigatorViewUtils.isNavStateIdle(navStatus);
  };
};

const styles = StyleSheet.create({
  navigatorView: {
    flex: 1,
  },
});
