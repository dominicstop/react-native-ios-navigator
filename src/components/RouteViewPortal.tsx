import React from 'react';

import type { NavigatorRouteView } from '../components/NavigatorRouteView';

import type { RouteOptions } from '../types/NavTypes';
import type { RenderNavBarItem } from '../types/NavSharedTypes';

import { compareRouteOptions } from '../functions/CompareObjects';
import { NavRouteViewContext, NavRouteViewContextProps } from '../context/NavRouteViewContext';


type RouteViewPortalProps = {
  routeOptions?: RouteOptions;
  
  // render props
  renderNavBarLeftItem ?: RenderNavBarItem;
  renderNavBarRightItem?: RenderNavBarItem;
  renderNavBarTitleItem?: RenderNavBarItem;
};

/** 
 * This component is used to customize the route's navigation bar.
 * This component is used inside a route, and allows you to update the route's `routeOptions`
 * and provide custom elements to show in the navigation bar.
 * 
 * Reminder: You can only one `RouteViewPortal` per route.
 * 
 * Through the `routeOptions` prop, you can update the route's `routeTitle` and `backButtonTitle`, 
 * configure the navigation bar items (e.g. like setting the right navigation bar item via 
 * `navBarButtonRightItemsConfig`), or providing a custom view to show in the navigation bar (
 * e.g. you can render a custom title via `renderNavBarTitleItem`, etc.)
 * 
 * Note: The reason why this component is called `RouteViewPortal` is because it's transporting
 * the elements (and props) you pass to this component to the route navigator. In other words,
 * the props and elements you pass to this component are being used/rendered somewhere else in
 * the view hierarchy. This is achieved through context, and as such, you can only use this
 * component if it's a child of a route navigator.
 */
export class RouteViewPortal extends React.Component<RouteViewPortalProps> {
  static contextType = NavRouteViewContext;
  
  context: NavRouteViewContextProps;
  routerRef: NavigatorRouteView;
  
  constructor(props: RouteViewPortalProps, context: NavRouteViewContextProps){
    super(props);

    const routerRef = context.getRouteRef();
    this.routerRef = routerRef;

    routerRef.setRouteViewPortalRef(this);
    routerRef.setRouteOptions(props.routeOptions);
  };

  componentDidUpdate(prevProps: RouteViewPortalProps){
    const nextProps = this.props;

    const didRouteOptionsChange = 
      !compareRouteOptions(prevProps.routeOptions, nextProps.routeOptions);

    const didChangeCustomNavBarItems = (
      ((prevProps.renderNavBarLeftItem  == null) != (nextProps.renderNavBarLeftItem  == null)) ||
      ((prevProps.renderNavBarRightItem == null) != (nextProps.renderNavBarRightItem == null)) ||
      ((prevProps.renderNavBarTitleItem == null) != (nextProps.renderNavBarTitleItem == null))
    );

    if(didRouteOptionsChange || didChangeCustomNavBarItems){
      this.routerRef.setRouteOptions(nextProps.routeOptions);
    };
  };

  render(){
    return null;
  };
};