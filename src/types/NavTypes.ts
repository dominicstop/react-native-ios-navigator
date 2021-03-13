
import type { NavigatorView } from "../components/NavigatorView";
import type { NavigatorRouteView, NavRouteEvents } from "../components/NavigatorRouteView";

import type { BackButtonDisplayMode, LargeTitleDisplayMode, RouteTransitionPopConfig, RouteTransitionPushConfig } from "../native_components/RNINavigatorRouteView";

import type { EventEmitter } from "../functions/EventEmitter";

import type { NavBarBackItemConfig, NavBarItemsConfig } from "./NavBarItemConfig";
import type { NavBarAppearanceConfig } from "./NavBarAppearanceConfig";

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
  backButtonTitle      ?: string;
  hidesBackButton      ?: boolean;
  backButtonDisplayMode?: BackButtonDisplayMode;

  navBarAppearanceOverride?: NavBarAppearanceConfig;
  leftItemsSupplementBackButton?: boolean;
};

export type NavigationObject = {
  routeKey  ?: string;
  routeIndex?: number;
  routeProps?: object;

  // navigator commands
  push        ?: typeof NavigatorView.prototype.push;
  pop         ?: typeof NavigatorView.prototype.pop;
  popToRoot   ?: typeof NavigatorView.prototype.popToRoot;
  removeRoute ?: typeof NavigatorView.prototype.removeRoute;
  removeRoutes?: typeof NavigatorView.prototype.removeRoutes;
  replaceRoute?: typeof NavigatorView.prototype.replaceRoute;
  insertRoute ?: typeof NavigatorView.prototype.insertRoute;
  setRoutes   ?: typeof NavigatorView.prototype.setRoutes;

  setNavigationBarHidden?: typeof NavigatorView.prototype.setNavigationBarHidden;

  // convenience navigator commands
  replacePreviousRoute?: typeof NavigatorView.prototype.replacePreviousRoute;
  replaceCurrentRoute ?: typeof NavigatorView.prototype.replaceCurrentRoute;
  removePreviousRoute ?: typeof NavigatorView.prototype.removePreviousRoute;
  removeAllPrevRoutes ?: typeof NavigatorView.prototype.removeAllPrevRoutes;

  // route commands
  getRouteOptions   ?: typeof NavigatorRouteView.prototype.getRouteOptions;
  setRouteOptions   ?: typeof NavigatorRouteView.prototype.setRouteOptions;
  setHidesBackButton?: typeof NavigatorRouteView.prototype.setHidesBackButton;

  // get ref functions
  getRefToRoute          ?: () => NavigatorRouteView;
  getRefToNavigator      ?: () => NavigatorView;
  getRefToNavRouteEmitter?: () => EventEmitter<NavRouteEvents>;
};