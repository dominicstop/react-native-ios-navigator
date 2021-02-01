import React, { ReactElement } from 'react';
import { StyleSheet, findNodeHandle, ViewStyle, View, Text } from 'react-native';

import { RNIWrapperView } from '../native_components/RNIWrapperViewManager';
import { RNINavigatorView } from '../native_components/RNINavigatorView';
import { RNINavigatorViewModule, NativePushPopOptions } from '../native_modules/RNINavigatorViewModule';

import { NavigatorRouteView } from './NavigatorRouteView';
import type { RouteContentProps } from '../components/NavigatorRouteView';

import type { RouteOptions } from '../types/NavTypes';
import type { NavBarAppearanceConfig, NavBarAppearanceLegacyConfig } from '../types/NavBarAppearanceConfig';

import type { onNavRouteDidPopPayload, onNavRouteViewAddedPayload, onNavRouteWillPopPayload } from '../native_components/RNINavigatorView';
import type { RouteTransitionPopConfig, RouteTransitionPushConfig } from '../native_components/RNINavigatorRouteView';

import * as Helpers from '../functions/Helpers';
import { EventEmitter } from '../functions/EventEmitter';

import { NativeIDKeys } from '../constants/LibraryConstants';


//#region - Type Definitions
/** Represents the current status of the navigator */
enum NavStatus {
  IDLE           = "IDLE"          , // nav. is idle, not busy
  IDLE_INIT      = "IDLE_INIT"     , // nav. just finished init.
  IDLE_ERROR     = "IDLE_ERROR"    , // nav. is idle due to error
  NAV_PUSHING    = "NAV_PUSHING"   , // nav. is busy pushing
  NAV_POPPING    = "NAV_POPPING"   , // nav. is busy popping
  NAV_PUSH_ABORT = "NAV_PUSH_ABORT", // nav. push was cancelled
};

enum NavEvents {
  onNavRouteViewAdded = "onNavRouteViewAdded"
};

type PushOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPushConfig;
};

type PopOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPopConfig;
};

/** Represents a route in the navigation stack. */
type NavRouteItem = {
  routeKey     : string;
  routeProps  ?: object;
  routeOptions?: RouteOptions;
};

/** Represents a route in the nav. `state.activeRoutes` */
interface NavRouteStateItem extends NavRouteItem {
  routeIndex: number;
};

type RenderNavBarItem = (routeItem: NavRouteStateItem) => ReactElement;

export type NavRouteConfigItem = {
  routeKey: string;
  initialRouteProps?: object;
  routeOptionsDefault?: RouteOptions;
  renderRoute: (routeItem: NavRouteItem) => ReactElement<RouteContentProps>;
  // render nav bar items
  renderNavBarLeftItem ?: RenderNavBarItem;
  renderNavBarRightItem?: RenderNavBarItem;
  renderNavBarTitleItem?: RenderNavBarItem;
};

/** `NavigatorView` comp. props */
type NavigatorViewProps = {
  style?: ViewStyle;

  // Nav. Route Config
  routes: Array<NavRouteConfigItem>;
  initialRouteKey: string;
  routeContainerStyle?: ViewStyle;
  
  // `RNINavigatorView` - General/Misc. Config
  isInteractivePopGestureEnabled?: boolean;

  // `RNINavigatorView` - Navbar Customization
  navBarPrefersLargeTitles?: boolean;
  navBarIsTranslucent?: boolean;
  navBarAppearance?: NavBarAppearanceConfig | NavBarAppearanceLegacyConfig;

  // `RNINavigatorView` - Global/Default Navbar items
  renderNavBarLeftItem ?: RenderNavBarItem;
  renderNavBarRightItem?: RenderNavBarItem;
  renderNavBarTitleItem?: RenderNavBarItem;

  //
  renderNavBarBackground?: () => ReactElement;
};

/** `NavigatorView` comp. state */
type NavigatorViewState = {
  activeRoutes: Array<NavRouteStateItem>;
  transitionConfigPushOverride?: RouteTransitionPushConfig;
  transitionConfigPopOverride ?: RouteTransitionPopConfig;
};
//#endregion


export class NavigatorView extends React.PureComponent<NavigatorViewProps, NavigatorViewState> {
  //#region - Property Declarations
  state: NavigatorViewState;

  /** A ref to the `RNINavigatorView` native component. */
  nativeRef: React.Component;
  
  private navStatus: NavStatus;
  private emitter: EventEmitter<NavEvents>;
  private routesToRemove: Array<{routeKey: string, routeIndex: number}>;
  private lastRouteRef: NavigatorRouteView;

  //#endregion

