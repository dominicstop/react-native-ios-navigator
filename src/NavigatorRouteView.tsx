import React from 'react';
import { StyleSheet, requireNativeComponent, ViewStyle } from 'react-native';

type RNINavigatorViewProps = {
  style: ViewStyle;
};

const componentName = "RNINavigatorRouteView";
const RNINavigatorRouteView = requireNativeComponent<RNINavigatorViewProps>(componentName);

export class NavigatorRouteView extends React.PureComponent {
  render(){
    return (
      <RNINavigatorRouteView style={styles.navigatorRouteView}>
        {this.props.children}
      </RNINavigatorRouteView>
    );
  };
};

const styles = StyleSheet.create({
  navigatorRouteView: {
    flex: 1,
  },
});
