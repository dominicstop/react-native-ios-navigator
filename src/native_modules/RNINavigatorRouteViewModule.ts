import { NativeModules } from 'react-native';


interface RNINavigatorRouteViewModule {
  registerNativeComponent(node: number, compNode: number, nativeID: string): Promise<void>
};

// Import native component
export const RNINavigatorRouteViewModule: RNINavigatorRouteViewModule =
  NativeModules["RNINavigatorRouteViewModule"];