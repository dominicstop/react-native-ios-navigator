import { requireNativeComponent, ViewStyle } from 'react-native';

export type RNINavigatorRouteViewProps = {
  style: ViewStyle;
  routeKey: string;
  routeIndex: number;
  routeTitle: string;
  // Native Events
  onNavRouteWillPush?: () => void;
  onNavRouteDidPush ?: () => void;

  onNavRouteWillPop?: () => void;
  onNavRouteDidPop ?: () => void;
};

export const RNINavigatorRouteView = 
  requireNativeComponent<RNINavigatorRouteViewProps>('RNINavigatorRouteView');