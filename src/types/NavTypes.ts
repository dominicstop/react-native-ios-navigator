import type { ReactElement } from 'react';

import type { RouteTransitionPopConfig, RouteTransitionPushConfig } from '../native_components/RNINavigatorRouteView';
import type { NativePushPopOptions } from '../native_modules/RNINavigatorViewModule';

import type { NavigationObject } from './NavigationObject';

// Nav-related types that are exported/public
// ------------------------------------------

export type NavCommandPushOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPushConfig;
};

export type NavCommandPopOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPopConfig;
};

export type RenderNavBarItem = (navigation: NavigationObject) => ReactElement;

export type RenderRouteHeader = (navigation: NavigationObject) => ReactElement;