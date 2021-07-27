import React, { ReactElement } from 'react';
import { Platform, StyleSheet, ViewStyle } from 'react-native';

import { RNIWrapperView } from '../native_components/RNIWrapperView';
import { NativeRouteMap, RNINavigatorView, RNINavigatorViewProps } from '../native_components/RNINavigatorView';
import { NavigatorConstantsObject, RNINavigatorViewModule } from '../native_modules/RNINavigatorViewModule';

import { NavigatorRouteView } from './NavigatorRouteView';

import { NavigatorUIConstantsContext } from '../context/NavigatorUIConstantsContext';

import type { NavCommandPopOptions, NavCommandPushOptions, RouteTransitionPopConfig, RouteTransitionPushConfig } from '../types/NavigationCommands';
import type { NavRouteItem, NavRouteStackItem, NavRouteStackPartialItem } from '../types/NavRouteItem';
import type { RenderNavItem } from '../types/NavTypes';
import type { NavRouteConfigItem, NavRouteConfigItemJS } from '../types/NavRouteConfigItem';

import { NavigatorViewEventEmitter, NavigatorViewEvents } from '../types/NavigatorViewEventEmitter';

import type { OnUIConstantsDidChangeEventObject, OnNavRouteViewAddedEvent, OnSetNativeRoutesEvent, OnNativeCommandRequestEvent, OnNavRoutePopEvent, OnUIConstantsDidChangeEvent, OnCustomCommandFromNativeEvent } from '../types/RNINavigatorViewEvents';

import * as Helpers from '../functions/Helpers';

import { TSEventEmitter } from '../functions/TSEventEmitter';
import { SimpleQueue } from '../functions/SimpleQueue';

import { NativeIDKeys } from '../constants/LibraryConstants';


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

// TODO: Move to types/InternalTypes
type NavRouteConfigItemExtended = NavRouteConfigItem & {
  routeKey: NavRouteItem['routeKey'];
};

export type SetRoutesTransformCallback = 
  (currentRoutes: Array<NavRouteStackPartialItem>) => Array<NavRouteStackPartialItem>;

export type NavRoutesConfigMap = { [k: string]: NavRouteConfigItem };

/** `NavigatorView` comp. props */
export type NavigatorViewProps = Partial<Pick<RNINavigatorViewProps,
  // mirror props from `RNINavigatorViewProps`
  | 'isInteractivePopGestureEnabled' 
  | 'shouldSwizzleRootViewController'
  | 'navBarPrefersLargeTitles' 
  | 'navBarAppearance' 
  | 'isNavBarTranslucent'
  // events
  | 'onCustomCommandFromNative'
  | 'onNavRouteWillPop'
  | 'onNavRouteDidPop'
>> & {
  style?: ViewStyle;

  // Nav. Route Config
  routes: NavRoutesConfigMap;
  initialRoutes: Array<NavRouteItem>;
  routeContainerStyle?: ViewStyle;
  
  // `RNINavigatorView` - Default Navbar items
  renderNavBarLeftItem ?: RenderNavItem;
  renderNavBarRightItem?: RenderNavItem;
  renderNavBarTitleItem?: RenderNavItem;

  renderNavBarBackground?: () => ReactElement;
};

/** `NavigatorView` comp. state */
type NavigatorViewState = Partial<Pick<OnUIConstantsDidChangeEventObject['nativeEvent'],
  | 'statusBarHeight'
  | 'safeAreaInsets'
>> & {
  activeRoutes: Array<NavRouteStackItem>;

  // push/pop override config
  transitionConfigPushOverride?: RouteTransitionPushConfig;
  transitionConfigPopOverride ?: RouteTransitionPopConfig;
};
//#endregion

const TIMEOUT_MOUNT   = 750;
const TIMEOUT_COMMAND = 1500;

const iOSVersion = parseInt(Platform.Version as string, 10);

let NAVIGATOR_ID_COUNTER = 0;
let ROUTE_ID_COUNTER     = 0;

let nativeRouteKeys: Record<string, string> = {};

export class NavigatorView extends React.PureComponent<NavigatorViewProps, NavigatorViewState> {
  
  //#region - Property Declarations
  state: NavigatorViewState;

  /** A ref to the `RNINavigatorView` native component. */
  nativeRef: React.Component;

  /** Unique identifier for this navigator */
  private navigatorID: number;
  
  private navStatus: NavStatus;
  private emitter: NavigatorViewEventEmitter;

