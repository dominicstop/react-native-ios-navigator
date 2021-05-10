import { NativeModules } from 'react-native';

export type RouteConstantsObject = {
  isCurrentlyInFocus: boolean;

  navBarHeight: number;
  statusBarHeight: number;
  navBarWithStatusBarHeight: number;

  safeAreaInsets: {
    top   : number;
    bottom: number;
    left  : number;
    right : number;
  };
  
  bounds: {
    x    : number;
    y    : number;
    left : number;
    right: number;
  };
};

interface RNINavigatorRouteViewModule {
  setHidesBackButton(node: number, isHidden: boolean, animated: boolean): Promise<void>;

  getConstants(node: number): Promise<RouteConstantsObject>;
};

// Import native component
export const RNINavigatorRouteViewModule: RNINavigatorRouteViewModule =
  NativeModules["RNINavigatorRouteViewModule"];