import { NativeModules } from 'react-native';
import type { EdgeInsets, Rect } from 'src/types/MiscTypes';

export type RouteConstantsObject = {
  isCurrentlyInFocus: boolean;

  navBarHeight: number;
  statusBarHeight: number;
  navBarWithStatusBarHeight: number;

  safeAreaInsets: EdgeInsets;
  bounds: Rect;
};

interface RNINavigatorRouteViewModule {
  setHidesBackButton(node: number, isHidden: boolean, animated: boolean): Promise<void>;

  getRouteConstants(node: number): Promise<RouteConstantsObject>;
};

// Import native component
export const RNINavigatorRouteViewModule: RNINavigatorRouteViewModule =
  NativeModules["RNINavigatorRouteViewModule"];