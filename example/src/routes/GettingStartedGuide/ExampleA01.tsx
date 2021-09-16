import * as React from 'react';
import { SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigatorView, RouteContentProps } from 'react-native-ios-navigator';

import * as Colors from '../../constants/Colors';

// Route - 'routeA'
// This is the component that gets shown when 'routeA' is pushed. 
function ExampleRoute(props: RouteContentProps){
  return (
    <SafeAreaView style={styles.routeContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // when this button is pressed, push a route 
          // with the "route key" value of 'routeA'.
          props.navigation.push({
            routeKey: 'routeA'
          });
        }}
      >
        <Text style={styles.buttonText}> 
          Push: 'RouteA' 
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export function ExampleA01(){
  return (
     <NavigatorView
      // The object that's passed to the `NavigatorView.routes` 
      // This prop defines what routes can be used in the navigator.
      //
      // Note: The object that is passed to this prop is referred to as
      // the "route map" (e.g. `NavRoutesConfigMap`).
      routes={{
        // The key of the property is used as the "route key" of the route.
        // E.g. so this is a route that has the `routeKey` value of 'routeA'.
        //
        // Note: The object that's assigned to the `routeKey` is referred to
        // as the "route config" (e.g. `NavRouteConfigItem`).
        routeA: {
          // Now we need to provide a config... we want to show the 
          // `ExampleRoute` component when this route is "pushed".
          //
          // The `renderRoute` property accepts a function that returns a
          // component to show in the route.
          renderRoute: () => (
            <ExampleRoute/>
          ),
        }
      }}
      // This prop controls the initial routes to show when the navigator
      // first mounts.
      initialRoutes={[{routeKey: 'routeA'}]}
    />
  );
};

const styles = StyleSheet.create({
  routeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: Colors.PURPLE.A700,
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: '600',
    color: 'white',
  },
});