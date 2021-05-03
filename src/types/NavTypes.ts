
import type { NavigatorView } from "../components/NavigatorView";
import type { NavigatorRouteView, NavRouteEvents } from "../components/NavigatorRouteView";

import type { BackButtonDisplayMode, LargeTitleDisplayMode, NavigationBarVisibilityMode, RouteTransitionPopConfig, RouteTransitionPushConfig } from "../native_components/RNINavigatorRouteView";

import type { EventEmitter } from "../functions/EventEmitter";

import type { NavBarBackItemConfig, NavBarItemsConfig } from "./NavBarItemConfig";
import type { NavBarAppearanceCombinedConfig } from "./NavBarAppearanceConfig";

// Nav-related types that are exported/public
// ------------------------------------------

export type RouteOptions = {
  // Transition Config
  transitionConfigPush?: RouteTransitionPushConfig;
  transitionConfigPop ?: RouteTransitionPopConfig;
  
  // Navbar Config
  routeTitle?: string;
  prompt    ?: string;
  largeTitleDisplayMode?: LargeTitleDisplayMode;

  // Navbar item config
  navBarButtonBackItemConfig  ?: NavBarBackItemConfig;
  navBarButtonLeftItemsConfig ?: NavBarItemsConfig;
  navBarButtonRightItemsConfig?: NavBarItemsConfig;

  // Navbar back button item config
  backButtonTitle              ?: string;
  hidesBackButton              ?: boolean;
  backButtonDisplayMode        ?: BackButtonDisplayMode;
  leftItemsSupplementBackButton?: boolean;

  /** 
   * By default, the `navBarButtonBackItemConfig` and related properties (e.g. `backButtonDisplayMode`) 
   * by default, does not affect the current route, but instead is applied to the next route
   * that is pushed. 
   * 
   * As such, setting the back button config will not affect the current route unless this
   * flag is set to `true`.
   * 
   * In other words, if this is set to true, the back button config will be applied to the prev.
   * route so that the config will be applied to the current route (confusing, i know but this
   * is how the `backItem` API works by default.)
   **/
  applyBackButtonConfigToCurrentRoute?: boolean;

  // NavigationConfigOverride-related
  /**
   * If you are using the iOS 13+ appearance API (i.e.  `mode: 'appearance'`), then it will use
   * the appearance-related properties from `UINavigationItem` (e.g. `standardAppearance`, etc.)
   * to override the current navigation bar customizations. 
   * 
   * Otherwise, if `legacy` mode is used, then it will override the current navigation bar 
   * customizations via temp. changing the navigation bar properties when a route is focused, 
   * and resetting it back to it's prev. values it's blurred.
   * 
   * **note**: Stick to one mode, switching between `appearance` and `legacy` is not supported.
   */
  navBarAppearanceOverride?: NavBarAppearanceCombinedConfig;
  navigationBarVisibility ?: NavigationBarVisibilityMode;
};

export type NavigationObject = {
  routeKey    : string;
  routeIndex  : number;
  routeProps ?: object;
  routeOptions: RouteOptions;

  // navigator commands
  push        : typeof NavigatorView.prototype.push;
  pop         : typeof NavigatorView.prototype.pop;
  popToRoot   : typeof NavigatorView.prototype.popToRoot;
  removeRoute : typeof NavigatorView.prototype.removeRoute;
  removeRoutes: typeof NavigatorView.prototype.removeRoutes;
  replaceRoute: typeof NavigatorView.prototype.replaceRoute;
  insertRoute : typeof NavigatorView.prototype.insertRoute;
  setRoutes   : typeof NavigatorView.prototype.setRoutes;

  setNavigationBarHidden: typeof NavigatorView.prototype.setNavigationBarHidden;

  // convenience navigator commands
  replacePreviousRoute: typeof NavigatorView.prototype.replacePreviousRoute;
  replaceCurrentRoute : typeof NavigatorView.prototype.replaceCurrentRoute;
  removePreviousRoute : typeof NavigatorView.prototype.removePreviousRoute;
  removeAllPrevRoutes : typeof NavigatorView.prototype.removeAllPrevRoutes;

  // misc. navigator commands
  sendCustomCommandToNative: typeof NavigatorView.prototype.sendCustomCommandToNative;

  // route commands
  getRouteOptions   : typeof NavigatorRouteView.prototype.getRouteOptions;
  setRouteOptions   : typeof NavigatorRouteView.prototype.setRouteOptions;
  setHidesBackButton: typeof NavigatorRouteView.prototype.setHidesBackButton;

  // get ref functions
  getRefToRoute          : () => NavigatorRouteView;
  getRefToNavigator      : () => NavigatorView;
  getRefToNavRouteEmitter: () => EventEmitter<NavRouteEvents>;
};