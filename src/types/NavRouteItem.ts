import type { RNINavigatorRouteViewProps } from "../native_components/RNINavigatorRouteView";
import type { RouteOptions } from "./RouteOptions";

/** Represents a route that can be added to the navigation stack. */
export type NavRouteItem = 
  Pick<RNINavigatorRouteViewProps, 'routeKey'> & {

  routeProps  ?: object;
  routeOptions?: RouteOptions;
};

/** Represents a route in the nav. `state.activeRoutes` */
export type NavRouteStackItem = NavRouteItem
  & Pick<RNINavigatorRouteViewProps, 'routeID' | 'routeIndex'> 
  & { isNativeRoute: boolean };

/** 
 * Used in the `SetRoutesTransformCallback` function. 
 * Represents either an active route in the navigation stack, or a route that is about 
 * to be created and added to the navigation stack. 
 */
export type NavRouteStackPartialItem = 
  NavRouteItem & Partial<Pick<RNINavigatorRouteViewProps, 'routeID'>>; 

/** Properties that can be used to identify an active route */
export type NavRouteStackItemMetadata = 
  Pick<RNINavigatorRouteViewProps, 'routeID' | 'routeKey' | 'routeIndex'>;

/** Properties that can be used to potentially identify an active route */
export type NavRouteStackItemPartialMetadata = 
  Partial<NavRouteStackItemMetadata>;