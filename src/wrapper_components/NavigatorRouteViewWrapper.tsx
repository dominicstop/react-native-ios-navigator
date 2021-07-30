// @refresh reset

import React from 'react';

import type { NavRouteStackItem } from '../types/NavRouteItem';
import type { RenderNavItem, RenderRouteContent } from '../types/NavTypes';
import type { NavRouteConfigItemJS } from '../types/NavRouteConfigItem';

import { NavigatorRouteView, NavigatorRouteViewProps } from '../components/NavigatorRouteView';


type NavigatorRouteViewWrapperProps = Pick<NavigatorRouteViewProps, 
  | 'navigatorID'
  | 'routeID'
  | 'routeKey'
  | 'routeIndex'
  | 'routeProps'
  | 'routeOptionsDefault'
  | 'transitionConfigPushOverride'
  | 'transitionConfigPopOverride'
  | 'getRefToNavigator'
> & {
  innerRef: (ref: NavigatorRouteView | null, route: NavRouteStackItem) => void;
  route: NavRouteStackItem;
  routeConfig: NavRouteConfigItemJS;
  currentActiveRouteIndex: number;

  renderDefaultNavBarLeftItem:  RenderNavItem | undefined;
  renderDefaultNavBarRightItem: RenderNavItem | undefined;
  renderDefaultNavBarTitleItem: RenderNavItem | undefined;
};

/**
 * This component is a wrapper for `NavigatorRouteView`.
 * * Responsible for handling the render props (i.e. so that the anon/arrow functions
 * aren't re-created on each re-render).
 * * Used in `NavigatorView._renderRoutes`.
 */
export class NavigatorRouteViewWrapper extends React.Component<NavigatorRouteViewWrapperProps> {

  _handleRef = (ref: NavigatorRouteView | null) => {
    const props = this.props;
    props.innerRef(ref, props.route);
  };

  _handleRenderRouteContent: RenderRouteContent = () => {
    const props = this.props;
    const routeConfig = this.props.routeConfig;

    return (
      routeConfig.renderRoute(props.route)
    );
  };

  _handleRenderNavBarLeftItem: RenderNavItem = (args) => {
    const props = this.props;
    const routeConfig = this.props.routeConfig;

    return (
      routeConfig.renderNavBarLeftItem?.(args) ??
      props.renderDefaultNavBarLeftItem?.(args)
    );
  };

  _handleRenderNavBarRightItem: RenderNavItem = (args) => {
    const props = this.props;
    const routeConfig = this.props.routeConfig;

    return (
      routeConfig.renderNavBarRightItem?.(args) ??
      props.renderDefaultNavBarRightItem?.(args)
    );
  };

  _handleRenderNavBarTitleItem: RenderNavItem = (args) => {
    const props = this.props;
    const routeConfig = this.props.routeConfig;

    return (
      routeConfig.renderNavBarTitleItem?.(args) ??
      props.renderDefaultNavBarTitleItem?.(args)
    );
  };
  
  render(){
    const props = this.props;

    return (
      <NavigatorRouteView
        ref={this._handleRef}
        navigatorID={props.navigatorID}
        routeID={props.routeID}
        routeKey={props.routeKey}
        routeIndex={props.routeIndex}
        routeProps={props.routeProps}
        isInFocus={(props.currentActiveRouteIndex === props.routeIndex)}
        routeOptionsDefault={props.routeOptionsDefault}
        transitionConfigPushOverride={props.transitionConfigPushOverride}
        transitionConfigPopOverride={props.transitionConfigPopOverride}
        getRefToNavigator={props.getRefToNavigator}
        renderRouteContent={this._handleRenderRouteContent}
        renderNavBarLeftItem={this._handleRenderNavBarLeftItem}
        renderNavBarRightItem={this._handleRenderNavBarRightItem}
        renderNavBarTitleItem={this._handleRenderNavBarTitleItem}
      />
    );
  };
};