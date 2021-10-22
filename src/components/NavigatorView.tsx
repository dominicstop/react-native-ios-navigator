import React, { ReactElement } from 'react';
import { Platform, StyleSheet, ViewProps } from 'react-native';

import { TSEventEmitter } from '@dominicstop/ts-event-emitter';

import { RNIWrapperView } from '../native_components/RNIWrapperView';
import { NativeRouteMap, RNINavigatorView, RNINavigatorViewProps } from '../native_components/RNINavigatorView';
import { NavigatorConstantsObject, RNINavigatorViewModule } from '../native_modules/RNINavigatorViewModule';

import { NavigatorRouteViewWrapper } from '../wrapper_components/NavigatorRouteViewWrapper';

import { NavigatorUIConstantsContext } from '../context/NavigatorUIConstantsContext';

import type { NavigatorRouteView } from './NavigatorRouteView';
import type { RNINavigatorRouteViewProps } from '../native_components/RNINavigatorRouteView';

import type { NavCommandPopOptions, NavCommandPushOptions, RouteTransitionConfig } from '../types/NavigationCommands';
import type { NavRouteItem, NavRouteStackItem, NavRouteStackPartialItem, NavRouteStackItemPartialMetadata } from '../types/NavRouteItem';
import type { RenderNavItem } from '../types/NavTypes';
import type { NavRouteConfigItem, NavRouteConfigItemJS } from '../types/NavRouteConfigItem';
import type { NavigationObject } from '../types/NavigationObject';
import type { OnUIConstantsDidChangeEventObject, OnNavRouteViewAddedEvent, OnSetNativeRoutesEvent, OnNativeCommandRequestEvent, OnNavRoutePopEvent, OnUIConstantsDidChangeEvent, OnCustomCommandFromNativeEvent, OnNavRouteDidShowEvent } from '../types/RNINavigatorViewEvents';

import { NavigatorViewEventEmitter, NavigatorViewEvents } from '../types/NavigatorViewEventEmitter';

import * as Helpers from '../functions/Helpers';

import { SimpleQueue } from '../functions/SimpleQueue';
import { NavigatorError, NavigatorErrorCodes } from '../functions/NavigatorError';

import { NativeIDKeys } from '../constants/LibraryConstants';
import { LIB_ENV } from '../constants/LibEnv';


//#region - Type Definitions
/** Represents the current status of the navigator */
enum NavStatus {
  IDLE           = "IDLE"          , // nav. is idle, not busy
  IDLE_INIT      = "IDLE_INIT"     , // nav. just finished init.
  IDLE_ERROR     = "IDLE_ERROR"    , // nav. is idle due to error
  NAV_PUSHING    = "NAV_PUSHING"   , // nav. is busy pushing
  NAV_POPPING    = "NAV_POPPING"   , // nav. is busy popping
  NAV_REMOVING   = "NAV_REMOVING"  , // nav. is busy removing a route
  NAV_REPLACING  = "NAV_REPLACING" , // nav. is busy replacing a route
  NAV_INSERTING  = "NAV_INSERTING" , // nav. is busy inserting a route
  NAV_UPDATING   = "NAV_UPDATING"  , // nav. is busy updating the routes
  UNMOUNTED      = "UNMOUNTED"     , // nav. comp. has been unmounted
  NAV_ABORT      = "NAV_ABORT"     , // nav. has been popped before push completed
};

// TODO (010): Move to types/InternalTypes
type NavRouteConfigItemExtended = 
  NavRouteConfigItem & Pick<RNINavigatorRouteViewProps, 'routeKey'>;

export type SetRoutesTransformCallback = 
  (currentRoutes: readonly NavRouteStackPartialItem[]) => Array<NavRouteStackPartialItem>;

export type NavRoutesConfigMap = { [k: string]: NavRouteConfigItem };

/** `NavigatorView` comp. props */
type NavigatorViewBaseProps = Partial<Pick<RNINavigatorViewProps,
  // mirror props from `RNINavigatorViewProps`
  | 'isInteractivePopGestureEnabled' 
  | 'shouldSwizzleRootViewController'
  | 'navBarPrefersLargeTitles' 
  | 'navBarAppearance' 
  | 'isNavBarTranslucent'
  | 'disableTransparentNavBarScrollEdgeAppearance'
  // events
  | 'onCustomCommandFromNative'
  | 'onNavRouteWillPop'
  | 'onNavRouteDidPop'
  | 'onNavRouteWillShow'
  | 'onNavRouteDidShow'
  | 'onUIConstantsDidChange'
>> & {

  // Nav. Route Config
  routes: NavRoutesConfigMap;
  initialRoutes: Array<NavRouteItem>;
  sharedRouteProps?: object;

  // `RNINavigatorView` - Default Navbar items
  renderNavBarLeftItem ?: RenderNavItem;
  renderNavBarRightItem?: RenderNavItem;
  renderNavBarTitleItem?: RenderNavItem;

  renderNavBarBackground?: () => ReactElement;
};

export type NavigatorViewProps = 
  ViewProps & NavigatorViewBaseProps;

/** `NavigatorView` comp. state */
type NavigatorViewState = Partial<Pick<OnUIConstantsDidChangeEventObject['nativeEvent'],
  | 'statusBarHeight'
  | 'safeAreaInsets'
  | 'navigatorSize'
>> & {
  activeRoutes: Array<NavRouteStackItem>;

  // push/pop override config
  transitionConfigPushOverride?: RouteTransitionConfig;
  transitionConfigPopOverride ?: RouteTransitionConfig;
};
//#endregion

const TIMEOUT_MOUNT   = 750;
const TIMEOUT_COMMAND = 1750;

const iOSVersion = parseInt(Platform.Version as string, 10);

let NAVIGATOR_ID_COUNTER = 0;
let ROUTE_ID_COUNTER     = 0;

let nativeRouteKeys: Record<string, string> = {};

export class NavigatorView extends React.PureComponent<NavigatorViewProps, NavigatorViewState> {
  
  //#region - Property Declarations
  /** A ref to the `RNINavigatorView` native component. */
  nativeRef!: React.Component;

  /** Unique identifier for this navigator */
  private navigatorID: number;
  
  private navStatus: NavStatus;
  private emitter: NavigatorViewEventEmitter;

  /** Used for `removeRouteBatchedFromState`*/
  private routesToRemove: 
    Array<Pick<RNINavigatorRouteViewProps, 'routeKey' | 'routeIndex'>>;

  /** Queue for nav. commands: only 1 command is called at a time */
  private queue: SimpleQueue;

  // note: the key should be the routeID
  private routeRefMap: { [key: number]: NavigatorRouteView } = {};
  //#endregion
  
  constructor(props: NavigatorViewProps){
    super(props);
    this.verifyProps();

    this.navigatorID = NAVIGATOR_ID_COUNTER++;

    this.navStatus = NavStatus.IDLE_INIT;
    this.routesToRemove = [];

    this.emitter = new TSEventEmitter();
    this.queue = new SimpleQueue();

    this.state = {
      activeRoutes: this.getInitialRoutes(),

      transitionConfigPushOverride: undefined,
      transitionConfigPopOverride: undefined,

      safeAreaInsets: undefined,
      statusBarHeight: undefined,
      navigatorSize: undefined,
    };
  };

  componentWillUnmount(){
    this.setNavStatus(NavStatus.UNMOUNTED);
    this.queue.clear();
  };

