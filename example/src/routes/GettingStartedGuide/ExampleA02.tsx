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

export function ExampleA02(){
  return (
     <NavigatorView
      initialRoutes={[{routeKey: 'routeA'}]}
      routes={{
        routeA: {
          // The route can be configured/customized further via the
          // `NavRouteConfigItem.defaultRouteOptions` property.
          routeOptionsDefault: {
            routeTitle: 'Hello World',
            prompt: 'Lorum Ipsum',

            // disable the "large title" for this route
            largeTitleDisplayMode: 'never',

            // show a button on the right side of the
            // navigation bar
            navBarButtonRightItemsConfig: [{
              type: 'TEXT',
              title: 'ABC',
              tintColor: 'red',
            }]
          },
          renderRoute: () => (
            <ExampleRoute/>
          ),
        }
      }}
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