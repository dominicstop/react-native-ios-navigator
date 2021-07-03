import { requireNativeComponent, ViewStyle } from 'react-native';

import type { NavBarBackItemConfig, NavBarItemsConfig } from '../types/NavBarItemConfig';
import type { NavBarAppearanceCombinedConfig } from '../types/NavBarAppearanceConfig';
import type { RouteSearchControllerConfig } from '../types/RouteSearchControllerConfig';
import type { OnPressNavBarItemEvent, OnRouteFocusBlurEvent, OnRoutePopEvent, OnRoutePushEvent, OnSearchBarCancelButtonClickedEvent, OnSearchBarSearchButtonClickedEvent, OnUpdateSearchResultsEvent } from '../types/NavRouteViewEvents';


type RouteTransitionPushTypes = 
  "DefaultPush" | "FadePush" | "SlideLeftPush" | "SlideUpPush" | "GlideUpPush";

type RouteTransitionPopTypes = 
  "DefaultPop" | "FadePop" | "SlideLeftPop" | "SlideUpPop" | "GlideUpPop";

type RouteTransitionConfigBase = {
  duration?: number;
};

export type RouteTransitionPushConfig = RouteTransitionConfigBase & {
  type: RouteTransitionPushTypes;
};

export type RouteTransitionPopConfig = RouteTransitionConfigBase & {
  type: RouteTransitionPopTypes;
};




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

  statusBarStyle?: StatusBarStyle;

  // Transition Config
  transitionConfigPush?: RouteTransitionPushConfig;
  transitionConfigPop ?: RouteTransitionPopConfig;

  // Navbar Config
  prompt?: String;
  routeTitle?: string;
  largeTitleDisplayMode?: LargeTitleDisplayMode;

  searchBarConfig?: RouteSearchControllerConfig;

  // Navbar Item Config
  navBarButtonBackItemConfig  ?: NavBarBackItemConfig;
  navBarButtonLeftItemsConfig ?: NavBarItemsConfig;
  navBarButtonRightItemsConfig?: NavBarItemsConfig;

  // Navbar back button item config
  hidesBackButton?: boolean;
  backButtonTitle?: string;
  backButtonDisplayMode?: BackButtonDisplayMode;
  leftItemsSupplementBackButton?: boolean;
  applyBackButtonConfigToCurrentRoute?: boolean;
  
  // `NavigationConfigOverride`-related
  navBarAppearanceOverride?: NavBarAppearanceCombinedConfig;
  navigationBarVisibility?: NavigationBarVisibilityMode;
  allowTouchEventsToPassThroughNavigationBar: boolean;

  // Native Events: Push
  onRouteWillPush?: OnRoutePushEvent;
  onRouteDidPush ?: OnRoutePushEvent;

  // Native Events: Pop
  onRouteWillPop?: OnRoutePopEvent;
  onRouteDidPop ?: OnRoutePopEvent;

  // Native Events: Focus
  onRouteWillFocus?: OnRouteFocusBlurEvent;
  onRouteDidFocus ?: OnRouteFocusBlurEvent;

  // Native Events: Blur
  onRouteWillBlur?: OnRouteFocusBlurEvent;
  onRouteDidBlur ?: OnRouteFocusBlurEvent;

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
};

export const RNINavigatorRouteView = 
  requireNativeComponent<RNINavigatorRouteViewProps>('RNINavigatorRouteView');