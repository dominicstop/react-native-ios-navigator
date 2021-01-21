
import React, { ReactElement } from 'react';

import type { NavigatorRouteView, NavRouteEvents } from '../components/NavigatorRouteView';
import type { EventEmitter } from '../functions/EventEmitter';

import { NavRouteViewContext, NavRouteViewContextProps } from '../context/NavRouteViewContext';


type RouteViewPortalRender = (params: {
  getRouterRef : () => NavigatorRouteView,
  getEmitterRef: () => EventEmitter<NavRouteEvents>,
}) => ReactElement;

type RouteViewPortalProps = {
  renderNavBarLeftItem ?: RouteViewPortalRender;
  renderNavBarRightItem?: RouteViewPortalRender;
  renderNavBarTitleItem?: RouteViewPortalRender;
};
  
export class RouteViewPortal extends React.Component<RouteViewPortalProps> {
  static contextType = NavRouteViewContext;
  
  context: NavRouteViewContextProps;

  async componentDidMount(){
    const context = this.context;

    const routerRef = context.getRouterRef();
    routerRef.setRouteRegistryRef(this);
  };

  render(){
    return null;
  };
};