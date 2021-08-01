import type { ReactElement } from 'react';

import type { RouteContentProps } from '../components/NavigatorRouteView';
import type { NavigationObject } from './NavigationObject';
import type { Nullish } from './UtilityTypes';

// Nav-related types that are exported/public
// ------------------------------------------

export type RenderNavItem = 
  (navigation: Readonly<NavigationObject>) => Nullish<ReactElement>;

export type RenderRouteContent = () => ReactElement<RouteContentProps>;
