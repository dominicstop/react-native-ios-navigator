import React, { ReactElement } from 'react';
import { StyleSheet, findNodeHandle, ViewStyle } from 'react-native';

import { RNIWrapperView } from '../native_components/RNIWrapperView';
import { NativeRouteMap, RNINavigatorView, RNINavigatorViewProps } from '../native_components/RNINavigatorView';
import { RNINavigatorViewModule } from '../native_modules/RNINavigatorViewModule';

import { NavigatorRouteView } from './NavigatorRouteView';

import type { RouteOptions } from '../types/RouteOptions';
import type { NavRouteItem } from '../types/NavSharedTypes';
import type { NavCommandPushOptions, RenderNavBarItem, NavCommandPopOptions } from '../types/NavTypes';

import type { RouteContentProps } from '../components/NavigatorRouteView';

import type { OnNavRouteViewAddedPayload } from '../native_components/RNINavigatorView';
import type { RouteTransitionPopConfig, RouteTransitionPushConfig } from '../native_components/RNINavigatorRouteView';

import * as Helpers from '../functions/Helpers';

import { EventEmitter } from '../functions/EventEmitter';
import { SimpleQueue } from '../functions/SimpleQueue';

import { NativeIDKeys } from '../constants/LibraryConstants';


//#region - Type Definitions
//#region - Extract handlers from RNINavigatorView
type OnNavRouteViewAdded    =  RNINavigatorViewProps['onNavRouteViewAdded'];
type OnNavRouteWillPop      =  RNINavigatorViewProps['onNavRouteWillPop'];
type OnNavRouteDidPop       =  RNINavigatorViewProps['onNavRouteDidPop'];
type OnSetNativeRoutes      =  RNINavigatorViewProps['onSetNativeRoutes'];
type OnNativeCommandRequest =  RNINavigatorViewProps['onNativeCommandRequest'];
//#endregion

export type OnCustomCommandFromNative = RNINavigatorViewProps['onCustomCommandFromNative'];

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

enum NavEvents {
  onNavRouteViewAdded = "onNavRouteViewAdded",
  onSetNativeRoutes   = "onSetNativeRoutes"  ,
};

/** Represents a route in the nav. `state.activeRoutes` */
type NavRouteStateItem = NavRouteItem & {
  routeID: number;
  routeIndex: number;
  isNativeRoute: boolean;
};

type NavRouteConfigItemBase = {
  routeKey: NavRouteItem['routeKey'];
  initialRouteProps?: object;
};

/** Native route config */
export type NavRouteConfigItemNative = NavRouteConfigItemBase & {
  isNativeRoute: true;
};

