import React, { ReactElement } from 'react';
import { StyleSheet, View, ViewStyle, findNodeHandle } from 'react-native';

import type { RouteViewPortal } from './RouteViewPortal';
import type { NavigatorView, RouteOptions } from './NavigatorView';

import { NavBarItemsWrapper } from './NavBarBackItemsWrapper';

import { RNINavigatorRouteView, RNINavigatorRouteViewProps, onPressNavBarItem, onRoutePushEvent, onRoutePopEvent, RouteTransitionPopConfig, RouteTransitionPushConfig } from '../native_components/RNINavigatorRouteView';
import { RNINavigatorRouteViewModule } from '../native_modules/RNINavigatorRouteViewModule';

import * as Helpers from '../functions/Helpers';
import { EventEmitter } from '../functions/EventEmitter';

import { NavRouteViewContext } from '../context/NavRouteViewContext';
import { NativeIDKeys } from '../constants/LibraryConstants';


//#region - Type Definitions
/** Event emitter keys for `NavigatorRouteView` */
export enum NavRouteEvents {
  // Navigator push/pop events
  onNavRouteWillPush = "onNavRouteWillPush",
  onNavRouteDidPush  = "onNavRouteDidPush" ,
  onNavRouteWillPop  = "onNavRouteWillPop" ,
  onNavRouteDidPop   = "onNavRouteDidPop"  ,
  // Navbar item `onPress` events
  onPressNavBarBackItem  = "onPressNavBarBackItem" ,
  onPressNavBarLeftItem  = "onPressNavBarLeftItem" ,
  onPressNavBarRightItem = "onPressNavBarRightItem",
};

export interface RouteContentProps {
  routeKey  ?: string;
  routeIndex?: number;
  // get ref functions
  getRefToRoute          ?: () => NavigatorRouteView;
  getRefToNavigator      ?: () => NavigatorView;
  getRefToNavRouteEmitter?: () => EventEmitter<NavRouteEvents>;
};

type NavigatorRouteViewProps = {
  routeKey: string;
  routeIndex: number;
  routeProps: object;
  routeOptionsDefault: RouteOptions;
  routeContainerStyle: ViewStyle,
  transitionConfigPushOverride: RouteTransitionPushConfig;
  transitionConfigPopOverride: RouteTransitionPopConfig;
  getRefToNavigator: () => NavigatorView,
  renderRouteContent: () => ReactElement<RouteContentProps>
  // render nav bar items
  renderNavBarBackItem ?: () => ReactElement;
  renderNavBarLeftItem ?: () => ReactElement;
  renderNavBarRightItem?: () => ReactElement;
  renderNavBarTitleItem?: () => ReactElement;
};

/** `NavigatorView` comp. state */
type NavigatorRouteViewState = {
  isMounted: boolean;
  routeOptions: RouteOptions;
  hasRoutePortal: boolean;
};
//#endregion


export class NavigatorRouteView extends React.PureComponent<NavigatorRouteViewProps, NavigatorRouteViewState> {
  //#region - Property Declarations
  state: NavigatorRouteViewState;
  routeContentRef: React.Component<RouteContentProps>;
  // references
  private _emitter              : EventEmitter<NavRouteEvents>;
  private _nativeRef            : React.Component<RNINavigatorRouteViewProps>;
  private _routeContentRef      : ReactElement;
  private _routeViewPortalRef   : RouteViewPortal;
  private _navBarItemsWrapperRef: NavBarItemsWrapper
  //#endregion

  constructor(props: NavigatorRouteViewProps){
    super(props);

    this._emitter = new EventEmitter<NavRouteEvents>();

    this.state = {
      isMounted: true,
      hasRoutePortal: false,
      routeOptions: {},
    };
  };

  //#region - Public Functions
  public getRefToNavigator = () => {
    return this.props.getRefToNavigator();
  };

  public getRouterRef = () => {
    return this;
  };

  public getEmitterRef = () => {
    return this._emitter;
  };

  public getPortalRef = () => {
    return this._routeViewPortalRef;
  };

  public getNavBarItemsWrapperRef = () => {
    return this._navBarItemsWrapperRef;
  };

