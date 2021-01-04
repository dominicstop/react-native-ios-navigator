import React from 'react';
import { StyleSheet, requireNativeComponent, ViewStyle } from 'react-native';

import { NavigatorRouteView } from './NavigatorRouteView';

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


const componentName    = "RNINavigatorView";
const RNINavigatorView = requireNativeComponent<RNINavigatorViewProps>(componentName);


export class NavigatorView extends React.PureComponent<NavigatorViewProps, NavigatorViewState> {
  //#region - Property Declarations
  navStatus: NavStatus;
  state: NavigatorViewState;
  //#endregion

  constructor(props: NavigatorViewProps){
    super(props);

    this.navStatus = NavStatus.IDLE_INIT;

    this.state = {
      activeRoutes: [props.initialRoute],
    };
  };
  
  render(){
    const { activeRoutes } = this.state;

    const routes = activeRoutes.map((route, index) => (
      <NavigatorRouteView
        key={`${route.routeKey}-${index}`}
        routeKey={route.routeKey}
        routeProps={route.routeProps}
        routeIndex={index}
      />
    ));

    return (
      <RNINavigatorView style={styles.navigatorView}>
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
