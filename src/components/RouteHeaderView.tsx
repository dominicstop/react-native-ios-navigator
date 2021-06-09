import React from 'react';

import { StyleSheet, ViewProps } from 'react-native';

import { RNINavigatorRouteHeaderView, RNINavigatorRouteHeaderViewProps } from '../native_components/RNINavigatorRouteHeaderView';
import { NativeIDKeys } from '../constants/LibraryConstants';

export type RouteHeaderViewProps = ViewProps & Partial<Pick<RNINavigatorRouteHeaderViewProps,
  // mirror props from `NavigatorRouteViewProps`
  | 'config'
  | 'headerTopPadding'
>>;

export class RouteHeaderView extends React.PureComponent<RouteHeaderViewProps> {
  render(){
    const props = this.props;

    return (
      <RNINavigatorRouteHeaderView
        pointerEvents={'box-none'}
        {...props}
        nativeID={NativeIDKeys.RouteHeader}
        config={props.config}
        headerTopPadding={props.headerTopPadding}
        style={[styles.header, props.style]}
      >
        {props.children}
      </RNINavigatorRouteHeaderView>
    );
  };
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});