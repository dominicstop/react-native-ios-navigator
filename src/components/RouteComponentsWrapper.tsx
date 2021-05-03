import React from 'react';
import { StyleSheet } from 'react-native';

import type { NavigatorRouteViewProps } from './NavigatorRouteView';
import type { RouteViewPortal } from './RouteViewPortal';
import type { NavigationObject } from '../types/NavTypes';

import { NativeIDKeys } from '../constants/LibraryConstants';
import { RNIWrapperView } from '../native_components/RNIWrapperView';


type RouteComponentsWrapperProps = Required<Pick<NavigatorRouteViewProps,
  // mirror props from `NavigatorRouteViewProps`
  | 'renderNavBarLeftItem'
  | 'renderNavBarRightItem'
  | 'renderNavBarTitleItem'
  | 'renderRouteHeader'
>> & {
  navigation: NavigationObject;
  getPortalRef: () => RouteViewPortal;
};

/** 
 * This component is used to hold `NavigatorRouteView`'s navigation bar items, and the
 * other route-related comp. such as the route header.
 * 
 * This component needs to wrap the route component items so that they can re-render 
 * and update when needed.
 * 
 * This component receives the route component items from `RouteViewPortal`. Whenever
 * `RouteViewPortal` updates, this comp. will also update, causing the nav. bar items
 * to re-render and update.
 */
export class RouteComponentsWrapper extends React.Component<RouteComponentsWrapperProps> {
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

    const navigation = props.navigation;

    const navBarLeftItem = (
      portalProps?.renderNavBarLeftItem?.(navigation) ??
      props.renderNavBarLeftItem?.(navigation)
    );

    const navBarRightItem = (
      portalProps?.renderNavBarRightItem?.(navigation) ??
      props.renderNavBarRightItem?.(navigation)
    );

    const navBarTitleItem = (
      portalProps?.renderNavBarTitleItem?.(navigation) ??
      props.renderNavBarTitleItem?.(navigation)
    );

    const routeHeader = (
      portalProps?.renderRouteHeader?.(navigation) ??
      props.renderRouteHeader?.(navigation)
    );

    return(
      <React.Fragment>
        {navBarLeftItem && (
          <RNIWrapperView 
            style={styles.routeItemContainer}
            nativeID={NativeIDKeys.NavBarLeftItem}
          >
            {navBarLeftItem}
          </RNIWrapperView>
        )}
        {navBarRightItem && (
          <RNIWrapperView  
            style={styles.routeItemContainer}
            nativeID={NativeIDKeys.NavBarRightItem}
          >
            {navBarRightItem}
          </RNIWrapperView>
        )}
        {navBarTitleItem && (
          <RNIWrapperView 
            style={styles.routeItemContainer}
            nativeID={NativeIDKeys.NavBarTitleItem}
          >
            {navBarTitleItem}
          </RNIWrapperView>
        )}
        {routeHeader}
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  routeItemContainer: {
    position: 'absolute',
  },
});