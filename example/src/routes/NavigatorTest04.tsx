import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';

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

function Button(props: { 
  title: string;
  subtitle: string;
  onPress: Function;
  marginTop?: number;
}){
  return (
    <TouchableOpacity
      style={[styles.buttonContainer, {marginTop: props.marginTop ?? 15}]}
      onPress={() => {
        props.onPress();
      }}
    >
      <Text style={styles.buttonText}>
        {props.title}
      </Text>
      <Text style={styles.buttonLabelText}>
          {props.subtitle}
        </Text>
    </TouchableOpacity>
  );
};

function MainRoute(props: RouteContentProps){
  const [bgColor] = React.useState(randomBGColor());
  const routeContainerStyle = { backgroundColor: bgColor };

  return (
    <ScrollView 
      style={[styles.routeContainer, routeContainerStyle]}
      contentContainerStyle={styles.routeContentContainer}
    >
      <View style={styles.debugDataContainer}>
        <Text style={styles.debugDataRouteIndexLabel}>
          {'Current Route Index'}
        </Text>
        <Text style={styles.debugDataRouteIndex}>
          {props.navigation.routeIndex}
        </Text>
      </View>
      <Button
        title={'Push'}
        subtitle={'with `FadePush` 1s'}
        marginTop={30}
        onPress={() => {
          props.navigation.push({
            routeKey: 'MainRoute'
          }, {
            transitionConfig: {
              type: 'FadePush',
              duration: 1,
            }
          });
        }}
      />
      <Button
        title={'Pop'}
        subtitle={'with `FadePop` 1s'}
        onPress={() => {
          props.navigation.pop({
            transitionConfig: {
              type: 'FadePop',
              duration: 1,
            }
          });
        }}
      />

      <Button
        title={'Push'}
        subtitle={'with `SlideLeftPush` 1s'}
        marginTop={30}
        onPress={() => {
          props.navigation.push({
            routeKey: 'MainRoute'
          }, {
            transitionConfig: {
              type: 'SlideLeftPush',
              duration: 1,
            }
          });
        }}
      />
      <Button
        title={'Pop'}
        subtitle={'with `SlideLeftPop` 1s'}
        onPress={() => {
          props.navigation.pop({
            transitionConfig: {
              type: 'SlideLeftPop',
              duration: 1,
            }
          });
        }}
      />

      <Button
        title={'Push'}
        subtitle={'with `SlideUpPush` 1s'}
        marginTop={30}
        onPress={() => {
          props.navigation.push({
            routeKey: 'MainRoute'
          }, {
            transitionConfig: {
              type: 'SlideUpPush',
              duration: 1,
            }
          });
        }}
      />
      <Button
        title={'Pop'}
        subtitle={'with `SlideUpPop` 1s'}
        onPress={() => {
          props.navigation.pop({
            transitionConfig: {
              type: 'SlideUpPop',
              duration: 1,
            }
          });
        }}
      />

      <Button
        title={'Push'}
        subtitle={'with `GlideUpPush` 1s'}
        marginTop={30}
        onPress={() => {
          props.navigation.push({
            routeKey: 'MainRoute'
          }, {
            transitionConfig: {
              type: 'GlideUpPush',
              duration: 1,
            }
          });
        }}
      />
      <Button
        title={'Pop'}
        subtitle={'with `GlideUpPop` 1s'}
        onPress={() => {
          props.navigation.pop({
            transitionConfig: {
              type: 'GlideUpPop',
              duration: 1,
            }
          });
        }}
      />
    </ScrollView>
  );
};

export function NavigatorTest04() {
  return (
    <SafeAreaView style={styles.rootContainer}>
      <RouteViewPortal
        routeOptions={{
          largeTitleDisplayMode: 'never',
        }}
      />
      <NavigatorView
        ref={r => { this.navRef = r }}
        initialRoutes={[{routeKey: 'MainRoute'}]}
        navBarPrefersLargeTitles={false}
        routes={[{
          routeKey: 'MainRoute',
          routeOptionsDefault: {
            largeTitleDisplayMode: 'never',
            
          },
          renderRoute: () => (
            <MainRoute/>
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
  routeContentContainer: {
    paddingBottom: 100,
  },
  routeContainer: {
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  debugDataContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 10,
    alignSelf: 'center',
    padding: 10,
  },
  debugDataRouteIndexLabel: {
    fontWeight: '300',
    opacity: 0.8,
  },
  debugDataRouteIndex: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: 'bold',
  },
  textRoute: {
    fontSize: 32,
  },
  buttonContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '500',
  },
  buttonLabelText: {
    fontWeight: '300',
    opacity: 0.8,
    fontSize: 16,
  },
});
