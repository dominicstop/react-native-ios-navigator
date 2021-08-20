import { NativeModules } from 'react-native';

import type { RNINavigatorRouteViewProps } from '../native_components/RNINavigatorRouteView';
import type { EdgeInsets, Rect } from '../types/MiscTypes';

export type NativePushPopOptions = {
  isAnimated?: boolean;
};

export type NativeRouteData = {
  type: 'viewController'
} | ({
  type: 'reactRoute' | 'nativeRoute'
} & Pick<RNINavigatorRouteViewProps, 
  | 'routeID'
  | 'routeKey'
  | 'routeIndex'
>);

export type NativeActiveRoutes = Pick<RNINavigatorRouteViewProps, 
  | 'routeID'
  | 'routeKey'
  | 'routeIndex'
> & {
  type: 'reactRoute' | 'nativeRoute'
};

export type NavigatorConstantsObject = {
  navigatorID: number;

  navBarHeight: number;
  statusBarHeight: number;
  safeAreaInsets: EdgeInsets;
  bounds: Rect;

  isPresenting: boolean;
  activeRoutes: Array<NativeRouteData>;

  topViewController    ?: NativeRouteData;
  visibleViewController?: NativeRouteData;
};

interface RNINavigatorViewModule {

  // Module Commands: Navigator
  // --------------------------

  push(
    node: number, 
    routeID: number,
    options: Readonly<NativePushPopOptions>
  ): Promise<void>;

  pop(
    node: number, 
    options: Readonly<NativePushPopOptions>
  ): Promise<{routeKey: string, routeIndex: number}>;

  setNavigationBarHidden(
    node: number,
    isHidden: boolean,
    animated: boolean
  ): Promise<void>;

  popToRoot(
    node: number, 
    options: Readonly<NativePushPopOptions>
  ): Promise<void>;
  
  removeRoute(
    node: number, 
    routeID: number,
    routeIndex: number,
    animated: boolean,
  ): Promise<void>;

  removeRoutes(
    node: number, 
    itemsToRemove: readonly Readonly<{
      routeID: number;
      routeIndex: number;
    }>[],
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
    nextRouteIDs: readonly number[],
    animated: boolean,
  ): Promise<void>;

  // Module Commands: Misc
  // ---------------------

  getNativeRouteKeys(callback: (keys: [string]) => void): void;

  sendCustomCommandToNative(
    node: number,
    commandKey: string,
    commandData: Readonly<object> | null
  ): Promise<object | null>;

  
  getNavigatorConstants(node: number): Promise<NavigatorConstantsObject>;

  getNavigatorActiveRoutes(node: number): Promise<NativeActiveRoutes>;
};

const MODULE_NAME = "RNINavigatorViewModule";

export const RNINavigatorViewModule: RNINavigatorViewModule =
  NativeModules[MODULE_NAME];