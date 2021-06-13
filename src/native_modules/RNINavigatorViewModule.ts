import { NativeModules } from 'react-native';

import type { RNINavigatorRouteViewProps } from 'src/native_components/RNINavigatorRouteView';
import type { EdgeInsets, Rect } from 'src/types/MiscTypes';

export type NativePushPopOptions = {
  isAnimated?: boolean;
};

type RouteData = {
  type: 'viewController'
} | ({
  type: 'reactRoute' | 'nativeRoute'
} & Pick<RNINavigatorRouteViewProps, 
  | 'routeID'
  | 'routeKey'
  | 'routeIndex'
>);

export type NavigatorConstantsObject = {
  navigatorID: number;

  navBarHeight: number;
  statusBarHeight: number;
  safeAreaInsets: EdgeInsets;
  bounds: Rect;

  isPresenting: boolean;
  activeRoutes: Array<RouteData>;

  topViewController    ?: RouteData;
  visibleViewController?: RouteData;
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
  // ---------------------

  getNativeRouteKeys(callback: (keys: [string]) => void): void;

  sendCustomCommandToNative(
    node: number,
    commandKey: string,
    commandData: object | null
  ): Promise<object | null>;

  
  getNavigatorConstants(node: number): Promise<NavigatorConstantsObject>;
};

const MODULE_NAME = "RNINavigatorViewModule";

export const RNINavigatorViewModule: RNINavigatorViewModule =
  NativeModules[MODULE_NAME];