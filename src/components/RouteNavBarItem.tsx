
import React, { ReactElement } from 'react';
import { findNodeHandle, StyleSheet, View } from 'react-native';

import { RNIRouteNavBarItemView, RNIRouteNavBarItemViewProps } from '../native_components/RNIRouteNavBarItemView';

import { NativeIDKeys } from '../constants/LibraryConstants';
import { NavRouteViewContext, NavRouteViewContextProps } from '../context/NavRouteViewContext';


class RouteNavBarLeftItem extends React.Component {
  static contextType = NavRouteViewContext;
  context: NavRouteViewContextProps;

  private navBarItemRef: React.Component<RNIRouteNavBarItemViewProps>;

  componentDidMount = async () => {
    const context = this.context;
    const routerRef = context.getRouterRef();

    routerRef.registerNativeComponent(
      this.navBarItemRef,
      NativeIDKeys.NavBarLeftItem
    );
  };

  render(){
    return (
      <RNIRouteNavBarItemView
        ref={r => this.navBarItemRef = r}
        style={styles.navBarItem}
        nativeID={NativeIDKeys.NavBarLeftItem}
      >
        {this.props.children}
      </RNIRouteNavBarItemView>
    );
  };
};

const styles = StyleSheet.create({
  navBarItem: {
    // don't show
    position: 'absolute',
    width: 0,
    height: 0,
  },
});

export const RouteNavBar = {
  LeftItem : RouteNavBarLeftItem,
  RightItem: RouteNavBarLeftItem,
  TitleItem: RouteNavBarLeftItem,
};