import { NativeModules } from 'react-native';

export type PushPopOptions = {
  isAnimated: boolean;
};

interface RNINavigatorViewModule {
  push(node: number, routeKey: string, options: PushPopOptions): Promise<void>;
  pop(node: number, options: PushPopOptions): Promise<{routeKey: string, routeIndex: number}>;
  setNavigationBarHidden(node: number, isHidden: boolean, animated: boolean): Promise<void>
};

// Import native component
export const RNINavigatorViewModule: RNINavigatorViewModule =
  NativeModules["RNINavigatorViewModule"];