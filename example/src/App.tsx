import * as React from 'react';

import { StyleSheet, Alert } from 'react-native';
import { NavigatorView } from 'react-native-ios-navigator';

import { RouteKeys, ROUTES } from './constants/Routes';
import { ImageCache } from './functions/ImageCache';


ImageCache.loadImages();

export default function App() {
  return (
    <NavigatorView
      ref={r => {this.navRef = r}}
      style={styles.container}
      routes={ROUTES}
      initialRoutes={[{routeKey: RouteKeys.Home}]}
      isInteractivePopGestureEnabled={true}
      navBarPrefersLargeTitles={true}
      onCustomCommandFromNative={({nativeEvent}) => {
        Alert.alert(
          nativeEvent.commandKey, 
          JSON.stringify(nativeEvent.commandData)
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});