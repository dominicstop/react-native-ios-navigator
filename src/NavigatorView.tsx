import React from 'react';
import { StyleSheet, requireNativeComponent,  ViewStyle } from 'react-native';

import { NavigatorViewModule } from './NavigatorViewModule';
import { NavigatorRouteView } from './NavigatorRouteView';

import * as Helpers from './Helpers';
import { EventEmitter } from './EventEmitter';

//#region - Type Definitions
/** Represents the current status of the navigator */
enum NavStatus {
  INIT        = "INIT"       , // init. status: preparing nav.
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
  routeTitle: string;
};

/** Represents a route in the navigation stack. */
type NavRouteItem = {
  routeKey     : string;
  routeProps  ?: object;
  routeOptions?: RouteOptions;
};

//#region - `RNINavigatorView` Events
type onNavRouteViewAddedPayload = { nativeEvent: {
  target    : number,
  routeKey  : string,
  routeIndex: number
}};

type onNavRouteWillPopPayload = { nativeEvent: {
  target         : number,
  routeKey       : string,
  routeIndex     : number,
  isUserInitiated: boolean
}};

type onNavRouteDidPopPayload = { nativeEvent: {
  target         : number,
  routeKey       : string,
  routeIndex     : number,
  isUserInitiated: boolean
}};

//#endregion

/** `RNINavigatorView` native comp. props */
type RNINavigatorViewProps = {
  style: ViewStyle;
  // Native Events
  onNavRouteViewAdded?: (events: onNavRouteViewAddedPayload) => void;
  onNavRouteWillPop  ?: (events: onNavRouteWillPopPayload  ) => void;
  onNavRouteDidPop   ?: (events: onNavRouteDidPopPayload   ) => void;
};

/** `NavigatorView` comp. props */
type NavigatorViewProps = {
  routes: Array<NavRouteItem>;
  initialRouteKey: string;
};

/** `NavigatorView` comp. state */
type NavigatorViewState = {
  activeRoutes: Array<NavRouteItem>,
};
//#endregion


export const RNINavigatorView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorView');


export class NavigatorView extends React.PureComponent<NavigatorViewProps, NavigatorViewState> {
  //#region - Property Declarations
  state: NavigatorViewState;
  navStatus: NavStatus;
  emitter: EventEmitter<NavEvents>;

  /** Used to communicate with `RNINavigatorView` native comp. */
  navigatorModule: NavigatorViewModule;
  /** A ref to the `RNINavigatorView` native component. */
  nativeRef: React.Component;
  //#endregion

  constructor(props: NavigatorViewProps){
    super(props);
  
    this.navStatus = NavStatus.INIT;

    this.emitter = new EventEmitter<NavEvents>();
    this.navigatorModule = new NavigatorViewModule();

    const initialRoute = props.routes.find(item => (
      item.routeKey == props.initialRouteKey
    ));

    this.state = {
      activeRoutes: [initialRoute],
    };
  };

  componentDidMount(){
    this.initNavModule();
  };

  private async initNavModule(){
    if(!this.navigatorModule.isModuleNodeSet){
      // pass a `RNINavigatorView` ref to native comp
      await this.navigatorModule.setRef(this.nativeRef);
      // update nav status: ready for commands
      this.navStatus = NavStatus.IDLE_INIT;
    };
  };

  /** Add route to `state.activeRoutes` and wait for it to be added in
    * the native side as a subview (i.e. `RNINavigatorView`) */
  private addRoute = (routeItem: NavRouteItem) => {
    //#region - 🐞 DEBUG 🐛
    LIB_GLOBAL.debugLog && console.log(
        `LOG - NavigatorView, addRoute`
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
        `LOG - NavigatorView, removeRoute`
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

  public push = async (routeItem: NavRouteItem) => {
    const props = this.props;

    const routeDefault = props.routes.find(item => (
      item.routeKey == routeItem.routeKey
    ));

    // TEMP, replace with queue - skip if nav. is busy
    if(NavigatorViewUtils.isNavStateBusy(this.navStatus)) return;

    try {
      // init. `NavigatorViewModule` if haven't already
      await this.initNavModule();

      // update nav status to busy
      this.navStatus = NavStatus.NAV_PUSHING;

      // add new route, and wait for it be added
      await this.addRoute({
        routeKey: routeItem.routeKey,
        routeOptions: {
          routeTitle: (
            routeItem   .routeOptions?.routeTitle ?? 
            routeDefault.routeOptions?.routeTitle
          ),
        }
      });
      
      // forward "push" request to native module
      await this.navigatorModule.push({routeKey: routeItem.routeKey});

      // update nav status to idle
      this.navStatus = NavStatus.IDLE;

    } catch(error){
      this.navStatus = NavStatus.IDLE_ERROR;
    };
  };

  public pop = async () => {
    // TEMP, replace with queue - skip if nav. is busy
    if(NavigatorViewUtils.isNavStateBusy(this.navStatus)) return;

    try {
      // init. `NavigatorViewModule` if haven't already
      await this.initNavModule();

      // update nav status to busy
      this.navStatus = NavStatus.NAV_POPPING;

      // forward "pop" request to native module
      const result = await this.navigatorModule.pop();

      // remove popped route from `activeRoutes`
      await this.removeRoute(result);

      // update nav status to idle
      this.navStatus = NavStatus.IDLE;

    } catch(error){
      this.navStatus = NavStatus.IDLE_ERROR;
    };
  };

  private _handleGetRefToNavigator = (): NavigatorView => {
    return this;
  };

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
    const { activeRoutes } = this.state;

    const routes = activeRoutes.map((route, index) => (
      <NavigatorRouteView
        key={`${route.routeKey}-${index}`}
        routeIndex={index}
        routeKey={route.routeKey}
        routeProps={route.routeProps}
        initialRouteTitle={route.routeOptions?.routeTitle}
        getRefToNavigator={this._handleGetRefToNavigator}
      />
    ));

    return (
      <RNINavigatorView 
        ref={r => this.nativeRef = r}
        style={styles.navigatorView}
        onNavRouteViewAdded={this._handleOnNavRouteViewAdded}
        onNavRouteWillPop={this._handleOnNavRouteWillPop}
        onNavRouteDidPop={this._handleOnNavRouteDidPop}
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
