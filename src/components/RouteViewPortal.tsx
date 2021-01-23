
import React, { ReactElement } from 'react';

import type { NavigatorView, RouteOptions } from './NavigatorView';
import type { NavigatorRouteView, NavRouteEvents } from '../components/NavigatorRouteView';
import type { EventEmitter } from '../functions/EventEmitter';

import { compareRouteOptions } from '../functions/CompareObjects';
import { NavRouteViewContext, NavRouteViewContextProps } from '../context/NavRouteViewContext';


type RouteViewPortalRender = (params: {
  routeKey    : string;
  routeIndex  : number;
  routeProps  : object;
  routeOptions: RouteOptions;
  // "get ref" functions
  getRefToNavigator: () => NavigatorView;
  getRouterRef     : () => NavigatorRouteView;
  getEmitterRef    : () => EventEmitter<NavRouteEvents>;
}) => ReactElement;

type RouteViewPortalProps = {
  routeOptions?: RouteOptions;
  // render props
  renderNavBarBackItem ?: RouteViewPortalRender;
  renderNavBarLeftItem ?: RouteViewPortalRender;
  renderNavBarRightItem?: RouteViewPortalRender;
  renderNavBarTitleItem?: RouteViewPortalRender;
};
  
export class RouteViewPortal extends React.Component<RouteViewPortalProps> {
  static contextType = NavRouteViewContext;
  
  context: NavRouteViewContextProps;
  routerRef: NavigatorRouteView;
  
  constructor(props: RouteViewPortalProps){
    super(props);
  };

  componentDidUpdate(prevProps: RouteViewPortalProps){
    const nextProps = this.props;

    const didRouteOptionsChange = 
      !compareRouteOptions(prevProps.routeOptions, nextProps.routeOptions);

    if(didRouteOptionsChange){
      this.routerRef.setRouteOptions(nextProps.routeOptions);
    };
  };

  async componentDidMount(){
    const context = this.context;

    const routerRef = context.getRouterRef();
    this.routerRef = routerRef;

    routerRef.setRouteRegistryRef(this);
  };

  render(){
    return null;
  };
};