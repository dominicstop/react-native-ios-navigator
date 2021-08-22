import { ViewStyle, requireNativeComponent, StyleProp } from 'react-native';
import type { RouteHeaderConfig, HeaderHeightConfig } from '../types/RouteHeaderConfig';


/** `RNINavigatorView` native comp. props */
export type RNINavigatorRouteHeaderViewProps = {
  style: StyleProp<ViewStyle>;
  nativeID: string;
  config?: RouteHeaderConfig;
  headerTopPadding?: HeaderHeightConfig;
};

export const RNINavigatorRouteHeaderView = 
  requireNativeComponent<RNINavigatorRouteHeaderViewProps>('RNINavigatorRouteHeaderView');