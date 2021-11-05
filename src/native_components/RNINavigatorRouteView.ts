import { requireNativeComponent, ViewStyle } from 'react-native';

import type { NavBarBackItemConfig, NavBarItemsConfig } from '../types/NavBarItemConfig';
import type { NavBarAppearanceCombinedConfig } from '../types/NavBarAppearanceConfig';
import type { RouteSearchControllerConfig } from '../types/RouteSearchControllerConfig';
import type { OnPressNavBarItemEvent, OnRouteFocusEvent, OnRouteBlurEvent, OnRoutePopEvent, OnRoutePushEvent, OnSearchBarCancelButtonClickedEvent, OnSearchBarSearchButtonClickedEvent, OnUpdateSearchResultsEvent, OnWillDismissSearchControllerEvent, OnDidDismissSearchControllerEvent, OnWillPresentSearchControllerEvent, OnDidPresentSearchControllerEvent } from '../types/RNINavigatorRouteViewEvents';
import type { RouteTransitionConfig } from '../types/NavigationCommands';


export type BackButtonDisplayMode =
  /** The navigation item attempts to display a specific title, a generic title, or no title for the Back button, depending on the space available. */
  | 'default'
  /**The navigation item attempts to display a generic title or no title for the Back button, depending on the space available. */
  | 'generic'
  /** The navigation item displays the Back button indicator instead of a title. */
  | 'minimal';

export type LargeTitleDisplayMode =
  /** Inherit the display mode from the previous navigation item. */
  | 'automatic'
  /** Always display a large title. */
  | 'always'
  /** Never display a large title. */
  | 'never';

export type NavigationBarVisibilityMode = 
  'visible' | 'hidden' | 'default';

export type StatusBarStyle = 
  "default" | "lightContent" | "darkContent";


export type RNINavigatorRouteViewProps = {
  style: ViewStyle;

  routeID: number;
  nativeID: string;
  routeKey: string;
  routeIndex: number;

  statusBarStyle?: StatusBarStyle | null;

  // Transition Config
  transitionConfigPush?: RouteTransitionConfig | null;
  transitionConfigPop ?: RouteTransitionConfig | null;

  // Navbar Config
  prompt    ?: string | null;
  routeTitle?: string | null;
  largeTitleDisplayMode?: LargeTitleDisplayMode | null;

  searchBarConfig?: RouteSearchControllerConfig | null;

  // Navbar Item Config
  navBarButtonBackItemConfig  ?: NavBarBackItemConfig | null;
  navBarButtonLeftItemsConfig ?: NavBarItemsConfig    | null;
  navBarButtonRightItemsConfig?: NavBarItemsConfig    | null;

  // Navbar back button item config
  hidesBackButton              ?: boolean | null;
  backButtonTitle              ?: string  | null;
  backButtonDisplayMode        ?: BackButtonDisplayMode | null;
  leftItemsSupplementBackButton?: boolean | null;

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
  applyBackButtonConfigToCurrentRoute?: boolean | null;
  
  // `NavigationConfigOverride`-related
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
  navBarAppearanceOverride?: NavBarAppearanceCombinedConfig | null;
  navigationBarVisibility ?: NavigationBarVisibilityMode    | null;

  allowTouchEventsToPassThroughNavigationBar?: boolean | null;

  // Native Events: Push
  onRouteWillPush?: OnRoutePushEvent;
  onRouteDidPush ?: OnRoutePushEvent;

  // Native Events: Pop
  onRouteWillPop?: OnRoutePopEvent;
  onRouteDidPop ?: OnRoutePopEvent;

  // Native Events: Focus
  onRouteWillFocus?: OnRouteFocusEvent;
  onRouteDidFocus ?: OnRouteFocusEvent;

  // Native Events: Blur
  onRouteWillBlur?: OnRouteBlurEvent;
  onRouteDidBlur ?: OnRouteBlurEvent;

  // Native Events: Navbar Item `onPress`
  onPressNavBarLeftItem ?: OnPressNavBarItemEvent;
  onPressNavBarRightItem?: OnPressNavBarItemEvent;

  // Native Events: Search
  /** Request to update the search results based on the search text. */
  onUpdateSearchResults?: OnUpdateSearchResultsEvent;

  /** The cancel button was tapped. */
  onSearchBarCancelButtonClicked?: OnSearchBarCancelButtonClickedEvent;
  
  /** The search button (usually in the keyboard) was tapped. */
  onSearchBarSearchButtonClicked?: OnSearchBarSearchButtonClickedEvent;

  onWillDismissSearchController?: OnWillDismissSearchControllerEvent;

  onDidDismissSearchController?: OnDidDismissSearchControllerEvent;

  onWillPresentSearchController?: OnWillPresentSearchControllerEvent;

  onDidPresentSearchController?: OnDidPresentSearchControllerEvent;
};

export const RNINavigatorRouteView = 
  requireNativeComponent<RNINavigatorRouteViewProps>('RNINavigatorRouteView');