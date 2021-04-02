import { requireNativeComponent, ViewStyle } from 'react-native';

import type { NavBarBackItemConfig, NavBarItemsConfig } from '../types/NavBarItemConfig';
import type { NavBarAppearanceConfig } from '../types/NavBarAppearanceConfig';


type RouteTransitionPushTypes = 
  "DefaultPush" | "FadePush" | "SlidePush" | "SlideUpPush";

type RouteTransitionPopTypes = 
  "DefaultPop" | "FadePop" | "SlidePop" | "SlideUpPop";

type RouteTransitionConfigBase = {
  duration?: number
};

export type RouteTransitionPushConfig = RouteTransitionConfigBase & {
  type: RouteTransitionPushTypes
};

export type RouteTransitionPopConfig = RouteTransitionConfigBase & {
  type: RouteTransitionPopTypes
};

export type onRoutePushEvent = (event: {
  nativeEvent: { 
    routeID   : number ,
    routeKey  : string ,
    routeIndex: number ,
    isAnimated: boolean,
  }
}) => void;

export type onRouteFocusBlurEvent = (event: {
  nativeEvent: { 
    routeID   : number ,
    routeKey  : string ,
    routeIndex: number ,
    isAnimated: boolean,
  }
}) => void;

export type onRoutePopEvent = (event: {
  nativeEvent: { 
    routeID        : number ,
    routeKey       : string ,
    routeIndex     : number ,
    isUserInitiated: boolean,
  }
}) => void;

export type onPressNavBarItem = (event: {
  nativeEvent: { 
    routeID: number,
    key    : string, 
    type   : string, 
  }
}) => void;

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

export type RNINavigatorRouteViewProps = {
  style: ViewStyle;

  routeID: number;
  nativeID: string;
  routeKey: string;
  routeIndex: number;

  // Transition Config
  transitionConfigPush?: RouteTransitionPushConfig;
  transitionConfigPop ?: RouteTransitionPopConfig;

  // Navbar Config
  prompt?: String;
  routeTitle?: string;
  largeTitleDisplayMode?: LargeTitleDisplayMode;

  // Navbar Item Config
  navBarButtonBackItemConfig  ?: NavBarBackItemConfig;
  navBarButtonLeftItemsConfig ?: NavBarItemsConfig;
  navBarButtonRightItemsConfig?: NavBarItemsConfig;

  // Navbar back button item config
  hidesBackButton?: boolean;
  backButtonTitle?: string;
  backButtonDisplayMode?: BackButtonDisplayMode;
  leftItemsSupplementBackButton?: boolean;

  // Overriding the NavBar Appearance
  navBarAppearanceOverride?: NavBarAppearanceConfig;

  // Native Events: Push
  onRouteWillPush?: onRoutePushEvent;
  onRouteDidPush ?: onRoutePushEvent;

  // Native Events: Pop
  onRouteWillPop?: onRoutePopEvent;
  onRouteDidPop ?: onRoutePopEvent;

  // Native Events: Focus
  onRouteWillFocus?: onRouteFocusBlurEvent;
  onRouteDidFocus ?: onRouteFocusBlurEvent;

  // Native Events: Blur
  onRouteWillBlur?: onRouteFocusBlurEvent;
  onRouteDidBlur ?: onRouteFocusBlurEvent;

  // Native Events: Navbar Item `onPress`
  onPressNavBarLeftItem ?: onPressNavBarItem;
  onPressNavBarRightItem?: onPressNavBarItem;
};

export const RNINavigatorRouteView = 
  requireNativeComponent<RNINavigatorRouteViewProps>('RNINavigatorRouteView');