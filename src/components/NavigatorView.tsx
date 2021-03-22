import React, { ReactElement } from 'react';
import { StyleSheet, findNodeHandle, ViewStyle } from 'react-native';

import { RNIWrapperView } from '../native_components/RNIWrapperView';
import { NativeRouteMap, onSetNativeRouteDataPayload as onSetNativeRoutesPayload, RNINavigatorView, RNINavigatorViewProps } from '../native_components/RNINavigatorView';
import { RNINavigatorViewModule } from '../native_modules/RNINavigatorViewModule';

import { NavigatorRouteView } from './NavigatorRouteView';

import type { RouteOptions } from '../types/NavTypes';
import type { NavCommandPushOptions, NavRouteItem, RenderNavBarItem, NavCommandPopOptions } from '../types/NavSharedTypes';

import type { RouteContentProps } from '../components/NavigatorRouteView';

import type { onNavRouteDidPopPayload, onNavRouteViewAddedPayload, onNavRouteWillPopPayload } from '../native_components/RNINavigatorView';
import type { RouteTransitionPopConfig, RouteTransitionPushConfig } from '../native_components/RNINavigatorRouteView';

import * as Helpers from '../functions/Helpers';
import { EventEmitter } from '../functions/EventEmitter';
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
  NAV_ABORT_PUSH = "NAV_ABORT_PUSH", // nav. has been popped before push completed
};

enum NavEvents {
  onNavRouteViewAdded = "onNavRouteViewAdded",
  onSetNativeRoutes   = "onSetNativeRoutes"  ,
};

/** Represents a route in the nav. `state.activeRoutes` */
type NavRouteStateItem = NavRouteItem & {
  routeIndex: number;
  routeID: number;
};

type NavRouteConfigItemBase = {
  routeKey: NavRouteItem['routeKey'];
  initialRouteProps?: object;
};

/** Native route */
type NavRouteConfigItemNative = NavRouteConfigItemBase & {
  isNativeRoute: true;
};

/** JS/React route */
type NavRouteConfigItemJS = NavRouteConfigItemBase & {
  isNativeRoute?: false;
  routeOptionsDefault?: RouteOptions;
  renderRoute: (routeItem: NavRouteItem) => ReactElement<RouteContentProps>;
  // render nav bar items
  renderNavBarLeftItem ?: RenderNavBarItem;
  renderNavBarRightItem?: RenderNavBarItem;
  renderNavBarTitleItem?: RenderNavBarItem;
};

export type NavRouteConfigItem = 
  NavRouteConfigItemNative | NavRouteConfigItemJS;

/** `NavigatorView` comp. props */
type NavigatorViewProps = Pick<RNINavigatorViewProps,
  'isInteractivePopGestureEnabled' | 'navBarPrefersLargeTitles' | 
  'navBarAppearance' | 'isNavBarTranslucent'
> & {
  style?: ViewStyle;

  // Nav. Route Config
  routes: Array<NavRouteConfigItem>;
  initialRouteKey: string;
  routeContainerStyle?: ViewStyle;
  
  // `RNINavigatorView` - Global/Default Navbar items
  renderNavBarLeftItem ?: RenderNavBarItem;
  renderNavBarRightItem?: RenderNavBarItem;
  renderNavBarTitleItem?: RenderNavBarItem;

  renderNavBarBackground?: () => ReactElement;
};

/** `NavigatorView` comp. state */
type NavigatorViewState = {
  activeRoutes: Array<NavRouteStateItem>;
  transitionConfigPushOverride?: RouteTransitionPushConfig;
  transitionConfigPopOverride ?: RouteTransitionPopConfig;
};
//#endregion

const TIMEOUT_MOUNT   = 750;
const TIMEOUT_COMMAND = 1000;

let NAVIGATOR_ID_COUNTER = 0;
let ROUTE_ID_COUNTER     = 0;

let nativeRouteKeys: { [key: string]: string } = null;

