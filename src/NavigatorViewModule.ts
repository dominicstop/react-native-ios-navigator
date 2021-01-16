import { NativeModules, EventSubscriptionVendor } from 'react-native';


interface RNINavigatorViewModule extends EventSubscriptionVendor {
  setNode(node: number): Promise<void>;
  push(node: number, routeKey: string): Promise<void>;
  pop(node: number): Promise<{routeKey: string, routeIndex: number}>;
  setNavigationBarHidden(node: number, isHidden: boolean, animated: boolean): Promise<void>
};

// Import native component
export const RNINavigatorViewModule: RNINavigatorViewModule =
  NativeModules["RNINavigatorViewModule"];