
import type { NavigatorView } from "../components/NavigatorView";
import type { NavigatorRouteView, NavRouteEvents } from "../components/NavigatorRouteView";

import type { BackButtonDisplayMode, LargeTitleDisplayMode, RouteTransitionPopConfig, RouteTransitionPushConfig } from "../native_components/RNINavigatorRouteView";

import type { EventEmitter } from "../functions/EventEmitter";

import type { NavBarBackItemConfig, NavBarItemsConfig } from "./NavBarItemConfig";
import type { NavCommandPop, NavCommandPopToRoot, NavCommandPush, NavCommandRemoveRoute, NavCommandReplaceRoute, NavCommandInsertRoute, NavCommandSetNavigationBarHidden, NavCommandReplaceRoutePreset, NavCommandRemoveRoutePreset, NavCommandRemoveRoutes, NavCommandRemoveRoutesPreset } from "./NavSharedTypes";
import type { NavBarAppearanceConfig } from "./NavBarAppearanceConfig";


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
  push        ?: NavCommandPush;
  pop         ?: NavCommandPop;
  popToRoot   ?: NavCommandPopToRoot;
  removeRoute ?: NavCommandRemoveRoute;
  removeRoutes?: NavCommandRemoveRoutes;
  replaceRoute?: NavCommandReplaceRoute;
  insertRoute ?: NavCommandInsertRoute;

  setNavigationBarHidden?: NavCommandSetNavigationBarHidden;

  // convenience navigator commands
  replacePreviousRoute?: NavCommandReplaceRoutePreset;
  replaceCurrentRoute ?: NavCommandReplaceRoutePreset;
  removePreviousRoute ?: NavCommandRemoveRoutePreset;
  removeAllPrevRoutes ?: NavCommandRemoveRoutesPreset;

  // get ref functions
  getRefToRoute          ?: () => NavigatorRouteView;
  getRefToNavigator      ?: () => NavigatorView;
  getRefToNavRouteEmitter?: () => EventEmitter<NavRouteEvents>;
};