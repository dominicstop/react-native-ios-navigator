import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';

import { TSEventEmitter } from '@dominicstop/ts-event-emitter';

import type { NavigationObject } from '../types/NavigationObject';
import type { RouteOptions } from '../types/RouteOptions';
import type { RenderNavItem, RenderRouteContent } from '../types/NavTypes';
import type { OnRoutePopEvent, OnRoutePushEvent, OnPressNavBarItemEvent, OnRouteFocusEvent, OnRouteBlurEvent, OnUpdateSearchResultsEvent, OnSearchBarCancelButtonClickedEvent, OnSearchBarSearchButtonClickedEvent } from '../types/RNINavigatorRouteViewEvents';
import type { RouteTransitionConfig } from '../types/NavigationCommands';
import type { Nullish } from '../types/UtilityTypes';

import { NavigatorRouteViewEventEmitter, NavigatorRouteViewEvents } from '../types/NavigatorRouteViewEventEmitter';

import type { NavigatorView } from './NavigatorView';
import type { RouteViewPortal } from './RouteViewPortal';

import { RouteComponentsWrapper } from '../wrapper_components/RouteComponentsWrapper';

import { RNINavigatorRouteView, RNINavigatorRouteViewProps } from '../native_components/RNINavigatorRouteView';
import { RNINavigatorRouteViewModule } from '../native_modules/RNINavigatorRouteViewModule';

import * as Helpers from '../functions/Helpers';

import { CompareRouteTransitionPopConfig, CompareRouteTransitionPushConfig } from '../functions/CompareRouteOptions';
import { CompareUtilities } from '../functions/CompareUtilities';
import { CompareRouteOptions } from '../functions/CompareRouteOptions';

import { NavRouteViewContext } from '../context/NavRouteViewContext';
import { NavigatorUIConstantsContext } from '../context/NavigatorUIConstantsContext';

import { NativeIDKeys } from '../constants/LibraryConstants';
import { LIB_ENV } from '../constants/LibEnv';
import { NavigatorRouteContentWrapper } from '../wrapper_components/NavigatorRouteContentWrapper';


//#region - Type Definitions

export interface RouteContentProps<T = object> {
  navigation?: NavigationObject<T>;
};

enum RouteStatus {
  INIT           = "INIT"          ,
  ROUTE_PUSHING  = "ROUTE_PUSHING" ,
  ROUTE_PUSHED   = "ROUTE_PUSHED"  ,
  ROUTE_POPPING  = "ROUTE_POPPING" ,
  ROUTE_POPPED   = "ROUTE_POPPED"  ,
  ROUTE_BLURRING = "ROUTE_BLURRING",
  ROUTE_BLURRED  = "ROUTE_BLURRED" ,
  ROUTE_FOCUSING = "ROUTE_FOCUSING",
  ROUTE_FOCUSED  = "ROUTE_FOCUSED" ,
  UNMOUNTED      = "UNMOUNTED"     ,
};

export type NavigatorRouteViewProps = Pick<RNINavigatorRouteViewProps,
  // mirror props from `RNINavigatorRouteViewProps`
  | 'routeID'
  | 'routeKey'
  | 'routeIndex'
> & {
  navigatorID: number;

  routeProps: object | null;
  routeOptionsDefault: RouteOptions | null;

  isInFocus: boolean;

  transitionConfigPushOverride: Nullish<RouteTransitionConfig>;
  transitionConfigPopOverride : Nullish<RouteTransitionConfig>;

  getRefToNavigator: () => NavigatorView;
  
  renderRouteContent: RenderRouteContent;

  // render nav bar items
  renderNavBarLeftItem : RenderNavItem | null;
  renderNavBarRightItem: RenderNavItem | null;
  renderNavBarTitleItem: RenderNavItem | null;

  renderRouteHeader?: RenderNavItem;
};

/** `NavigatorView` comp. state */
type NavigatorRouteViewState = {
  updateIndex: number;
  routeOptions: Nullish<RouteOptions>;
  hasRoutePortal: boolean;
};
//#endregion


export class NavigatorRouteView extends React.Component<NavigatorRouteViewProps, NavigatorRouteViewState> {
  //#region - Property Declarations

