import React, { ReactElement } from 'react';
import { StyleSheet, View, ViewStyle, findNodeHandle } from 'react-native';

import type { NavigationObject, RouteOptions } from '../types/NavTypes';
import type { RenderNavBarItem } from '../types/NavSharedTypes';

import type { NavigatorView } from './NavigatorView';
import type { RouteViewPortal } from './RouteViewPortal';

import { RouteComponentsWrapper } from './RouteComponentsWrapper';

import { RNINavigatorRouteView, RNINavigatorRouteViewProps, onPressNavBarItem, onRoutePushEvent, onRoutePopEvent, RouteTransitionPopConfig, RouteTransitionPushConfig, onRouteFocusBlurEvent } from '../native_components/RNINavigatorRouteView';
import { RNINavigatorRouteViewModule } from '../native_modules/RNINavigatorRouteViewModule';

import * as Helpers from '../functions/Helpers';
import { EventEmitter } from '../functions/EventEmitter';

import { NavRouteViewContext, NavRouteViewContextProps } from '../context/NavRouteViewContext';
import { NativeIDKeys } from '../constants/LibraryConstants';

import { RNINavigatorRouteHeaderView, RNINavigatorRouteHeaderViewProps } from '../native_components/RNINavigatorRouteHeaderView';


export type RouteHeaderViewProps = Partial<Pick<RNINavigatorRouteHeaderViewProps,
  // mirror props from `NavigatorRouteViewProps`
  | 'config'
  | 'style'
>> & {

};

export class RouteHeaderView extends React.PureComponent<RouteHeaderViewProps> {
  render(){
    const props = this.props;

    return (
      <RNINavigatorRouteHeaderView
        nativeID={NativeIDKeys.RouteHeader}
        config={props.config}
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