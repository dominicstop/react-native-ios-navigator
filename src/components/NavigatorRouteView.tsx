import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import type { RouteViewPortal } from './RouteViewPortal';
import type { NavigatorView, RouteOptions } from './NavigatorView';

import { RNINavigatorRouteView } from '../native_components/RNINavigatorRouteView';

import * as Helpers from '../functions/Helpers';
import { EventEmitter } from '../functions/EventEmitter';

import { NavRouteViewContext } from '../context/NavRouteViewContext';
import { NativeIDKeys } from '../constants/LibraryConstants';



//#region - Type Definitions
export enum NavRouteEvents {
  onNavRouteWillPush = "onNavRouteWillPush",
  onNavRouteDidPush  = "onNavRouteDidPush" ,
  onNavRouteWillPop  = "onNavRouteWillPop" ,
  onNavRouteDidPop   = "onNavRouteDidPop"  ,
};

export interface RouteContentProps {
  routeKey?: string;
  routeIndex?: number;
  getRefToRoute?: () => NavigatorRouteView;
  getRefToNavigator?: () => NavigatorView;
  getRefToNavRouteEmitter?: () => EventEmitter<NavRouteEvents>;
};

type NavigatorRouteViewProps = {
  routeKey: string;
  routeIndex: number;
  routeProps: object;
  initialRouteOptions: RouteOptions;
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
  routeTitle: string;
  hasRoutePortal: boolean;
};


//#endregion


export class NavigatorRouteView extends React.PureComponent<NavigatorRouteViewProps, NavigatorRouteViewState> {
  //#region - Property Declarations
  state: NavigatorRouteViewState;
  routeContentRef: React.Component<RouteContentProps>;
  emitter: EventEmitter<NavRouteEvents>;

  private _routeContentRef: ReactElement;
  private _routeViewPortalRef: RouteViewPortal;
  //#endregion

  constructor(props: NavigatorRouteViewProps){
    super(props);

    this.emitter = new EventEmitter<NavRouteEvents>();

    this.state = {
      isMounted: true,
      hasRoutePortal: false,
      routeTitle: (
        // get the initial route title
        props.initialRouteOptions?.routeTitle ??
        props.routeKey
      ),
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
    return this.emitter;
  };

  public setRouteTitle = async (title: string) => {
    await Helpers.setStateAsync<Partial<NavigatorRouteViewState>>(this, {
      routeTitle: title
    });
  };

  public setRouteRegistryRef = (ref: RouteViewPortal) => {
    this._routeViewPortalRef = ref;
    this.setState({hasRoutePortal: true});
  };
  //#endregion

  //#region - Handlers
  private _handleGetRefToRoute = () => {
    return this;
  };

  private _handleGetRefToNavRouteEmitter = () => {
    return this.emitter;
  };
  //#endregion

  //#region - Native Event Handlers
  /** Handler for `RNINavigatorRouteView` native event: `onNavRouteWillPop` */
  private _handleOnNavRouteWillPop = () => {
    this.emitter.emit(NavRouteEvents.onNavRouteWillPop, null);
  };

  /** Handler for `RNINavigatorRouteView` native event: `onNavRouteDidPop` */
  private _handleOnNavRouteDidPop = () => {
    this.emitter.emit(NavRouteEvents.onNavRouteDidPop, null);
  };

  /** Handler for `RNINavigatorRouteView` native event: `onNavRouteWillPus` */
  private _handleOnNavRouteWillPush = () => {
    this.emitter.emit(NavRouteEvents.onNavRouteWillPush, null);
  };

  /** Handler for `RNINavigatorRouteView` native event: `onNavRouteDidPush` */
  private _handleOnNavRouteDidPush = () => {
    this.emitter.emit(NavRouteEvents.onNavRouteDidPush, null);
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
        style={styles.routeItem}
        nativeID={NativeIDKeys.RouteContent}
      >
        {routeContentWithProps}
      </View>
    );
  };

  _renderNavBarItems = () => {
    const props = this.props;
    const state = this.state;

    const portalProps = this._routeViewPortalRef?.props;

    const sharedParams = {
      // pass "get ref" functions...
      getRouterRef     : this.getRouterRef     ,
      getEmitterRef    : this.getEmitterRef    ,
      getRefToNavigator: this.getRefToNavigator,
      // pass down route props...
      routeKey    : props.routeKey  ,
      routeIndex  : props.routeIndex,
      routeProps  : props.routeProps,
      routeOptions: {
        ...props.initialRouteOptions,
        routeTitle: state.routeTitle,
      },
    };

    const navBarBackItem = (
      portalProps?.renderNavBarBackItem?.(sharedParams) ??
      props.renderNavBarBackItem?.()
    );

    const navBarLeftItem = (
      portalProps?.renderNavBarLeftItem?.(sharedParams) ??
      props.renderNavBarLeftItem?.()
    );

    const navBarRightItem = (
      portalProps?.renderNavBarRightItem?.(sharedParams) ??
      props.renderNavBarRightItem?.()
    );

    const navBarTitleItem = (
      portalProps?.renderNavBarTitleItem?.(sharedParams) ??
      props.renderNavBarTitleItem?.()
    );

    return(
      <React.Fragment>
        {navBarBackItem && (
          <View 
            style={styles.routeItem}
            nativeID={NativeIDKeys.NavBarBackItem}
          >
            {navBarBackItem}
          </View>
        )}
        {navBarLeftItem && (
          <View 
            style={styles.routeItem}
            nativeID={NativeIDKeys.NavBarLeftItem}
          >
            {navBarLeftItem}
          </View>
        )}
        {navBarRightItem && (
          <View  
            style={styles.routeItem}
            nativeID={NativeIDKeys.NavBarRightItem}
          >
            {navBarRightItem}
          </View>
        )}
        {navBarTitleItem && (
          <View 
            style={styles.routeItem}
            nativeID={NativeIDKeys.NavBarTitleItem}
          >
            {navBarTitleItem}
          </View>
        )}
      </React.Fragment>
    );
  };

  render(){
    const props = this.props;
    const state = this.state;

    if(!state.isMounted) return null;

    return(
      <NavRouteViewContext.Provider value={{
        // pass down function to get refs
        getRouterRef: this.getRouterRef,
        getEmitterRef: this.getEmitterRef,
      }}>
        <RNINavigatorRouteView
          style={styles.navigatorRouteView}
          routeKey={props.routeKey}
          routeIndex={props.routeIndex}
          routeTitle={state.routeTitle}
          // nav route events
          onNavRouteWillPop={this._handleOnNavRouteWillPop}
          onNavRouteDidPop={this._handleOnNavRouteDidPop}
          onNavRouteWillPush={this._handleOnNavRouteWillPush}
          onNavRouteDidPush={this._handleOnNavRouteDidPush}
        >
          {this._renderRouteContents()}
          {this._renderNavBarItems()}
        </RNINavigatorRouteView>
      </NavRouteViewContext.Provider>
    );
  };
};

const styles = StyleSheet.create({
  routeItem: {
    position: 'absolute',
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