  /** Used for `removeRouteBatchedFromState`*/
  private routesToRemove: Array<{routeKey: string, routeIndex: number}>;

  /** Queue for nav. commands: only 1 command is called at a time */
  private queue: SimpleQueue;

  // note: the key should be the routeID
  private routeRefMap: {[key: number]: NavigatorRouteView} = {};
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
    };
  };

  componentWillUnmount(){
    this.setNavStatus(NavStatus.UNMOUNTED);
    this.queue.clear();
  };

  //#region - Private Functions
  private verifyProps = () => {
    const props = this.props;

    if(props.routes == null) throw new Error(
      'The NavigatorView.routes prop cannot be empty.'
    );

    if(typeof props.routes !== 'object' || Array.isArray(props.routes)) throw new Error(
      'The value passed to the NavigatorView.routes prop must be an object.'
    );

    const routeKeys = Object.keys(props.routes);

    if(routeKeys.length === 0) throw new Error(
        'The NavigatorView.routes prop cannot be an empty object.'
      + ' There must be at least one valid route.'
    );

    for (const routeKey of routeKeys) {
      const routeConfig = props.routes[routeKey];

      // skip native routes...
      if(routeConfig.isNativeRoute) continue;

      if(routeConfig.renderRoute == null) throw new Error(
          `Invalid route config for ${routeKey} in NavigatorView.routes prop.`
        + ` Missing 'renderRoute' function (all JS routes must have a component to render).`
      );
      
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
      throw new Error(`'NavigatorView' error: Invalid value given to 'initialRoutes' prop.`);
    };

    return initialRoutes.map((route, index) => {
      const config = this.getRouteConfig(route.routeKey);

      // guard: no matching route config found for `routeKey`
      if(config == null){
        throw new Error(
            "'NavigatorView' error: invalid value for 'initialRoutes' prop"
          + ` - no matching route found for 'routeKey': ${route.routeKey}.`
          + " All routes must be declared in the routes prop."
          + " If this is a native route, please add it to the 'routes' prop w/"
          + " the 'isNativeRoute' property set to true."
        );
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
        routeOptions: (config as NavRouteConfigItemJS).routeOptionsDefault,
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

  private setNavStatus(navStatus: NavStatus){
    if(this.navStatus !== NavStatus.UNMOUNTED){
      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, setNavStatus`
        + ` - next status: ${navStatus}`
        + ` - current status: ${this.navStatus}`
      );
      //#endregion
      this.navStatus = navStatus;
    };
  };

  /** used to set/reset the transition override for the current route  */
  private configureTransitionOverride = (params: {
    isPushing: boolean;
    pushConfig?: RouteTransitionPushConfig;
    popConfig?: RouteTransitionPopConfig;
  }) => {

    const hasTransitionConfig = (
      params.pushConfig != null ||
      params.popConfig  != null 
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
      throw new Error(
          `The transition duration of ${transitionDuration} sec. is too long`
        + " - reminder: specify duration in seconds (ex: 0.5), not in ms (ex: 500)"
      );
    };

    return({
      // add some wiggle room
      transitionDuration: (transitionDuration + 250),
      setTransition: async () => {
        if(hasTransitionConfig){
          await Promise.all([
            // temp bugfix: delay so that pop transition config is set/received
            // from native.
            params.isPushing? null : Helpers.timeout(100),
            // temporarily override the last route's push/pop transition
            Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
              transitionConfigPushOverride: params.pushConfig,
              transitionConfigPopOverride : params.popConfig ,
            }),
          ])
        };
      },
      resetTransition: async () => {
        if(hasTransitionConfig){
          // remove the push/pop transition override
          await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
            transitionConfigPushOverride: undefined,
            transitionConfigPopOverride : undefined,
          });
        };
      },
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
  private waitForRoutesToBeAdded = (routeItems: Array<NavRouteStackItem>) => {
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
  private waitForRoutesToBeRemoved = (routeItems: Array<NavRouteStackItem>) => {
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

  private createStateSnapshot = () => {
    let stateSnapshot: NavigatorViewState | null = null;

    return {
      save: () => {
        stateSnapshot = { ...this.state };
      },
      restore: () => {
        const isMounted = this.navStatus !== NavStatus.UNMOUNTED;
        if(stateSnapshot != null && isMounted){
          this.setState(stateSnapshot);
          stateSnapshot = null;
        };
      },
      clear: () => {
        stateSnapshot = null;
      },
    };
  };

  /** Remove route from `state.activeRoutes` in batches a few ms apart. */
  private removeRouteBatchedFromState = async (params?: { routeKey: string, routeIndex: number }) => { 
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
      LIB_GLOBAL.debugLog && console.log(
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
    routeItem: NavRouteItem, 
    options?: NavCommandPushOptions
  ): Promise<void> => {
    
    const stateSnapshot = this.createStateSnapshot();
    const routeConfig   = this.getRouteConfig(routeItem.routeKey);

    if(!routeConfig){
      // no matching route config found for `routeItem`
      throw new Error(
        `NavigatorView' failed to do: 'push', invalid 'routeKey': ${routeItem.routeKey}`
      );
    };
    
    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      const { activeRoutes } = this.state;
      this.setNavStatus(NavStatus.NAV_PUSHING);

      stateSnapshot.save();

      const transitionConfig = this.configureTransitionOverride({
        isPushing: true,
        pushConfig: options?.transitionConfig,
      });

      // the amount of time to wait for "push" to resolve before rejecting.
      const timeout = Math.max(
        transitionConfig.transitionDuration, TIMEOUT_COMMAND
      );

      // temporarily override the last route's "push" transition
      await transitionConfig.setTransition();

      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, push: add route`
        + ` - with routeKey: ${routeItem.routeKey}`
        + ` - current activeRoutes: ${this.state.activeRoutes.length}`
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
      stateSnapshot.clear();

    } catch(error){
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);
      stateSnapshot.restore();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted) {
        throw new Error(`'NavigatorView' failed to do: 'push' with error: ${error}`);
      };
    };
  };

  public pop = async (options?: NavCommandPopOptions): Promise<void> => {
    const { activeRoutes } = this.state;
    const stateSnapshot = this.createStateSnapshot();

    if(activeRoutes.length < 1){
      throw new Error(`'pop' failed, active route count must be > 1`);
    };

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_POPPING);
      stateSnapshot.save();

      const transitionConfig = this.configureTransitionOverride({
        isPushing: false,
        popConfig: options?.transitionConfig,
      });

      // the amount of time to wait for "pop" to resolve before rejecting.
      const timeout = Math.max(transitionConfig.transitionDuration, TIMEOUT_COMMAND);

      // temporarily change the last route's "pop" transition
      await transitionConfig.setTransition();

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
      stateSnapshot.clear();

    } catch(error){
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);
      stateSnapshot.restore();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted) {
        throw new Error(`'NavigatorView' failed to do: 'pop' with error: ${error}`);
      };
    };
  };

  public popToRoot = async (options?: NavCommandPopOptions): Promise<void> => {
    const { activeRoutes } = this.state;
    const stateSnapshot = this.createStateSnapshot();

    if(activeRoutes.length < 1){
      throw new Error(`\`popToRoot\` failed, route count must be > 1`);
    };

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_POPPING);
      stateSnapshot.save();

      const transitionConfig = this.configureTransitionOverride({
        isPushing: false,
        popConfig: options?.transitionConfig,
      });

      // the amount of time to wait for "pop" to resolve before rejecting.
      const timeout = Math.max(transitionConfig.transitionDuration, TIMEOUT_COMMAND);

      // temporarily change the last route's "pop" transition
      await transitionConfig.setTransition();

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
      stateSnapshot.clear();

    } catch(error){
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);
      stateSnapshot.restore();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted) {
        throw new Error(`'NavigatorView' failed to do: 'popToRoot' with error: ${error}`);
      };
    };
  };

  public removeRoute = async (
    routeIndex: number, 
    animated = false
  ): Promise<void> => {

    const { activeRoutes } = this.state;
    const stateSnapshot = this.createStateSnapshot();

    const routeToBeRemoved = activeRoutes[routeIndex];

    if(activeRoutes.length < 1){
      throw new Error(`\`removeRoute\` failed, route count must be > 1`);
    };

    if(routeToBeRemoved == null){
      throw new Error(`\`removeRoute\` failed, invalid index: ${routeIndex}`);
    };

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_REMOVING);
      stateSnapshot.save();

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
      stateSnapshot.clear();

    } catch(error){
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);
      stateSnapshot.restore();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted) {
        throw new Error(`'NavigatorView' failed to do: 'removeRoute' with error: ${error}`);
      };
    };
  };

  public removeRoutes = async (
    routeIndices: Array<number>,
    animated = false
  ): Promise<void> => {
    
    const { activeRoutes } = this.state;
    const stateSnapshot = this.createStateSnapshot();

    if(routeIndices.length === 0){
      throw new Error(`'removeRoutes' failed, 'routeIndexes' is empty`);
    };

    // check if `routeIndexes` are valid
    for (const routeIndex of routeIndices) {
      const item = activeRoutes[routeIndex];

      if(item == null){
        throw new Error(`\`removeRoutes\` failed, invalid index: ${routeIndex}`);
      };
    };
    
    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_REMOVING);
      stateSnapshot.save();

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
      stateSnapshot.clear();

    } catch(error){
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);
      stateSnapshot.restore();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted) {
        throw new Error(`'NavigatorView' failed to do: 'removeRoutes' with error: ${error}`);
      };
    };
  };

  public replaceRoute = async (
    prevRouteIndex: number, 
    routeItem: NavRouteItem, 
    animated = false
  ): Promise<void> => {

    const { activeRoutes } = this.state;
    const stateSnapshot = this.createStateSnapshot();

    const routeToReplace         = activeRoutes[prevRouteIndex];
    const replacementRouteConfig = this.getRouteConfig(routeItem.routeKey);

    if(routeToReplace == null){
      throw new Error(`\`replaceRoute\` failed, no route found for the given \`routeIndex\`: ${prevRouteIndex}`);
    };

    if(replacementRouteConfig == null){
      throw new Error(`\`replaceRoute\` failed, no route found for the given \`routeKey\`: ${routeItem?.routeKey}`);
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
      stateSnapshot.save();

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
      stateSnapshot.clear();

    } catch(error){
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);
      stateSnapshot.restore();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted) {
        throw new Error(`'NavigatorView' failed to do: 'removeRoutes' with error: ${error}`);
      };
    };
  };

  public insertRoute = async (
    routeItem: NavRouteItem, 
    atIndex: number, 
    animated = false
  ) => {

    const state = this.state;
    const routeConfig = this.getRouteConfig(routeItem.routeKey);

    if(!routeConfig){
      // no matching route config found for `routeItem`
      throw new Error("`NavigatorView` failed to do: `insertRoute`: Invalid `routeKey`");
    };

    if(atIndex > state.activeRoutes.length){
      throw new Error("`NavigatorView` failed to do: `insertRoute`: Invalid `atIndex` (out of bounds)");
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
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, insertRoute: add route`
        + ` - with routeKey: ${nextRoute.routeKey}`
        + ` - current activeRoutes: ${this.state.activeRoutes.length}`
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

    } catch(error){
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted) {
        throw new Error(`'NavigatorView' failed to do: 'insertRoute' with error: ${error}`);
      };
    };
  };
  
  // TODO: Use this command to replace the other native commands
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
    const stateSnapshot = this.createStateSnapshot();

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.setNavStatus(NavStatus.NAV_UPDATING);
      stateSnapshot.save();

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
            throw new Error(
                'Transform callback returned an invalid route key.'
              + `No matching route config for routeKey: ${route.routeKey}`
            );
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
      LIB_GLOBAL.debugLog && console.log(
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
      stateSnapshot.clear();

    } catch(error){
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);
      stateSnapshot.restore();

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted) {
        throw new Error(`'NavigatorView' failed to do: 'setRoutes' with error: ${error}`);
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

    } catch(error){
      const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

      this.setNavStatus(NavStatus.IDLE_ERROR);
      this.queue.dequeue();

      if(!wasAborted) {
        throw new Error(`'NavigatorView' failed to do: 'setNavigationBarHidden' with error: ${error}`);
      };
    };
  };

  // Convenience Navigation Commands
  // -------------------------------

  public replacePreviousRoute = async (
    routeItem: NavRouteItem, 
    animated = false
  ) => {
    
    const { activeRoutes } = this.state;
    const lastRouteIndex = activeRoutes.length - 1;

    await this.replaceRoute(lastRouteIndex - 1, routeItem, animated);
  };

  public replaceCurrentRoute = async (
    routeItem: NavRouteItem, 
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

  public sendCustomCommandToNative = async (
    commandKey: string, 
    commandData: object | null = null
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

    } catch(error){
      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, getNavigatorConstants`
        + ` - error message: ${error}`
      );
      //#endregion

      throw new Error("`NavigatorView` failed to do: `getNavigatorConstants` - " + error);
    };
  };
  //#endregion

  //#region - Native Event Handlers
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
    LIB_GLOBAL.debugLog && console.log(
        `LOG/JS - NavigatorView, _handleOnNativeCommandRequest`
      + `commandKey: ${nativeEvent.commandData.commandKey}`
      + `commandData: ${JSON.stringify(nativeEvent.commandData)}`
    );
    //#endregion
    
    switch (commandData.commandKey) {
      // TODO: Move to sep. function
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

        } catch(error) {
          const wasAborted = NavigatorViewUtils.wasAborted(this.navStatus);

          this.setNavStatus(NavStatus.IDLE_ERROR);
          this.queue.dequeue();

          if(!wasAborted) {
            throw new Error(
                `'NavigatorView' failed to do: '${commandData.commandKey}'`
              + `with error: ${error}`
            );
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
    LIB_GLOBAL.debugLog && console.log(
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

    this.setState({
      safeAreaInsets : nativeEvent.safeAreaInsets,
      statusBarHeight: nativeEvent.statusBarHeight,
    });
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

      return (
        <NavigatorRouteView
          key={`routeID-${route.routeID}`}
          ref={r => { this.routeRefMap[route.routeID] = r! }}
          navigatorID={this.navigatorID}
          routeID={route.routeID}
          routeIndex={route.routeIndex}
          routeKey={route.routeKey}
          isRootRoute={(route.routeIndex === 0)}
          currentActiveRouteIndex={activeRoutesLastIndex}
          // merge routeProps
          routeProps={Helpers.shallowMergeObjects(
            routeConfig.initialRouteProps,
            route.routeProps
          )}
          // merge routeOptions
          routeOptionsDefault={Helpers.shallowMergeObjects(
            routeConfig.routeOptionsDefault,
            route.routeOptions
          )}
          transitionConfigPushOverride={(isSecondToLast
            ? state.transitionConfigPushOverride ?? null
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
          renderNavBarLeftItem={(params) => (
            routeConfig.renderNavBarLeftItem?.(params) ??
            props      .renderNavBarLeftItem?.(params)
          )}
          renderNavBarRightItem={(params) => (
            routeConfig.renderNavBarRightItem?.(params) ??
            props      .renderNavBarRightItem?.(params)
          )}
          renderNavBarTitleItem={(params) => (
            routeConfig.renderNavBarTitleItem?.(params) ??
            props      .renderNavBarTitleItem?.(params)
          )}
        />
      );
    });
  };
  
  render(){
    const props = this.props;
    const state = this.state;

    const style = (props.style == null) 
      ? styles.navigatorView 
      : [styles.navigatorView, props.style];

    return (
      <RNINavigatorView 
        ref={r => { this.nativeRef = r! }}
        style={style}
        // General config
        navigatorID={this.navigatorID}
        isInteractivePopGestureEnabled={props.isInteractivePopGestureEnabled ?? true}
        shouldSwizzleRootViewController={props.shouldSwizzleRootViewController ?? true}
        nativeRoutes={this.getNativeRoutes()}
        initialRouteKeys={
          props.initialRoutes.map(route => route.routeKey)
        }
        // Navigation Bar customization
        isNavBarTranslucent={props.isNavBarTranslucent ?? true}
        navBarPrefersLargeTitles={props.navBarPrefersLargeTitles ?? true}
        navBarAppearance={props.navBarAppearance}
        // event handlers: push/pop
        onNavRouteWillPop={this._handleOnNavRouteWillPop}
        onNavRouteDidPop={this._handleOnNavRouteDidPop}
        onNavRouteViewAdded={this._handleOnNavRouteViewAdded}
        onSetNativeRoutes={this._handleOnSetNativeRoutes}
        onNativeCommandRequest={this._handleOnNativeCommandRequest}
        onCustomCommandFromNative={this._handleOnCustomCommandFromNative}
        onUIConstantsDidChange={this._handleOnUIConstantsDidChange}
      >
        <NavigatorUIConstantsContext.Provider value={{
          safeAreaInsets: state.safeAreaInsets,
          statusBarHeight: state.statusBarHeight,
        }}>
          {this._renderRoutes()}
          {props.renderNavBarBackground && (
            <RNIWrapperView
              style={styles.navBarBackgroundContainer} 
              nativeID={NativeIDKeys.NavBarBackground}
            >
              {props.renderNavBarBackground()}
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
