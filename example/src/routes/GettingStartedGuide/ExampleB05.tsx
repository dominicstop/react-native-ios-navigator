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
          props.navigation.push({
            routeKey: 'routeA',
          });
        }}
      >
        <Text style={styles.buttonText}> 
          Push: 'RouteA'
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Pop current route when the button is pressed
          props.navigation.pop();
        }}
      >
        <Text style={styles.buttonText}> 
          Pop Current Route
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export function ExampleB05(){
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
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: '600',
    color: 'white',
  },
});