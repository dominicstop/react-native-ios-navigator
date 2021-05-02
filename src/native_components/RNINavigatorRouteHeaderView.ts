import { ViewStyle, requireNativeComponent } from 'react-native';
import type {  } from 'src/types/NavBarAppearanceConfig';

export type HeaderHeightValue = number | 'navigationBarHeight';

export type RouteHeaderConfig = {
  headerMode: 'fixed';
  headerHeight?: HeaderHeightValue;
} | {
  headerMode: 'resize';
  headerHeightMin?: HeaderHeightValue;
  headerHeightMax?: HeaderHeightValue;
};

/** `RNINavigatorView` native comp. props */
export type RNINavigatorRouteHeaderViewProps = {
  style: ViewStyle;
  nativeID: string;
  config?: RouteHeaderConfig;
};

export const RNINavigatorRouteHeaderView = 
  requireNativeComponent<RNINavigatorRouteHeaderViewProps>('RNINavigatorRouteHeaderView');