  routeStatus: RouteStatus;

  /** is incremented whenever `props.routeProps` changes */
  private routePropsUpdateIndex = 0;

  // references
  private _emitter            : NavigatorRouteViewEventEmitter;
  private _nativeRef         ?: React.Component<RNINavigatorRouteViewProps>;
  private _navigatorRef       : NavigatorView;
  private _routeContentRef   ?: ReactElement;
  private _routeViewPortalRef?: RouteViewPortal;
  
  private _routeComponentsWrapperRef?: RouteComponentsWrapper;
  //#endregion

  constructor(props: NavigatorRouteViewProps){
    super(props);

    this.routeStatus   = RouteStatus.INIT;
    this._emitter      = new TSEventEmitter();
    this._navigatorRef = props.getRefToNavigator();

    this.state = {
      updateIndex: 0,
      hasRoutePortal: false,
      routeOptions: {},
    };
  };

  shouldComponentUpdate(nextProps: NavigatorRouteViewProps, nextState: NavigatorRouteViewState){
    const prevProps = this.props;
    const prevState = this.state;

    const didRoutePropsChange = !CompareUtilities.unwrapAndShallowCompareObject(
      prevProps.routeProps,
      nextProps.routeProps
    );

    if(didRoutePropsChange) this.routePropsUpdateIndex++;

    // note: short-circuit eval so:
    // * value types first
    // * complex/nested objects last
    return (
      didRoutePropsChange
      // props: compare `routeIndex` - routes were re-arranged/sorted
      || (prevProps.routeIndex !== nextProps.routeIndex)
      // props: compare focus change
      || (prevProps.isInFocus !== nextProps.isInFocus)

      // state: compare `hasRoutePortal` - portal comp. added/removed 
      || (prevState.hasRoutePortal !== nextState.hasRoutePortal)
      // state: compare `updateIndex` - force an update
      || (prevState.updateIndex !== nextState.updateIndex)

      // props: compare "push transition config"
      || !CompareRouteTransitionPushConfig.unwrapAndCompare(
        prevProps.transitionConfigPushOverride,
        nextProps.transitionConfigPushOverride
      )
      // props: compare "pop transition config"
      || !CompareRouteTransitionPopConfig.unwrapAndCompare(
        prevProps.transitionConfigPopOverride,
        nextProps.transitionConfigPopOverride
      )
      // props: compare "default route options"
      || !CompareRouteOptions.unwrapAndCompare(
        prevProps.routeOptionsDefault,
        nextProps.routeOptionsDefault
      )
    );
  };

  componentWillUnmount(){
    //#region - 🐞 DEBUG 🐛
    LIB_ENV.debugLog && console.log(
        `LOG/JS - NavigatorRouteView, componentWillUnmount`
      + ` - routeID: ${this.props.routeID}`
      + ` - routeIndex: ${this.props.routeIndex}`
      + ` - routeKey: ${this.props.routeKey}`
    );
    //#endregion

    this.routeStatus = RouteStatus.UNMOUNTED;
  };

  //#region - "get ref" Functions
  public getRefToNavigator = () => {
    return this.props.getRefToNavigator();
  };

  public getRouteRef = () => {
    return this;
  };

  public getEmitterRef = () => {
    return this._emitter;
  };

  public getPortalRef = () => {
    return this._routeViewPortalRef;
  };
  
  public getRouteComponentsWrapper = () => {
    return this._routeComponentsWrapperRef;
  };
  //#endregion

