

import type { NavigatorView } from "../components/NavigatorView";
import type { NavigatorRouteView } from "../components/NavigatorRouteView";

import type { RouteOptions } from "./RouteOptions";

import type { NavigatorRouteViewEventEmitter } from "./NavigatorRouteViewEventEmitter";

export type NavigationObject = {
  routeKey    : string;
  routeIndex  : number;
  routeProps  : object | null;
  routeOptions: RouteOptions;

  // navigator commands
  push        : typeof NavigatorView.prototype.push;
  pop         : typeof NavigatorView.prototype.pop;
  popToRoot   : typeof NavigatorView.prototype.popToRoot;
  removeRoute : typeof NavigatorView.prototype.removeRoute;
  removeRoutes: typeof NavigatorView.prototype.removeRoutes;
  replaceRoute: typeof NavigatorView.prototype.replaceRoute;
  insertRoute : typeof NavigatorView.prototype.insertRoute;
  setRoutes   : typeof NavigatorView.prototype.setRoutes;
  
  setNavigationBarHidden: typeof NavigatorView.prototype.setNavigationBarHidden;

  // convenience navigator commands
  replacePreviousRoute: typeof NavigatorView.prototype.replacePreviousRoute;
  replaceCurrentRoute : typeof NavigatorView.prototype.replaceCurrentRoute;
  removePreviousRoute : typeof NavigatorView.prototype.removePreviousRoute;
  removeAllPrevRoutes : typeof NavigatorView.prototype.removeAllPrevRoutes;

  // misc. navigator commands
  sendCustomCommandToNative: typeof NavigatorView.prototype.sendCustomCommandToNative;
  getNavigatorConstants    : typeof NavigatorView.prototype.getNavigatorConstants;

  // route commands
  getRouteOptions: typeof NavigatorRouteView.prototype.getRouteOptions;
  setRouteOptions: typeof NavigatorRouteView.prototype.setRouteOptions;

  setHidesBackButton: typeof NavigatorRouteView.prototype.setHidesBackButton;
  getRouteConstants : typeof NavigatorRouteView.prototype.getRouteConstants;

  // get ref functions
  getRefToRoute          : () => NavigatorRouteView;
  getRefToNavigator      : () => NavigatorView;
  getRefToNavRouteEmitter: () => NavigatorRouteViewEventEmitter;
};