import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import type { NavigatorView } from './NavigatorView';
import { RNINavigatorRouteView } from '../native_components/RNINavigatorRouteView';

import { EventEmitter } from '../functions/EventEmitter';
import { NavRouteViewContext } from '../context/NavRouteViewContext';


//#region - Type Definitions
export enum NavRouteEvents {
  onNavRouteWillPush = "onNavRouteWillPush",
  onNavRouteDidPush  = "onNavRouteDidPush" ,
  onNavRouteWillPop  = "onNavRouteWillPop" ,
  onNavRouteDidPop   = "onNavRouteDidPop"  ,
};

export interface RouteContentProps {
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
  renderRouteContent: () => ReactElement<RouteContentProps>;
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
  //#endregion

  constructor(props: NavigatorRouteViewProps){
    super(props);

    this.emitter = new EventEmitter<NavRouteEvents>();

    this.state = {
      isMounted: true,
      routeTitle: props.initialRouteTitle,
    };
  };

  //#region - Public Functions
  public getRouterRef = () => {
    return this;
  };

  public getEmitterRef = () => {
    return this.emitter;
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

    // unmount views
    this.setState({isMounted: false});
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
  
  render(){
    const props = this.props;
    const state = this.state;

    if(!this.state.isMounted) return null;

    return(
      <NavRouteViewContext.Provider value={{
        // pass down function to get refs
        //getModalRef  : this._handleGetModalRef,
        getEmitterRef: this.getEmitterRef,
        getRouterRef: this.getRouterRef
      }}>
        <RNINavigatorRouteView
          style={styles.navigatorRouteView}
          routeKey={props.routeKey}
          routeIndex={props.routeIndex}
          routeTitle={state.routeTitle}
          onNavRouteWillPop={this._handleOnNavRouteWillPop}
          onNavRouteDidPop={this._handleOnNavRouteDidPop}
          onNavRouteWillPush={this._handleOnNavRouteWillPush}
          onNavRouteDidPush={this._handleOnNavRouteDidPush}
        >
          <View style={styles.routeContentContainer}>
            {React.cloneElement<RouteContentProps>(
              props.renderRouteContent(), {
                getRefToRoute: this._handleGetRefToRoute,
                getRefToNavigator: props.getRefToNavigator,
                getRefToNavRouteEmitter: this._handleGetRefToNavRouteEmitter
              }
            )}
          </View>
        </RNINavigatorRouteView>
      </NavRouteViewContext.Provider>
    );
  };
};

const styles = StyleSheet.create({
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
