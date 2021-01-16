import React, { ReactElement } from 'react';
import { StyleSheet, requireNativeComponent, ViewStyle, View, Text } from 'react-native';

import type { NavigatorView } from './NavigatorView';


//#region - Type Definitions
export interface RouteContentProps {
  getRefToRoute?: () => NavigatorRouteView,
  getRefToNavigator?: () => NavigatorView,
};

//#region - `RNINavigatorRouteView` Events
//#endregion

type RNINavigatorViewProps = {
  style: ViewStyle;
  routeKey: string;
  routeIndex: number;
  routeTitle: string;
  // Native Events
  onNavRouteWillPush?: () => void;
  onNavRouteDidPush ?: () => void;
  
  onNavRouteWillPop?: () => void;
  onNavRouteDidPop ?: () => void;
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

export const RNINavigatorRouteView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorRouteView');

/** */
export class NavigatorRouteView extends React.PureComponent<NavigatorRouteViewProps, NavigatorRouteViewState> {
  //#region - Property Declarations
  state: NavigatorRouteViewState;
  //#endregion

  constructor(props: NavigatorRouteViewProps){
    super(props);

    this.state = {
      isMounted: true,
      routeTitle: props.initialRouteTitle,
    };
  };

  private _getRefToRoute = () => {
    return this;
  };

  //#region - Native Event Handlers
  /** Handler for native event: `onNavRouteWillPop` */
  private _handleOnNavRouteWillPop = () => {
    
  };

  /** Handler for native event: `onNavRouteDidPop` */
  private _handleOnNavRouteDidPop = () => {
    // unmount views
    this.setState({isMounted: false});
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
      >
        <View style={styles.routeContentContainer}>
          {React.cloneElement<RouteContentProps>(
            props.renderRouteContent(), {
              getRefToRoute: this._getRefToRoute,
              getRefToNavigator: () => props.getRefToNavigator(),
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
