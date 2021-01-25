import { requireNativeComponent, ViewStyle } from 'react-native';
import type { NavBarBackItemConfig, NavBarItemsConfig } from '../types/NavBarItemConfig';


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
  onNavRouteWillPush?: () => void;
  onNavRouteDidPush ?: () => void;

  // Native Events: Pop
  onNavRouteWillPop?: () => void;
  onNavRouteDidPop ?: () => void;

  // Native Events: Navbar Item `onPress`
  onPressNavBarBackItem ?: onPressNavBarItem;
  onPressNavBarLeftItem ?: onPressNavBarItem;
  onPressNavBarRightItem?: onPressNavBarItem;
};

export const RNINavigatorRouteView = 
  requireNativeComponent<RNINavigatorRouteViewProps>('RNINavigatorRouteView');