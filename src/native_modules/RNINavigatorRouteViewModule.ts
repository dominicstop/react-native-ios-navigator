import { NativeModules } from 'react-native';


interface RNINavigatorRouteViewModule {
  setHidesBackButton(node: number, isHidden: boolean, animated: boolean): Promise<void>
};

// Import native component
export const RNINavigatorRouteViewModule: RNINavigatorRouteViewModule =
  NativeModules["RNINavigatorRouteViewModule"];