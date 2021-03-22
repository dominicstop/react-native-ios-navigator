import { NativeModules } from 'react-native';

export type NativePushPopOptions = {
  isAnimated?: boolean;
};

interface RNINavigatorViewModule {

  // Module Commands: Navigator
  // --------------------------

  push(
    node: number, 
    routeID: number,
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
  
  removeRoute(
    node: number, 
    routeID: number,
    routeIndex: number,
    animated: boolean,
  ): Promise<void>;

  removeRoutes(
    node: number, 
    itemsToRemove: Array<{
      routeID: number;
      routeIndex: number;
    }>,
    animated: boolean,
  ): Promise<void>;

  replaceRoute(
    node: number,
    prevRouteIndex: number,
    prevRouteID: number,
    nextRouteID: number,
    animated: boolean,
  ): Promise<void>;

  insertRoute(
    node: number,
    nextRouteID: number,
    atIndex: number,
    animated: boolean,
  ): Promise<void>;

  setRoutes(
    node: number,
    nextRouteIDs: Array<number>,
    animated: boolean,
  ): Promise<void>;

  // Module Commands: Misc
  // -----------------------

  getNativeRouteKeys(callback: (keys: [string]) => void): void;
};

export const RNINavigatorViewModule: RNINavigatorViewModule =
  NativeModules["RNINavigatorViewModule"];