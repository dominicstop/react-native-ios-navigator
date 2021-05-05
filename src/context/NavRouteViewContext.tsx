import React from 'react';

import type { NavigationObject } from '../types/NavigationObject';
import type { NavigatorRouteViewProps } from '../components/NavigatorRouteView';


export type NavRouteViewContextProps = Pick<NavigatorRouteViewProps,
  // mirror props from `NavigatorRouteView`
  | 'routeID'
  | 'navigatorID'
> & {
  navigation: NavigationObject;
};

export const NavRouteViewContext = 
  React.createContext<Partial<NavRouteViewContextProps>>({});