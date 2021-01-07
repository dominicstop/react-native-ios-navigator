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
  onNavRouteViewAdded = "onNavRouteViewAdded"
};

/** Represents a route in the navigation stack. */
type NavRouteItem = {
  routeKey: String;
  routeProps?: Object;
};

type onNavRouteViewAddedPayload = { nativeEvent: {
  target    : number,
  routeKey  : string,
  routeIndex: number
}};

/** `RNINavigatorView` native comp. props */
type RNINavigatorViewProps = {
  style: ViewStyle;
  // Native Events
  onNavRouteViewAdded: (events: onNavRouteViewAddedPayload) => void;
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

  async push (params: { routeKey: String }) {
    const { activeRoutes } = this.state;

    // 
    this.navStatus = NavStatus.NAV_PUSHING;

    try {
      // add new route
      await Promise.all([
        // 2. wait for the new route to be added
        new Promise<void>(resolve => {
          this.emitter.once(NavEvents.onNavRouteViewAdded, () => {
            console.log("onNavRouteViewAdded");
            resolve();
          })
        }),
        // 1. append new route to `activeRoutes`
        Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
          activeRoutes: [...prevState.activeRoutes, {
            routeKey: params.routeKey
          }]
        }))
      ]);
      
      // send "push" request to native module
      await this.navigatorModule.push({routeKey: params.routeKey});

      this.navStatus = NavStatus.IDLE;

    } catch(error){
      this.navStatus = NavStatus.IDLE_ERROR;
    };
  };

  _handleGetRefToNavigator = (): NavigatorView => {
    return this;
  };

  _handleOnNavRouteViewAdded = ({nativeEvent}: onNavRouteViewAddedPayload) => {
    console.log("emit: onNavRouteViewAdded");

    this.emitter.emit(NavEvents.onNavRouteViewAdded, {
      target    : nativeEvent.target,
      routeKey  : nativeEvent.routeKey,
      routeIndex: nativeEvent.routeIndex,
    });
  };
  
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
