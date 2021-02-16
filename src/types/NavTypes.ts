import type { NavigatorView } from "../components/NavigatorView";
import type { NavigatorRouteView, NavRouteEvents } from "../components/NavigatorRouteView";

import type { BackButtonDisplayMode, LargeTitleDisplayMode, RouteTransitionPopConfig, RouteTransitionPushConfig } from "../native_components/RNINavigatorRouteView";

import type { EventEmitter } from "../functions/EventEmitter";

import type { NavBarBackItemConfig, NavBarItemsConfig } from "./NavBarItemConfig";
import type { NavCommandPop, NavCommandPush } from "./NavSharedTypes";
import type { NavBarAppearanceConfig } from "./NavBarAppearanceConfig";


export type RouteOptions = {
  // Transition Config
  transitionConfigPush?: RouteTransitionPushConfig;
  transitionConfigPop ?: RouteTransitionPopConfig;
  
  // Navbar Config
  routeTitle?: string;
  prompt?: string;
  largeTitleDisplayMode?: LargeTitleDisplayMode;

  // Navbar item config
  navBarButtonBackItemConfig  ?: NavBarBackItemConfig;
  navBarButtonLeftItemsConfig ?: NavBarItemsConfig;
  navBarButtonRightItemsConfig?: NavBarItemsConfig;

  // Navbar back button item config
  leftItemsSupplementBackButton?: boolean;
  backButtonTitle?: string;
  backButtonDisplayMode?: BackButtonDisplayMode;
  hidesBackButton?: boolean;

  navBarAppearanceOverride?: NavBarAppearanceConfig;
};

export type NavigationObject = {
  routeKey  ?: string;
  routeIndex?: number;
  routeProps?: object;
  // navigator commands
  push?: NavCommandPush;
  pop?: NavCommandPop;
  // get ref functions
  getRefToRoute          ?: () => NavigatorRouteView;
  getRefToNavigator      ?: () => NavigatorView;
  getRefToNavRouteEmitter?: () => EventEmitter<NavRouteEvents>;
};