import React, { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';

import type { NavigatorView } from './NavigatorView';
import { RNINavigatorRouteView } from '../native_components/RNINavigatorRouteView';

import { EventEmitter } from '../functions/EventEmitter';


//#region - Type Definitions
export interface RouteContentProps {
  getRefToRoute?: () => NavigatorRouteView,
  getRefToNavigator?: () => NavigatorView,
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


/** */
export class NavigatorRouteView extends React.PureComponent<NavigatorRouteViewProps, NavigatorRouteViewState> {
  //#region - Property Declarations
  state: NavigatorRouteViewState;
  routeContentRef: React.Component<RouteContentProps>;
  //#endregion

  constructor(props: NavigatorRouteViewProps){
    super(props);

    this.state = {
      isMounted: true,
      routeTitle: props.initialRouteTitle,
    };
  };

  //#region - Handlers
  private _handleGetRefToRoute = () => {
    return this;
  };
  //#endregion

  //#region - Native Event Handlers
  /** Handler for native event: `onNavRouteWillPop` */
  private _handleOnNavRouteWillPop = () => {
    
  };

  /** Handler for native event: `onNavRouteDidPop` */
  private _handleOnNavRouteDidPop = () => {
    // unmount views
    this.setState({isMounted: false});
  };

  private _handleOnNavRouteWillPush = () => {

  };

  private _handleOnNavRouteDidPush = () => {

  };

  //#endregion
  
  render(){
    const props = this.props;
    const state = this.state;

    if(!this.state.isMounted) return null;

    return (
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
            }
          )}
        </View>
      </RNINavigatorRouteView>
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
