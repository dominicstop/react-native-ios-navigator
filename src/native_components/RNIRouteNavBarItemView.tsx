
import { requireNativeComponent, ViewStyle } from 'react-native';

export type RNIRouteNavBarItemViewProps = {
  style: ViewStyle;
  nativeID: string;
};

export const RNIRouteNavBarItemView = 
  requireNativeComponent<RNIRouteNavBarItemViewProps>('RNIRouteNavBarItemView');