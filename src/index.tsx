import React from 'react';
import { StyleSheet, requireNativeComponent, ViewStyle } from 'react-native';

type RNINavigatorViewProps = {
  style: ViewStyle;
};

const componentName    = "RNINavigatorView";
const RNINavigatorView = requireNativeComponent<RNINavigatorViewProps>(componentName);

export class NavigatorView extends React.PureComponent {
  render(){
    return (
      <RNINavigatorView style={styles.navigatorView}>
        {this.props.children}
      </RNINavigatorView>
    );
  };
};

const styles = StyleSheet.create({
  navigatorView: {
    flex: 1,
    backgroundColor: 'red',
  },
});
