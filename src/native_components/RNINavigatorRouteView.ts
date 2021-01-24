import { requireNativeComponent, ViewStyle } from 'react-native';
import type { BackButtonDisplayMode, NavBarBackItemConfig, NavBarItemsConfig } from '../types/NavBarItemConfig';

type onPressNavBarItem = (event: {
  nativeEvent: { key: string, type: string }
}) => void;

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