  public getRouteOptions: (() => RouteOptions) = () => {
    const props = this.props;
    const portalProps = this._routeViewPortalRef?.props;

    const { routeOptionsDefault } = this.props;
    const { routeOptions } = this.state;

    // check if portal has custom nav bar items
    const hasNavBarBackItem  = (portalProps?.renderNavBarBackItem  != null);
    const hasNavBarLeftItem  = (portalProps?.renderNavBarLeftItem  != null);
    const hasNavBarRightItem = (portalProps?.renderNavBarRightItem != null);

    return {
      // ------------------------------------------------------
      // Technically, this whole thing could be done like this:
      // `{...routeOptionsDefault, ...routeOptions}`
      // but it's less clear/explicit, idk refactor this later.
      // ------------------------------------------------------
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
      // #endregion ------------------*
      // #region - Navbar Item Config |
      // -----------------------------*
      navBarButtonBackItemConfig: (
        routeOptions       ?.navBarButtonBackItemConfig ??
        routeOptionsDefault?.navBarButtonBackItemConfig ??
        // custom back bar item was set, so we implicitly/automatically
        // create a `type: CUSTOM` nav bar item config...
        (hasNavBarBackItem? { type: 'CUSTOM' } : null)
      ),
      navBarButtonLeftItemsConfig: (
        routeOptions       ?.navBarButtonLeftItemsConfig ??
        routeOptionsDefault?.navBarButtonLeftItemsConfig ??
        // custom left bar item was set, so we implicitly/automatically
        // create a `type: CUSTOM` nav bar item config...
        (hasNavBarLeftItem? [{ type: 'CUSTOM' }] : null)
      ),
      navBarButtonRightItemsConfig: (
        routeOptions       ?.navBarButtonRightItemsConfig ??
        routeOptionsDefault?.navBarButtonRightItemsConfig ??
        // custom right bar item was set, so we implicitly/automatically
        // create a `type: CUSTOM` nav bar item config...
        (hasNavBarRightItem? [{ type: 'CUSTOM' }] : null)
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
      // #endregion
    };
  };
  
  public setRouteOptions = async (routeOptions: RouteOptions) => {
    await Helpers.setStateAsync<NavigatorRouteViewState>(this, (prevState) => ({
      ...prevState, 
      routeOptions: {
        ...prevState.routeOptions,
        ...routeOptions,
      },
    }));
  };

  public setRouteViewPortalRef = (ref: RouteViewPortal) => {
    this._routeViewPortalRef = ref;
    this._navBarItemsWrapperRef?.setPortalRef(ref);

    this.setState({hasRoutePortal: true});
  };

  public setHidesBackButton = async (isHidden: boolean, animated: boolean) => {
    try {
      await Helpers.promiseWithTimeout(1000,
        RNINavigatorRouteViewModule.setHidesBackButton(
          findNodeHandle(this._nativeRef),
          isHidden, animated
        )
      );

    } catch(error){
      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorRouteView, setHidesBackButton`
        + ` - error message: ${error}`
      );
      //#endregion

      throw new Error("`NavigatorRouteView` failed to do: `setHidesBackButton`");
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

  /** Handle event: `onNavRouteWillPop` */
  private _handleOnNavRouteWillPop: onRoutePopEvent = (event) => {
    this._emitter.emit(NavRouteEvents.onNavRouteWillPop, event);
  };

  /** Handle event: `onNavRouteDidPop` */
  private _handleOnNavRouteDidPop: onRoutePopEvent = (event) => {
    this._emitter.emit(NavRouteEvents.onNavRouteDidPop, event);
  };

  /** Handle event: `onNavRouteWillPush` */
  private _handleOnNavRouteWillPush: onRoutePushEvent = (event) => {
    this._emitter.emit(NavRouteEvents.onNavRouteWillPush, event);
  };

  /** Handle event: `onNavRouteDidPush` */
  private _handleOnNavRouteDidPush: onRoutePushEvent = (event) => {
    this._emitter.emit(NavRouteEvents.onNavRouteDidPush, event);
  };

  /** Handle event: `onPressNavBarBackItem` */
  private _handleOnPressNavBarBackItem: onPressNavBarItem = (event) => {
    this._emitter.emit(NavRouteEvents.onPressNavBarBackItem, event);
  };

  /** Handle event: `onPressNavBarLeftItem` */
  private _handleOnPressNavBarLeftItem: onPressNavBarItem = (event) => {
    this._emitter.emit(NavRouteEvents.onPressNavBarLeftItem, event);
  };

  /** Handle event: `onPressNavBarRightItem` */
  private _handleOnPressNavBarRightItem: onPressNavBarItem = (event) => {
    this._emitter.emit(NavRouteEvents.onPressNavBarRightItem, event);
  };
  //#endregion
  
  _renderRouteContents = () => {
    const props = this.props;
    const routeContent = props.renderRouteContent();

    // @ts-ignore
    const routeContentWithProps = React.cloneElement<RouteContentProps>(
      routeContent, {
        // pass down route props
        ...props.routeProps,
        // pass down route details
        routeKey: props.routeKey,
        routeIndex: props.routeIndex,
        // pass down 'get ref' functions
        getRefToRoute: this._handleGetRefToRoute,
        getRefToNavigator: props.getRefToNavigator,
        getRefToNavRouteEmitter: this._handleGetRefToNavRouteEmitter,
        // store a ref to this element
        ...(Helpers.isClassComponent(routeContent) && {
          ref: node => { this._routeContentRef = node }
        }),
      }
    );

    return(
      <View
        style={[styles.routeItem, props.routeContainerStyle]}
        nativeID={NativeIDKeys.RouteContent}
      >
        {routeContentWithProps}
      </View>
    );
  };

  render(){
    const props = this.props;
    const state = this.state;

    if(!state.isMounted) return null;
    const routeOptions = this.getRouteOptions();

    return(
      <NavRouteViewContext.Provider value={{
        // pass down function to get refs
        getRouterRef: this.getRouterRef,
        getEmitterRef: this.getEmitterRef,
      }}>
        <RNINavigatorRouteView
          style={styles.navigatorRouteView}
          ref={r => this._nativeRef = r}
          // route config
          routeKey={props.routeKey}
          routeIndex={props.routeIndex}
          routeTitle={routeOptions.routeTitle}
          // nav route events: push/pop
          onNavRouteWillPop={this._handleOnNavRouteWillPop}
          onNavRouteDidPop={this._handleOnNavRouteDidPop}
          onNavRouteWillPush={this._handleOnNavRouteWillPush}
          onNavRouteDidPush={this._handleOnNavRouteDidPush}
          // nav route events: navbar item `onPress`
          onPressNavBarBackItem={this._handleOnPressNavBarBackItem}
          onPressNavBarLeftItem={this._handleOnPressNavBarLeftItem}
          onPressNavBarRightItem={this._handleOnPressNavBarRightItem}
          // pass down: navbar item config + back button item config
          {...routeOptions}
        >
          {this._renderRouteContents()}
          <NavBarItemsWrapper
            ref={r => this._navBarItemsWrapperRef = r}
            routeKey={props.routeKey}
            routeIndex={props.routeIndex}
            routeProps={props.routeProps}
            routeOptions={routeOptions}
            // get ref functions
            getRefToNavigator={props.getRefToNavigator}
            getEmitterRef={this.getEmitterRef}
            getRouterRef={this.getRouterRef}
            getPortalRef={this.getPortalRef}
            // render nav bar items
            renderNavBarBackItem={props.renderNavBarBackItem}
            renderNavBarLeftItem={props.renderNavBarLeftItem}
            renderNavBarRightItem={props.renderNavBarRightItem}
            renderNavBarTitleItem={props.renderNavBarTitleItem}
          />
        </RNINavigatorRouteView>
      </NavRouteViewContext.Provider>
    );
  };
};

const styles = StyleSheet.create({
  routeItem: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'white',
  },
  navigatorRouteView: {
    // don't show on first mount
    position: 'absolute',
    width: 0,
    height: 0,
  },
  routeContentContainer: {
    // can't add `flex: 1` else it disappears
  },
});
