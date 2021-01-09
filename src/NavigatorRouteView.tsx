import React from 'react';
import { StyleSheet, requireNativeComponent, ViewStyle, View, Text } from 'react-native';

import type { NavigatorView } from './NavigatorView';


//#region - Type Definitions
//#region - `RNINavigatorRouteView` Events
//#endregion

type RNINavigatorViewProps = {
  style: ViewStyle;
  routeKey: String;
  routeIndex: Number;
    // Native Events
  onNavRouteWillPop?: () => void;
  onNavRouteDidPop ?: () => void;
};

type NavigatorRouteViewProps = {
  routeKey: String;
  routeProps: Object;
  routeIndex: Number;
  getRefToNavigator: () => NavigatorView,
};

/** `NavigatorView` comp. state */
type NavigatorRouteViewState = {
  isMounted: Boolean;
};
//#endregion

export const RNINavigatorRouteView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorRouteView');

/** */
export class NavigatorRouteView extends React.PureComponent<NavigatorRouteViewProps, NavigatorRouteViewState> {
  //#region - Property Declarations
  state: NavigatorRouteViewState;
  //#endregion

  constructor(props){
    super(props);

    this.state = {
      isMounted: true
    };
  };

  //#region - Native Event Handlers
  /** Handler for native event: `onNavRouteWillPop` */
  private _handleOnNavRouteWillPop = () => {
  };

  /** Handler for native event: `onNavRouteDidPop` */
  private _handleOnNavRouteDidPop = () => {
  };
  //#endregion
  
  render(){
    if(!this.state.isMounted) return null;
    const props = this.props;
    
    return (
      <RNINavigatorRouteView 
        style={styles.navigatorRouteView}
        routeKey={props.routeKey}
        routeIndex={props.routeIndex}
        onNavRouteWillPop={this._handleOnNavRouteWillPop}
        onNavRouteDidPop={this._handleOnNavRouteDidPop}
      >
        <View style={{paddingTop: 80, paddingHorizontal: 20}}>
          <Text style={{fontSize: 32}}>
            {`Hello World, Route: ${props.routeKey}, routeIndex: ${props.routeIndex}`}
          </Text>
          <Text 
            style={{fontSize: 32}}
            onPress={() => {
              const props = this.props;
              const navigatorRef = props.getRefToNavigator();
              navigatorRef.push({routeKey: "routeSecond"})
            }}
          >
            {`Navigate: push`}
          </Text>
        </View>
      </RNINavigatorRouteView>
    );
  };
};

const styles = StyleSheet.create({
  navigatorRouteView: {
    backgroundColor: 'yellow',
    // don't show on first mount
    position: 'absolute',
    width: 0,
    height: 0,
  },
});
