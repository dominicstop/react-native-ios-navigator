import * as React from 'react';
import { SafeAreaView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigatorView, RouteContentProps } from 'react-native-ios-navigator';

import * as Colors from '../../constants/Colors';

function ExampleRoute(props: RouteContentProps){
  return (
    <SafeAreaView style={styles.routeContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Push route when this button is pressed...
          props.navigation.push({
            routeKey: 'routeA',
            // ... and set the route's route options
            routeOptions: {
              largeTitleDisplayMode: 'never',
              routeTitle: 'Hello World',
              prompt: 'Lorum Ipsum',
            },
          });
        }}
      >
        <Text style={styles.buttonText}> 
          Push: 'RouteA' + Send Route Options 
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export function ExampleB04(){
  return (
     <NavigatorView
      routes={{
        routeA: {
          renderRoute: () => (
            <ExampleRoute/>
          ),
        }
      }}
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