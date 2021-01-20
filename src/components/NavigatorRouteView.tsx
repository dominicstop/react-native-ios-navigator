import React, { ReactElement } from 'react';
import { StyleSheet, View, findNodeHandle } from 'react-native';

import type { NavigatorView } from './NavigatorView';

import { RNINavigatorRouteView, RNINavigatorRouteViewProps } from '../native_components/RNINavigatorRouteView';
import { RNINavigatorRouteViewModule } from '../native_modules/RNINavigatorRouteViewModule';

import * as Helpers from '../functions/Helpers';
import { EventEmitter } from '../functions/EventEmitter';

import { NavRouteViewContext } from '../context/NavRouteViewContext';
import { NativeIDKeys } from '../constants/LibraryConstants';



//#region - Type Definitions
type ComponentRef = number | React.Component | React.ComponentClass;

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
  initialRouteTitle: string;
  getRefToNavigator: () => NavigatorView,
  renderRouteContent: () => ReactElement<RouteContentProps>
  // render nav bar items
  renderNavBarLeftItem ?: () => ReactElement;
  renderNavBarRightItem?: () => ReactElement;
  renderNavBarTitleItem?: () => ReactElement;
};

/** `NavigatorView` comp. state */
type NavigatorRouteViewState = {
  isMounted: boolean;
  routeTitle: string;
};
//#endregion


export class NavigatorRouteView extends React.PureComponent<NavigatorRouteViewProps, NavigatorRouteViewState> {
  //#region - Property Declarations
  state: NavigatorRouteViewState;
  routeContentRef: React.Component<RouteContentProps>;
  emitter: EventEmitter<NavRouteEvents>;

  private _routeViewRef: React.Component<RNINavigatorRouteViewProps>;
  private _routeContentRef: ReactElement;

  private nativeCompRegistryQueue: Array<{ref: ComponentRef, nativeID: NativeIDKeys}>
  //#endregion

  constructor(props: NavigatorRouteViewProps){
    super(props);

    this.nativeCompRegistryQueue = [];
    this.emitter = new EventEmitter<NavRouteEvents>();

    this.state = {
      isMounted: true,
      routeTitle: props.initialRouteTitle,
    };
  };

  componentDidMount = async () => {
    while(this.nativeCompRegistryQueue.length > 0){
      const queueItem = this.nativeCompRegistryQueue.pop();

       RNINavigatorRouteViewModule.registerNativeComponent(
        findNodeHandle(this._routeViewRef),
        findNodeHandle(queueItem.ref),
        queueItem.nativeID
      );
    };
  };

  //#region - Public Functions
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

  public registerNativeComponent = (ref: ComponentRef, nativeID: NativeIDKeys) => {
    this.nativeCompRegistryQueue.push({ref, nativeID});
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
          ref={r => this._routeViewRef = r}
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
