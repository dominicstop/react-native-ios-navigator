import * as React from 'react';
import { StyleSheet, SafeAreaView, Alert } from 'react-native';

import { NavigatorView, RouteContentProps, RouteViewPortal } from 'react-native-ios-navigator';
import { CardBody, CardButton, CardTitle } from '../components/ui/Card';
import { ObjectPropertyDisplay } from '../components/ui/ObjectPropertyDisplay';

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

  const data = {
    routeKey: props.navigation.routeKey,
    routeIndex: props.navigation.routeIndex,
    routeProps: props.navigation.routeProps,
  };

  return(
    <SafeAreaView style={[styles.routeContainer, routeContainerStyle]}>
      <CardBody style={styles.cardBody}>
        <CardTitle
          title={'React/JS Route'}
          pillTitle={'RouteA'}
        />
        <ObjectPropertyDisplay
          object={data}
        />
        <CardButton
          title={'Push React Route'}
          subtitle={"Push route: 'RouteA'"}
          onPress={() => {
            const nav = props.navigation;
            nav.push({routeKey: 'routeA'});
          }}
        />
        <CardButton
          title={'Push Native Route'}
          subtitle={"Push 'UIViewController': 'TestNativeRoute'"}
          onPress={() => {
            const nav = props.navigation;
            nav.push({
              routeKey: 'TestNativeRoute', 
              routeProps: { 
                routeToPush: 'routeA', 
              },
            });
          }}
        />
      </CardBody>
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
          routeProps: { message: 'B', routeToPush: 'routeA' }
        }, { 
          routeKey: 'routeA',
          routeProps: { message: 'C' }
        }, { 
          routeKey: 'TestNativeRoute',
          routeProps: { message: 'D', routeToPush: 'routeA' }
        }, { 
          routeKey: 'routeA',
          routeProps: { message: 'E' }
        }, { 
          routeKey: 'TestNativeRoute',
          routeProps: { message: 'F', routeToPush: 'routeA' }
        }, { 
          routeKey: 'routeA',
          routeProps: { message: 'G' }
        }, { 
          routeKey: 'TestNativeRoute',
          routeProps: { message: 'H', routeToPush: 'routeA' }
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
    justifyContent: 'center',
  },
  cardBody: {
    marginHorizontal: 12
  },
  textContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  titleText: {
    alignSelf: 'center',
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '500',
  },
  labelText: {
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 5,
  },
  labelValueText: {
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