import { requireNativeComponent, ViewStyle } from 'react-native';
import type { NavBarBackItemConfig, NavBarItemsConfig } from '../types/NavBarItemConfig';


type onPressNavBarItem = (event: {
  nativeEvent: { key: string, type: string }
}) => void;

export type BackButtonDisplayMode =
  /** The navigation item attempts to display a specific title, a generic title, or no title for the Back button, depending on the space available. */
  | 'default'
  /**The navigation item attempts to display a generic title or no title for the Back button, depending on the space available. */
  | 'generic'
  /** The navigation item displays the Back button indicator instead of a title. */
  |'minimal'

export type RNINavigatorRouteViewProps = {
  style: ViewStyle;
  routeKey: string;
  routeIndex: number;

  routeTitle?: string;
  prompt?: String;
  // Navbar item config
  navBarButtonBackItemConfig  ?: NavBarBackItemConfig;
  navBarButtonLeftItemsConfig ?: NavBarItemsConfig;
  navBarButtonRightItemsConfig?: NavBarItemsConfig;

  // Navbar back button item config
  leftItemsSupplementBackButton?: boolean;
  backButtonTitle?: string;
  backButtonDisplayMode?: BackButtonDisplayMode;
  hidesBackButton?: boolean;

  // Native Events
  onNavRouteWillPush?: () => void;
  onNavRouteDidPush ?: () => void;

  onNavRouteWillPop?: () => void;
  onNavRouteDidPop ?: () => void;

  onPressNavBarBackItem ?: onPressNavBarItem;
  onPressNavBarLeftItem ?: onPressNavBarItem;
  onPressNavBarRightItem?: onPressNavBarItem;
};

export const RNINavigatorRouteView = 
  requireNativeComponent<RNINavigatorRouteViewProps>('RNINavigatorRouteView');