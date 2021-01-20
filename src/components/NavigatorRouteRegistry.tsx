
import React, { ReactElement } from 'react';

import type { NavigatorRouteView, NavRouteEvents } from '../components/NavigatorRouteView';
import type { EventEmitter } from '../functions/EventEmitter';

import { NavRouteViewContext, NavRouteViewContextProps } from '../context/NavRouteViewContext';


type NavRouteRegistryRender = (params: {
  getRouterRef : () => NavigatorRouteView,
  getEmitterRef: () => EventEmitter<NavRouteEvents>,
}) => ReactElement;

type NavRouteViewRegistryProps = {
  renderNavBarLeftItem ?: NavRouteRegistryRender;
  renderNavBarRightItem?: NavRouteRegistryRender;
  renderNavBarTitleItem?: NavRouteRegistryRender;
};
  
export class NavigatorRouteViewRegistry extends React.Component<NavRouteViewRegistryProps> {
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