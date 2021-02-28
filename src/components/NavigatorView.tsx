import React, { ReactElement } from 'react';
import { StyleSheet, findNodeHandle, ViewStyle } from 'react-native';

import { RNIWrapperView } from '../native_components/RNIWrapperView';
import { RNINavigatorView } from '../native_components/RNINavigatorView';
import { RNINavigatorViewModule } from '../native_modules/RNINavigatorViewModule';

import { NavigatorRouteView } from './NavigatorRouteView';

import type { RouteOptions } from '../types/NavTypes';
import type { NavCommandPush, NavCommandPop, NavCommandPopToRoot, NavCommandRemoveRoute, NavCommandReplaceRoute, NavCommandInsertRoute, NavCommandReplaceRoutePreset, NavCommandRemoveRoutePreset, NavRouteItem, RenderNavBarItem, NavCommandRemoveRoutes } from '../types/NavSharedTypes';
import type { NavBarAppearanceCombinedConfig } from '../types/NavBarAppearanceConfig';

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
  UNMOUNTED      = "UNMOUNTED"     , // nav. comp. has been unmounted
  NAV_ABORT_PUSH = "NAV_ABORT_PUSH", // nav. has been popped before push completed
};

enum NavEvents {
  onNavRouteViewAdded = "onNavRouteViewAdded"
};

/** Represents a route in the nav. `state.activeRoutes` */
interface NavRouteStateItem extends NavRouteItem {
  routeIndex: number;
  routeID: number;
};


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
  navBarAppearance?: NavBarAppearanceCombinedConfig;

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

