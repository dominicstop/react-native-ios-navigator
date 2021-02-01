import type { RouteTransitionPopConfig, RouteTransitionPushConfig } from '../native_components/RNINavigatorRouteView';
import type { NativePushPopOptions } from '../native_modules/RNINavigatorViewModule';
import type { RouteOptions } from './NavTypes';

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

export type NavCommandPush = (routeItem: NavRouteItem, options?: NavCommandPushOptions) => Promise<void>;

export type NavCommandPop =  (options?: NavCommandPopOptions) => Promise<void>;

//#endregion