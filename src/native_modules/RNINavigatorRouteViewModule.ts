import { NativeModules } from 'react-native';

import type { EdgeInsets, Rect } from '../types/MiscTypes';
import type { RouteSearchControllerState } from '../types/RouteSearchControllerState';

export type RouteConstantsObject = {
  isCurrentlyInFocus: boolean;

  navBarHeight: number;
  statusBarHeight: number;
  navBarWithStatusBarHeight: number;

  safeAreaInsets: EdgeInsets;
  bounds: Rect;
};

interface RNINavigatorRouteViewModule {
  setHidesBackButton(
    node: number, 
    isHidden: boolean, 
    animated: boolean
  ): Promise<void>;

  getRouteConstants(node: number): 
    Promise<RouteConstantsObject>;

  getRouteSearchControllerState(node: number): 
    Promise<RouteSearchControllerState>;

  setRouteSearchControllerState(
    node: number,
    state: Partial<RouteSearchControllerState>
  ): Promise<void>;
};

const COMPONENT_NAME = 'RNINavigatorRouteViewModule';

export const RNINavigatorRouteViewModule: RNINavigatorRouteViewModule =
  NativeModules[COMPONENT_NAME];