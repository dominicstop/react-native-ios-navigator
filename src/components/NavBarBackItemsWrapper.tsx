import React from 'react';
import { StyleSheet } from 'react-native';

import type { RouteViewPortal } from './RouteViewPortal';
import type { NavigatorView } from './NavigatorView';
import type { NavigatorRouteView, NavRouteEvents } from './NavigatorRouteView';

import type { EventEmitter } from '../functions/EventEmitter';
import type { RouteOptions } from '../types/NavTypes';
import type { RenderNavBarItem, RenderNavBarItemParams } from '../types/NavSharedTypes';

import { NativeIDKeys } from '../constants/LibraryConstants';
import { RNIWrapperView } from '../native_components/RNIWrapperView';


type NavBarBackItemsWrapperProps = {
  routeKey    : string;
  routeIndex  : number;
  routeProps  : object;
  routeOptions: RouteOptions;
  // get ref functions
  getRefToNavigator: () => NavigatorView;
  getEmitterRef    : () => EventEmitter<NavRouteEvents>;
  getRouterRef     : () => NavigatorRouteView;
  getPortalRef     : () => RouteViewPortal;
  // render nav bar items
  renderNavBarLeftItem : RenderNavBarItem;
  renderNavBarRightItem: RenderNavBarItem;
  renderNavBarTitleItem: RenderNavBarItem;
};

/** 
 * This component is used to hold `NavigatorRouteView`'s navigation bar items.
 * This component needs to wrap the navigation bar items so that they can re-render and
 * update when needed.
 * 
 * This component receives the navigation bar items from `RouteViewPortal`. Whenever
 * `RouteViewPortal` updates, this comp. will also update, causing the nav. bar items
 * to re-render and update.
 */
export class NavBarItemsWrapper extends React.Component<NavBarBackItemsWrapperProps> {
  private _routeViewPortalRef: RouteViewPortal;

  componentDidMount(){
    const props = this.props;
    this._routeViewPortalRef = props.getPortalRef();
  };

  setPortalRef = (portalRef: RouteViewPortal) => {
    this._routeViewPortalRef = portalRef;
  };

  render(){
    const props = this.props;
    const portalProps = this._routeViewPortalRef?.props;

    const sharedParams: RenderNavBarItemParams = {
      // pass "get ref" functions...
      getRefToRoute          : props.getRouterRef     , // TODO: rename to `getRouteRef`
      getRefToNavigator      : props.getRefToNavigator,
      getRefToNavRouteEmitter: props.getEmitterRef    ,
      // pass down route props...
      routeKey    : props.routeKey    ,
      routeIndex  : props.routeIndex  ,
      routeProps  : props.routeProps  ,
      routeOptions: props.routeOptions,
    };

    const navBarLeftItem = (
      portalProps?.renderNavBarLeftItem?.(sharedParams) ??
      props.renderNavBarLeftItem?.(sharedParams)
    );

    const navBarRightItem = (
      portalProps?.renderNavBarRightItem?.(sharedParams) ??
      props.renderNavBarRightItem?.(sharedParams)
    );

    const navBarTitleItem = (
      portalProps?.renderNavBarTitleItem?.(sharedParams) ??
      props.renderNavBarTitleItem?.(sharedParams)
    );

    return(
      <React.Fragment>
        {navBarLeftItem && (
          <RNIWrapperView 
            style={styles.navBarItemContainer}
            nativeID={NativeIDKeys.NavBarLeftItem}
          >
            {navBarLeftItem}
          </RNIWrapperView>
        )}
        {navBarRightItem && (
          <RNIWrapperView  
            style={styles.navBarItemContainer}
            nativeID={NativeIDKeys.NavBarRightItem}
          >
            {navBarRightItem}
          </RNIWrapperView>
        )}
        {navBarTitleItem && (
          <RNIWrapperView 
            style={styles.navBarItemContainer}
            nativeID={NativeIDKeys.NavBarTitleItem}
          >
            {navBarTitleItem}
          </RNIWrapperView>
        )}
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  navBarItemContainer: {
    position: 'absolute',
  },
});