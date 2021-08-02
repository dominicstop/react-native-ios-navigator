import * as React from 'react';
import { StyleSheet, SafeAreaView, ViewStyle, Text, TouchableOpacity } from 'react-native';

import { RouteContentProps, RouteViewEvents, RouteViewPortal } from 'react-native-ios-navigator';

import * as Colors  from '../../constants/Colors';
import * as Helpers from '../../functions/Helpers';
import { RouteKeys } from './NavigatorTest08';

import type { RouteProps } from './SharedTypes';


const BG_COLORS = [
  Colors.RED.A700,
  Colors.PINK.A700,
  Colors.VIOLET.A700,
  Colors.PURPLE.A700,
  Colors.INDIGO.A700,
  Colors.BLUE.A700,
  Colors.GREEN.A700,
  Colors.LIGHT_GREEN.A700,
  Colors.YELLOW.A700,
  Colors.AMBER.A700,
  Colors.ORANGE.A700,
];

export function RouteB(props: RouteContentProps<RouteProps>){
  const navigation = props.navigation;
  const routeProps = navigation.routeProps;

  const [bgColor] = React.useState(
    Helpers.randomElement(BG_COLORS)
  );

  const rootContainerStyle: ViewStyle = {
    backgroundColor: bgColor,
  };

  return(
    <React.Fragment>
      <RouteViewPortal
        routeOptions={{
          routeTitle: `${navigation.routeKey} - ${navigation.routeIndex}`,
        }}
        renderNavBarRightItem={() => (
          <TouchableOpacity 
            style={styles.buttonContainer}
            onPress={() => {
              navigation.push({routeKey: RouteKeys.RouteA});
            }}
          >
            <Text style={styles.buttonText}>
              {'Push RouteA'}
            </Text>
          </TouchableOpacity>
        )}
      />
      <RouteViewEvents
        onRouteWillPush={() => {
          routeProps.recordEvent({
            eventType: 'onRouteWillPush',
            timestamp: Date.now(),
            routeKey: navigation.routeKey,
            routeIndex: navigation.routeIndex,
          });
        }}
        onRouteDidPush={() => {
          routeProps.recordEvent({
            eventType: 'onRouteDidPush',
            timestamp: Date.now(),
            routeKey: navigation.routeKey,
            routeIndex: navigation.routeIndex,
          });
        }}
        onRouteWillPop={() => {
          routeProps.recordEvent({
            eventType: 'onRouteWillPop',
            timestamp: Date.now(),
            routeKey: navigation.routeKey,
            routeIndex: navigation.routeIndex,
          });
        }}
        onRouteDidPop={() => {
          routeProps.recordEvent({
            eventType: 'onRouteDidPop',
            timestamp: Date.now(),
            routeKey: navigation.routeKey,
            routeIndex: navigation.routeIndex,
          });
        }}
        onRouteWillFocus={() => {
          routeProps.recordEvent({
            eventType: 'onRouteWillFocus',
            timestamp: Date.now(),
            routeKey: navigation.routeKey,
            routeIndex: navigation.routeIndex,
          });
        }}
        onRouteDidFocus={() => {
          routeProps.recordEvent({
            eventType: 'onRouteDidFocus',
            timestamp: Date.now(),
            routeKey: navigation.routeKey,
            routeIndex: navigation.routeIndex,
          });
        }}
        onRouteWillBlur={() => {
          routeProps.recordEvent({
            eventType: 'onRouteWillBlur',
            timestamp: Date.now(),
            routeKey: navigation.routeKey,
            routeIndex: navigation.routeIndex,
          });
        }}
        onRouteDidBlur={() => {
          routeProps.recordEvent({
            eventType: 'onRouteDidBlur',
            timestamp: Date.now(),
            routeKey: navigation.routeKey,
            routeIndex: navigation.routeIndex,
          });
        }}
      />
      <SafeAreaView style={[styles.rootContainer, rootContainerStyle]}>
        <Text style={styles.textTitle}>
          <Text style={styles.textTitleLabel}>
            {'routeKey: '}
          </Text>
          <Text style={styles.textTitleValue}>
            {navigation.routeKey}
          </Text>
        </Text>
        <Text style={styles.textTitle}>
          <Text style={styles.textTitleLabel}>
            {'routeIndex: '}
          </Text>
          <Text style={styles.textTitleValue}>
            {navigation.routeIndex}
          </Text>
        </Text>
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    color: 'white',
    marginBottom: 10,
    fontSize: 32,
  },
  textTitleLabel: {
    fontWeight: 'bold',
  },
  textTitleValue: {
    fontWeight: '300',
    opacity: 0.9,
  },
  buttonContainer: {
    backgroundColor: Colors.PURPLE.A700,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});