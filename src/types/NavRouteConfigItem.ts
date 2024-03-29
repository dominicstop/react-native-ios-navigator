import type { ReactElement } from "react";

import type { RouteContentProps } from "../components/NavigatorRouteView";

import type { NavRouteItem } from "./NavRouteItem";
import type { RenderNavItem } from "./NavTypes";
import type { RouteOptions } from "./RouteOptions";


type NavRouteConfigItemBase = {
  initialRouteProps?: object;
};

/** Native route config */
export type NavRouteConfigItemNative = NavRouteConfigItemBase & {
  isNativeRoute: true;
};

/** JS/React route config */
export type NavRouteConfigItemJS = NavRouteConfigItemBase & {
  isNativeRoute?: false | undefined;
  routeOptionsDefault?: RouteOptions;

  // render the route to show in the view controller
  renderRoute: (routeItem: Readonly<NavRouteItem>) => ReactElement<RouteContentProps>;

  // render nav bar items
  renderNavBarLeftItem ?: RenderNavItem;
  renderNavBarRightItem?: RenderNavItem;
  renderNavBarTitleItem?: RenderNavItem;
};

export type NavRouteConfigItem = 
  NavRouteConfigItemNative | NavRouteConfigItemJS;