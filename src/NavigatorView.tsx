import React, { ReactComponentElement } from 'react';
import { StyleSheet, requireNativeComponent, ViewStyle } from 'react-native';

import { NavigatorViewModule } from './NavigatorViewModule';
import { NavigatorRouteView } from './NavigatorRouteView';

import * as Helpers from './Helpers';

//#region - Type Definitions
/** Represents the current status of the navigator */
enum NavStatus {
  IDLE        = "IDLE"       ,
  IDLE_INIT   = "IDLE_INIT"  , 
  NAV_PUSHING = "NAV_PUSHING",
  NAV_POPPING = "NAV_POPPING",
};

/** 
 * Represents a route in the navigation stack.
*/
type NavRouteItem = {
  routeKey: String;
  routeProps?: Object;
};

/** `RNINavigatorView` native comp. props */
type RNINavigatorViewProps = {
  style: ViewStyle;
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
  /** Used to communicate with `RNINavigatorView` native comp. */
  navigatorModule: NavigatorViewModule;
  /** A ref to the `RNINavigatorView` native component. */
  nativeRef: React.Component;
  //#endregion

  constructor(props: NavigatorViewProps){
    super(props);

    this.navStatus = NavStatus.IDLE_INIT;
    this.navigatorModule = new NavigatorViewModule();

    this.state = {
      activeRoutes: [props.initialRoute],
    };
  };

  componentDidMount(){
    // pass a `RNINavigatorView` ref to native comp
    this.navigatorModule.setRef(this.nativeRef);
  };

  async push(params: { routeKey: String }){
    const { activeRoutes } = this.state;

    await Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
      activeRoutes: [...prevState.activeRoutes, {
        routeKey: params.routeKey
      }]
    }));

    // temp
    await Helpers.timeout(500);

    await this.navigatorModule.push({routeKey: params.routeKey});
  };

  _handleGetRefToNavigator = (): NavigatorView => {
    return this;
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
      navStatus == NavStatus.IDLE      ||
      navStatus == NavStatus.IDLE_INIT 
    );
  };
};

const styles = StyleSheet.create({
  navigatorView: {
    flex: 1,
  },
});