// init. `nativeRouteKeys`
RNINavigatorViewModule.getNativeRouteKeys(keys => {
  //#region - 🐞 DEBUG 🐛
  LIB_GLOBAL.debugLog && console.log(
      `LOG/JS - NavigatorViewModule, getNativeRouteKeys`
    + ` - keys: ${JSON.stringify(keys)}`
    + ` - typeof keys: ${typeof keys}`
  );
  //#endregion

  nativeRouteKeys = keys.reduce((acc, curr) => {
    acc[curr] = curr;
    return acc;
  }, {} as typeof nativeRouteKeys);
});

export class NavigatorView extends React.PureComponent<NavigatorViewProps, NavigatorViewState> {
  //#region - Property Declarations
  state: NavigatorViewState;

  /** A ref to the `RNINavigatorView` native component. */
  nativeRef: React.Component;

  /** Unique identifier for this navigator */
  private navigatorID: number;
  
  private navStatus: NavStatus;
  private emitter: EventEmitter<NavEvents>;

  /** Used for `removeRouteBatchedFromState`*/
  private routesToRemove: Array<{routeKey: string, routeIndex: number}>;

  /** Queue for nav. commands: only 1 command is called at a time */
  private queue: SimpleQueue;

  // note: the key should be the routeID
  private routeRefMap: {[key: number]: NavigatorRouteView} = {};
  //#endregion

  constructor(props: NavigatorViewProps){
    super(props);

    this.navigatorID = NAVIGATOR_ID_COUNTER++;

    this.navStatus = NavStatus.IDLE_INIT;
    this.routesToRemove = [];

    this.emitter = new EventEmitter<NavEvents>();
    this.queue = new SimpleQueue();

    const initialRoute = this.getRouteConfig(props.initialRouteKey);
    if(!initialRoute){
      // no matching route config found for `initialRouteKey`
      throw new Error("`NavigatorView` error: invalid value for `initialRouteKey` prop"
        + ` - no matching route found for \`initialRouteKey\`: ${props.initialRouteKey}`
      );
    };

    this.state = {
      activeRoutes: [{
        // create initial route item
        routeKey: initialRoute.routeKey,
        routeIndex: 0, 
        routeID: ROUTE_ID_COUNTER++
      }],
      transitionConfigPushOverride: null,
      transitionConfigPopOverride: null,
    };
  };

  componentWillUnmount(){
    this.navStatus == NavStatus.UNMOUNTED;
    this.queue.clear();
  };

  //#region - Private Functions
  private isValidRouteKey = (routeKey: string) => {
    const { routes } = this.props;
    const isNativeRoute = (nativeRouteKeys[routeKey] != null);

    return isNativeRoute || routes.some(route => (
      route.routeKey == routeKey
    ));
  };

  private getNativeRoutes = (): NativeRouteMap => {
    const { activeRoutes } = this.state;

    const nativeRoutes = activeRoutes.filter(route => 
      nativeRouteKeys?.[route.routeKey] != null
    );

    return nativeRoutes.reduce((acc, curr) => {
      acc[curr.routeID] = {
        routeKey  : curr.routeKey,
        routeIndex: curr.routeIndex,
      };

      return acc;
    }, {} as NativeRouteMap);
  };

  private getRoutesToRender = () => {
    // make a copy
    const activeRoutes = [...this.state.activeRoutes];
    
    return activeRoutes
      // only return js/react routes
      .filter(route => nativeRouteKeys?.[route.routeKey] == null)
      // sort by routeID in asc. order
      .sort((a, b) => (a.routeID - b.routeID))
  };

  private getRouteConfig = (routeKey: string): NavRouteConfigItem => {
    const { routes } = this.props;

    const routeConfig = routes.find(item => (item.routeKey == routeKey));

    const nativeRouteKey = nativeRouteKeys?.[routeKey];
    const hasNativeRouteKeyMatch = (nativeRouteKey != null);

    return (!hasNativeRouteKeyMatch)? routeConfig : {
      routeKey,
      isNativeRoute: true,
      initialRouteProps: routeConfig?.initialRouteProps,
    };
  };