  //#region - Private Functions
  private verifyProps = () => {
    const props = this.props;

    if(props.routes == null){
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidProps,
        message: "the 'NavigatorView.routes' prop cannot be empty"
      });
    };

    if(typeof props.routes !== 'object' || Array.isArray(props.routes)){
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidProps,
        message: "the value passed to the 'NavigatorView.routes' prop must be an object"
      });
    };

    const routeKeys = Object.keys(props.routes);

    if(routeKeys.length === 0){
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidProps,
        message: 
            "the 'NavigatorView.routes' prop cannot be an empty object."
          + ' There must be at least one valid route'
      });
    };

    for (const routeKey of routeKeys) {
      const routeConfig = props.routes[routeKey];

      // skip native routes...
      if(routeConfig.isNativeRoute) continue;

      // TODO (016): Add user-defined type guard
      // * (x: NavRouteConfigItem): x is NavRouteConfigItemJS

      if((routeConfig as NavRouteConfigItemJS).renderRoute == null){
        throw new NavigatorError({
          code: NavigatorErrorCodes.invalidProps,
          message: 
              `invalid route config for ${routeKey} in 'NavigatorView.routes' prop.`
            + " Missing 'renderRoute' function (all JS routes must have a component to render)"
        });
      };
    };
  };

  private isValidRouteKey = (routeKey: string) => {
    const { routes } = this.props;

    const hasNativeRouteKeyMatch = (nativeRouteKeys[routeKey] != null);
    const hasRoutesConfigMatch   = (routes[routeKey] !== undefined);

    return (hasNativeRouteKeyMatch || hasRoutesConfigMatch);
  };

  private getInitialRoutes = (): Array<NavRouteStackItem> => {
    const { initialRoutes } = this.props;

    const isValid = ((initialRoutes != null) && Array.isArray(initialRoutes));
    const isEmpty = (initialRoutes?.length === 0);

    // guard: initial validation for `initialRoutes`
    
    if(!isValid || isEmpty){
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidProps,
        message: "Invalid value given to 'initialRoutes' prop"
      });
    };

    return initialRoutes.map((route, index) => {
      const config = this.getRouteConfig(route.routeKey);

      // guard: no matching route config found for `routeKey`
      if(config == null){
        throw new NavigatorError({
          code: NavigatorErrorCodes.invalidProps,
          message: 
                "invalid value for 'initialRoutes' prop"
            + ` - no matching route found for 'routeKey': ${route.routeKey}.`
            + " All routes must be declared in the routes prop."
            + " If this is a native route, please add it to the 'routes' prop w/"
            + " the 'isNativeRoute' property set to 'true'"
        });
      };

      const routeItem: NavRouteStackItem = {
        isNativeRoute: config.isNativeRoute!,
        routeID: ROUTE_ID_COUNTER++,
        routeIndex: index,
        routeKey: route.routeKey,
        routeProps: route.routeProps,
      };

      return (config.isNativeRoute ? routeItem : ({
        ...routeItem,
        routeOptions: Helpers.shallowMergeObjects(
          (config as NavRouteConfigItemJS).routeOptionsDefault,
          route.routeOptions,
        ) ?? undefined,
      }));
    });
  };

  /** Creates a dict of the current native routes based on `state.activeRoutes` */
  private getNativeRoutes = (): NativeRouteMap => {
    const { activeRoutes } = this.state;

    const nativeRoutes = activeRoutes.filter(route => route.isNativeRoute);

    return nativeRoutes.reduce((acc, curr) => {
      acc[curr.routeID] = {
        routeKey  : curr.routeKey,
        routeIndex: curr.routeIndex,
        routeProps: curr.routeProps,
      };

      return acc;
    }, {} as NativeRouteMap);
  };

  /** returns the current js/react routes sorted by `routeID` */
  private getRoutesToRender = () => {
    // make a copy
    const activeRoutes = [...this.state.activeRoutes];
    
    return activeRoutes
      // only return js/react routes
      .filter(route => !route.isNativeRoute)
      // sort by routeID in asc. order
      .sort((a, b) => (a.routeID - b.routeID))
  };

  /** get route config with the matching `routeKey` */
  private getRouteConfig = (routeKey: string): NavRouteConfigItemExtended | undefined => {
    const { routes } = this.props;

    const routeConfig = routes[routeKey];
    const nativeRouteKey = nativeRouteKeys?.[routeKey];

    const hasNativeRouteKeyMatch = (nativeRouteKey != null);
    const isNativeRoute = routeConfig?.isNativeRoute || hasNativeRouteKeyMatch;

    if(isNativeRoute) return {
      routeKey,
      isNativeRoute: true,
      initialRouteProps: routeConfig?.initialRouteProps,
    };

    return (routeConfig == null)? undefined : {
      routeKey, ...routeConfig,
    };
  };

  private getLastRouteTransitionDuration = (isPushing: boolean) => {
    const { activeRoutes } = this.state;

    const lastIndex = activeRoutes.length - 1;
    const lastRoute = activeRoutes[lastIndex];

    // if the last route is a native route, then this will be undefined
    const lastRouteRef = this.routeRefMap[lastRoute.routeID];
    if(!lastRouteRef) return 0;

    const routeConfig = lastRouteRef.getRouteOptions();

    return (isPushing
      ? routeConfig.transitionConfigPush?.duration ?? 0
      : routeConfig.transitionConfigPop ?.duration ?? 0
    );
  };

  private getRefToRouteView = (
    routeDetails: NavRouteStackItemPartialMetadata
  ): NavigatorRouteView | undefined => {
    const routeStackItem = this.getRouteStackItem(routeDetails);

    if(routeStackItem == null) return undefined;

    return this.routeRefMap[routeStackItem.routeID];
  };

  private setNavStatus(navStatus: NavStatus){
    if(this.navStatus !== NavStatus.UNMOUNTED){
      //#region - 🐞 DEBUG 🐛
      LIB_ENV.debugLog && console.log(
          `LOG/JS - NavigatorView, setNavStatus`
        + ` - navigatorID: ${this.navigatorID}`
        + ` - next status: ${navStatus}`
        + ` - current status: ${this.navStatus}`
        + ` - queue.isBusy: ${this.queue.isBusy()}`
      );
      //#endregion

      this.navStatus = navStatus;
    };
  };

  /** used to set/reset the transition override for the current route  */
  private configureTransitionOverride = (params: Readonly<{
    isPushing: true;
    pushConfig?: RouteTransitionConfig;
  } | {
    isPushing: false;
    popConfig?: RouteTransitionConfig;
  }>) => {
    let listener: { unsubscribe: () => void } | undefined;

    const hasTransitionConfig = (params.isPushing
      ? (params.pushConfig != null)
      : (params.popConfig  != null)
    );

    // the push/pop duration in seconds
    const transitionConfigDuration = (params.isPushing
      ? params.pushConfig?.duration
      : params.popConfig ?.duration
    );

    // note: convert seconds -> ms
    const transitionDuration = (1000 * (
      transitionConfigDuration ??
      this.getLastRouteTransitionDuration(true) ?? 0
    ));

    if(transitionDuration > 10000){
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidArguments,
        message: 
            `the transition duration of ${transitionDuration} ms. is too long`
          + " - reminder: specify duration in seconds (ex: 0.5), not in ms (ex: 500)"
      });
    };

    return({
      // add some wiggle room
      transitionDuration: (transitionDuration + 250),
      setTransition: async () => {
        if(!hasTransitionConfig) return;

        // set transition
        await Promise.all([
          // temp bugfix: delay so that pop transition config is set/received
          // from native.
          params.isPushing? null : Helpers.timeout(100),
          
          // temporarily override the last route's push/pop transition
          Helpers.setStateAsync<Partial<NavigatorViewState>>(this, params.isPushing
            ? { transitionConfigPushOverride: params.pushConfig }
            : { transitionConfigPopOverride : params.popConfig  }
          ),
        ]);
      },
      resetTransition: async () => {
        if(!hasTransitionConfig) return;
        listener?.unsubscribe();

        // remove the push/pop transition override
        await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
          transitionConfigPushOverride: undefined,
          transitionConfigPopOverride : undefined,
        });
      },
      scheduleReset: () => {
        if(!hasTransitionConfig) return;

        if(params.isPushing){
          listener = this.emitter.once('onNavRouteDidShow', () => {
            if(this.state.transitionConfigPushOverride == null) return;

            this.setState({
              transitionConfigPushOverride: undefined
            });
          });

        } else {
          this.emitter.once('onNavRouteDidPop', () => {
            if(this.state.transitionConfigPopOverride == null) return;

            this.setState({
              transitionConfigPopOverride: undefined
            });
          });
        };
      }
    });
  };

  /** 
   * Returns a promise that will resolve once all the routes in `routeItems` are added/initialized
   * from the native-side.
   * * If the route item in `routeItems` has a native route, then wait for them to be created
   *   and initialized with data (e.g. wait for the `onNavRouteViewAdded` event).
   * * For each react/js route in `routeItems`, wait for it to be added as a subview in the 
   *   native side (e.g. wait for the `onNavRouteViewAdded` event).
   * 
   * note: This promise will reject if the events fail to fire within `TIMEOUT_MOUNT` ms. */
  private waitForRoutesToBeAdded = (routeItems: readonly NavRouteStackItem[]) => {
    // filter out/separate react and native routes
    const [nativeRoutes, reactRoutes] = routeItems.reduce((acc, curr) => {
      acc[curr.isNativeRoute? 0 : 1].push(curr.routeID);
      return acc;
    }, [[], []] as [Array<number>, Array<number>]);

    const hasNativeRoutes = nativeRoutes.length > 0;

    return Helpers.promiseWithTimeout(TIMEOUT_MOUNT, Promise.all([
      // 1. wait for native routes to be init. (if any)
      hasNativeRoutes? new Promise<void>(resolve => {
        this.emitter.once(NavigatorViewEvents.onSetNativeRoutes, () => {
          resolve();
        });
      }) : null,
      
      // 2. wait for react routes to be "received" from native
      ...reactRoutes.map(routeID => new Promise<void>(resolve => {
        this.emitter.once(NavigatorViewEvents.onNavRouteViewAdded, ({nativeEvent}) => {
          if(nativeEvent.routeID === routeID){
            resolve();
          };
        })
      }))
    ]));
  };

  /**
   * Returns a promise that will resolve once all the routes in `routeItems` are removed
   * from from the native-side (i.e. wait for `onNavRouteDidPop`).
   */
  private waitForRoutesToBeRemoved = (routeItems: readonly NavRouteStackItem[]) => {
    return Promise.all(
      routeItems.map(routeItem => new Promise<void>(resolve => {
        this.emitter.once(NavigatorViewEvents.onNavRouteDidPop, ({nativeEvent}) => {
          if(nativeEvent.routeID === routeItem.routeID){
            resolve();
          };
        })
      }))
    );
  };

  private syncRoutesFromNative = async () => {
    const state = this.state;

    // is the current react routes diff. from the native routes?
    let syncStatus: 'sync' | 'diverged' | 'unknown' = 'sync';

    let activeRoutesNext: NavRouteStackItem[] = [];

    try {
      const activeRoutesNative = await this.getActiveRoutes();

      const activeRoutesMapJS: Record<number, NavRouteStackItem> = {};
      for (const route of state.activeRoutes) {
        activeRoutesMapJS[route.routeID] = route;
      };

      for (let i = 0; i < activeRoutesNative.length; i++) {
        activeRoutesNext[i] = (activeRoutesNative[i]);

        if(state.activeRoutes[i]?.routeID !== activeRoutesNative[i].routeID){
          syncStatus = 'diverged';
        };
      };

      if(syncStatus === 'diverged'){
        //#region - 🐞 DEBUG 🐛
        LIB_ENV.debugLog && console.log(
            `LOG/JS - NavigatorView, syncRoutesFromNative`
          + ` - active routes synced`
        );
        //#endregion

        await Helpers.setStateAsync<NavigatorViewState>(this, {
          activeRoutes: activeRoutesNext,
        });
      };

    } catch(e) {
      const error = new NavigatorError(e);

      //#region - 🐞 DEBUG 🐛
      LIB_ENV.debugLog && console.log(
          `LOG/JS - Error, NavigatorView, syncRoutesFromNative`
        + ` - sync failed w/ error: ${error.message}`
      );
      //#endregion

      // sync failed
      syncStatus = 'unknown';
    };

    return {
      results: syncStatus,
      didDivergeFromNative: 
        (syncStatus === 'diverged' || syncStatus === 'unknown')
    };
  };

  /** Remove route from `state.activeRoutes` in batches a few ms apart. */
  private removeRouteBatchedFromState = async (params?: Readonly<{
    routeKey: string, 
    routeIndex: number 
  }>) => { 
    if(params){
      // To prevent too many state updates, the routes to be removed
      // are queued/grouped, and are removed in batches...
      this.routesToRemove.push(params);
    };

    // trigger remove if:
    const shouldRemove = () => (
      // - A. there's a param argument
      (params != null) &&
      // - B. the route to be removed has a valid `routeKey`
      this.isValidRouteKey(params.routeKey) &&
      // - C. there are queued items to remove
      (this.routesToRemove.length > 0)
    );

    // if busy, wait for prev. to finish
    const queue = this.queue.schedule();
    await queue.promise;

    this.setNavStatus(NavStatus.NAV_POPPING);
    
    while(shouldRemove()){      
      // delay, so `routesToRemove` queue gets filled first
      await Helpers.timeout(200);

      // make a copy of `routesToRemove` and then clear original
      const toBeRemoved = [...this.routesToRemove];
      this.routesToRemove = [];

      //#region - 🐞 DEBUG 🐛
      LIB_ENV.debugLog && console.log(
          `LOG/JS - NavigatorView, removeRouteBatchedFromState`
        + ` - with routeKey: ${params?.routeKey ?? 'N/A'}`
        + ` - routeIndex: ${params?.routeIndex ?? 'N/A'}`
        + ` - navStatus: ${this.navStatus}`
        + ` - current activeRoutes: ${this.state.activeRoutes.length}`
        + ` - current routesToRemove: ${toBeRemoved.length}`
        + ` - activeRoutes: ${JSON.stringify(this.state.activeRoutes)}`
      );
      //#endregion

      // Remove `routesToRemove` from `activeRoutes`.
      await Helpers.setStateAsync<NavigatorViewState>(this, 
        ({activeRoutes: prevRoutes}) => ({
          activeRoutes: prevRoutes.filter((prevRoute) => !(
            toBeRemoved.some((removedRoute) => (
              (removedRoute.routeKey   === prevRoute.routeKey  ) &&
              (removedRoute.routeIndex === prevRoute.routeIndex) 
            ))
          ))
        })
      );
    };

    this.setNavStatus(NavStatus.IDLE);
    this.queue.dequeue();
  };

  private _handleGetRefToNavigator = (): NavigatorView => {
    return this;
  };
  //#endregion

  //#region - Public Functions
  public getActiveRoutes = () => {
    return this.state.activeRoutes;
  };

  // Navigation Commands
  // -------------------

  public push = async (
    routeItem: Readonly<NavRouteItem>, 
    options?: NavCommandPushOptions
  ): Promise<void> => {
    
    const routeConfig = this.getRouteConfig(routeItem.routeKey);

    const transitionConfig = this.configureTransitionOverride({
      isPushing: true,
      pushConfig: options?.transitionConfig,
    });

    if(!routeConfig){
      // no matching route config found for `routeItem`
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidArguments,
        message: `invalid 'routeKey': ${routeItem.routeKey}`
      });
    };
    
    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      const { activeRoutes } = this.state;
      this.setNavStatus(NavStatus.NAV_PUSHING);

      // the amount of time to wait for "push" to resolve before rejecting.
      const timeout = Math.max(
        transitionConfig.transitionDuration, TIMEOUT_COMMAND
      );

      // temporarily override the last route's "push" transition
      await transitionConfig.setTransition();
      transitionConfig.scheduleReset();

      //#region - 🐞 DEBUG 🐛
      LIB_ENV.debugLog && console.log(
          `LOG/JS - NavigatorView, push: add route`
        + ` - with routeKey: ${routeItem.routeKey}`
        + ` - pre-push activeRoutes: ${this.state.activeRoutes.length}`
      );
      //#endregion
      
      const nextRouteIndex = activeRoutes.length;

      const nextRoute: NavRouteStackItem = {
        routeID: ROUTE_ID_COUNTER++,
        routeIndex: nextRouteIndex,
        routeKey: routeItem.routeKey,
        routeProps: routeItem.routeProps,
        routeOptions: routeItem.routeOptions,
        isNativeRoute: routeConfig?.isNativeRoute ?? false,
      };

      await Promise.all([
        // 1. Wait for new route to be added/init
        this.waitForRoutesToBeAdded([nextRoute]),
        // 2. Append new route to `activeRoutes`
        Helpers.setStateAsync<NavigatorViewState>(this, 
          ({activeRoutes: prevRoutes}) => ({
            activeRoutes: [...prevRoutes, nextRoute]
          })
        )
      ]);

      // forward "push" request to native module
      await Helpers.promiseWithTimeout(timeout,
        RNINavigatorViewModule.push(
          Helpers.getNativeNodeHandle(this.nativeRef),
          nextRoute.routeID, {
            isAnimated: (options?.isAnimated ?? true)
          }
        )
      );

      // reset transition override
      transitionConfig.resetTransition();

      // finished, start next item
      this.setNavStatus(NavStatus.IDLE);
      this.queue.dequeue();

    } catch(e){
      const error = new NavigatorError(e);
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      transitionConfig.resetTransition();
      const syncStats = await this.syncRoutesFromNative();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();
      
      if(!wasAborted || syncStats.didDivergeFromNative) {
        throw error;
      };
    };
  };

  public pop = async (options?: Readonly<NavCommandPopOptions>): Promise<void> => {
    const { activeRoutes } = this.state;

    if(activeRoutes.length < 1){
      throw new NavigatorError({
        code: NavigatorErrorCodes.routeOutOfBounds,
        message: "no routes to pop, the current active route count must be > 1"
      });
    };

    const transitionConfig = this.configureTransitionOverride({
      isPushing: false,
      popConfig: options?.transitionConfig,
    });

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_POPPING);

      // the amount of time to wait for "pop" to resolve before rejecting.
      const timeout = Math.max(transitionConfig.transitionDuration, TIMEOUT_COMMAND);

      // temporarily change the last route's "pop" transition
      await transitionConfig.setTransition();
      transitionConfig.scheduleReset();

      // forward "pop" request to native module
      const result = await Helpers.promiseWithTimeout(timeout,
        RNINavigatorViewModule.pop(
          Helpers.getNativeNodeHandle(this.nativeRef), {
            isAnimated: options?.isAnimated ?? true,
          }
        )
      );

      // remove popped route from `activeRoutes`
      await Helpers.setStateAsync<NavigatorViewState>(this, 
        (prevState) => ({
          activeRoutes: prevState.activeRoutes.filter((route) => !(
            (route.routeIndex === result.routeIndex) &&
            (route.routeKey   === result.routeKey  )
          ))
        })
      );

      // reset transition override
      await transitionConfig.resetTransition();

      this.setNavStatus(NavStatus.IDLE);
      this.queue.dequeue();

    } catch(e){
      const error = new NavigatorError(e);
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      transitionConfig.resetTransition();

      const syncStats = await this.syncRoutesFromNative();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted || syncStats.didDivergeFromNative) {
        throw error;
      };
    };
  };

  public popToRoot = async (options?: Readonly<NavCommandPopOptions>): Promise<void> => {
    const { activeRoutes } = this.state;

    if(activeRoutes.length < 1){
      throw new Error(`\`popToRoot\` failed, route count must be > 1`);
    };

    const transitionConfig = this.configureTransitionOverride({
      isPushing: false,
      popConfig: options?.transitionConfig,
    });

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_POPPING);
      
      // the amount of time to wait for "pop" to resolve before rejecting.
      const timeout = Math.max(transitionConfig.transitionDuration, TIMEOUT_COMMAND);

      // temporarily change the last route's "pop" transition
      await transitionConfig.setTransition();
      transitionConfig.scheduleReset();

      // forward `popToRoot` request to native module
      await Helpers.promiseWithTimeout(timeout,
        RNINavigatorViewModule.popToRoot(
          Helpers.getNativeNodeHandle(this.nativeRef), {
            isAnimated: options?.isAnimated ?? true,
          }
        )
      );

      // remove popped route from `activeRoutes`
      await Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
        ...prevState,
        activeRoutes: [prevState.activeRoutes[0]]
      }));

      // reset transition override
      await transitionConfig.resetTransition();

      this.setNavStatus(NavStatus.IDLE);
      this.queue.dequeue();

    } catch(e){
      const error = new NavigatorError(e);
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      transitionConfig.resetTransition();
      const syncStats = await this.syncRoutesFromNative();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted || syncStats.didDivergeFromNative) {
        throw error;
      };
    };
  };

  public removeRoute = async (
    routeIndex: number, 
    animated = false
  ): Promise<void> => {

    const { activeRoutes } = this.state;

    const routeToBeRemoved = activeRoutes[routeIndex];

    if(activeRoutes.length < 1){
      throw new NavigatorError({
        code: NavigatorErrorCodes.routeOutOfBounds,
        message: "no routes to remove, the current active route count must be > 1"
      });
    };

    if(routeToBeRemoved == null){
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidRouteIndex,
        message: `invalid 'routeIndex' value: ${routeIndex}`
          + " - no matching route could be found for the given value"
      });
    };

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_REMOVING);

      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.removeRoute(
          Helpers.getNativeNodeHandle(this.nativeRef),
          routeToBeRemoved.routeID,
          routeToBeRemoved.routeIndex,
          animated
        )
      );

      // wait a bit so `routeToBeRemoved` can receive the `onRouteDidPop` event
      await Helpers.timeout(100);

      await Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
        ...prevState,
        activeRoutes: prevState.activeRoutes
          // remove route from `activeRoutes`
          .filter(route => (route.routeID !== routeToBeRemoved.routeID))
          // update the route indexes
          .map((route, index) => ({...route, routeIndex: index}))
      }));

      this.setNavStatus(NavStatus.IDLE);
      this.queue.dequeue();

    } catch(e){
      const error = new NavigatorError(e);
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      const syncStats = await this.syncRoutesFromNative();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted || syncStats.didDivergeFromNative) {
        throw error;
      };
    };
  };

  public removeRoutes = async (
    routeIndices: readonly number[],
    animated = false
  ): Promise<void> => {
    
    const { activeRoutes } = this.state;

    if(routeIndices.length === 0){
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidArguments,
        message: "the provided 'routeIndexes' to remove is empty"
      });
    };

    // check if `routeIndexes` are valid
    for (const routeIndex of routeIndices) {
      const item = activeRoutes[routeIndex];

      if(item == null){
        throw new NavigatorError({
          code: NavigatorErrorCodes.invalidRouteIndex,
          message: `invalid 'routeIndexes' value: ${routeIndex}`
            + " - no matching route found the given value"
        });
      };
    };
    
    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_REMOVING);

      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.removeRoutes(
          Helpers.getNativeNodeHandle(this.nativeRef),
          // routes to remove,
          routeIndices.map(routeIndex => ({
            routeIndex,
            routeID: activeRoutes[routeIndex].routeID,
          })),
          animated
        )
      );

      // wait a bit so the routes in `routeIndices` can receive the `onRouteDidPop` event
      await Helpers.timeout(100);

      await Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
        ...prevState,
        activeRoutes: prevState.activeRoutes
          // remove routes from `activeRoutes`
          .filter((_, index) => !routeIndices.some(routeIndex => routeIndex === index))
          // update the route indexes
          .map((route, index) => ({...route, routeIndex: index}))
      }));

      this.setNavStatus(NavStatus.IDLE);
      this.queue.dequeue();

    } catch(e){
      const error = new NavigatorError(e);
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      const syncStats = await this.syncRoutesFromNative();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted || syncStats.didDivergeFromNative) {
        throw error;
      };
    };
  };

  public replaceRoute = async (
    prevRouteIndex: number, 
    routeItem: Readonly<NavRouteItem>, 
    animated = false
  ): Promise<void> => {

    const { activeRoutes } = this.state;

    const routeToReplace         = activeRoutes[prevRouteIndex];
    const replacementRouteConfig = this.getRouteConfig(routeItem.routeKey);

    if(routeToReplace == null){
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidRouteIndex,
        message: `invalid 'prevRouteIndex' value: ${prevRouteIndex}`
          + " - no matching route found for the given value"
      });
    };

    if(replacementRouteConfig == null){
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidRouteKey,
        message: `invalid replacement 'routeKey' value: ${routeItem?.routeKey}`
          + " - no matching route found for the given value"
      });
    };

    const replacementRoute: NavRouteStackItem = {
      routeID: ROUTE_ID_COUNTER++,
      routeKey: routeItem.routeKey,
      routeIndex: prevRouteIndex,
      routeProps: routeItem.routeProps,
      routeOptions: routeItem.routeOptions,
      isNativeRoute: replacementRouteConfig?.isNativeRoute ?? false,
    };

    try {
      // if busy, wait for prev. to finish first...
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_REPLACING);

      await Promise.all([
        // 1. wait for replacement route to be added/init
        this.waitForRoutesToBeAdded([replacementRoute]),
        // 2. replace route in state
        Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
          ...prevState,
          activeRoutes: prevState.activeRoutes.map((route, index) => ({
            ...((routeToReplace.routeID === route.routeID)? replacementRoute : route),
            // overwrite new route index...
            routeIndex: index
          }))
        })),
      ]);

      await Helpers.timeout(500);

      // forward command to native module
      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.replaceRoute(
          Helpers.getNativeNodeHandle(this.nativeRef),
          prevRouteIndex,
          routeToReplace.routeID,
          replacementRoute.routeID,
          animated
        )
      );

      this.setNavStatus(NavStatus.IDLE);
      this.queue.dequeue();

    } catch(e){
      const error = new NavigatorError(e);
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      const syncStats = await this.syncRoutesFromNative();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted || syncStats.didDivergeFromNative) {
        throw error;
      };
    };
  };

  public insertRoute = async (
    routeItem: Readonly<NavRouteItem>, 
    atIndex: number, 
    animated = false
  ) => {

    const state = this.state;
    const routeConfig = this.getRouteConfig(routeItem.routeKey);

    if(!routeConfig){
      // no matching route config found for `routeItem`
      throw new NavigatorError({
        code: NavigatorErrorCodes.invalidRouteKey,
        message: `invalid 'routeKey' value: ${routeItem?.routeKey}`
          + " - no corresponding route could be for the given value"
      });
    };

    if(atIndex > state.activeRoutes.length){
      throw new NavigatorError({
        code: NavigatorErrorCodes.routeOutOfBounds,
        message: `invalid 'atIndex' value: ${atIndex} (out of bounds)`
          + " - the provided 'atIndex' exceeds the total active routes"
      });
    };

    const nextRoute: NavRouteStackItem = {
      routeID: ROUTE_ID_COUNTER++,
      routeKey: routeItem.routeKey,
      routeIndex: atIndex,
      routeProps: routeItem.routeProps,
      routeOptions: routeItem.routeOptions,
      isNativeRoute: routeConfig?.isNativeRoute ?? false,
    };
    
    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;
      
      this.setNavStatus(NavStatus.NAV_INSERTING);

      //#region - 🐞 DEBUG 🐛
      LIB_ENV.debugLog && console.log(
          `LOG/JS - NavigatorView, insertRoute: add route`
        + ` - with routeKey: ${nextRoute.routeKey}`
        + ` - pre-push activeRoutes: ${this.state.activeRoutes.length}`
      );
      //#endregion

      await Promise.all([
        // 1. wait for next route to be added/init
        this.waitForRoutesToBeAdded([nextRoute]),
        // 2. append new route to `activeRoutes`
        Helpers.setStateAsync<NavigatorViewState>(this, 
          ({activeRoutes: prevRoutes}) => ({
            activeRoutes: Helpers.arrayInsert(prevRoutes, atIndex, nextRoute)
              .map((route, index) => ({...route, routeIndex: index}))
          })
        )
      ]);

      // forward command to native module
      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.insertRoute(
          Helpers.getNativeNodeHandle(this.nativeRef),
          nextRoute.routeID,
          atIndex,
          animated
        )
      );
      
      // finished, start next item
      this.setNavStatus(NavStatus.IDLE);
      this.queue.dequeue();

    } catch(e){
      const error = new NavigatorError(e);
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      const syncStats = await this.syncRoutesFromNative();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted || syncStats.didDivergeFromNative) {
        throw error;
      };
    };
  };
  
  // TODO (011): Use this command to replace the other native commands
  // * All the other nav commands (e.g. `removeRoute`, `removeRoutes`, `replaceRoute`,
  //   `popToRoot`, and `insertRoute`) can be updated to use this command instead.
  // * So we'll have 3 kinds of nav commands: 
  //     1. native nav. commands: e.g. `push`, `pop`, and `setRoutes`.
  //     2. nav commands: e.g. nav. commands that are just wrappers around the
  //        the native commands.
  //     3. convenience nav commands: preset nav. commands.
  public setRoutes = async (
    transform: SetRoutesTransformCallback, 
    animated = false
  ): Promise<void> => {

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_UPDATING);

      const currentRoutes = [...this.state.activeRoutes];
      
      const currentRoutesMap = currentRoutes.reduce<Record<number, NavRouteStackItem>>((acc, curr) => {
        acc[curr.routeID] = {...curr};
        return acc;
      }, {} as {[key: number]: NavRouteStackItem});

      const transformResult = transform(
        currentRoutes.map(route => ({
          routeID: route.routeID,
          routeKey: route.routeKey,
        }))
      );

      const nextRoutes: Array<NavRouteStackItem> = transformResult.map((route, index) => {
        const prevRoute = route.routeID && currentRoutesMap[route.routeID];
        
        if(prevRoute){
          return {
            // merge old + new route items
            ...prevRoute, ...route,
            // assign new routeIndex
            routeIndex: index,
          };

        } else {
          const routeConfig = this.getRouteConfig(route.routeKey);

          if(routeConfig == null){
            throw new NavigatorError({
              code: NavigatorErrorCodes.invalidRouteKey,
              message: "the transform callback returned an invalid route key."
                + ` - no matching route found for the given 'routeKey': ${route.routeKey}`
            });
          };

          return {
            ...route,
            // assign a routeID since it's a new route
            routeID: ROUTE_ID_COUNTER++,
            // assign a routeIndex
            routeIndex: index,
            isNativeRoute: routeConfig.isNativeRoute ?? false,
          };
        };
      });

      // get nextRoutes items that aren't mounted/added yet
      const nextRoutesNew = nextRoutes.filter(nextRoute => (
        !currentRoutes.some(currentRoute => (
          currentRoute.routeID === nextRoute.routeID
        ))
      ));

      //#region - 🐞 DEBUG 🐛
      LIB_ENV.debugLog && console.log(
          `LOG/JS - NavigatorView, setRoutes`
        + ` - current routes: ${currentRoutes}`
        + ` - next routes: ${nextRoutes}`
        + ` - new routes: ${nextRoutesNew}`
      );
      //#endregion
      
      await Promise.all([
        // 1. wait for the new route items to mount (if any)
        this.waitForRoutesToBeAdded(nextRoutesNew),
        // 2. update the state route items
        Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
          activeRoutes: nextRoutes
        })
      ]);

      // forward command to native module
      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.setRoutes(
          Helpers.getNativeNodeHandle(this.nativeRef),
          nextRoutes.map(route => route.routeID),
          animated
        )
      );

      // finished, start next item
      this.setNavStatus(NavStatus.IDLE);
      this.queue.dequeue();

    } catch(e){
      const error = new NavigatorError(e);
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      const syncStats = await this.syncRoutesFromNative();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted || syncStats.didDivergeFromNative) {
        throw error;
      };
    };
  };

  public setNavigationBarHidden = async (
    isHidden: boolean, 
    animated: boolean
  ): Promise<void> => {

    try {
      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.setNavigationBarHidden(
          Helpers.getNativeNodeHandle(this.nativeRef),
          isHidden, animated
        )
      );

    } catch(e){
      const error = new NavigatorError(e);
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted) {
        throw error;
      };
    };
  };

  // Convenience Navigation Commands
  // -------------------------------

  public replacePreviousRoute = async (
    routeItem: Readonly<NavRouteItem>, 
    animated = false
  ) => {
    
    const { activeRoutes } = this.state;
    const lastRouteIndex = activeRoutes.length - 1;

    await this.replaceRoute(lastRouteIndex - 1, routeItem, animated);
  };

  public replaceCurrentRoute = async (
    routeItem: Readonly<NavRouteItem>, 
    animated = false
  ): Promise<void> => {

    const { activeRoutes } = this.state;
    const lastRouteIndex = activeRoutes.length - 1;

    await this.replaceRoute(lastRouteIndex, routeItem, animated);
  };

  public removePreviousRoute = async (animated = false): Promise<void> => {
    const { activeRoutes } = this.state;
    const lastRouteIndex = activeRoutes.length - 1;

    await this.removeRoute(lastRouteIndex - 1, animated);
  };

  public removeAllPrevRoutes = async (animated = false): Promise<void> => {
    const { activeRoutes } = this.state;
    const lastRouteIndex = activeRoutes.length - 1;

    const routesToRemove = activeRoutes
      .slice(0, lastRouteIndex)
      .map((_, index) => index);

    await this.removeRoutes(routesToRemove, animated);
  };

  // Misc. Navigation Commands
  // -------------------------

  /** 
   * Based on the provided `routeDetails`, return its corresponding 
   * `NavRouteStackItem`.
   * 
   * Returns `undefined` if no matching `NavRouteStackItem` were found,
   * or if the provided `routeDetails` are invalid/conflict with one another.
   * */
  public getRouteStackItem(
    routeDetails: NavRouteStackItemPartialMetadata
  ): NavRouteStackItem | undefined {

    const state = this.state;
    let stackItem: NavRouteStackItem | undefined;

    // A - Get stackItem
    // * Based on the stackItem, get the corresponding stackItem
    
    if(routeDetails.routeID != null){
      stackItem = state.activeRoutes
        .find(item => item.routeIndex === routeDetails.routeIndex);
    };
    
    if(stackItem != null && routeDetails.routeIndex != null){
      stackItem = state.activeRoutes
        .find(item => item.routeIndex === routeDetails.routeIndex);
    };

    if(stackItem != null && routeDetails.routeKey != null){
      stackItem = state.activeRoutes
        .find(item => item.routeKey === routeDetails.routeKey);
    };

    // B - Verify if stackItem matches routeDetails
    // * Only verify the routeDetails properties if they were provided 

    if(stackItem == null) return undefined;

    const didMatchRouteID = (routeDetails.routeID == null) 
      ? true : routeDetails.routeID === stackItem.routeID;

    const didMatchRouteKey = (routeDetails.routeKey == null) 
      ? true : routeDetails.routeKey === stackItem.routeKey;

      const didMatchRouteIndex = (routeDetails.routeIndex == null) 
      ? true : routeDetails.routeIndex === stackItem.routeIndex;

    const didStackItemMatchRouteDetails = 
      (didMatchRouteID && didMatchRouteKey && didMatchRouteIndex);

    return didStackItemMatchRouteDetails ? stackItem : undefined;
  };

  /** 
   * Based on the provided `routeDetails`, return its corresponding 
   * `NavigationObject`.
   * 
   * Returns `undefined` if no matching `NavigationObject` were found,
   * or if the provided `routeDetails` are invalid/conflict with one another.
   * */
  getNavigationObjectForRoute(
    routeDetails: NavRouteStackItemPartialMetadata
  ): NavigationObject | undefined {

    return this.getRefToRouteView(routeDetails)
      ?.getRouteNavigationObject();
  };

  public sendCustomCommandToNative = async (
    commandKey: string, 
    commandData: Readonly<object> | null = null
  ): Promise<object | null> => {

    return await RNINavigatorViewModule.sendCustomCommandToNative(
      Helpers.getNativeNodeHandle(this.nativeRef),
      commandKey,
      commandData
    );
  };

  public getNavigatorConstants = async (): Promise<NavigatorConstantsObject> => {
    try {
      const result = await Helpers.promiseWithTimeout(1000,
        RNINavigatorViewModule.getNavigatorConstants(
          Helpers.getNativeNodeHandle(this.nativeRef)
        )
      );

      return result;

    } catch(e){
      throw new NavigatorError(e);
    };
  };

  public dismissModal = async (animated = true) => {
    await RNINavigatorViewModule.dismissModal(
      Helpers.getNativeNodeHandle(this.nativeRef),
      animated
    );
  };
  //#endregion

  //#region - Handlers
  private _handleRouteViewWrapperRef = (ref: NavigatorRouteView | null, route: NavRouteStackItem) => {
    this.routeRefMap[route.routeID] = ref!;
  };

  private _handleOnNavRouteViewAdded: OnNavRouteViewAddedEvent = (event) => {
    if(this.navigatorID !== event.nativeEvent.navigatorID) return;

    // emit event: nav. route was added to `RNINavigatorView`'s subviews
    this.emitter.emit(NavigatorViewEvents.onNavRouteViewAdded, event);
  };

  private _handleOnSetNativeRoutes: OnSetNativeRoutesEvent = (event) => {
    if(this.navigatorID !== event.nativeEvent.navigatorID) return;

    // emit event: route data was set for the native routes
    this.emitter.emit(NavigatorViewEvents.onSetNativeRoutes, event);
  };

  private _handleOnNativeCommandRequest: OnNativeCommandRequestEvent = async ({nativeEvent}) => {
    if(this.navigatorID !== nativeEvent.navigatorID) return;
    
    const { commandData } = nativeEvent;

    //#region - 🐞 DEBUG 🐛
    LIB_ENV.debugLog && console.log(
        `LOG/JS - NavigatorView, _handleOnNativeCommandRequest`
      + `commandKey: ${nativeEvent.commandData.commandKey}`
      + `commandData: ${JSON.stringify(nativeEvent.commandData)}`
    );
    //#endregion
    
    switch (commandData.commandKey) {
      // TODO (012): Move to sep. function
      case 'pushViewController':
        try {
          // if busy, wait for prev. to finish
          const queue = this.queue.schedule();
          await queue.promise;

          const { activeRoutes } = this.state;

          const nextRouteIndex = activeRoutes.length;
          this.setNavStatus(NavStatus.NAV_PUSHING);

          const nextRoute: NavRouteStackItem = {
            routeID: commandData.routeID,
            routeKey: commandData.routeKey,
            routeIndex: nextRouteIndex,
            isNativeRoute: true,
          };

          await Promise.all([
            // 1. wait for the native route to be init
            this.waitForRoutesToBeAdded([nextRoute]),
            // 2. Append new route to `activeRoutes`
            Helpers.setStateAsync<NavigatorViewState>(this,
              ({activeRoutes: prevRoutes}) => ({
                activeRoutes: [...prevRoutes, nextRoute]
              })
            )
          ]);

          // forward "push" request to native module
          await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
            RNINavigatorViewModule.push(
              Helpers.getNativeNodeHandle(this.nativeRef),
              nextRoute.routeID, {
                isAnimated: commandData.isAnimated
              }
            )
          );

          // finished, start next item
          this.setNavStatus(NavStatus.IDLE);
          this.queue.dequeue();

        } catch(e) {
          const error = new NavigatorError(e);
          const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

          const syncStats = await this.syncRoutesFromNative();

          this.setNavStatus(NavStatus.IDLE_ERROR);
          this.queue.dequeue();

          if(!wasAborted || syncStats.didDivergeFromNative) {
            throw error;
          };
        };
        break;

      case 'push':
        await this.push({
          routeKey  : commandData.routeKey,
          routeProps: commandData.routeProps,
        }, {
          isAnimated: commandData.isAnimated,
        });
        break;
      
      case 'pop':
        await this.pop({
          isAnimated: commandData.isAnimated,
        })
        break;
    };
  };

  private _handleOnCustomCommandFromNative: OnCustomCommandFromNativeEvent = (event) => {
    if(this.navigatorID !== event.nativeEvent.navigatorID) return;
    this.props.onCustomCommandFromNative?.(event);
  };

  private _handleOnNavRouteWillPop: OnNavRoutePopEvent = ({nativeEvent}) => {
    if(this.navigatorID !== nativeEvent.navigatorID) return;

    const { onNavRouteWillPop } = this.props;
    onNavRouteWillPop && onNavRouteWillPop({nativeEvent});

    if(!NavigatorViewUtils.isNavStateIdle(this.navStatus)){
      this.setNavStatus(NavStatus.NAV_ABORT);
    };
  };

  private _handleOnNavRouteDidPop: OnNavRoutePopEvent = ({nativeEvent}) => {
    if(this.navigatorID !== nativeEvent.navigatorID) return;

    this.emitter.emit('onNavRouteDidPop', {nativeEvent});

    const { onNavRouteDidPop } = this.props;
    onNavRouteDidPop && onNavRouteDidPop({nativeEvent});

    //#region - 🐞 DEBUG 🐛
    LIB_ENV.debugLog && console.log(
        `LOG/JS - NavigatorView, onNavRouteDidPop`
      + ` - with args, routeKey: ${nativeEvent.routeKey}`
      + ` - routeIndex: ${nativeEvent.routeIndex}`
    );
    //#endregion

    // * A route has been removed either through a tap on the "back" 
    //   button, or through a swipe back gesture.
    // * As such, the route has to be removed from `state.activeRoutes`.
    if(nativeEvent.isUserInitiated){

      // * In iOS 13+, multiple routes can be removed at once via the back button context menu.
      // * This results in multiple calls to `_handleOnNavRouteDidPop`.
      // * To fix this, there's a special version of `removeRoute` that removes routes in batches.
      if(iOSVersion >= 13){
        this.removeRouteBatchedFromState({
          routeKey  : nativeEvent.routeKey,
          routeIndex: nativeEvent.routeIndex
        });

      } else {
        this.removeRoute(nativeEvent.routeIndex);
      };
    };
  };

  private _handleOnUIConstantsDidChange: OnUIConstantsDidChangeEvent = ({nativeEvent}) => {
    if(this.navigatorID !== nativeEvent.navigatorID) return;
    
    this.props.onUIConstantsDidChange?.({nativeEvent});
    
    this.setState({
      safeAreaInsets : nativeEvent.safeAreaInsets,
      statusBarHeight: nativeEvent.statusBarHeight,
      navigatorSize  : nativeEvent.navigatorSize,
    });
  };

  private _handleOnNavRouteDidShow: OnNavRouteDidShowEvent = ({nativeEvent}) => {
    if(this.navigatorID !== nativeEvent.navigatorID) return;

    this.props.onNavRouteDidShow?.({nativeEvent});
    this.emitter.emit('onNavRouteDidShow', {nativeEvent});
  };
  //#endregion

  private _renderRoutes(){
    const props = this.props;
    const state = this.state;

    // * Get the `state.activeRoutes` sorted by their `routeID`, such that the
    //   routes are ordered from oldest to newest.
    // * Supposedly, when reordering comps, as long as the key of a comp. does
    //   not change, the comps. should be "preserved", but When replacing the 1st 
    //   route (i.e. replacing `state.activeRoutes[0]`), it causes all the other 
    //   routes to disappear.
    // * Specifically, it triggers `componentWillUnmount` for all the other 
    //   active routes (even though there aren't any changes to their props/keys).
    // * This then triggers `vc.didMove(toParent: nil`) in the native side,
    //   which then triggers the cleanup/remove process.
    // * This bug has something to do with the re-ordering of components, causing
    //   the comps. to be "recreated" from scratch.
    // * So this is a temp. workaround to prevent the unnecessary reordering of the
    //   comps., the downside is that the routes need to be sorted on every render...
    const activeRoutes = this.getRoutesToRender();

    const activeRoutesCount     = activeRoutes.length;
    const activeRoutesLastIndex = activeRoutesCount - 1;

    return activeRoutes.map(route => {
      // the routes from `activeRoutes` will only ever have js/react routes
      const routeConfig = this.getRouteConfig(route.routeKey) as NavRouteConfigItemJS;

      const isLast         = route.routeIndex === activeRoutesLastIndex;
      const isSecondToLast = route.routeIndex === (activeRoutesLastIndex - 1);

      const initialRouteProps = Helpers.shallowMergeObjects(
        routeConfig.initialRouteProps,
        props.sharedRouteProps
      );

      return (
        <NavigatorRouteViewWrapper
          key={`routeID-${route.routeID}`}
          innerRef={this._handleRouteViewWrapperRef}
          navigatorID={this.navigatorID}
          routeID={route.routeID}
          routeIndex={route.routeIndex}
          routeKey={route.routeKey}
          currentActiveRouteIndex={activeRoutesLastIndex}
          route={route}
          routeConfig={routeConfig}
          // merge routeProps
          routeProps={Helpers.shallowMergeObjects(
            initialRouteProps,
            route.routeProps
          )}
          // merge routeOptions
          routeOptionsDefault={Helpers.shallowMergeObjects(
            routeConfig.routeOptionsDefault,
            route.routeOptions
          )}
          // Note: the prev. route's push transition config 
          // determines the next route's push transition
          transitionConfigPushOverride={(isSecondToLast
            ? state.transitionConfigPushOverride ?? null
            : null
          )}
          transitionConfigPopOverride ={(isLast
            ? state.transitionConfigPopOverride 
            : null
          )}
          getRefToNavigator={this._handleGetRefToNavigator}
          renderDefaultNavBarLeftItem={props.renderNavBarLeftItem}
          renderDefaultNavBarRightItem={props.renderNavBarRightItem}
          renderDefaultNavBarTitleItem={props.renderNavBarTitleItem}
        />
      );
    });
  };
  
  render(){
    const {
      isInteractivePopGestureEnabled,
      shouldSwizzleRootViewController,
      navBarPrefersLargeTitles,
      navBarAppearance,
      isNavBarTranslucent,
      disableTransparentNavBarScrollEdgeAppearance,
      initialRoutes,
      renderNavBarBackground,
      ...viewProps
    } = this.props;

    const state = this.state;

    const style = (viewProps.style == null) 
      ? styles.navigatorView 
      : [styles.navigatorView, viewProps.style];

    //#region - 🐞 DEBUG 🐛
    LIB_ENV.debugLogRender && console.log(
        `LOG/JS - NavigatorView, render`
      + ` - navigatorID: ${this.navigatorID}`
    );
    //#endregion

    return (
      <RNINavigatorView 
        ref={r => { this.nativeRef = r! }}
        navigatorID={this.navigatorID}
        style={style}
        // General config
        isInteractivePopGestureEnabled={isInteractivePopGestureEnabled ?? true}
        shouldSwizzleRootViewController={shouldSwizzleRootViewController ?? true}
        disableTransparentNavBarScrollEdgeAppearance={disableTransparentNavBarScrollEdgeAppearance ?? true}
        nativeRoutes={this.getNativeRoutes()}
        initialRouteKeys={
          initialRoutes.map(route => route.routeKey)
        }
        // Navigation Bar customization
        isNavBarTranslucent={isNavBarTranslucent ?? true}
        navBarPrefersLargeTitles={navBarPrefersLargeTitles ?? true}
        navBarAppearance={navBarAppearance}
        // event handlers: push/pop
        onNavRouteWillPop={this._handleOnNavRouteWillPop}
        onNavRouteDidPop={this._handleOnNavRouteDidPop}
        onNavRouteViewAdded={this._handleOnNavRouteViewAdded}
        onSetNativeRoutes={this._handleOnSetNativeRoutes}
        onNativeCommandRequest={this._handleOnNativeCommandRequest}
        onCustomCommandFromNative={this._handleOnCustomCommandFromNative}
        onUIConstantsDidChange={this._handleOnUIConstantsDidChange}
        onNavRouteWillShow={this._handleOnNavRouteDidShow}
        onNavRouteDidShow={this._handleOnNavRouteDidShow}
        {...viewProps}
      >
        <NavigatorUIConstantsContext.Provider value={{
          safeAreaInsets : state.safeAreaInsets,
          statusBarHeight: state.statusBarHeight,
          navigatorSize  : state.navigatorSize,
        }}>
          {this._renderRoutes()}
          {renderNavBarBackground && (
            <RNIWrapperView
              style={styles.navBarBackgroundContainer} 
              nativeID={NativeIDKeys.NavBarBackground}
            >
              {renderNavBarBackground()}
            </RNIWrapperView>
          )}
        </NavigatorUIConstantsContext.Provider>
      </RNINavigatorView>
    );
  };
};