  constructor(props: NavigatorViewProps){
    super(props);

    this.navStatus = NavStatus.IDLE_INIT;
    this.emitter = new EventEmitter<NavEvents>();
    this.routesToRemove = [];

    const initialRoute = props.routes.find(item => (
      item.routeKey == props.initialRouteKey
    ));

    this.state = {
      activeRoutes: [{...initialRoute, routeIndex: 0}],
      transitionConfigPushOverride: null,
      transitionConfigPopOverride: null,
    };
  };

  //#region - Private Functions
  private isValidRouteKey = (routeKey: string) => {
    return this.props.routes.some(route => (
      route.routeKey == routeKey
    ));
  };

  private getMatchingRoute = (routeItem: NavRouteItem) => {
    return this.props.routes.find(item => (
      item.routeKey == routeItem.routeKey
    ));
  };

  private getLastRouteTransitionDuration = (isPushing: boolean) => {
    const routeConfig = this.lastRouteRef.getRouteOptions();

    return (isPushing
      ? routeConfig.transitionConfigPush?.duration
      : routeConfig.transitionConfigPop ?.duration
    );
  };
  
  /** Add route to `state.activeRoutes` and wait for it to be added in
    * the native side as a subview (i.e. `RNINavigatorView`) */
  private addRoute = (routeItem: NavRouteItem) => {
    //#region - 🐞 DEBUG 🐛
    LIB_GLOBAL.debugLog && console.log(
        `LOG/JS - NavigatorView, addRoute`
      + ` - with routeKey: ${routeItem.routeKey}`
      + ` - current activeRoutes: ${this.state.activeRoutes.length}`
    );
    //#endregion

    return Promise.all([
      // -----------------------------------------------------
      // 1. Wait for the new route to be added in native side.
      //    note: This promise will reject if `onNavRouteViewAdded` fails to fire
      //    within 500 ms (i.e. if it takes to long for the promise to be fulfilled).
      // ----------------------------------------------------------------------------
      Helpers.promiseWithTimeout(500, new Promise<void>(resolve => {
        this.emitter.once(NavEvents.onNavRouteViewAdded, () => {
          resolve();
        })
      })),
      // --------------------------------------
      // 2. Append new route to `activeRoutes`.
      //    The new route will be "received" from `RNINavigatorView`.
      // ------------------------------------------------------------
      Helpers.setStateAsync<NavigatorViewState>(this, ({activeRoutes: prevRoutes}) => ({
        activeRoutes: [...prevRoutes, {...routeItem,
          routeIndex: ((Helpers.lastElement(prevRoutes)?.routeIndex ?? 0) + 1)
        }]
      }))
    ]);
  };