let NAVIGATOR_ID_COUNTER = 0;
let ROUTE_ID_COUNTER     = 0;

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

  private lastRouteRef: NavigatorRouteView;
  //#endregion

  constructor(props: NavigatorViewProps){
    super(props);

    this.navigatorID = NAVIGATOR_ID_COUNTER++;

    this.navStatus = NavStatus.IDLE_INIT;
    this.routesToRemove = [];

    this.emitter = new EventEmitter<NavEvents>();
    this.queue = new SimpleQueue();

    const initialRoute = this.getMatchingRoute(props.initialRouteKey);
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
    return this.props.routes.some(route => (
      route.routeKey == routeKey
    ));
  };

  private getMatchingRoute = (routeKey: string) => {
    return this.props.routes.find(item => (
      item.routeKey == routeKey
    ));
  };

  private getLastRouteTransitionDuration = (isPushing: boolean) => {
    const routeConfig = this.lastRouteRef.getRouteOptions();

    return (isPushing
      ? routeConfig.transitionConfigPush?.duration
      : routeConfig.transitionConfigPop ?.duration
    );
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

  /** Remove route from `state.activeRoutes` */
  private removeRouteFromState = (params: { routeKey: string, routeIndex: number }) => {
    //#region - 🐞 DEBUG 🐛
    LIB_GLOBAL.debugLog && console.log(
        `LOG/JS - NavigatorView, removeRouteFromState`
      + ` - with routeKey: ${params.routeKey}`
      + ` - routeIndex: ${params.routeIndex}`
      + ` - current activeRoutes: ${this.state.activeRoutes.length}`
    );
    //#endregion

    // Remove route from `activeRoutes`.
    // The route will be "removed" from `RNINavigatorView`'s subviews.
    return Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
      activeRoutes: prevState.activeRoutes.filter((route) => !(
        (route.routeIndex == params.routeIndex) &&
        (route.routeKey   == params.routeKey  )
      ))
    }));
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

  public push: NavCommandPush = async (routeItem, options) => {
    const routeConfig = this.getMatchingRoute(routeItem.routeKey);

    if(!routeConfig){
      // no matching route config found for `routeItem`
      throw new Error("`NavigatorView` failed to do: `push`: Invalid `routeKey`");
    };
    
    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.navStatus = NavStatus.NAV_PUSHING;

      const hasTransition = (options?.transitionConfig != null);

      // note: convert seconds -> ms
      const transitionDuration = (1000 * (
        options?.transitionConfig?.duration       ??
        this.getLastRouteTransitionDuration(true) ?? 0
      ));

      if(transitionDuration > 10000){
        throw new Error("`NavigatorView` failed to do: `push`: transition duration too big"
          + " - reminder: specify duration in seconds (ex: 0.5), not in ms (ex: 500)"
        );
      };

      // the amount of time to wait for "push" to resolve before rejecting.
      const timeout = Math.max((transitionDuration + 100), 750);

      if(hasTransition){
        // temporarily override the last route's "push" transition
        await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
          transitionConfigPushOverride: options.transitionConfig
        });
      };

      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, push: add route`
        + ` - with routeKey: ${routeItem.routeKey}`
        + ` - current activeRoutes: ${this.state.activeRoutes.length}`
      );
      //#endregion

      // summary: add new route, and wait for it be added
      await Promise.all([
        // ----------------------------------------------------------------------
        // 1. Wait for the new route to be added as a subview in the native side.
        //    note: This promise will reject if `onNavRouteViewAdded` fails to fire
        //    within 500 ms (i.e. if it takes to long for the promise to be fulfilled).
        // ----------------------------------------------------------------------------
        Helpers.promiseWithTimeout(500, new Promise<void>(resolve => {
          this.emitter.once(NavEvents.onNavRouteViewAdded, ({nativeEvent}: onNavRouteViewAddedPayload) => {
            if(routeItem.routeKey == nativeEvent.routeKey){
              resolve();
            };
          })
        })),
        // --------------------------------------
        // 2. Append new route to `activeRoutes`.
        //    The new route will be "received" from `RNINavigatorView`.
        // ------------------------------------------------------------
        Helpers.setStateAsync<NavigatorViewState>(this, ({activeRoutes: prevRoutes}) => ({
          activeRoutes: [...prevRoutes, {
            ...routeItem,
            routeID: ROUTE_ID_COUNTER++,
            routeIndex: ((Helpers.lastElement(prevRoutes)?.routeIndex ?? 0) + 1)
          }]
        }))
      ]);

      // forward "push" request to native module
      await Helpers.promiseWithTimeout(timeout,
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

  public pop: NavCommandPop = async (options) => {
    const { activeRoutes } = this.state;

    if(activeRoutes.length < 1){
      throw new Error(`\`pop\` failed, active route count must be > 1`);
    };

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.navStatus = NavStatus.NAV_POPPING;

      const hasTransition = (options?.transitionConfig != null);

      // note: convert seconds -> ms
      const transitionDuration = (1000 * (
        options?.transitionConfig?.duration        ??
        this.getLastRouteTransitionDuration(false) ?? 0
      ));

      if(transitionDuration > 10000){
        throw new Error("`NavigatorView` failed to do: `pop`: transition duration too big"
          + " - reminder: specify duration in seconds (ex: 0.5), not in ms (ex: 500)"
        );
      };

      // the amount of time to wait for "pop" to resolve before rejecting.
      const timeout = Math.max((transitionDuration + 100), 750);

      if(hasTransition){
        // temporarily change the last route's "pop" transition
        await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
          transitionConfigPopOverride: options.transitionConfig
        });
      };

      // forward "pop" request to native module
      const result = await Helpers.promiseWithTimeout(timeout,
        RNINavigatorViewModule.pop(
          findNodeHandle(this.nativeRef), {
            isAnimated: options?.isAnimated ?? true,
          }
        )
      );

      // remove popped route from `activeRoutes`
      await this.removeRouteFromState(result);

      if(hasTransition){
        // reset transition override
        await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
           transitionConfigPopOverride: null,
         });
      };

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

  public popToRoot: NavCommandPopToRoot = async (options) => {
    const { activeRoutes } = this.state;

    if(activeRoutes.length < 1){
      throw new Error(`\`popToRoot\` failed, route count must be > 1`);
    };

    try {
      // if busy, wait for prev. to finish
      const queue = this.queue.schedule();
      await queue.promise;

      this.navStatus = NavStatus.NAV_POPPING;

      const hasTransition = (options?.transitionConfig != null);

      // note: convert seconds -> ms
      const transitionDuration = (1000 * (
        options?.transitionConfig?.duration        ??
        this.getLastRouteTransitionDuration(false) ?? 0
      ));

      // the amount of time to wait for "popToRoot" to resolve before rejecting.
      const timeout = Math.max((transitionDuration + 100), 750);

      if(transitionDuration > 10000){
        throw new Error("`NavigatorView` failed to do: `pop`: transition duration too big"
          + " - reminder: specify duration in seconds (ex: 0.5), not in ms (ex: 500)"
        );
      };

      if(hasTransition){
        // temporarily change the last route's "pop" transition
        await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
          transitionConfigPopOverride: options.transitionConfig
        });
      };

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

      if(hasTransition){
        // reset transition override
        await Helpers.setStateAsync<Partial<NavigatorViewState>>(this, {
           transitionConfigPopOverride: null,
         });
      };

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

  public removeRoute: NavCommandRemoveRoute = async (routeIndex, animated = false) => {
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

      await Helpers.promiseWithTimeout(750,
        RNINavigatorViewModule.removeRoute(
          findNodeHandle(this.nativeRef),
          routeToBeRemoved.routeKey,
          routeToBeRemoved.routeIndex,
          animated
        )
      );

      await Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
        ...prevState,
        activeRoutes: prevState.activeRoutes
          // remove route from `activeRoutes`
          .filter((route, index) => (
            routeIndex != index &&
            routeToBeRemoved.routeKey != route.routeKey
          ))
          // update the route indexes
          .map((route, index) => ({
            ...route,
            routeIndex: index,
          }))
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

  public removeRoutes: NavCommandRemoveRoutes = async (routeIndexes, animated = false) => {
    const { activeRoutes } = this.state;

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

      await Helpers.promiseWithTimeout(750,
        RNINavigatorViewModule.removeRoutes(
          findNodeHandle(this.nativeRef),
          // routes to remove,
          routeIndexes.map(routeIndex => ({
            routeIndex,
            routeKey: activeRoutes[routeIndex].routeKey,
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


  public replaceRoute: NavCommandReplaceRoute = async (prevRouteIndex, routeItem, animated = false) => {
    const { activeRoutes } = this.state;

    const routeToReplace         = activeRoutes[prevRouteIndex];
    const replacementRouteConfig = this.getMatchingRoute(routeItem.routeKey);

    if(routeToReplace == null){
      throw new Error(`\`replaceRoute\` failed, no route found for the given \`routeIndex\`: ${prevRouteIndex}`);
    };

    if(replacementRouteConfig == null){
      throw new Error(`\`replaceRoute\` failed, no route found for the given \`routeKey\`: ${routeItem?.routeKey}`);
    };

    const replacementRoute: NavRouteStateItem = {
      ...routeItem,
      routeID: ROUTE_ID_COUNTER++,
      routeIndex: prevRouteIndex,
    };

    // `replaceRoute` Bugfix/Workaround:
    // * When replacing the first route, changing the `state.activeRoutes[0]`
    //   causes all the other routes to disappear.
    // * Specifically, it triggers `componentWillUnmount` for all the other 
    //   active routes (even though there aren't any changes to their props).
    // * This then triggers `vc.didMove(toParent: nil`) in the native side,
    //   which then triggers the cleanup/remove process.
    const isReplacingFirstRoute = 
      (prevRouteIndex == 0 ) && (activeRoutes.length > 0);

    try {
      if(isReplacingFirstRoute){
        // A. use alt. method
        await this.insertRoute(routeItem, 1);
        await this.removeRoute(0, animated);
        
      } else {
        // B. use normal method
        // if busy, wait for prev. to finish
        const queue = this.queue.schedule();
        await queue.promise;

        this.navStatus = NavStatus.NAV_REPLACING;

        await Promise.all([
          // 1. wait for replacement route to be added
          Helpers.promiseWithTimeout(500, new Promise<void>(resolve => {
            this.emitter.once(NavEvents.onNavRouteViewAdded, ({nativeEvent}: onNavRouteViewAddedPayload) => {
              if(nativeEvent.routeKey == routeItem.routeKey){
                resolve();
              };
            })
          })),
          // 2. replace route in state
          Helpers.setStateAsync<NavigatorViewState>(this, (prevState) => ({
            ...prevState,
            activeRoutes: prevState.activeRoutes.map((route, index) => (
              (prevRouteIndex == index && routeToReplace.routeKey == route.routeKey)
                ? { routeIndex: index, ...replacementRoute } 
                : { routeIndex: index, ...route }
            ))
          })),
        ]);

        // forward command to native module
        await Helpers.promiseWithTimeout(750,
          RNINavigatorViewModule.replaceRoute(
            findNodeHandle(this.nativeRef),
            prevRouteIndex,
            routeToReplace.routeKey,
            replacementRoute.routeKey,
            animated
          )
        );

        this.navStatus = NavStatus.IDLE;
        this.queue.dequeue();
      };

    } catch(error){
      if(this.navStatus != NavStatus.UNMOUNTED){
        this.navStatus = NavStatus.IDLE_ERROR;
        this.queue.dequeue();

        throw new Error(`\`replaceRoute\` failed with error: ${error}`);
      };
    };
  };

  public insertRoute: NavCommandInsertRoute = async (routeItem, atIndex, animated = false) => {
    const state = this.state;
    const routeConfig = this.getMatchingRoute(routeItem.routeKey);

    if(!routeConfig){
      // no matching route config found for `routeItem`
      throw new Error("`NavigatorView` failed to do: `insertRoute`: Invalid `routeKey`");
    };

    if(atIndex > state.activeRoutes.length){
      throw new Error("`NavigatorView` failed to do: `insertRoute`: Invalid `atIndex` (out of bounds)");
    };

    const nextRoute: NavRouteStateItem = {
      ...routeItem,
      routeID: ROUTE_ID_COUNTER++,
      routeIndex: atIndex,
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

      // summary: add new route, and wait for it be added
      await Promise.all([
        // ----------------------------------------------------------------------
        // 1. Wait for the new route to be added as a subview in the native side.
        //    note: This promise will reject if `onNavRouteViewAdded` fails to fire
        //    within 500 ms (i.e. if it takes to long for the promise to be fulfilled).
        // ----------------------------------------------------------------------------
        Helpers.promiseWithTimeout(500, new Promise<void>(resolve => {
          this.emitter.once(NavEvents.onNavRouteViewAdded, ({nativeEvent}: onNavRouteViewAddedPayload) => {
            if(routeItem.routeKey == nativeEvent.routeKey){
              resolve();
            };
          })
        })),
        // -----------------------------------
        // 2. add new route to `activeRoutes`.
        //    The new route will be "received" from `RNINavigatorView`.
        // ------------------------------------------------------------
        Helpers.setStateAsync<NavigatorViewState>(this, ({activeRoutes: prevRoutes}) => ({
          activeRoutes: Helpers
            .arrayInsert(prevRoutes, atIndex, nextRoute)
            .map((route, index) => ({...route, routeIndex: index}))
        }))
      ]);

      // forward command to native module
      await Helpers.promiseWithTimeout((750),
        RNINavigatorViewModule.insertRoute(
          findNodeHandle(this.nativeRef),
          nextRoute.routeKey,
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

  public setNavigationBarHidden = async (isHidden: boolean, animated: boolean) => {
    try {
      await Helpers.promiseWithTimeout(1000,
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

  public replacePreviousRoute: NavCommandReplaceRoutePreset = async (routeItem, animated = false) => {
    const { activeRoutes } = this.state;
    const lastRouteIndex = activeRoutes.length - 1;

    await this.replaceRoute(lastRouteIndex - 1, routeItem, animated);
  };

  public replaceCurrentRoute: NavCommandReplaceRoutePreset = async (routeItem, animated = false) => {
    const { activeRoutes } = this.state;
    const lastRouteIndex = activeRoutes.length - 1;

    await this.replaceRoute(lastRouteIndex, routeItem, animated);
  };

  public removePreviousRoute: NavCommandRemoveRoutePreset = async (animated = false) => {
    const { activeRoutes } = this.state;
    const lastRouteIndex = activeRoutes.length - 1;

    await this.removeRoute(lastRouteIndex - 1, animated);
  };
  //#endregion

  //#region - Native Event Handlers
  /** Handler for native event: `onNavRouteViewAdded` */
  private _handleOnNavRouteViewAdded = (event: onNavRouteViewAddedPayload) => {
    if(this.navigatorID != event.nativeEvent.navigatorID) return;

    // emit event: nav. route was added to `RNINavigatorView`'s subviews
    this.emitter.emit(NavEvents.onNavRouteViewAdded, event);
  };

  /** 
   * Handler for native event: `onNavRouteWillPop` 
   * a route is about to be removed either through a tap on the "back" button,
   * or through a swipe back gesture. */
  private _handleOnNavRouteWillPop = ({nativeEvent}: onNavRouteWillPopPayload) => {
    if(this.navigatorID != nativeEvent.navigatorID) return;

    if(this.navStatus == NavStatus.NAV_PUSHING){
      this.navStatus = NavStatus.NAV_ABORT_PUSH;
    };
  };

  /** Handler for native event: `onNavRouteDidPop` */
  private _handleOnNavRouteDidPop = ({nativeEvent}: onNavRouteDidPopPayload) => {
    if(this.navigatorID != nativeEvent.navigatorID) return;

    //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - NavigatorView, onNavRouteDidPop`
        + ` - with args, routeKey: ${nativeEvent.routeKey}`
        + ` - routeIndex: ${nativeEvent.routeIndex}`
      );
      //#endregion

    // A: A route has been removed either through a tap on the "back" 
    //    button, or through a swipe back gesture.
    if(nativeEvent.isUserInitiated){
      // A1: Remove route
      this.removeRouteBatchedFromState({
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
      const routeConfig = this.getMatchingRoute(route.routeKey);

      const isLast         = (activeRoutesCount - 1) == index;
      const isSecondToLast = (activeRoutesCount - 2) == index;

      return (
        <NavigatorRouteView
          key={`routeID-${route.routeID}`}
          {...(isLast && {ref: r => this.lastRouteRef = r})}
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
