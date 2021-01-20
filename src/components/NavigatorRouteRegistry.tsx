
import React, { ReactElement } from 'react';

import type { NavigatorRouteView, NavRouteEvents } from '../components/NavigatorRouteView';
import type { EventEmitter } from '../functions/EventEmitter';

import { NavRouteViewContext, NavRouteViewContextProps } from '../context/NavRouteViewContext';
import { NavRoutePortalKeys } from '../constants/LibraryConstants';


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
    const props = this.props;

    const sharedParams = {
      getRouterRef: context.getRouterRef,
      getEmitterRef: context.getEmitterRef,
    };

    // delay updating to prevent React from going to infinite loop
    await Promise.resolve();

    if(props.renderNavBarLeftItem){
      context.portalTeleport(
        NavRoutePortalKeys.NavBarLeftItem,
        props.renderNavBarLeftItem(sharedParams)
      );
    };

    if(props.renderNavBarRightItem){
      context.portalTeleport(
        NavRoutePortalKeys.NavBarRightItem,
        props.renderNavBarRightItem(sharedParams)
      );
    };

    if(props.renderNavBarTitleItem){
      context.portalTeleport(
        NavRoutePortalKeys.NavBarTitleItem,
        props.renderNavBarTitleItem(sharedParams)
      );
    };
  };

  render(){
    return null;
  };
};