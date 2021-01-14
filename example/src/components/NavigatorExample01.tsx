import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NavigatorView, RouteContentProps } from 'react-native-ios-navigator';

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
  return {backgroundColor: Helpers.randomElement<string>(colors)};
};

export class NavigatorExample01 extends React.Component<RouteContentProps> {
  navRef: NavigatorView;

  render(){
    const props = this.props;

    return(
      <View style={styles.rootContainer}>
        <NavigatorView
          ref={r => this.navRef = r}
          initialRouteKey={'routeA'}
          routes={[{
            routeKey: 'routeA',
            routeOptions: {
              routeTitle: "Route A",
            },
            renderRoute: (route, index) => (
              <View style={[styles.routeContainer, randomBGColor()]}>
                <Text style={styles.textRoute}>
                  {`Debug: ${route.routeKey} - ${index}`}
                </Text>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    this.navRef.push({routeKey: 'routeA'});
                  }}
                >
                  <Text style={styles.buttonText}>
                    {'Push: RouteA'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  onPress={() => {
                    this.navRef.push({routeKey: 'routeB'});
                  }}
                >
                  <Text style={styles.buttonText}>
                    {'Push: RouteB'}
                  </Text>
                </TouchableOpacity>
              </View>
            ),
          }, {
            routeKey: 'routeB',
            routeOptions: {
              routeTitle: "Route B",
            },
            renderRoute: (route, index) => (
              <View style={styles.routeContainer}>
                <Text style={styles.textRoute}>
                  {`Debug: ${route.routeKey} - ${index}`}
                </Text>
              </View>
            ),
          }]}
        />
      </View>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  routeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
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