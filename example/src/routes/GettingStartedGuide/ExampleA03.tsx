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

export function ExampleA03(){
  return (
     <NavigatorView
      routes={{
        routeA: {
          routeOptionsDefault: {
            largeTitleDisplayMode: 'never',
          },
          renderRoute: () => (
            <ExampleRoute/>
          ),
        }
      }}
      // show multiple initial routes...
      initialRoutes={[{
        routeKey: 'routeA',
        routeOptions: {
          routeTitle: '01 (Root)'
        }
      }, {
        routeKey: 'routeA',
        routeOptions: {
          routeTitle: '02'
        }
      }, {
        routeKey: 'routeA',
        routeOptions: {
          routeTitle: '03'
        }
      }, {
        routeKey: 'routeA',
        routeOptions: {
          routeTitle: '04'
        }
      }, {
        routeKey: 'routeA',
        routeOptions: {
          routeTitle: '05'
        }
      }, {
        routeKey: 'routeA',
        routeOptions: {
          routeTitle: '06'
        }
      }]}
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