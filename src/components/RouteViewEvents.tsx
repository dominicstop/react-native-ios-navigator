
import React from 'react';

import { NavRouteEvents } from '../components/NavigatorRouteView';

import type { NavigatorRouteView } from '../components/NavigatorRouteView';
import type { OnRoutePopEvent, OnRoutePushEvent, OnRouteFocusBlurEvent, OnPressNavBarItem, OnUpdateSearchResults, OnSearchBarCancelButtonClicked, OnSearchBarSearchButtonClicked } from '../types/NavRouteViewEvents';

import type { EventEmitter } from '../functions/EventEmitter';

import { NavRouteViewContext, NavRouteViewContextProps } from '../context/NavRouteViewContext';


type RouteViewEventsProps = {
  // push/pop events
  onRouteWillPush?: OnRoutePushEvent;
  onRouteDidPush ?: OnRoutePushEvent;
  onRouteWillPop ?: OnRoutePopEvent ;
  onRouteDidPop  ?: OnRoutePopEvent ;

  // focus/blur events
  onRouteWillFocus?: OnRouteFocusBlurEvent;
  onRouteDidFocus ?: OnRouteFocusBlurEvent;
  onRouteWillBlur ?: OnRouteFocusBlurEvent;
  onRouteDidBlur  ?: OnRouteFocusBlurEvent;

  // onPress navbar item events
  onPressNavBarLeftItem ?: OnPressNavBarItem;
  onPressNavBarRightItem?: OnPressNavBarItem;

  // search events
  onUpdateSearchResults?: OnUpdateSearchResults;
  onSearchBarCancelButtonClicked?: OnSearchBarCancelButtonClicked;
  onSearchBarSearchButtonClicked?: OnSearchBarSearchButtonClicked;
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
  
  routerRef: NavigatorRouteView;
  emitterRef: EventEmitter<NavRouteEvents>;
  
  constructor(props: RouteViewEventsProps, context: NavRouteViewContextProps){
    super(props);
    const { navigation } = context;

    const routeRef = navigation.getRefToRoute();
    this.routerRef = routeRef;

    const routeEmitterRef = routeRef.getEmitterRef();
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

    routeEmitterRef.addListener(
      NavRouteEvents.onUpdateSearchResults,
      this._handleOnUpdateSearchResults
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onSearchBarCancelButtonClicked,
      this._handleOnSearchBarCancelButtonClicked
    );

    routeEmitterRef.addListener(
      NavRouteEvents.onSearchBarSearchButtonClicked,
      this._handleOnSearchBarSearchButtonClicked
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

  _handleOnRouteWillPush: OnRoutePushEvent = (params) => {
    this.props.onRouteWillPush?.(params);
  };

  _handleOnRouteDidPush: OnRoutePushEvent = (params) => {
    this.props.onRouteDidPush?.(params);
  };

  _handleOnRouteWillPop: OnRoutePopEvent = (params) => {
    this.props.onRouteWillPop?.(params);
  };

  _handleOnRouteDidPop: OnRoutePopEvent = (params) => {
    this.props.onRouteDidPop?.(params);
  };

  _handleOnRouteWillFocus: OnRouteFocusBlurEvent = (params) => {
    this.props.onRouteWillFocus?.(params);
  };

  _handleOnRouteDidFocus: OnRouteFocusBlurEvent = (params) => {
    this.props.onRouteDidFocus?.(params);
  };

  _handleOnRouteWillBlur: OnRouteFocusBlurEvent = (params) => {
    this.props.onRouteWillBlur?.(params);
  };

  _handleOnRouteDidBlur: OnRouteFocusBlurEvent = (params) => {
    this.props.onRouteDidBlur?.(params);
  };

  _handleOnPressNavBarLeftItem: OnPressNavBarItem = (params) => {
    this.props.onPressNavBarLeftItem?.(params);
  };

  _handleOnPressNavBarRightItem: OnPressNavBarItem = (params) => {
    this.props.onPressNavBarRightItem?.(params);
  };

  _handleOnUpdateSearchResults: OnUpdateSearchResults = (params) => {
    this.props.onUpdateSearchResults?.(params);
  };

  _handleOnSearchBarCancelButtonClicked: OnSearchBarCancelButtonClicked = (params) => {
    this.props.onSearchBarCancelButtonClicked?.(params);
  };

  _handleOnSearchBarSearchButtonClicked: OnSearchBarSearchButtonClicked = (params) => {
    this.props.onSearchBarSearchButtonClicked?.(params);
  };
  //#endregion

  render(){
    return null as any;
  };
};