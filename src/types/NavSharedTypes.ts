import type { ReactElement } from 'react';

import type { NavigatorRouteView, NavRouteEvents } from 'src/components/NavigatorRouteView';
import type { NavigatorView } from 'src/components/NavigatorView';

import type { RouteTransitionPopConfig, RouteTransitionPushConfig } from '../native_components/RNINavigatorRouteView';
import type { NativePushPopOptions } from '../native_modules/RNINavigatorViewModule';

import type { RouteOptions } from './NavTypes';
import type { EventEmitter } from "../functions/EventEmitter";


// Nav-related types that are shared but not exported/public
// ---------------------------------------------------------

/** Represents a route in the navigation stack. */
export type NavRouteItem = {
  routeKey     : string;
  routeProps  ?: object;
  routeOptions?: RouteOptions;
};

//#region - Navigator Commands
type NavCommandPushOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPushConfig;
};

type NavCommandPopOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPopConfig;
};

export type NavCommandPush = (
  routeItem: NavRouteItem, 
  options?: NavCommandPushOptions
) => Promise<void>;

export type NavCommandPop = (
  options?: NavCommandPopOptions
) => Promise<void>;

export type NavCommandPopToRoot = (
  options?: NativePushPopOptions
) => Promise<void>;

export type NavCommandRemoveRoute = (
  routeIndex: number, 
  animated?: boolean
) => Promise<void>;

export type NavCommandReplaceRoute = (
  prevRouteIndex: number, 
  nextRouteKey: string, 
  animated?: boolean
) => Promise<void>;

export type NavCommandInsertRoute = (
  routeItem: NavRouteItem, 
  atIndex: number, 
  animated?: boolean
) => Promise<void>;

export type NavCommandSetNavigationBarHidden = (
  isHidden: boolean, 
  animated: boolean
) => Promise<void>;

//#endregion

export type RenderNavBarItemParams = {
  routeKey    ?: string;
  routeIndex  ?: number;
  routeProps  ?: object;
  routeOptions?: RouteOptions;
  // get ref functions
  getRefToRoute          ?: () => NavigatorRouteView;
  getRefToNavigator      ?: () => NavigatorView;
  getRefToNavRouteEmitter?: () => EventEmitter<NavRouteEvents>;
};

export type RenderNavBarItem = (params: RenderNavBarItemParams) => ReactElement;