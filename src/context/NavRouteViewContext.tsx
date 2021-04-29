import React from 'react';
import type { NavigationObject } from '../types/NavTypes';

import type { NavigatorRouteView, NavigatorRouteViewProps, NavRouteEvents } from '../components/NavigatorRouteView';
import type { EventEmitter } from '../functions/EventEmitter';


export type NavRouteViewContextProps = Pick<NavigatorRouteViewProps,
  // mirror props from `NavigatorRouteView`
  | 'routeID'
  | 'navigatorID'
> & {
  navigation: NavigationObject;
};

export const NavRouteViewContext = 
  React.createContext<Partial<NavRouteViewContextProps>>({});