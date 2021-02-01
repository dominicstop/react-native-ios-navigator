import type { BackButtonDisplayMode, LargeTitleDisplayMode, RouteTransitionPopConfig, RouteTransitionPushConfig } from "../native_components/RNINavigatorRouteView";
import type { NavBarBackItemConfig, NavBarItemsConfig } from "./NavBarItemConfig";

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
};