  //#region - Public Functions
  /** Combines all the route configs into one */
  public getRouteOptions = (): RouteOptions => {
    const props = this.props;
    const portalProps = this._routeViewPortalRef?.props;

    const { routeOptionsDefault } = this.props;
    const { routeOptions } = this.state;

    // check if portal has custom nav bar items
    const hasNavBarLeftItem  = (portalProps?.renderNavBarLeftItem  != null);
    const hasNavBarRightItem = (portalProps?.renderNavBarRightItem != null);

    return {
      // ------------------------------------------------------
      // Technically, this whole thing could be done like this:
      // `{...routeOptionsDefault, ...routeOptions}`
      // but it's less clear/explicit, idk refactor this later.
      // ------------------------------------------------------
      statusBarStyle: (
        routeOptions       ?.statusBarStyle ??
        routeOptionsDefault?.statusBarStyle
      ),
      routeContainerStyle: (
        routeOptions       ?.routeContainerStyle ??
        routeOptionsDefault?.routeContainerStyle
      ),
      automaticallyAddHorizontalSafeAreaInsets: (
        routeOptions       ?.automaticallyAddHorizontalSafeAreaInsets ??
        routeOptionsDefault?.automaticallyAddHorizontalSafeAreaInsets ?? true
      ),
      // #region - Transition Config |
      // ----------------------------*
      transitionConfigPush: (
        props.transitionConfigPushOverride        ??
        routeOptions       ?.transitionConfigPush ??
        routeOptionsDefault?.transitionConfigPush
      ),
      transitionConfigPop: (
        props.transitionConfigPopOverride        ??
        routeOptions       ?.transitionConfigPop ??
        routeOptionsDefault?.transitionConfigPop
      ),
      // #endregion -------------*
      // #region - Navbar Config |
      // ------------------------*
      routeTitle: (
        routeOptions       ?.routeTitle ??
        routeOptionsDefault?.routeTitle ?? props.routeKey
      ),
      prompt: (
        routeOptions       ?.prompt ??
        routeOptionsDefault?.prompt 
      ),
      largeTitleDisplayMode: (
        routeOptions       ?.largeTitleDisplayMode ??
        routeOptionsDefault?.largeTitleDisplayMode 
      ),
      searchBarConfig: (
        routeOptions       ?.searchBarConfig ??
        routeOptionsDefault?.searchBarConfig 
      ),
      // #endregion ----------------------------------*
      // #region - `NavigationConfigOverride`-related |
      // ---------------------------------------------*
      navBarAppearanceOverride: (
        routeOptions       ?.navBarAppearanceOverride ??
        routeOptionsDefault?.navBarAppearanceOverride 
      ),
      navigationBarVisibility: (
        routeOptions       ?.navigationBarVisibility ??
        routeOptionsDefault?.navigationBarVisibility 
      ),
      allowTouchEventsToPassThroughNavigationBar: (
        routeOptions       ?.allowTouchEventsToPassThroughNavigationBar ??
        routeOptionsDefault?.allowTouchEventsToPassThroughNavigationBar
      ),
      // #endregion ------------------*
      // #region - Navbar Item Config |
      // -----------------------------*
      navBarButtonBackItemConfig: (
        routeOptions       ?.navBarButtonBackItemConfig ??
        routeOptionsDefault?.navBarButtonBackItemConfig
      ),
      navBarButtonLeftItemsConfig: (
        routeOptions       ?.navBarButtonLeftItemsConfig ??
        routeOptionsDefault?.navBarButtonLeftItemsConfig ??
        // custom left bar item was set, so we implicitly/automatically
        // create a `type: CUSTOM` nav bar item config...
        (hasNavBarLeftItem? [{ type: 'CUSTOM' }] : undefined)
      ),
      navBarButtonRightItemsConfig: (
        routeOptions       ?.navBarButtonRightItemsConfig ??
        routeOptionsDefault?.navBarButtonRightItemsConfig ??
        // custom right bar item was set, so we implicitly/automatically
        // create a `type: CUSTOM` nav bar item config...
        (hasNavBarRightItem? [{ type: 'CUSTOM' }] : undefined)
      ),
      // #endregion ------------------------------*
      // #region - Navbar back button item config |
      // -----------------------------------------*
      leftItemsSupplementBackButton: (
        routeOptions       ?.leftItemsSupplementBackButton ??
        routeOptionsDefault?.leftItemsSupplementBackButton
      ),
      backButtonTitle: (
        routeOptions       ?.backButtonTitle ??
        routeOptionsDefault?.backButtonTitle
      ),
      backButtonDisplayMode: (
        routeOptions       ?.backButtonDisplayMode ??
        routeOptionsDefault?.backButtonDisplayMode
      ),
      hidesBackButton: (
        routeOptions       ?.hidesBackButton ??
        routeOptionsDefault?.hidesBackButton
      ),
      applyBackButtonConfigToCurrentRoute: (
        routeOptions       ?.applyBackButtonConfigToCurrentRoute ??
        routeOptionsDefault?.applyBackButtonConfigToCurrentRoute
      ),
      // #endregion
    };
  };

