import React from 'react';

import type { NavigatorRouteView, NavRouteEvents } from '../components/NavigatorRouteView';
import type { EventEmitter } from '../functions/EventEmitter';


export type NavRouteViewContextProps = {
  // func. to get refs
  getRouterRef : () => NavigatorRouteView;
  getEmitterRef: () => EventEmitter<NavRouteEvents>;
  // portal-related props
  portalGates: {[key: string]: React.ReactElement}
  portalTeleport: (gateName: string, element: React.ReactElement) => void;
};

export const NavRouteViewContext = 
  React.createContext<Partial<NavRouteViewContextProps>>({});
