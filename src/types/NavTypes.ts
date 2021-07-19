import type { ReactElement } from 'react';
import type { NavigationObject } from './NavigationObject';

// Nav-related types that are exported/public
// ------------------------------------------

export type RenderNavItem = (navigation: NavigationObject) => ReactElement | null | undefined;
