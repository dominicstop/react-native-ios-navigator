
import React from 'react';

import type { NavigatorRouteView } from '../components/NavigatorRouteView';
import type { OnRoutePopEvent, OnRoutePushEvent, OnRouteFocusEvent, OnRouteBlurEvent, OnPressNavBarItemEvent, OnUpdateSearchResultsEvent, OnSearchBarCancelButtonClickedEvent, OnSearchBarSearchButtonClickedEvent, OnWillDismissSearchControllerEvent, OnDidDismissSearchControllerEvent, OnWillPresentSearchControllerEvent, OnDidPresentSearchControllerEvent } from '../types/RNINavigatorRouteViewEvents';

import { NavigatorRouteViewEventEmitter, NavigatorRouteViewEvents } from '../types/NavigatorRouteViewEventEmitter';

import { NavigationContext, NavigationContextProps } from '../context/NavigationContext';


type RouteViewEventsProps = {
  // push/pop events
  onRouteWillPush?: OnRoutePushEvent;
  onRouteDidPush ?: OnRoutePushEvent;
  onRouteWillPop ?: OnRoutePopEvent ;
  onRouteDidPop  ?: OnRoutePopEvent ;

  // focus/blur events
  onRouteWillFocus?: OnRouteFocusEvent;
  onRouteDidFocus ?: OnRouteFocusEvent;
  onRouteWillBlur ?: OnRouteBlurEvent;
  onRouteDidBlur  ?: OnRouteBlurEvent;

  // onPress navbar item events
  onPressNavBarLeftItem ?: OnPressNavBarItemEvent;
  onPressNavBarRightItem?: OnPressNavBarItemEvent;

  // search lifecycle events
  onUpdateSearchResults?: OnUpdateSearchResultsEvent;

  onWillDismissSearchController?: OnWillDismissSearchControllerEvent;
  onDidDismissSearchController?: OnDidDismissSearchControllerEvent;

  onWillPresentSearchController?: OnWillPresentSearchControllerEvent;
  onDidPresentSearchController?: OnDidPresentSearchControllerEvent;

  // search events
  onSearchBarCancelButtonClicked?: OnSearchBarCancelButtonClickedEvent;
  onSearchBarSearchButtonClicked?: OnSearchBarSearchButtonClickedEvent;
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
  static contextType = NavigationContext;
  
  routerRef: NavigatorRouteView;
  emitterRef: NavigatorRouteViewEventEmitter;
  
  constructor(props: RouteViewEventsProps, context: NavigationContextProps){
    super(props);
    const { navigation } = context;

    const routeRef = navigation.getRefToRoute();
    this.routerRef = routeRef;

    const routeEmitterRef = routeRef.getEmitterRef();
    this.emitterRef = routeEmitterRef;

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onRouteWillPush,
      this._handleOnRouteWillPush
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onRouteDidPush,
      this._handleOnRouteDidPush
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onRouteWillPop,
      this._handleOnRouteWillPop
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onRouteDidPop,
      this._handleOnRouteDidPop
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onRouteWillFocus,
      this._handleOnRouteWillFocus
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onRouteDidFocus,
      this._handleOnRouteDidFocus
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onRouteWillBlur,
      this._handleOnRouteWillBlur
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onRouteDidBlur,
      this._handleOnRouteDidBlur
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onPressNavBarLeftItem,
      this._handleOnPressNavBarLeftItem
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onPressNavBarRightItem,
      this._handleOnPressNavBarRightItem
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onUpdateSearchResults,
      this._handleOnUpdateSearchResults
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onSearchBarCancelButtonClicked,
      this._handleOnSearchBarCancelButtonClicked
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onSearchBarSearchButtonClicked,
      this._handleOnSearchBarSearchButtonClicked
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onWillDismissSearchController,
      this._handleOnWillDismissSearchController
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onDidDismissSearchController,
      this._handleOnDidDismissSearchController
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onWillPresentSearchController,
      this._handleOnWillPresentSearchController
    );

    routeEmitterRef.addListener(
      NavigatorRouteViewEvents.onDidPresentSearchController,
      this._handleOnDidPresentSearchController
    );
  };

  componentWillUnmount(){
    const routeEmitterRef = this.emitterRef;

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onRouteWillPush,
      this._handleOnRouteWillPush
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onRouteDidPush,
      this._handleOnRouteDidPush
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onRouteWillPop,
      this._handleOnRouteWillPop
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onRouteDidPop,
      this._handleOnRouteDidPop
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onRouteWillFocus,
      this._handleOnRouteWillFocus
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onRouteDidFocus,
      this._handleOnRouteDidFocus
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onRouteWillBlur,
      this._handleOnRouteWillBlur
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onRouteDidBlur,
      this._handleOnRouteDidBlur
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onPressNavBarLeftItem,
      this._handleOnPressNavBarLeftItem
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onPressNavBarRightItem,
      this._handleOnPressNavBarRightItem
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onWillDismissSearchController,
      this._handleOnWillDismissSearchController
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onDidDismissSearchController,
      this._handleOnDidDismissSearchController
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onWillPresentSearchController,
      this._handleOnWillPresentSearchController
    );

    routeEmitterRef.removeListener(
      NavigatorRouteViewEvents.onDidPresentSearchController,
      this._handleOnDidPresentSearchController
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

  _handleOnRouteWillFocus: OnRouteFocusEvent = (params) => {
    this.props.onRouteWillFocus?.(params);
  };

  _handleOnRouteDidFocus: OnRouteFocusEvent = (params) => {
    this.props.onRouteDidFocus?.(params);
  };

  _handleOnRouteWillBlur: OnRouteBlurEvent = (params) => {
    this.props.onRouteWillBlur?.(params);
  };

  _handleOnRouteDidBlur: OnRouteBlurEvent = (params) => {
    this.props.onRouteDidBlur?.(params);
  };

  _handleOnPressNavBarLeftItem: OnPressNavBarItemEvent = (params) => {
    this.props.onPressNavBarLeftItem?.(params);
  };

  _handleOnPressNavBarRightItem: OnPressNavBarItemEvent = (params) => {
    this.props.onPressNavBarRightItem?.(params);
  };

  _handleOnUpdateSearchResults: OnUpdateSearchResultsEvent = (params) => {
    this.props.onUpdateSearchResults?.(params);
  };

  _handleOnSearchBarCancelButtonClicked: OnSearchBarCancelButtonClickedEvent = (params) => {
    this.props.onSearchBarCancelButtonClicked?.(params);
  };

  _handleOnSearchBarSearchButtonClicked: OnSearchBarSearchButtonClickedEvent = (params) => {
    this.props.onSearchBarSearchButtonClicked?.(params);
  };

  _handleOnWillDismissSearchController: OnWillDismissSearchControllerEvent = (params) => {
    this.props.onWillDismissSearchController?.(params);
  };

  _handleOnDidDismissSearchController: OnDidDismissSearchControllerEvent = (params) => {
    this.props.onDidDismissSearchController?.(params);
  };

  _handleOnWillPresentSearchController: OnWillPresentSearchControllerEvent = (params) => {
    this.props.onWillPresentSearchController?.(params);
  };

  _handleOnDidPresentSearchController: OnDidPresentSearchControllerEvent = (params) => {
    this.props.onDidPresentSearchController?.(params);
  };

  //#endregion

  render(){
    return null as any;
  };
};