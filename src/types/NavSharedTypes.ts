import type { ReactElement } from 'react';

import type { RouteTransitionPopConfig, RouteTransitionPushConfig } from '../native_components/RNINavigatorRouteView';
import type { NativePushPopOptions } from '../native_modules/RNINavigatorViewModule';

import type { NavigationObject } from './NavigationObject';
import type { RouteOptions } from './RouteOptions';


// Nav-related types that are shared but not exported/public
// ---------------------------------------------------------

/** Represents a route in the navigation stack. */
export type NavRouteItem = {
  routeKey     : string;
  routeProps  ?: object;
  routeOptions?: RouteOptions;
};

export type NavCommandPushOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPushConfig;
};

export type NavCommandPopOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPopConfig;
};

// TODO: Move handlers
export type RenderNavBarItem = (navigation: NavigationObject) => ReactElement;

export type RenderRouteHeader = (navigation: NavigationObject) => ReactElement;