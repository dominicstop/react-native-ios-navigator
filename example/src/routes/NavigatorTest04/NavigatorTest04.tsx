import * as React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import { NavigatorView, RouteViewPortal } from 'react-native-ios-navigator';

import { MainRoute } from './MainRoute';


export function NavigatorTest04() {
  return (
    <SafeAreaView style={styles.rootContainer}>
      <RouteViewPortal
        routeOptions={{
          largeTitleDisplayMode: 'never',
        }}
      />
      <NavigatorView
        ref={r => { this.navRef = r }}
        initialRoutes={[{routeKey: 'MainRoute'}]}
        navBarPrefersLargeTitles={false}
        routes={{
          MainRoute: {
            routeOptionsDefault: {
              largeTitleDisplayMode: 'never',
            },
            renderRoute: () => (
              <MainRoute/>
            ),
          }}
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});


