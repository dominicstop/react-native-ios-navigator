import { requireNativeComponent, ViewStyle } from 'react-native';
import type { BackButtonDisplayMode, NavBarBackItemConfig, NavBarItemConfig } from 'src/types/NavBarItemConfig';

type onPressNavBarItem = (event: {
  nativeEvent: { key: string, type: string }
}) => void;

export type RNINavigatorRouteViewProps = {
  style: ViewStyle;
  routeKey: string;
  routeIndex: number;
  routeTitle: string;

  // Navbar item config
  navBarButtonBackItemConfig  ?: NavBarBackItemConfig;
  navBarButtonLeftItemsConfig ?: NavBarItemConfig;
  navBarButtonRightItemsConfig?: NavBarItemConfig;

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