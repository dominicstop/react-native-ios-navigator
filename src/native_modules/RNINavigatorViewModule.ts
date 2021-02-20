import { NativeModules } from 'react-native';

export type NativePushPopOptions = {
  isAnimated?: boolean;
};


interface RNINavigatorViewModule {
  push(
    node: number, 
    routeKey: string,
    options: NativePushPopOptions
  ): Promise<void>;

  pop(
    node: number, 
    options: NativePushPopOptions
  ): Promise<{routeKey: string, routeIndex: number}>;

  setNavigationBarHidden(
    node: number,
    isHidden: boolean,
    animated: boolean
  ): Promise<void>;

  popToRoot(
    node: number, 
    options: NativePushPopOptions
  ): Promise<void>;
  
};

// Import native component
export const RNINavigatorViewModule: RNINavigatorViewModule =
  NativeModules["RNINavigatorViewModule"];