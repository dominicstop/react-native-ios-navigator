import * as React from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';

import { NavigatorView, RouteContentProps, RouteViewPortal, useNavRouteLifeCycle } from 'react-native-ios-navigator';

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

// extend
interface ExampleRouteProps extends RouteContentProps {
};

function ExampleRoute(props: ExampleRouteProps){
  const [bgColor] = React.useState(randomBGColor());

  const routeContainerStyle = { backgroundColor: bgColor };

  useNavRouteLifeCycle('onRouteWillPush' , () => console.log('onRouteWillPush' ));
  useNavRouteLifeCycle('onRouteDidPush'  , () => console.log('onRouteDidPush'  ));
  useNavRouteLifeCycle('onRouteWillPop'  , () => console.log('onRouteWillPop'  ));
  useNavRouteLifeCycle('onRouteDidPop'   , () => console.log('onRouteDidPop'   ));
  useNavRouteLifeCycle('onRouteWillFocus', () => console.log('onRouteWillFocus'));
  useNavRouteLifeCycle('onRouteDidFocus' , () => console.log('onRouteDidFocus' ));
  useNavRouteLifeCycle('onRouteWillBlur' , () => console.log('onRouteWillBlur' ));
  useNavRouteLifeCycle('onRouteDidBlur'  , () => console.log('onRouteDidBlur'  ));

  return (
    <SafeAreaView style={[styles.routeContainer, routeContainerStyle]}>
      <Text style={styles.textRoute}>
        {`Debug: ${props.navigation.routeKey} - ${props.navigation.routeIndex}`}
      </Text>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          const nav = props.navigation;
          nav.push({routeKey: 'routeA'}, {
            transitionConfig: { type: 'SlidePush', duration: 0.3 }
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
          const nav = props.navigation;
          nav.push({routeKey: 'routeB', routeOptions: {
            routeTitle: `Route B${nav.routeIndex + 1}`
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
        ref={r => this.navRef = r}
        initialRouteKey={'routeA'}
        navBarPrefersLargeTitles={false}
        routes={[{
          routeKey: 'routeA',
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
        }, {
          routeKey: 'routeB',
          routeOptionsDefault: {
            routeTitle: "Route B",
          },
          renderRoute: () => (
            <ExampleRoute/>
          ),
        }]}
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