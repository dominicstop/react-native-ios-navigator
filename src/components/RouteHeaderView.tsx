import React from 'react';

import { RNINavigatorRouteHeaderView, RNINavigatorRouteHeaderViewProps } from '../native_components/RNINavigatorRouteHeaderView';
import { NativeIDKeys } from '../constants/LibraryConstants';

export type RouteHeaderViewProps = Partial<Pick<RNINavigatorRouteHeaderViewProps,
  // mirror props from `NavigatorRouteViewProps`
  | 'config'
  | 'style'
  | 'headerTopPadding'
>>;

export class RouteHeaderView extends React.PureComponent<RouteHeaderViewProps> {
  render(){
    const props = this.props;

    return (
      <RNINavigatorRouteHeaderView
        nativeID={NativeIDKeys.RouteHeader}
        config={props.config}
        headerTopPadding={props.headerTopPadding}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          ...props.style
        }}
      >
        {props.children}
      </RNINavigatorRouteHeaderView>
    );
  };
};