  private getLastRouteTransitionDuration = (isPushing: boolean) => {
    const { activeRoutes } = this.state;

    const lastIndex = activeRoutes.length - 1;
    const lastRoute = activeRoutes[lastIndex];

    const lastRouteRef = this.routeRefMap[lastRoute.routeID];
    // if the last route is a native route, then this will be null
    const routeConfig = lastRouteRef?.getRouteOptions();

    return (isPushing
      ? routeConfig?.transitionConfigPush?.duration ?? 0
      : routeConfig?.transitionConfigPop ?.duration ?? 0
    );
  };

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
      throw new Error(`The transition duration of ${transitionDuration} sec. is too big`
        + " - reminder: specify duration in seconds (ex: 0.5), not in ms (ex: 500)"
      );
    };

    return({
      // add some wiggle room
      transitionDuration: (transitionDuration + 250),
      setTransition: async () => {
        if(hasTransitionConfig){
          // temporarily override the last route's push/pop transition
          await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
            transitionConfigPushOverride: params.pushConfig,
            transitionConfigPopOverride : params.popConfig ,
          });
        };
      },
      resetTransition: async () => {
        if(hasTransitionConfig){
          // temporarily override the last route's push/pop transition
          await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
            transitionConfigPushOverride: null,
            transitionConfigPopOverride : null,
          });
        };
      },
    });
  };

  /** 
   * Wait for the react routes to be added as a subview in the native side, and wait fot
   * native routes to be init. with data.
   * note: This promise will reject if the events fail to fire within `TIMEOUT_MOUNT` ms. */
  private waitForRoutes = (routeItems: Array<NavRouteStateItem>) => {
    // filter out react and native routes
    const [nativeRoutes, reactRoutes] = routeItems.reduce((acc, curr) => {
      const isNativeRoute = (nativeRouteKeys[curr.routeKey] != null);
      acc[isNativeRoute? 0 : 1].push(curr.routeID);
      return acc;
    }, [[], []] as [Array<number>, Array<number>]);

    const hasNativeRoutes = nativeRoutes.length > 0;
    
    return Helpers.promiseWithTimeout(TIMEOUT_MOUNT, Promise.all([
      // 1. wait for native routes to be init.
      hasNativeRoutes && new Promise<void>(resolve => {
        this.emitter.once(NavEvents.onSetNativeRoutes, () => {
          resolve();
        });
      }),
      // 2. wait for react routes to be "received" from native
      ...reactRoutes.map(routeID => new Promise<void>(resolve => {
        this.emitter.once(NavEvents.onNavRouteViewAdded, ({nativeEvent}: onNavRouteViewAddedPayload) => {
          if(nativeEvent.routeID == routeID){
            resolve();
          };
        })
      }))
    ]));
  };

  /** Remove route from `state.activeRoutes` */
  private removeRouteBatchedFromState = async (params?: { routeKey: string, routeIndex: number }) => { 
    if(params){
      // To prevent too many state updates, the routes to be removed
      // are queued/grouped, and are removed in batches...
      this.routesToRemove.push(params);
    };

    // trigger remove if:
    const shouldRemove = () => (
      // - A the route to be removed has a valid `routeKey`
      this.isValidRouteKey(params.routeKey) &&
      // - B. there are queued items to remove
      (this.routesToRemove.length > 0)
    );

    // if busy, wait for prev. to finish
    const queue = this.queue.schedule();
    await queue.promise;

    this.navStatus = NavStatus.NAV_POPPING;

    while(shouldRemove()){
      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, removeRouteBatchedFromState`
        + ` - with routeKey: ${params.routeKey}`
        + ` - routeIndex: ${params.routeIndex}`
        + ` - navStatus: ${this.navStatus}`
        + ` - current activeRoutes: ${this.state.activeRoutes.length}`
        + ` - current routesToRemove: ${this.routesToRemove.length}`
        + ` - activeRoutes: ${JSON.stringify(this.state.activeRoutes)}`
      );
      //#endregion
      
      // delay, so `routesToRemove` queue gets filled first
      await Helpers.timeout(200);

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
    };

    this.navStatus = NavStatus.IDLE;
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

    const routeConfig = this.getRouteConfig(routeItem.routeKey);

    if(!routeConfig){
      // no matching route config found for `routeItem`
      throw new Error("`NavigatorView` failed to do: `push`: Invalid `routeKey`");
    };
    
    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      const { activeRoutes } = this.state;
      this.navStatus = NavStatus.NAV_PUSHING;

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

      const nextRoute: NavRouteStateItem = {
        routeID: ROUTE_ID_COUNTER++,
        routeKey: routeItem.routeKey,
        routeOptions: routeItem.routeOptions,
        routeIndex: nextRouteIndex,
        routeProps: (
          routeItem.routeProps ?? 
          routeConfig.initialRouteProps
        ),
      };

      await Promise.all([
        // 1. Wait for new route to be added/init
        this.waitForRoutes([nextRoute]),
        // 2. Append new route to `activeRoutes`
        Helpers.setStateAsync<NavigatorViewState>(this, ({activeRoutes: prevRoutes}) => ({
          activeRoutes: [...prevRoutes, nextRoute]
        }))
      ]);

      // forward "push" request to native module
      await Helpers.promiseWithTimeout(timeout,
        RNINavigatorViewModule.push(
          findNodeHandle(this.nativeRef),
          nextRoute.routeID, {
            isAnimated: (options?.isAnimated ?? true)
          }
        )
      );

      // reset transition override
      transitionConfig.resetTransition();
      
      // finished, start next item
      this.navStatus = NavStatus.IDLE;
      this.queue.dequeue();

    } catch(error){
      const wasAborted = (
        this.navStatus == NavStatus.NAV_ABORT_PUSH ||
        this.navStatus == NavStatus.UNMOUNTED 
      );

      if(!wasAborted) {
        this.navStatus = NavStatus.IDLE_ERROR;
        this.queue.dequeue();

        throw new Error("`NavigatorView` failed to do: `push` with error " + error);
      };
    };
  };

  public pop = async (options?: NavCommandPopOptions): Promise<void> => {
    const { activeRoutes } = this.state;

    if(activeRoutes.length < 1){
      throw new Error(`\`pop\` failed, active route count must be > 1`);
    };

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.navStatus = NavStatus.NAV_POPPING;

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
          findNodeHandle(this.nativeRef), {
            isAnimated: options?.isAnimated ?? true,
          }
        )
      );

      // remove popped route from `activeRoutes`
      await Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
        activeRoutes: prevState.activeRoutes.filter((route) => !(
          (route.routeIndex == result.routeIndex) &&
          (route.routeKey   == result.routeKey  )
        ))
      }));

      // reset transition override
      await transitionConfig.resetTransition();

      this.navStatus = NavStatus.IDLE;
      this.queue.dequeue();

    } catch(error){
      if(this.navStatus != NavStatus.UNMOUNTED){
        this.navStatus = NavStatus.IDLE_ERROR;
        this.queue.dequeue();

        throw new Error("`NavigatorView` failed to do: `pop` with error " + error);
      };
    };
  };

  public popToRoot = async (options?: NavCommandPopOptions): Promise<void> => {
    const { activeRoutes } = this.state;

    if(activeRoutes.length < 1){
      throw new Error(`\`popToRoot\` failed, route count must be > 1`);
    };

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.navStatus = NavStatus.NAV_POPPING;

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
          findNodeHandle(this.nativeRef), {
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

      this.navStatus = NavStatus.IDLE;
      this.queue.dequeue();

    } catch(error){
      if(this.navStatus != NavStatus.UNMOUNTED){
        this.navStatus = NavStatus.IDLE_ERROR;
        this.queue.dequeue();

        throw new Error("`NavigatorView` failed to do: `popToRoot` with error " + error);
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
      throw new Error(`\`removeRoute\` failed, route count must be > 1`);
    };

    if(routeToBeRemoved == null){
      throw new Error(`\`removeRoute\` failed, invalid index: ${routeIndex}`);
    };

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.navStatus = NavStatus.NAV_REMOVING;

      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.removeRoute(
          findNodeHandle(this.nativeRef),
          routeToBeRemoved.routeID,
          routeToBeRemoved.routeIndex,
          animated
        )
      );

      await Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
        ...prevState,
        activeRoutes: prevState.activeRoutes
          // remove route from `activeRoutes`
          .filter(route => (route.routeID != routeToBeRemoved.routeID))
          // update the route indexes
          .map((route, index) => ({...route, routeIndex: index}))
      }));

      this.navStatus = NavStatus.IDLE;
      this.queue.dequeue();

    } catch(error){
      if(this.navStatus != NavStatus.UNMOUNTED){
        this.navStatus = NavStatus.IDLE_ERROR;
        this.queue.dequeue();

        throw new Error(`\`removeRoute\` failed with error: ${error}`);
      };
    };
  };

  public removeRoutes = async (
    routeIndexes: Array<number>,
    animated = false
  ): Promise<void> => {
    
    const { activeRoutes } = this.state;

    if(routeIndexes.length == 0){
      throw new Error(`\`removeRoutes\` failed, \`routeIndexes\` is empty`);
    };

    // check if `routeIndexes` are valid
    for (const routeIndex of routeIndexes) {
      const item = activeRoutes[routeIndex];

      if(item == null){
        throw new Error(`\`removeRoutes\` failed, invalid index: ${routeIndex}`);
      };
    };
    
    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.navStatus = NavStatus.NAV_REMOVING;

      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.removeRoutes(
          findNodeHandle(this.nativeRef),
          // routes to remove,
          routeIndexes.map(routeIndex => ({
            routeIndex,
            routeID: activeRoutes[routeIndex].routeID,
          })),
          animated
        )
      );

      await Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
        ...prevState,
        activeRoutes: prevState.activeRoutes
          // remove routes from `activeRoutes`
          .filter((_, index) => !routeIndexes.some(routeIndex => routeIndex == index))
          // update the route indexes
          .map((route, index) => ({...route, routeIndex: index}))
      }));

      this.navStatus = NavStatus.IDLE;
      this.queue.dequeue();

    } catch(error){
      if(this.navStatus != NavStatus.UNMOUNTED){
        this.navStatus = NavStatus.IDLE_ERROR;
        this.queue.dequeue();

        throw new Error(`\`removeRoute\` failed with error: ${error}`);
      };
    };
  };

  public replaceRoute = async (
    prevRouteIndex: number, 
    routeItem: NavRouteItem, 
    animated = false
  ): Promise<void> => {

    const { activeRoutes } = this.state;

    const routeToReplace         = activeRoutes[prevRouteIndex];
    const replacementRouteConfig = this.getRouteConfig(routeItem.routeKey);

    if(routeToReplace == null){
      throw new Error(`\`replaceRoute\` failed, no route found for the given \`routeIndex\`: ${prevRouteIndex}`);
    };

    if(replacementRouteConfig == null){
      throw new Error(`\`replaceRoute\` failed, no route found for the given \`routeKey\`: ${routeItem?.routeKey}`);
    };

    const replacementRoute: NavRouteStateItem = {
      routeID: ROUTE_ID_COUNTER++,
      routeKey: routeItem.routeKey,
      routeIndex: prevRouteIndex,
      routeOptions: routeItem.routeOptions,
      routeProps: (
        routeItem.routeProps ??
        replacementRouteConfig.initialRouteProps
      ),
    };

    try {
      // if busy, wait for prev. to finish first...
      const queue = this.queue.schedule();
      await queue.promise;

      this.navStatus = NavStatus.NAV_REPLACING;

      await Promise.all([
        // 1. wait for replacement route to be added/init
        this.waitForRoutes([replacementRoute]),
        // 2. replace route in state
        Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
          ...prevState,
          activeRoutes: prevState.activeRoutes.map((route, index) => (
            (routeToReplace.routeID == route.routeID)
              ? { routeIndex: index, ...replacementRoute } 
              : { routeIndex: index, ...route }
          ))
        })),
      ]);

      await Helpers.timeout(500);

      // forward command to native module
      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.replaceRoute(
          findNodeHandle(this.nativeRef),
          prevRouteIndex,
          routeToReplace.routeID,
          replacementRoute.routeID,
          animated
        )
      );

      this.navStatus = NavStatus.IDLE;
      this.queue.dequeue();

    } catch(error){
      if(this.navStatus != NavStatus.UNMOUNTED){
        this.navStatus = NavStatus.IDLE_ERROR;
        this.queue.dequeue();

        throw new Error(`\`replaceRoute\` failed with error: ${error}`);
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

    const nextRoute: NavRouteStateItem = {
      routeID: ROUTE_ID_COUNTER++,
      routeKey: routeItem.routeKey,
      routeIndex: atIndex,
      routeOptions: routeItem.routeOptions,
      routeProps: (
        routeItem.routeProps ??
        routeConfig.initialRouteProps
      ),
    };
    
    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;
      
      this.navStatus = NavStatus.NAV_INSERTING;

      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, insertRoute: add route`
        + ` - with routeKey: ${nextRoute.routeKey}`
        + ` - current activeRoutes: ${this.state.activeRoutes.length}`
      );
      //#endregion

      await Promise.all([
        // 1. wait for next route to be added/init
        this.waitForRoutes([nextRoute]),
        // 2. append new route to `activeRoutes`
        Helpers.setStateAsync<NavigatorViewState>(this, ({activeRoutes: prevRoutes}) => ({
          activeRoutes: Helpers.arrayInsert(prevRoutes, atIndex, nextRoute)
            .map((route, index) => ({...route, routeIndex: index}))
        }))
      ]);

      // forward command to native module
      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.insertRoute(
          findNodeHandle(this.nativeRef),
          nextRoute.routeID,
          atIndex,
          animated
        )
      );
      
      // finished, start next item
      this.navStatus = NavStatus.IDLE;
      this.queue.dequeue();

    } catch(error){
      if(this.navStatus != NavStatus.UNMOUNTED) {
        this.navStatus = NavStatus.IDLE_ERROR;
        this.queue.dequeue();

        throw new Error("`NavigatorView` failed to do: `insertRoute` with error: " + error);
      };
    };
  };
  
  // TODO: Update to support native routes
  // TODO: Use this command to replace the other native commands
  // * All the other nav commands (e.g. `removeRoute`, `removeRoutes`, `replaceRoute`,
  //   `popToRoot`, and `insertRoute`) can be updated to use this command instead.
  // * So we'll have 3 kinds of nav commands: 
  //     1. native nav. commands: e.g. `push`, `pop`, and `setRoutes`.
  //     2. nav commands: e.g. nav. commands that are just wrappers around the
  //        the native commands.
  //     3. convenience nav commands: preset nav. commands.
  public setRoutes = async (
    transform: (currentRoutes: Array<NavRouteItem & {routeID?: number}>) => typeof currentRoutes, 
    animated = false
  ): Promise<void> => {

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.navStatus = NavStatus.NAV_UPDATING;

      const currentRoutes = [...this.state.activeRoutes];
      
      const currentRoutesMap = currentRoutes.reduce<Record<number, NavRouteStateItem>>((acc, curr) => {
        acc[curr.routeID] = {...curr};
        return acc;
      }, {} as {[key: number]: NavRouteStateItem});

      const transformResult = transform(
        currentRoutes.map(route => ({
          routeID: route.routeID,
          routeKey: route.routeKey,
        }))
      );

      const nextRoutes: Array<NavRouteStateItem> = transformResult.map((route, index) => ({
        // merge old + new route items
        ...currentRoutesMap[route.routeID], ...route,
        // assign a routeID if it doesn't have one yet
        routeID: route.routeID ?? ROUTE_ID_COUNTER++,
        // assign new routeIndex
        routeIndex: index,
      }));

      // get nextRoutes items that aren't mounted/added yet
      const nextRoutesNew = nextRoutes.filter(newRoute => (
        !currentRoutes.some(currentRoute => (
          currentRoute.routeID === newRoute.routeID
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
        this.waitForRoutes(nextRoutesNew),
        // 2. update the state route items
        Helpers.setStateAsync<NavigatorViewState>(this, () => ({
          activeRoutes: nextRoutes,
        }))
      ]);

      // forward command to native module
      await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
        RNINavigatorViewModule.setRoutes(
          findNodeHandle(this.nativeRef),
          nextRoutes.map(route => route.routeID),
          animated
        )
      );

      // finished, start next item
      this.navStatus = NavStatus.IDLE;
      this.queue.dequeue();

    } catch(error){
      if(this.navStatus != NavStatus.UNMOUNTED) {
        this.navStatus = NavStatus.IDLE_ERROR;
        this.queue.dequeue();

        throw new Error("`NavigatorView` failed to do: `insertRoute` with error: " + error);
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
          findNodeHandle(this.nativeRef),
          isHidden, animated
        )
      );

    } catch(error){
      if(this.navStatus != NavStatus.UNMOUNTED){
        this.navStatus = NavStatus.IDLE_ERROR;
        throw new Error(`\`setNavigationBarHidden\` failed with error: ${error}`);
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
  //#endregion

  //#region - Native Event Handlers
  private _handleOnNavRouteViewAdded = (event: onNavRouteViewAddedPayload) => {
    if(this.navigatorID != event.nativeEvent.navigatorID) return;

    // emit event: nav. route was added to `RNINavigatorView`'s subviews
    this.emitter.emit(NavEvents.onNavRouteViewAdded, event);
  };

  private _handleOnSetNativeRoutes = (event: onSetNativeRoutesPayload) => {
    if(this.navigatorID != event.nativeEvent.navigatorID) return;

    // emit event: route data was set for the native routes
    this.emitter.emit(NavEvents.onSetNativeRoutes, event);
  };

  private _handleOnNavRouteWillPop = ({nativeEvent}: onNavRouteWillPopPayload) => {
    if(this.navigatorID != nativeEvent.navigatorID) return;

    if(this.navStatus == NavStatus.NAV_PUSHING){
      this.navStatus = NavStatus.NAV_ABORT_PUSH;
    };
  };

  private _handleOnNavRouteDidPop = ({nativeEvent}: onNavRouteDidPopPayload) => {
    if(this.navigatorID != nativeEvent.navigatorID) return;

    //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, onNavRouteDidPop`
        + ` - with args, routeKey: ${nativeEvent.routeKey}`
        + ` - routeIndex: ${nativeEvent.routeIndex}`
      );
      //#endregion

    // A route has been removed either through a tap on the "back" 
    // button, or through a swipe back gesture.
    if(nativeEvent.isUserInitiated){
      // cleanup - remove route
      this.removeRouteBatchedFromState({
        routeKey  : nativeEvent.routeKey,
        routeIndex: nativeEvent.routeIndex
      });
    };
  };
  //#endregion

  _renderRoutes(){
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
    const activeRoutesCount = activeRoutes.length;

    return activeRoutes.map(route => {
      // the routes from `activeRoutes` will only ever have js/react routes
      const routeConfig = this.getRouteConfig(route.routeKey) as NavRouteConfigItemJS;

      const isLast         = (activeRoutesCount - 1) == route.routeIndex;
      const isSecondToLast = (activeRoutesCount - 2) == route.routeIndex;

      return (
        <NavigatorRouteView
          key={`routeID-${route.routeID}`}
          ref={r => this.routeRefMap[route.routeID] = r}
          routeID={route.routeID}
          routeIndex={route.routeIndex}
          routeContainerStyle={props.routeContainerStyle}
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

    return (
      <RNINavigatorView 
        ref={r => this.nativeRef = r}
        style={[styles.navigatorView, props.style]}
        // General config
        navigatorID={this.navigatorID}
        isInteractivePopGestureEnabled={props.isInteractivePopGestureEnabled ?? true}
        nativeRoutes={this.getNativeRoutes()}
        // Navigation Bar customization
        isNavBarTranslucent={props.isNavBarTranslucent ?? true}
        navBarPrefersLargeTitles={props.navBarPrefersLargeTitles ?? true}
        navBarAppearance={props.navBarAppearance}
        // event handlers: push/pop
        onNavRouteWillPop={this._handleOnNavRouteWillPop}
        onNavRouteDidPop={this._handleOnNavRouteDidPop}
        onNavRouteViewAdded={this._handleOnNavRouteViewAdded}
        onSetNativeRoutes={this._handleOnSetNativeRoutes}
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
  static sortByRouteIndex<T>(routes: Array<T & {routeIndex: number}>){
    return routes.sort((a, b) => 
      (a.routeIndex - b.routeIndex)
    );
  };

  static isNavStateIdle(navStatus: NavStatus){
    return (
      navStatus == NavStatus.IDLE           ||
      navStatus == NavStatus.IDLE_INIT      ||
      navStatus == NavStatus.IDLE_ERROR     ||
      navStatus == NavStatus.NAV_ABORT_PUSH
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
