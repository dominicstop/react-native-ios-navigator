import React from 'react';
import { StyleSheet, requireNativeComponent, NativeAppEventEmitter,  ViewStyle } from 'react-native';

import { NavigatorViewModule } from './NavigatorViewModule';
import { NavigatorRouteView } from './NavigatorRouteView';

import * as Helpers from './Helpers';
import { EventEmitter } from './EventEmitter';

//#region - Type Definitions
/** Represents the current status of the navigator */
enum NavStatus {
  IDLE        = "IDLE"       ,
  IDLE_INIT   = "IDLE_INIT"  ,
  IDLE_ERROR  = "IDLE_ERROR" ,
  NAV_PUSHING = "NAV_PUSHING",
  NAV_POPPING = "NAV_POPPING",
};

enum NavEvents {
  onNavRouteViewAdded   = "onNavRouteViewAdded"  ,
  onNavRouteViewRemoved = "onNavRouteViewRemoved",
};

/** Represents a route in the navigation stack. */
type NavRouteItem = {
  routeKey: String;
  routeProps?: Object;
};

//#region - `RNINavigatorView` Events
type onNavRouteViewAddedPayload = { nativeEvent: {
  target    : number,
  routeKey  : string,
  routeIndex: number
}};

type onNavRouteViewRemovedPayload = { nativeEvent: {
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
  onNavRouteViewAdded  ?: (events: onNavRouteViewAddedPayload  ) => void;
  onNavRouteViewRemoved?: (events: onNavRouteViewRemovedPayload) => void;

  onNavRouteWillPop?: (events: onNavRouteWillPopPayload) => void;
  onNavRouteDidPop ?: (events: onNavRouteDidPopPayload ) => void;
};

/** `NavigatorView` comp. props */
type NavigatorViewProps = {
  routes: Array<NavRouteItem>;
  initialRoute: NavRouteItem;
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

    this.navStatus = NavStatus.IDLE_INIT;

    this.emitter = new EventEmitter<NavEvents>();
    this.navigatorModule = new NavigatorViewModule();

    this.state = {
      activeRoutes: [props.initialRoute],
    };
  };

  componentDidMount(){
    // pass a `RNINavigatorView` ref to native comp
    this.navigatorModule.setRef(this.nativeRef);
  };

  /** Add route to `state.activeRoutes` and wait for it to be added in
    * the native side as a subview (i.e. `RNINavigatorView`) */
  private addRoute = (params: { routeKey: String }) => {
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
          routeKey: params.routeKey
        }]
      }))
    ]);
  };

  private removeRoute = (params: { routeKey: string, routeIndex: number }) => {
    console.log(`removeRoute - active routes: ${this.state.activeRoutes.length}`);
    return Promise.all([
      // -----------------------------------------------------
      // 1. Wait for the new route to be removed in native side.
      //    note: This promise will reject if `onNavRouteViewRemoved` fails to fire
      //    within 500 ms (i.e. if it takes to long for the promise to be fulfilled).
      // ----------------------------------------------------------------------------
      Helpers.promiseWithTimeout(500, new Promise<void>(resolve => {
        this.emitter.once(NavEvents.onNavRouteViewRemoved, () => {
          resolve();
        })
      })),
      // --------------------------------------
      // 2. Remove route to `activeRoutes`.
      //    The route will be "removed" from `RNINavigatorView`'s subviews.
      // ------------------------------------------------------------------
      Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
        activeRoutes: prevState.activeRoutes.filter((route, index) => !(
          (index          == params.routeIndex) &&
          (route.routeKey == params.routeKey  )
        ))
      }))
    ]);
  };

  push = async (params: { routeKey: string }) => {
    const { activeRoutes } = this.state;

    // update nav status to busy
    this.navStatus = NavStatus.NAV_PUSHING;

    try {
      // add new route, and wait for it be added
      await this.addRoute(params);
      
      // forward "push" request to native module
      await this.navigatorModule.push({routeKey: params.routeKey});
      // update nav status to idle
      this.navStatus = NavStatus.IDLE;

    } catch(error){
      this.navStatus = NavStatus.IDLE_ERROR;
    };
  };

  _handleGetRefToNavigator = (): NavigatorView => {
    return this;
  };

  //#region - Native Event Handlers
  /** Handler for native event: `onNavRouteViewAdded` */
  _handleOnNavRouteViewAdded = ({nativeEvent}: onNavRouteViewAddedPayload) => {
    // emit event: nav. route was added to `RNINavigatorView`'s subviews
    this.emitter.emit(NavEvents.onNavRouteViewAdded, {
      target    : nativeEvent.target,
      routeKey  : nativeEvent.routeKey,
      routeIndex: nativeEvent.routeIndex,
    });
  };

  /** Handler for native event: `onNavRouteViewRemoved` */
  _handleOnNavRouteViewRemoved  = ({nativeEvent}: onNavRouteViewRemovedPayload) => {
    // emit event: nav. route was removed from `RNINavigatorView`'s subviews
    this.emitter.emit(NavEvents.onNavRouteViewRemoved, {
      target    : nativeEvent.target,
      routeKey  : nativeEvent.routeKey,
      routeIndex: nativeEvent.routeIndex,
    });
  };
  
  /** Handler for native event: `onNavRouteWillPop` */
  _handleOnNavRouteWillPop = ({nativeEvent}: onNavRouteWillPopPayload) => {
    // a route is about to be removed either through a tap on the "back" button,
      // or through a swipe back gesture.
    if(nativeEvent.isUserInitiated){
      
    };
  };

  /** Handler for native event: `onNavRouteDidPop` */
  _handleOnNavRouteDidPop = ({nativeEvent}: onNavRouteDidPopPayload) => {
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
        routeKey={route.routeKey}
        routeProps={route.routeProps}
        routeIndex={index}
        getRefToNavigator={this._handleGetRefToNavigator}
      />
    ));

    return (
      <RNINavigatorView 
        ref={r => this.nativeRef = r}
        style={styles.navigatorView}
        onNavRouteViewAdded={this._handleOnNavRouteViewAdded}
        onNavRouteViewRemoved={this._handleOnNavRouteViewRemoved}
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
  static isNavStateBusy(navStatus: NavStatus){
    return (
      navStatus == NavStatus.NAV_POPPING ||
      navStatus == NavStatus.NAV_PUSHING 
    );
  };

  static isNavStateIdle(navStatus: NavStatus){
    return (
      navStatus == NavStatus.IDLE       ||
      navStatus == NavStatus.IDLE_INIT  ||
      navStatus == NavStatus.IDLE_ERROR
    );
  };
};

const styles = StyleSheet.create({
  navigatorView: {
    flex: 1,
  },
});