/** JS/React route config */
export type NavRouteConfigItemJS = NavRouteConfigItemBase & {
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
export type NavigatorViewProps = Partial<Pick<RNINavigatorViewProps,
  // mirror props from `RNINavigatorViewProps`
  | 'nativeID'
  | 'isInteractivePopGestureEnabled' 
  | 'shouldSwizzleRootViewController'
  | 'navBarPrefersLargeTitles' 
  | 'navBarAppearance' 
  | 'isNavBarTranslucent'
  | 'onCustomCommandFromNative'
>> & {
  style?: ViewStyle;

  // Nav. Route Config
  routes: Array<NavRouteConfigItem>;
  initialRoutes: Array<NavRouteItem>;
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
const TIMEOUT_COMMAND = 1500;

let NAVIGATOR_ID_COUNTER = 0;
let ROUTE_ID_COUNTER     = 0;

let nativeRouteKeys: Record<string, string> = null

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

    this.state = {
      activeRoutes: this.getInitialRoutes(),
      transitionConfigPushOverride: null,
      transitionConfigPopOverride: null,
    };
  };

  componentWillUnmount(){
    this.setNavStatus(NavStatus.UNMOUNTED);
    this.queue.clear();
  };

  //#region - Private Functions
  private isValidRouteKey = (routeKey: string) => {
    const { routes } = this.props;
    const hasNativeRouteKeyMatch = (nativeRouteKeys?.[routeKey] != null);

    return hasNativeRouteKeyMatch || routes.some(route => (
      route.routeKey == routeKey
    ));
  };

  private getInitialRoutes = (): Array<NavRouteStateItem> => {
    const { initialRoutes } = this.props;

    // guard: initial validation for `initialRoutes`
    const isValid = ((initialRoutes != null) && Array.isArray(initialRoutes));
    const isEmpty = (initialRoutes?.length == 0);

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

      const routeItem: NavRouteStateItem = {
        isNativeRoute: config.isNativeRoute,
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
  private getRouteConfig = (routeKey: string): NavRouteConfigItem | null => {
    const { routes } = this.props;

    const routeConfig = routes.find(item => (item.routeKey == routeKey));
    const nativeRouteKey = nativeRouteKeys?.[routeKey];

    const hasNativeRouteKeyMatch = (nativeRouteKey != null);
    const isNativeRoute = routeConfig?.isNativeRoute || hasNativeRouteKeyMatch;

    return (!isNativeRoute)? routeConfig : {
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

  private setNavStatus(navStatus: NavStatus){
    if(this.navStatus != NavStatus.UNMOUNTED){
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
            !params.isPushing && Helpers.timeout(100),
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
   * native routes to be created/init. w/ data.
   * note: This promise will reject if the events fail to fire within `TIMEOUT_MOUNT` ms. */
  private waitForRoutes = (routeItems: Array<NavRouteStateItem>) => {
    // filter out/separate react and native routes
    const [nativeRoutes, reactRoutes] = routeItems.reduce((acc, curr) => {
      acc[curr.isNativeRoute? 0 : 1].push(curr.routeID);
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
        this.emitter.once(NavEvents.onNavRouteViewAdded, ({nativeEvent}: OnNavRouteViewAddedPayload) => {
          if(nativeEvent.routeID === routeID){
            resolve();
          };
        })
      }))
    ]));
  };

  private createStateSnapshot = () => {
    let stateSnapshot: NavigatorViewState = null;

    return {
      save: () => {
        stateSnapshot = { ...this.state };
      },
      restore: () => {
        if(stateSnapshot != null){
          this.setState(stateSnapshot);
          stateSnapshot = null;
        };
      },
      clear: () => {
        stateSnapshot = null;
      },
    };
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

    this.setNavStatus(NavStatus.NAV_POPPING);
    
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

      const nextRoute: NavRouteStateItem = {
        routeID: ROUTE_ID_COUNTER++,
        routeIndex: nextRouteIndex,
        routeKey: routeItem.routeKey,
        routeProps: routeItem.routeProps,
        routeOptions: routeItem.routeOptions,
        isNativeRoute: routeConfig?.isNativeRoute ?? false,
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
    routeIndexes: Array<number>,
    animated = false
  ): Promise<void> => {
    
    const { activeRoutes } = this.state;
    const stateSnapshot = this.createStateSnapshot();

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

      this.setNavStatus(NavStatus.NAV_REMOVING);
      stateSnapshot.save();

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

    const replacementRoute: NavRouteStateItem = {
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

    const nextRoute: NavRouteStateItem = {
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
    transform: (currentRoutes: Array<NavRouteItem & {routeID?: number}>) => typeof currentRoutes, 
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
        routeProps: route.routeProps,
        // merge old + new route items
        ...currentRoutesMap[route.routeID], ...route,
        // assign new routeIndex
        routeIndex: index,
        // assign a routeID if it doesn't have one yet
        routeID: route.routeID ?? ROUTE_ID_COUNTER++,
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
          findNodeHandle(this.nativeRef),
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
      findNodeHandle(this.nativeRef),
      commandKey,
      commandData
    );
  };

  public getNavigatorConstants = async () => {
    try {
      const result = await Helpers.promiseWithTimeout(1000,
        RNINavigatorViewModule.getNavigatorConstants(
          findNodeHandle(this.nativeRef)
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
  private _handleOnNavRouteViewAdded: OnNavRouteViewAdded = (event) => {
    if(this.navigatorID != event.nativeEvent.navigatorID) return;

    // emit event: nav. route was added to `RNINavigatorView`'s subviews
    this.emitter.emit(NavEvents.onNavRouteViewAdded, event);
  };

  private _handleOnSetNativeRoutes: OnSetNativeRoutes = (event) => {
    if(this.navigatorID != event.nativeEvent.navigatorID) return;

    // emit event: route data was set for the native routes
    this.emitter.emit(NavEvents.onSetNativeRoutes, event);
  };

  private _handleOnNativeCommandRequest: OnNativeCommandRequest = async ({nativeEvent}) => {
    if(this.navigatorID != nativeEvent.navigatorID) return;
    
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

          const nextRoute: NavRouteStateItem = {
            routeID: commandData.routeID,
            routeKey: commandData.routeKey,
            routeIndex: nextRouteIndex,
            isNativeRoute: true,
          };

          await Promise.all([
            // 1. wait for the native route to be init
            this.waitForRoutes([nextRoute]),
            // 2. Append new route to `activeRoutes`
            Helpers.setStateAsync<NavigatorViewState>(this, ({activeRoutes: prevRoutes}) => ({
              activeRoutes: [...prevRoutes, nextRoute]
            }))
          ]);

          // forward "push" request to native module
          await Helpers.promiseWithTimeout(TIMEOUT_COMMAND,
            RNINavigatorViewModule.push(
              findNodeHandle(this.nativeRef),
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

  private _handleOnCustomCommandFromNative: OnCustomCommandFromNative = (event) => {
    if(this.navigatorID != event.nativeEvent.navigatorID) return;
    this.props.onCustomCommandFromNative?.(event);
  };

  private _handleOnNavRouteWillPop: OnNavRouteWillPop = ({nativeEvent}) => {
    if(this.navigatorID != nativeEvent.navigatorID) return;

    if(!NavigatorViewUtils.isNavStateIdle(this.navStatus)){
      this.setNavStatus(NavStatus.NAV_ABORT);
    };
  };

  private _handleOnNavRouteDidPop: OnNavRouteDidPop = ({nativeEvent}) => {
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

      const isLast         = route.routeIndex == (activeRoutesCount - 1);
      const isSecondToLast = route.routeIndex == (activeRoutesCount - 2);

      return (
        <NavigatorRouteView
          key={`routeID-${route.routeID}`}
          ref={r => this.routeRefMap[route.routeID] = r}
          navigatorID={this.navigatorID}
          routeID={route.routeID}
          routeIndex={route.routeIndex}
          routeKey={route.routeKey}
          isRootRoute={(route.routeIndex == 0)}
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
    const state = this.state;

    return (
      <RNINavigatorView 
        ref={r => this.nativeRef = r}
        style={[styles.navigatorView, props.style]}
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
      navStatus == NavStatus.IDLE       ||
      navStatus == NavStatus.IDLE_INIT  ||
      navStatus == NavStatus.IDLE_ERROR ||
      navStatus == NavStatus.NAV_ABORT
    );
  };

  static wasAborted(navStatus: NavStatus){
    return (
      navStatus == NavStatus.UNMOUNTED   ||
      navStatus == NavStatus.NAV_ABORT   ||
      navStatus == NavStatus.NAV_POPPING 
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
