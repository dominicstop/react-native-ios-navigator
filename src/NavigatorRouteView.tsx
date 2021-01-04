import React from 'react';
import { StyleSheet, requireNativeComponent, ViewStyle, Text } from 'react-native';

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
};


//#endregion

const componentName = "RNINavigatorRouteView";
const RNINavigatorRouteView = requireNativeComponent<RNINavigatorViewProps>(componentName);

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
        <Text style={{fontSize: 32, padding: 20}}>
          {`Hello World, Route: ${props.routeKey}, routeIndex: ${props.routeIndex}`}
        </Text>
      </RNINavigatorRouteView>
    );
  };
};

const styles = StyleSheet.create({
  navigatorRouteView: {
    flex: 1,
    backgroundColor: 'yellow',
  },
});
