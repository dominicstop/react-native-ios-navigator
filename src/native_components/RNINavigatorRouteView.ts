import { requireNativeComponent, ViewStyle } from 'react-native';
import type { NavBarBackItemConfig, NavBarItemsConfig } from '../types/NavBarItemConfig';

type RouteTransitionPushTypes = 
  "DefaultPush" | "FadePush";

type RouteTransitionPopTypes = 
  "DefaultPop" | "FadePop";

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
    routeKey: string,
    routeIndex: number,
    isAnimated: boolean
  }
}) => void;

export type onRoutePopEvent = (event: {
  nativeEvent: { 
    routeKey: string,
    routeIndex: number,
    isUserInitiated: boolean
  }
}) => void;

export type onPressNavBarItem = (event: {
  nativeEvent: { key: string, type: string }
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

  // Native Events: Push
  onNavRouteWillPush?: onRoutePushEvent;
  onNavRouteDidPush ?: onRoutePushEvent;

  // Native Events: Pop
  onNavRouteWillPop?: onRoutePopEvent;
  onNavRouteDidPop ?: onRoutePopEvent;

  // Native Events: Navbar Item `onPress`
  onPressNavBarBackItem ?: onPressNavBarItem;
  onPressNavBarLeftItem ?: onPressNavBarItem;
  onPressNavBarRightItem?: onPressNavBarItem;
};

export const RNINavigatorRouteView = 
  requireNativeComponent<RNINavigatorRouteViewProps>('RNINavigatorRouteView');