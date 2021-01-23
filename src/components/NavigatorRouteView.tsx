import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import type { RouteViewPortal } from './RouteViewPortal';
import type { NavigatorView, RouteOptions } from './NavigatorView';

import { NavBarItemsWrapper } from './NavBarBackItemsWrapper';

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

    const { initialRouteOptions: defaultRouteOptions } = this.props;
    const { routeOptions } = this.state;

    // Technically, this whole thing could be done like this:
    // `{...defaultRouteOptions, ...routeOptions}`
    // but it's less clear/explicit, idk refactor this later.

    return {
      // Navbar item config
      routeTitle: (
        routeOptions       ?.routeTitle ??
        defaultRouteOptions?.routeTitle ?? props.routeKey
      ),
      navBarButtonBackItemConfig: (
        routeOptions       ?.navBarButtonBackItemConfig ??
        defaultRouteOptions?.navBarButtonBackItemConfig
      ),
      navBarButtonLeftItemsConfig: (
        routeOptions       ?.navBarButtonLeftItemsConfig ??
        defaultRouteOptions?.navBarButtonLeftItemsConfig
      ),
      navBarButtonRightItemsConfig: (
        routeOptions       ?.navBarButtonRightItemsConfig ??
        defaultRouteOptions?.navBarButtonRightItemsConfig
      ),
      leftItemsSupplementBackButton: (
        routeOptions       ?.leftItemsSupplementBackButton ??
        defaultRouteOptions?.leftItemsSupplementBackButton
      ),
      // Navbar back button item config
      backButtonTitle: (
        routeOptions       ?.backButtonTitle ??
        defaultRouteOptions?.backButtonTitle
      ),
      backButtonDisplayMode: (
        routeOptions       ?.backButtonDisplayMode ??
        defaultRouteOptions?.backButtonDisplayMode
      ),
      hidesBackButton: (
        routeOptions       ?.hidesBackButton ??
        defaultRouteOptions?.hidesBackButton
      ),
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
    console.log("NavigatorRouteView, setRouteOptions - routeOptions: ", this.state.routeOptions); //

  };

  public setRouteTitle = async (title: string) => {
    await Helpers.setStateAsync<NavigatorRouteViewState>(this, (prevState) => ({
      ...prevState, 
      routeOptions: {
        ...prevState.routeOptions,
        routeTitle: title,
      },
    }));
  };

  public setRouteViewPortalRef = (ref: RouteViewPortal) => {
    this._routeViewPortalRef = ref;
    this._navBarItemsWrapperRef?.setPortalRef(ref);

    this.setState({hasRoutePortal: true});
  };
  //#endregion

  //#region - Handlers
  private _handleGetRefToRoute = () => {
    return this;
  };

  private _handleGetRefToNavRouteEmitter = () => {
    return this._emitter;
  };
  //#endregion

  //#region - Native Event Handlers
  /** Handler for `RNINavigatorRouteView` native event: `onNavRouteWillPop` */
  private _handleOnNavRouteWillPop = () => {
    this._emitter.emit(NavRouteEvents.onNavRouteWillPop, null);
  };

  /** Handler for `RNINavigatorRouteView` native event: `onNavRouteDidPop` */
  private _handleOnNavRouteDidPop = () => {
    this._emitter.emit(NavRouteEvents.onNavRouteDidPop, null);
  };

  /** Handler for `RNINavigatorRouteView` native event: `onNavRouteWillPus` */
  private _handleOnNavRouteWillPush = () => {
    this._emitter.emit(NavRouteEvents.onNavRouteWillPush, null);
  };

  /** Handler for `RNINavigatorRouteView` native event: `onNavRouteDidPush` */
  private _handleOnNavRouteDidPush = () => {
    this._emitter.emit(NavRouteEvents.onNavRouteDidPush, null);
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
          routeKey={props.routeKey}
          routeIndex={props.routeIndex}
          routeTitle={routeOptions.routeTitle}
          // nav route events
          onNavRouteWillPop={this._handleOnNavRouteWillPop}
          onNavRouteDidPop={this._handleOnNavRouteDidPop}
          onNavRouteWillPush={this._handleOnNavRouteWillPush}
          onNavRouteDidPush={this._handleOnNavRouteDidPush}
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
