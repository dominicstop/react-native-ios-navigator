import type { ReactElement } from 'react';

import type { NavigatorRouteView, NavRouteEvents } from 'src/components/NavigatorRouteView';
import type { NavigatorView } from 'src/components/NavigatorView';

import type { RouteTransitionPopConfig, RouteTransitionPushConfig } from '../native_components/RNINavigatorRouteView';
import type { NativePushPopOptions } from '../native_modules/RNINavigatorViewModule';

import type { NavigationObject, RouteOptions } from './NavTypes';
import type { EventEmitter } from "../functions/EventEmitter";


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

export type RenderNavBarItem = (navigation: NavigationObject) => ReactElement;