/** Utilities for `NavigatorView` */
class NavigatorViewUtils {
  static sortByRouteIndex<T>(routes: Array<T & {routeIndex: number}>){
    return routes.sort((a, b) => 
      (a.routeIndex - b.routeIndex)
    );
  };

  static isNavStateIdle(navStatus: NavStatus){
    return (
      navStatus === NavStatus.IDLE       ||
      navStatus === NavStatus.IDLE_INIT  ||
      navStatus === NavStatus.IDLE_ERROR ||
      navStatus === NavStatus.NAV_ABORT
    );
  };

  static wasAborted(navStatus: NavStatus){
    return (
      navStatus === NavStatus.UNMOUNTED   ||
      navStatus === NavStatus.NAV_ABORT   ||
      navStatus === NavStatus.NAV_POPPING 
    );
  };

  static isNavStateBusy(navStatus: NavStatus){
    return !NavigatorViewUtils.isNavStateIdle(navStatus);
  };

  static getNativeRouteKeys() {
    return new Promise<Record<string, string>>(resolve => {
      RNINavigatorViewModule.getNativeRouteKeys(keys => {
        resolve(keys.reduce((acc, curr) => {
          acc[curr] = curr;
          return acc;
        }, {} as Record<string, string>))
      });
    });
  };
};

// init. `nativeRouteKeys`
NavigatorViewUtils.getNativeRouteKeys().then(keys => {
  nativeRouteKeys = keys;
});

const styles = StyleSheet.create({
  navigatorView: {
    flex: 1,
  },
  navBarBackgroundContainer: {
    position: 'absolute',
  },
});