  /** Remove route to `state.activeRoutes` */
  private removeRoute = async (params?: { routeKey: string, routeIndex: number }) => { 
    if(params){
      // To prevent too many state updates, the routes to be removed
      // are queued/grouped, and are removed in batches...
      this.routesToRemove.push(params);
    };

    // trigger remove if:
    const shouldRemove = (
      // - A the route to be removed has a valid `routeKey`
      (this.isValidRouteKey(params.routeKey)) &&
      // - B. there are queued items to remove and...
      (this.routesToRemove.length > 0) &&
      // - C. navigator isn't busy, or remove is triggered by recursive call.
      (NavigatorViewUtils.isNavStateIdle(this.navStatus) || false)
    );

    if(shouldRemove){
      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, removeRoute`
        + ` - with routeKey: ${params.routeKey}`
        + ` - routeIndex: ${params.routeIndex}`
        + ` - navStatus: ${this.navStatus}`
        + ` - current activeRoutes: ${this.state.activeRoutes.length}`
        + ` - current routesToRemove: ${this.routesToRemove.length}`
        + ` - activeRoutes: ${JSON.stringify(this.state.activeRoutes)}`
      );
      //#endregion
      
      this.navStatus = NavStatus.NAV_POPPING;
      // delay, so `routesToRemove` queue gets filled first
      await Helpers.timeout(300);

      // make a copy of `routesToRemove` and then clear original
      const toBeRemoved = [...this.routesToRemove];
      this.routesToRemove = [];

      // Remove `routesToRemove` from `activeRoutes`.
      await Helpers.setStateAsync<NavigatorViewState>(this, ({activeRoutes: prevRoutes}) => ({
        activeRoutes: prevRoutes.filter((prevRoute) => !(
          toBeRemoved.some((removedRoute) => (
            (removedRoute.routeKey   == prevRoute.routeKey  ) &&
            (removedRoute.routeIndex == prevRoute.routeIndex) 
          ))
        ))
      }));

      // recursively remove routes from `routesToRemove`
      if(this.routesToRemove.length > 0){
        this.removeRoute();

      } else {
        this.navStatus = NavStatus.IDLE;
      };
    };
  };

  private _handleGetRefToNavigator = (): NavigatorView => {
    return this;
  };
  //#endregion

  //#region - Public Functions
  public push = async (routeItem: NavRouteItem, options?: PushOptions) => {
    const routeConfig = this.getMatchingRoute(routeItem);

    if(!routeConfig){
      throw new Error("`NavigatorView` failed to do: `push`: Invalid `routeKey`");
    };
    
    // TEMP, replace with queue - skip if nav. is busy
    if(NavigatorViewUtils.isNavStateBusy(this.navStatus)) return;

    try {
      // update nav status to busy
      this.navStatus = NavStatus.NAV_PUSHING;

      const hasTransition = (options?.transitionConfig != null);
      // the amount of time to wait for "push" to resolve before rejecting.
      // note: convert seconds -> ms
      const minTimeout = (1000 * (
        options?.transitionConfig?.duration       ??
        this.getLastRouteTransitionDuration(true) ?? 0
      ));

      if(hasTransition){
        // temporarily override the last route's "push" transition
        await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
          transitionConfigPushOverride: options.transitionConfig
        });
      };

      // add new route, and wait for it be added
      await this.addRoute({
        routeKey    : routeItem.routeKey    ,
        routeProps  : routeItem.routeProps  ,
        routeOptions: routeItem.routeOptions,
      });

      // forward "push" request to native module
      await Helpers.promiseWithTimeout((minTimeout + 750),
        RNINavigatorViewModule.push(
          findNodeHandle(this.nativeRef),
          routeItem.routeKey, {
            isAnimated: (options?.isAnimated ?? true)
          }
        )
      );

      if(hasTransition){
        // reset transition override
        await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
          transitionConfigPushOverride: null,
        });
      };
      
      // update nav status to idle
      this.navStatus = NavStatus.IDLE;

    } catch(error){
      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
        `LOG/JS - NavigatorView, push - error message: ${error}`
        + ` - NavStatus: ${this.navStatus}`
      );
      //#endregion

      if(this.navStatus != NavStatus.NAV_PUSH_ABORT) {
        this.navStatus = NavStatus.IDLE_ERROR;
        throw new Error("`NavigatorView` failed to do: `push`");
      };
    };
  };

  public pop = async (options?: PopOptions) => {
    // TEMP, replace with queue - skip if nav. is busy
    if(NavigatorViewUtils.isNavStateBusy(this.navStatus)) return;

    try {
      // update nav status to busy
      this.navStatus = NavStatus.NAV_POPPING;

      const hasTransition = (options?.transitionConfig != null);
      // the amount of time to wait for "pop" to resolve before rejecting.
      // note: convert seconds -> ms
      const minTimeout = (1000 * (
        options?.transitionConfig?.duration        ??
        this.getLastRouteTransitionDuration(false) ?? 0
      ));

      if(hasTransition){
        // temporarily change the last route's "pop" transition
        await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
          transitionConfigPopOverride: options.transitionConfig
        });
      };

      // forward "pop" request to native module
      const result = await Helpers.promiseWithTimeout((minTimeout + 750),
        RNINavigatorViewModule.pop(
          findNodeHandle(this.nativeRef), {
            isAnimated: options?.isAnimated ?? true,
          }
        )
      );

      // remove popped route from `activeRoutes`
      await this.removeRoute(result);

      if(hasTransition){
        // reset transition override
        await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
           transitionConfigPopOverride: null,
         });
      };

      // update nav status to idle
      this.navStatus = NavStatus.IDLE;

    } catch(error){
      this.navStatus = NavStatus.IDLE_ERROR;
      throw new Error("`NavigatorView` failed to do: `pop`");
    };
  };

  public setNavigationBarHidden = async (isHidden: boolean, animated: boolean) => {
    try {
      await Helpers.promiseWithTimeout(1000,
        RNINavigatorViewModule.setNavigationBarHidden(
          findNodeHandle(this.nativeRef),
          isHidden, animated
        )
      );

    } catch(error){
      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, setNavigationBarHidden`
        + ` - error message: ${error}`
      );
      //#endregion

      throw new Error("`NavigatorView` failed to do: `setNavigationBarHidden`");
    };
  };
  //#endregion

  //#region - Native Event Handlers
  /** Handler for native event: `onNavRouteViewAdded` */
  private _handleOnNavRouteViewAdded = ({nativeEvent}: onNavRouteViewAddedPayload) => {
    // emit event: nav. route was added to `RNINavigatorView`'s subviews
    this.emitter.emit(NavEvents.onNavRouteViewAdded, {
      target    : nativeEvent.target,
      routeKey  : nativeEvent.routeKey,
      routeIndex: nativeEvent.routeIndex,
    });
  };

  /** 
   * Handler for native event: `onNavRouteWillPop` 
   * a route is about to be removed either through a tap on the "back" button,
   * or through a swipe back gesture. */
  private _handleOnNavRouteWillPop = ({nativeEvent}: onNavRouteWillPopPayload) => {
    if(this.navStatus == NavStatus.NAV_PUSHING){
      this.navStatus = NavStatus.NAV_PUSH_ABORT;
    };
  };

  /** Handler for native event: `onNavRouteDidPop` */
  private _handleOnNavRouteDidPop = ({nativeEvent}: onNavRouteDidPopPayload) => {
    // A: A route has been removed either through a tap on the "back" 
    //    button, or through a swipe back gesture.
    if(nativeEvent.isUserInitiated){
      // A1: Remove route
      this.removeRoute({
        routeKey  : nativeEvent.routeKey,
        routeIndex: nativeEvent.routeIndex
      });
      
    };
  };
  //#endregion

  _renderRoutes(){
    const props = this.props;
    const { activeRoutes, ...state } = this.state;

    const activeRoutesCount = activeRoutes.length;

    return activeRoutes.map((route, index) => {
      const routeConfig = this.getMatchingRoute(route);

      const isLast         = (activeRoutesCount - 1) == index;
      const isSecondToLast = (activeRoutesCount - 2) == index;

      return (
        <NavigatorRouteView
          key={`${route.routeKey}-${route.routeIndex}`}
          {...(isLast && {ref: r => this.lastRouteRef = r})}
          routeContainerStyle={props.routeContainerStyle}
          routeIndex={route.routeIndex}
          routeKey={route.routeKey}
          routeProps={(
            route      .routeProps ??
            routeConfig.initialRouteProps
          )}
          routeOptionsDefault={(
            route      .routeOptions ??
            routeConfig.routeOptionsDefault
          )}
          transitionConfigPushOverride={(isSecondToLast
            ? state.transitionConfigPushOverride
            : null
          )}
          transitionConfigPopOverride ={(isLast
            ? state.transitionConfigPopOverride
            : null
          )}
          getRefToNavigator={this._handleGetRefToNavigator}
          renderRouteContent={() => (
            routeConfig.renderRoute(route)
          )}
          renderNavBarLeftItem={() => (
            routeConfig.renderNavBarLeftItem?.(route) ??
            props      .renderNavBarLeftItem?.(route)
          )}
          renderNavBarRightItem={() => (
            routeConfig.renderNavBarRightItem?.(route) ??
            props      .renderNavBarRightItem?.(route)
          )}
          renderNavBarTitleItem={() => (
            routeConfig.renderNavBarTitleItem?.(route) ??
            props      .renderNavBarTitleItem?.(route)
          )}
        />
      );
    });
  };
  
  render(){
    const props = this.props;

    return (
      <RNINavigatorView 
        ref={r => this.nativeRef = r}
        style={[styles.navigatorView, props.style]}
        // General config
        isInteractivePopGestureEnabled={props.isInteractivePopGestureEnabled ?? true}
        // Navigation Bar customization
        isNavBarTranslucent={props.navBarIsTranslucent ?? true}
        navBarPrefersLargeTitles={props.navBarPrefersLargeTitles ?? true}
        navBarAppearance={props.navBarAppearance}
        // event handlers: push/pop
        onNavRouteWillPop={this._handleOnNavRouteWillPop}
        onNavRouteDidPop={this._handleOnNavRouteDidPop}
        onNavRouteViewAdded={this._handleOnNavRouteViewAdded}
      >
        {this._renderRoutes()}
        {props.renderNavBarBackground && (
          <RNIWrapperView
            style={styles.navBarBackgroundContainer} 
            nativeID={NativeIDKeys.NavBarBackground}
          >
            {props.renderNavBarBackground()}
          </RNIWrapperView>
        )}
      </RNINavigatorView>
    );
  };
};

/** Utilities for `NavigatorView` */
class NavigatorViewUtils {
  static isNavStateIdle(navStatus: NavStatus){
    return (
      navStatus == NavStatus.IDLE           ||
      navStatus == NavStatus.IDLE_INIT      ||
      navStatus == NavStatus.IDLE_ERROR     ||
      navStatus == NavStatus.NAV_PUSH_ABORT
    );
  };

  static isNavStateBusy(navStatus: NavStatus){
    return !NavigatorViewUtils.isNavStateIdle(navStatus);
  };
};

const styles = StyleSheet.create({
  navigatorView: {
    flex: 1,
  },
  navBarBackgroundContainer: {
    position: 'absolute',
  },
});
