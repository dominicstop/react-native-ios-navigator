import React from 'react';

import { StyleSheet, View, ViewProps } from 'react-native';

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
      <View 
        style={styles.headerContainer}
        pointerEvents={'box-none'}
      >
        <RNINavigatorRouteHeaderView
          pointerEvents={'box-none'}
          {...props}
          nativeID={NativeIDKeys.RouteHeader}
          config={props.config}
          headerTopPadding={props.headerTopPadding}
          style={[props.style]}
        >
          {props.children}
        </RNINavigatorRouteHeaderView>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 0,
  },
});