import * as React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';

import { NavigatorView, RouteViewPortal, useNavigation, useNavRouteEvents } from 'react-native-ios-navigator';

import * as Colors  from '../constants/Colors';
import * as Helpers from '../functions/Helpers';


const colors = [
  Colors.PINK.A700,
  Colors.RED.A700,
  Colors.ORANGE.A700,
  Colors.YELLOW.A700,
  Colors.AMBER.A700,
  Colors.GREEN.A700,
  Colors.LIGHT_GREEN.A700,
  Colors.BLUE.A700,
  Colors.PURPLE.A700,
  Colors.VIOLET.A700,
  Colors.INDIGO.A700,
];

function randomBGColor(){
  return Helpers.randomElement<string>(colors);
};

function ExampleRoute(){
  const navigation = useNavigation();

  const [bgColor] = React.useState(randomBGColor());

  const routeContainerStyle = { backgroundColor: bgColor };

  useNavRouteEvents('onRouteWillPush' , () => console.log('onRouteWillPush' ));
  useNavRouteEvents('onRouteDidPush'  , () => console.log('onRouteDidPush'  ));
  useNavRouteEvents('onRouteWillPop'  , () => console.log('onRouteWillPop'  ));
  useNavRouteEvents('onRouteDidPop'   , () => console.log('onRouteDidPop'   ));
  useNavRouteEvents('onRouteWillFocus', () => console.log('onRouteWillFocus'));
  useNavRouteEvents('onRouteDidFocus' , () => console.log('onRouteDidFocus' ));
  useNavRouteEvents('onRouteWillBlur' , () => console.log('onRouteWillBlur' ));
  useNavRouteEvents('onRouteDidBlur'  , () => console.log('onRouteDidBlur'  ));

  return (
    <SafeAreaView style={[styles.routeContainer, routeContainerStyle]}>
      <Text style={styles.textRoute}>
        {`Debug: ${navigation.routeKey} - ${navigation.routeIndex}`}
      </Text>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          navigation.push({routeKey: 'routeA'}, {
            transitionConfig: { type: 'SlideLeft', duration: 0.3 }
          });
        }}
      >
        <Text style={styles.buttonText}>
          {'Push: RouteA'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          navigation.push({routeKey: 'routeB', routeOptions: {
            routeTitle: `Route B${navigation.routeIndex + 1}`
          }});
        }}
      >
        <Text style={styles.buttonText}>
          {'Push: RouteB'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export function NavigatorExample01() {
  return(
    <SafeAreaView style={styles.rootContainer}>
      <RouteViewPortal
        routeOptions={{
          //largeTitleDisplayMode: 'never',
        }}
      />
      <NavigatorView
        ref={r => { this.navRef = r }}
        initialRoutes={[{routeKey: 'routeA'}]}
        navBarPrefersLargeTitles={false}
        routes={{
          routeA: {
            routeOptionsDefault: {
              routeTitle: "Route A",
              navBarButtonBackItemConfig: {
                type: 'IMAGE_SYSTEM',
                imageValue: 'trash'
              }
            },
            renderRoute: () => (
              <ExampleRoute/>
            ),
          }, 
          routeB: {
            routeOptionsDefault: {
              routeTitle: "Route B",
            },
            renderRoute: () => (
              <ExampleRoute/>
            ),
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  routeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textRoute: {
    fontSize: 32,
  },
  buttonContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 12,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
  }
});