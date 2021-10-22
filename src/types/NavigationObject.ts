

import type { NavigatorView } from "../components/NavigatorView";
import type { NavigatorRouteView } from "../components/NavigatorRouteView";

import type { RouteOptions } from "./RouteOptions";

import type { NavigatorRouteViewEventEmitter } from "./NavigatorRouteViewEventEmitter";
import type { RNINavigatorRouteViewProps } from "../native_components/RNINavigatorRouteView";


export type NavigationObject<T = object> = Pick<RNINavigatorRouteViewProps, 
  // route metadata
  | 'routeID' 
  | 'routeKey' 
  | 'routeIndex'

> & Pick<typeof NavigatorView.prototype,
  // navigator commands
  | 'push'
  | 'pop'
  | 'popToRoot'
  | 'removeRoute'
  | 'removeRoutes'
  | 'replaceRoute'
  | 'insertRoute'
  | 'setRoutes'
  | 'setNavigationBarHidden'
  
  // convenience navigator commands
  | 'replacePreviousRoute'
  | 'replaceCurrentRoute'
  | 'removePreviousRoute'
  | 'removeAllPrevRoutes'

  // misc. navigator commands
  | 'sendCustomCommandToNative'
  | 'getNavigatorConstants'
  | 'getActiveRoutes'
  | 'dismissModal'
  | 'getMatchingRouteStackItem'
  | 'getNavigationObjectForRoute'

> & Pick<typeof NavigatorRouteView.prototype,
  // route commands
  | 'getRouteOptions'
  | 'setRouteOptions'
  | 'setHidesBackButton'
  | 'getRouteConstants'
> & {

  routeProps  : T | null;
  routeOptions: RouteOptions;

  // get ref functions
  getRefToRoute          : () => NavigatorRouteView;
  getRefToNavigator      : () => NavigatorView;
  getRefToNavRouteEmitter: () => NavigatorRouteViewEventEmitter;
};