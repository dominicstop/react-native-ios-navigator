import { ViewStyle, requireNativeComponent, StyleProp } from 'react-native';

export type HeaderHeightValue = 
  | number 
  | 'navigationBar'
  | 'statusBar'
  | 'navigationBarWithStatusBar'
  | 'safeArea'
  | 'none';

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
  style: StyleProp<ViewStyle>;
  nativeID: string;
  config?: RouteHeaderConfig;
  headerTopPadding?: HeaderHeightValue;
};

export const RNINavigatorRouteHeaderView = 
  requireNativeComponent<RNINavigatorRouteHeaderViewProps>('RNINavigatorRouteHeaderView');