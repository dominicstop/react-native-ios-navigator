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
          ...props.style
        }}
      >
        {props.children}
      </RNINavigatorRouteHeaderView>
    );
  };
};