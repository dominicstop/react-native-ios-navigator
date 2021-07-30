import type { ReactElement } from 'react';

import type { RouteContentProps } from '../components/NavigatorRouteView';
import type { NavigationObject } from './NavigationObject';

// Nav-related types that are exported/public
// ------------------------------------------

export type RenderNavItem = (navigation: NavigationObject) => ReactElement | null | undefined;

export type RenderRouteContent = () => ReactElement<RouteContentProps>;