  public getRouteNavigationObject = (): NavigationObject => {
    const props = this.props;
    const routeOptions = this.getRouteOptions();

    return {
      routeOptions,
      // pass down route details/data
      routeKey    : props.routeKey,
      routeIndex  : props.routeIndex,
      routeProps  : props.routeProps,
      // pass down navigator commands
      push        : this._navigatorRef.push,
      pop         : this._navigatorRef.pop,
      popToRoot   : this._navigatorRef.popToRoot,
      removeRoute : this._navigatorRef.removeRoute,
      removeRoutes: this._navigatorRef.removeRoutes,
      replaceRoute: this._navigatorRef.replaceRoute,
      insertRoute : this._navigatorRef.insertRoute,
      setRoutes   : this._navigatorRef.setRoutes,
      setNavigationBarHidden: this._navigatorRef.setNavigationBarHidden,
      // pass down misc. navigator commands
      sendCustomCommandToNative: this._navigatorRef.sendCustomCommandToNative,
      getNavigatorConstants    : this._navigatorRef.getNavigatorConstants,
      getActiveRoutes          : this._navigatorRef.getActiveRoutes,
      // pass down convenience navigator commands
      replacePreviousRoute: this._navigatorRef.replacePreviousRoute,
      replaceCurrentRoute : this._navigatorRef.replaceCurrentRoute,
      removePreviousRoute : this._navigatorRef.removePreviousRoute,
      removeAllPrevRoutes : this._navigatorRef.removeAllPrevRoutes,
      // navigator route commands
      getRouteOptions   : this.getRouteOptions,
      setRouteOptions   : this.setRouteOptions,
      setHidesBackButton: this.setHidesBackButton,
      getRouteConstants : this.getRouteConstants,
      // pass down 'get ref' functions
      getRefToRoute          : this._handleGetRefToRoute,
      getRefToNavigator      : props.getRefToNavigator,
      getRefToNavRouteEmitter: this._handleGetRefToNavRouteEmitter,
    };
  };
  
  public setRouteOptions = async (
    routeOptions: Nullish<Readonly<RouteOptions>>
  ) => {
    await Helpers.setStateAsync<NavigatorRouteViewState>(this, (prevState) => ({
      ...prevState, routeOptions,
      updateIndex: (prevState.updateIndex + 1),
    }));
  };

  public setRouteViewPortalRef = (ref: RouteViewPortal) => {
    this._routeViewPortalRef = ref;
    this._routeComponentsWrapperRef?.setPortalRef(ref);

    this.setState({hasRoutePortal: true});
  };

  // Module Commands
  // ---------------

  public setHidesBackButton = async (isHidden: boolean, animated: boolean) => {
    try {
      if(!RouteViewUtils.isRouteReady(this.routeStatus)){
        throw new Error("`NavigatorRouteView` is not mounted")
      };

      if(this._nativeRef == null) throw new Error(
        "this._nativeRef not set"
      );

      await Helpers.promiseWithTimeout(1000,
        RNINavigatorRouteViewModule.setHidesBackButton(
          Helpers.getNativeNodeHandle(this._nativeRef),
          isHidden, animated
        )
      );

    } catch(error){
      throw new Error(
          "'NavigatorRouteView' failed to do: 'setHidesBackButton'"
        + ` - with error: ${error}`
      );
    };
  };

  public getRouteConstants = async () => {
    try {
      if(!RouteViewUtils.isRouteReady(this.routeStatus)){
        throw new Error("`NavigatorRouteView` is not mounted")
      };

      if(this._nativeRef == null) throw new Error(
        "this._nativeRef not set"
      );

      const result = await Helpers.promiseWithTimeout(1000,
        RNINavigatorRouteViewModule.getRouteConstants(
          Helpers.getNativeNodeHandle(this._nativeRef)
        )
      );

      return result;

    } catch(error){
      throw new Error(
        "'NavigatorRouteView.getConstants' failed with error: " + error
      );
    };
  };
  // #endregion
  
