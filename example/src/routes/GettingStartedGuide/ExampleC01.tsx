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

export function ExampleC01(){
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
      navBarPrefersLargeTitles={false}
      // Customize the look of the navigation bar
      navBarAppearance={{
        // Use the appearance API (i.e. iOS 13 and above) to style
        // the navigation bar
        mode: 'appearance',
        useStandardAppearanceAsDefault: true,

        standardAppearance: {
          // Set nav bar bg to red
          backgroundColor: 'red',
          
          // Make the nav bar title white
          titleTextAttributes: {
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
          },

          // Add a gradient shadow below the nav bar
          shadowImage: {
            type: 'IMAGE_GRADIENT',
            imageValue: {
              colors: ['rgba(255,0,0,1)', 'rgba(255,0,0,0)'],
              type: 'axial',
              height: 75,
              startPoint: 'top',
              endPoint: 'bottom',
            },
          },
        },
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