import type { RouteOptions } from "./RouteOptions";

/** Represents a route that can be added to the navigation stack. */
export type NavRouteItem = {
  routeKey     : string;
  routeProps  ?: object;
  routeOptions?: RouteOptions;
};

/** Represents a route in the nav. `state.activeRoutes` */
export type NavRouteStackItem = NavRouteItem & {
  routeID: number;
  routeIndex: number;
  isNativeRoute: boolean;
};