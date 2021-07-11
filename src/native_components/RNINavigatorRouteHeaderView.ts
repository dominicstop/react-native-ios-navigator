import { ViewStyle, requireNativeComponent, StyleProp } from 'react-native';
import type { RouteHeaderConfig, HeaderHeightValue } from '../types/RouteHeaderConfig';


/** `RNINavigatorView` native comp. props */
export type RNINavigatorRouteHeaderViewProps = {
  style: StyleProp<ViewStyle>;
  nativeID: string;
  config?: RouteHeaderConfig;
  headerTopPadding?: HeaderHeightValue;
};

export const RNINavigatorRouteHeaderView = 
  requireNativeComponent<RNINavigatorRouteHeaderViewProps>('RNINavigatorRouteHeaderView');