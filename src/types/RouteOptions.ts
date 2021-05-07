

import type { BackButtonDisplayMode, LargeTitleDisplayMode, NavigationBarVisibilityMode, RouteTransitionPopConfig, RouteTransitionPushConfig, StatusBarStyle } from "../native_components/RNINavigatorRouteView";

import type { NavBarBackItemConfig, NavBarItemsConfig } from "./NavBarItemConfig";
import type { NavBarAppearanceCombinedConfig } from "./NavBarAppearanceConfig";


// TODO: Cleanup Types - Mirror from source (e.g. RNINavigatorRouteViewProps, etc.)
export type RouteOptions = {

  statusBarStyle?: StatusBarStyle;

  // Transition Config
  // -----------------

  transitionConfigPush?: RouteTransitionPushConfig;
  transitionConfigPop ?: RouteTransitionPopConfig;
  
  // Navbar Config
  // -------------

  routeTitle?: string;
  prompt    ?: string;
  largeTitleDisplayMode?: LargeTitleDisplayMode;

  // Navbar item config
  // ------------------

  navBarButtonBackItemConfig  ?: NavBarBackItemConfig;
  navBarButtonLeftItemsConfig ?: NavBarItemsConfig;
  navBarButtonRightItemsConfig?: NavBarItemsConfig;

  // Navbar back button item config
  // ------------------------------

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
  // --------------------------------
  
  /**
   * If you are using the iOS 13+ appearance API (i.e. `mode: 'appearance'`), then it will use
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
  navigationBarVisibility?: NavigationBarVisibilityMode;
  allowTouchEventsToPassThroughNavigationBar?: boolean;
};