
import React from 'react';

import { NavRouteEvents } from '../components/NavigatorRouteView';

import type { NavigatorRouteView } from '../components/NavigatorRouteView';
import type { onRoutePopEvent, onRoutePushEvent, onRouteFocusBlurEvent, onPressNavBarItem } from 'src/native_components/RNINavigatorRouteView';

import type { EventEmitter } from '../functions/EventEmitter';
import type { RouteOptions } from '../types/NavTypes';

import { NavRouteViewContext, NavRouteViewContextProps } from '../context/NavRouteViewContext';


type RouteViewEventsProps = {
  routeOptions?: RouteOptions;

  // push/pop events
  onRouteWillPush?: onRoutePushEvent;
  onRouteDidPush ?: onRoutePushEvent;
  onRouteWillPop ?: onRoutePopEvent ;
  onRouteDidPop  ?: onRoutePopEvent ;

  // push/pop events
  onRouteWillFocus?: onRouteFocusBlurEvent;
  onRouteDidFocus ?: onRouteFocusBlurEvent;
  onRouteWillBlur ?: onRouteFocusBlurEvent;
  onRouteDidBlur  ?: onRouteFocusBlurEvent;

  // onPress navbar item events
  onPressNavBarLeftItem ?: onPressNavBarItem;
  onPressNavBarRightItem?: onPressNavBarItem;
};

/** 
 * This component is used to listen to route-related events.
 * 
 * This component is used inside a route, and allows you to listen for the events
 * that are related to that route.
 * 
 * This component is just a "convenient" wrapper component that subscribes to the
 * parent route component's event emitter. The reference to the event emitter is obtained
 * via context.
 */
export class RouteViewEvents extends React.Component<RouteViewEventsProps> {
  static contextType = NavRouteViewContext;
  
  context: NavRouteViewContextProps;
  routerRef: NavigatorRouteView;
  emitterRef: EventEmitter<NavRouteEvents>;
  
  constructor(props: RouteViewEventsProps, context: NavRouteViewContextProps){
    super(props);

    const routerRef = context.getRouteRef();
    this.routerRef = routerRef;

    const routeEmitterRef = routerRef.getEmitterRef();
    this.emitterRef = routeEmitterRef;

    routeEmitterRef.addListener(
      NavRouteEvents.onRouteWillPush,
      this._handleOnRouteWillPush
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onRouteDidPush,
      this._handleOnRouteDidPush
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onRouteWillPop,
      this._handleOnRouteWillPop
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onRouteDidPop,
      this._handleOnRouteDidPop
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onRouteWillFocus,
      this._handleOnRouteWillFocus
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onRouteDidFocus,
      this._handleOnRouteDidFocus
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onRouteWillBlur,
      this._handleOnRouteWillBlur
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onRouteDidBlur,
      this._handleOnRouteDidBlur
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onPressNavBarLeftItem,
      this._handleOnPressNavBarLeftItem
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onPressNavBarRightItem,
      this._handleOnPressNavBarRightItem
    );
  };

  componentWillUnmount(){
    const routeEmitterRef = this.emitterRef;

    routeEmitterRef.removeListener(
      NavRouteEvents.onRouteWillPush,
      this._handleOnRouteWillPush
    );

    routeEmitterRef.removeListener(
      NavRouteEvents.onRouteDidPush,
      this._handleOnRouteDidPush
    );

    routeEmitterRef.removeListener(
      NavRouteEvents.onRouteWillPop,
      this._handleOnRouteWillPop
    );

    routeEmitterRef.removeListener(
      NavRouteEvents.onRouteDidPop,
      this._handleOnRouteDidPop
    );

    routeEmitterRef.removeListener(
      NavRouteEvents.onRouteWillFocus,
      this._handleOnRouteWillFocus
    );

    routeEmitterRef.removeListener(
      NavRouteEvents.onRouteDidFocus,
      this._handleOnRouteDidFocus
    );

    routeEmitterRef.removeListener(
      NavRouteEvents.onRouteWillBlur,
      this._handleOnRouteWillBlur
    );

    routeEmitterRef.removeListener(
      NavRouteEvents.onRouteDidBlur,
      this._handleOnRouteDidBlur
    );

    routeEmitterRef.removeListener(
      NavRouteEvents.onPressNavBarLeftItem,
      this._handleOnPressNavBarLeftItem
    );

    routeEmitterRef.removeListener(
      NavRouteEvents.onPressNavBarRightItem,
      this._handleOnPressNavBarRightItem
    );
  };

  //#region - Event Handlers

  _handleOnRouteWillPush: onRoutePushEvent = (params) => {
    this.props.onRouteWillPush?.(params);
  };

  _handleOnRouteDidPush: onRoutePushEvent = (params) => {
    this.props.onRouteDidPush?.(params);
  };

  _handleOnRouteWillPop: onRoutePopEvent = (params) => {
    this.props.onRouteWillPop?.(params);
  };

  _handleOnRouteDidPop: onRoutePopEvent = (params) => {
    this.props.onRouteDidPop?.(params);
  };

  _handleOnRouteWillFocus: onRouteFocusBlurEvent = (params) => {
    this.props.onRouteWillFocus?.(params);
  };

  _handleOnRouteDidFocus: onRouteFocusBlurEvent = (params) => {
    this.props.onRouteDidFocus?.(params);
  };

  _handleOnRouteWillBlur: onRouteFocusBlurEvent = (params) => {
    this.props.onRouteWillBlur?.(params);
  };

  _handleOnRouteDidBlur: onRouteFocusBlurEvent = (params) => {
    this.props.onRouteDidBlur?.(params);
  };

  _handleOnPressNavBarLeftItem: onPressNavBarItem = (params) => {
    this.props.onPressNavBarLeftItem?.(params);
  };

  _handleOnPressNavBarRightItem: onPressNavBarItem = (params) => {
    this.props.onPressNavBarRightItem?.(params);
  };

  //#endregion

  render(){
    return null;
  };
};