import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { NavigatorView } from 'react-native-ios-navigator';


export default function App() {
  return (
    <View style={styles.container}>
      <NavigatorView
        routes={[{
          routeKey: 'routeFirst',
          routeOptions: {
            routeTitle: "Route First"
          }
        }, {
          routeKey: 'routeSecond',
          routeOptions: {
            routeTitle: "Route Second"
          }
        }]}
        initialRouteKey={'routeFirst'}
      />
      <NavigatorView
        routes={[{
          routeKey: 'routeFirst',
          routeOptions: {
            routeTitle: "Route First"
          }
        }, {
          routeKey: 'routeSecond',
          routeOptions: {
            routeTitle: "Route Second"
          }
        }]}
        initialRouteKey={'routeFirst'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
