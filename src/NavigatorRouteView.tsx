import React from 'react';
import { StyleSheet, requireNativeComponent, ViewStyle, View, Text } from 'react-native';

import type { NavigatorView } from './NavigatorView';


//#region - Type Definitions
type RNINavigatorViewProps = {
  style: ViewStyle;
  routeKey: String;
  routeIndex: Number;
};

type NavigatorRouteViewProps = {
  routeKey: String;
  routeProps: Object;
  routeIndex: Number;
  getRefToNavigator: () => NavigatorView,
};


//#endregion

export const RNINavigatorRouteView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorRouteView');

/** */
export class NavigatorRouteView extends React.PureComponent<NavigatorRouteViewProps> {
  render(){
    const props = this.props;

    return (
      <RNINavigatorRouteView 
        style={styles.navigatorRouteView}
        routeKey={props.routeKey}
        routeIndex={props.routeIndex}
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
    position: 'absolute',
    backgroundColor: 'yellow',
  },
});