  // #region - Handlers
  private _handleGetRefToRoute = () => {
    return this;
  };

  private _handleGetRefToNavRouteEmitter = () => {
    return this._emitter;
  };
  // #endregion

  // #region - Native Event Handlers
  // Native Event Handlers for `RNINavigatorRouteView`

  private _handleOnRouteWillPop: OnRoutePopEvent = (event) => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onRouteWillPop, event);
    this.routeStatus = RouteStatus.ROUTE_POPPING;
  };

  private _handleOnRouteDidPop: OnRoutePopEvent = (event) => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onRouteDidPop, event);
    this.routeStatus = RouteStatus.ROUTE_POPPED;
  };

  private _handleOnRouteWillPush: OnRoutePushEvent = (event) => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onRouteWillPush, event);
    this.routeStatus = RouteStatus.ROUTE_PUSHING;
  };

  private _handleOnRouteDidPush: OnRoutePushEvent = (event) => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onRouteDidPush, event);
    this.routeStatus = RouteStatus.ROUTE_PUSHED;
  };

  private _handleOnPressNavBarLeftItem: OnPressNavBarItemEvent = (event) => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;
    this._emitter.emit(NavigatorRouteViewEvents.onPressNavBarLeftItem, event);
  };

  private _handleOnPressNavBarRightItem: OnPressNavBarItemEvent = (event) => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;
    this._emitter.emit(NavigatorRouteViewEvents.onPressNavBarRightItem, event);
  };

  private _handleOnRouteWillFocus: OnRouteFocusEvent = (event)  => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onRouteWillFocus, event);
    this.routeStatus = RouteStatus.ROUTE_FOCUSING;
  };

  private _handleOnRouteDidFocus: OnRouteFocusEvent = (event)  => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onRouteDidFocus, event);
    this.routeStatus = RouteStatus.ROUTE_FOCUSED;
  };

  private _handleOnRouteWillBlur: OnRouteBlurEvent = (event)  => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onRouteWillBlur, event);
    this.routeStatus = RouteStatus.ROUTE_BLURRING;
  };

  private _handleOnRouteDidBlur: OnRouteBlurEvent = (event)  => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onRouteDidBlur, event);
    this.routeStatus = RouteStatus.ROUTE_BLURRED;
  };
  
  private _handleOnUpdateSearchResults: OnUpdateSearchResultsEvent = (event) => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onUpdateSearchResults, event);
  };

  private _handleOnSearchBarCancelButtonClicked: OnSearchBarCancelButtonClickedEvent = (event) => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onSearchBarCancelButtonClicked, event);
  };

  private _handleOnSearchBarSearchButtonClicked: OnSearchBarSearchButtonClickedEvent = (event) => {
    if(this.props.routeID !== event.nativeEvent.routeID) return;

    this._emitter.emit(NavigatorRouteViewEvents.onSearchBarSearchButtonClicked, event);
  };

  //#endregion
  
  private _renderRouteContents = (navigation: NavigationObject) => {
    const props = this.props;

    const routeOptions = navigation.routeOptions;

    const routeContent = props.renderRouteContent();

    const routeContentWithProps = React.cloneElement<RouteContentProps>(routeContent, {
      navigation,
      // store a ref to this element
      ...(Helpers.isClassComponent(routeContent) && {
        ref: (node: any) => { this._routeContentRef = node }
      }),
    });

    const portalProps = this._routeViewPortalRef?.props;

    const routeHeader = (
      portalProps?.renderRouteHeader?.(navigation) ??
      props.renderRouteHeader?.(navigation)
    );

    return (
      <NavigatorUIConstantsContext.Consumer>
        {(context) => (
          <NavigatorRouteContentWrapper
            isInFocus={props.isInFocus}
            routePropsUpdateIndex={this.routePropsUpdateIndex}
            routeContainerStyle={routeOptions.routeContainerStyle}
            automaticallyAddHorizontalSafeAreaInsets={routeOptions.automaticallyAddHorizontalSafeAreaInsets}
            safeAreaInsets={context.safeAreaInsets}
            hasRouteHeader={(routeHeader != null)}
          >
            {routeContentWithProps}
            {routeHeader}
          </NavigatorRouteContentWrapper>
        )}
      </NavigatorUIConstantsContext.Consumer>
    );
  };

  render(){
    const props = this.props;

    const navigation   = this.getRouteNavigationObject();
    const routeOptions = navigation.routeOptions;

    //#region - 🐞 DEBUG 🐛
    LIB_ENV.debugLogRender && console.log(
        `LOG/JS - NavigatorRouteView, render`
      + ` - routeID: ${props.routeID}`
      + ` - routeKey: ${props.routeKey}`
      + ` - routeKey: ${props.routeIndex}`
    );
    //#endregion

    return(
      <NavRouteViewContext.Provider value={{
        navigation,
        navigatorID: props.navigatorID,
        routeID: props.routeID,
      }}>
        <RNINavigatorRouteView
          style={styles.navigatorRouteView}
          ref={r => { this._nativeRef = r! }}
          routeID={props.routeID}
          nativeID={NativeIDKeys.NavRouteItem}
          routeKey={props.routeKey}
          routeIndex={props.routeIndex}
          // Route Native Events: Push/Pop Events
          onRouteWillPop={this._handleOnRouteWillPop}
          onRouteDidPop={this._handleOnRouteDidPop}
          onRouteWillPush={this._handleOnRouteWillPush}
          onRouteDidPush={this._handleOnRouteDidPush}
          // Route Native Events: Focus/Blur
          onRouteWillFocus={this._handleOnRouteWillFocus}
          onRouteDidFocus={this._handleOnRouteDidFocus}
          onRouteWillBlur={this._handleOnRouteWillBlur}
          onRouteDidBlur={this._handleOnRouteDidBlur}
          // Route Native Events: Navbar Item `onPress`
          onPressNavBarLeftItem={this._handleOnPressNavBarLeftItem}
          onPressNavBarRightItem={this._handleOnPressNavBarRightItem}
          // Route Native Events: Search
          onUpdateSearchResults={this._handleOnUpdateSearchResults}
          onSearchBarCancelButtonClicked={this._handleOnSearchBarCancelButtonClicked}
          onSearchBarSearchButtonClicked={this._handleOnSearchBarSearchButtonClicked}
          // pass down navbar item config, back button item config, etc.
          {...routeOptions}
          allowTouchEventsToPassThroughNavigationBar={
            routeOptions.allowTouchEventsToPassThroughNavigationBar ?? false
          }
        >
          {this._renderRouteContents(navigation)}
          <RouteComponentsWrapper
            ref={r => { this._routeComponentsWrapperRef = r! }}
            navigation={navigation}
            getPortalRef={this.getPortalRef}
            // render nav bar items
            renderNavBarLeftItem={props.renderNavBarLeftItem}
            renderNavBarRightItem={props.renderNavBarRightItem}
            renderNavBarTitleItem={props.renderNavBarTitleItem}
          />
        </RNINavigatorRouteView>
      </NavRouteViewContext.Provider>
    );
  };
};

class RouteViewUtils {
  static isRouteReady(routeStatus: RouteStatus){
    return (
      routeStatus !== RouteStatus.INIT &&
      routeStatus !== RouteStatus.UNMOUNTED
    );
  };

  static isRouteFocusingOrFocused(routeStatus: RouteStatus){
    return (
      routeStatus === RouteStatus.ROUTE_PUSHING  ||
      routeStatus === RouteStatus.ROUTE_PUSHED   ||
      routeStatus === RouteStatus.ROUTE_FOCUSING ||
      routeStatus === RouteStatus.ROUTE_FOCUSED    
    );
  };
};

const styles = StyleSheet.create({
  navigatorRouteView: {
    ...StyleSheet.absoluteFillObject,
    // don't show
    opacity: 0,
  },
});
