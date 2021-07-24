import * as React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';

import { NavigatorView, RouteContentProps, RouteViewPortal } from 'react-native-ios-navigator';

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



function RouteA(props: RouteContentProps){
  const [bgColor] = React.useState(randomBGColor());
  const routeContainerStyle = { backgroundColor: bgColor };

  return (
    <SafeAreaView style={[styles.routeContainer, routeContainerStyle]}>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>
          {`routeKey: `}
          <Text style={styles.subtitleText}>
            {props.navigation.routeKey}
          </Text>
        </Text>
        <Text style={styles.titleText}>
          {`routeIndex: `}
          <Text style={styles.subtitleText}>
            {props.navigation.routeIndex}
          </Text>
        </Text>
        <Text style={styles.titleText}>
          {`routeProps: `}
          <Text style={styles.subtitleText}>
            {JSON.stringify(props.navigation.routeProps ?? {})}
          </Text>
        </Text>
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          const nav = props.navigation;
          nav.push({routeKey: 'routeA'});
        }}
      >
        <Text style={styles.buttonText}>
          {'Push: RouteA'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export function NavigatorTest05() {
  return(
    <SafeAreaView style={styles.rootContainer}>
      <RouteViewPortal
        routeOptions={{
          largeTitleDisplayMode: 'never',
        }}
      />
      <NavigatorView
        ref={r => { this.navRef = r }}
        initialRoutes={[{ 
          routeKey: 'routeA',
          routeProps: { message: 'A' }
        }, { 
          routeKey: 'TestNativeRoute',
          routeProps: { message: 'B' }
        }, { 
          routeKey: 'routeA',
          routeProps: { message: 'C' }
        }, { 
          routeKey: 'TestNativeRoute',
          routeProps: { message: 'D' }
        }, { 
          routeKey: 'routeA',
          routeProps: { message: 'E' }
        }, { 
          routeKey: 'TestNativeRoute',
          routeProps: { message: 'F' }
        }, { 
          routeKey: 'routeA',
          routeProps: { message: 'G' }
        }, { 
          routeKey: 'TestNativeRoute',
          routeProps: { message: 'H' }
        }]}
        navBarPrefersLargeTitles={false}
        onCustomCommandFromNative={({nativeEvent}) => {
          Alert.alert(
            nativeEvent.commandKey, 
            JSON.stringify(nativeEvent.commandData)
          );
        }}
        routes={{
          routeA: {
            routeOptionsDefault: {
              routeTitle: "Route A",
            },
            renderRoute: () => (
              <RouteA/>
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
  textContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 5,
  },
  subtitleText: {
    fontWeight: '300',
    opacity: 0.75,
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