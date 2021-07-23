import * as React from 'react';
import { StyleSheet, ScrollView, Alert  } from 'react-native';

import { RouteContentProps, RouteViewEvents, RouteViewPortal } from 'react-native-ios-navigator';

import { CardBody, CardButton, CardTitle } from '../../components/ui/Card';

import type { RouteProps } from './SharedTypes';


export function RouteA(props: RouteContentProps<RouteProps>){
  const navigation = props.navigation;
  const routeProps = navigation.routeProps;

  return(
    <React.Fragment>
      <RouteViewPortal
        routeOptions={{
          routeTitle: `${navigation.routeKey} - ${navigation.routeIndex}`,
        }}
      />
      <RouteViewEvents
        onRouteWillPush={() => {
          console.log('onRouteWillPush - routeProps: ', routeProps, ' - navigation: ', navigation);
          routeProps.recordEvent({
            eventType: 'onRouteWillPush',
            timestamp: Date.now(),
          });
        }}
        onRouteDidPush={() => {
          routeProps.recordEvent({
            eventType: 'onRouteDidPush',
            timestamp: Date.now(),
          });
        }}
        onRouteWillPop={() => {
          routeProps.recordEvent({
            eventType: 'onRouteWillPop',
            timestamp: Date.now(),
          });
        }}
        onRouteDidPop={() => {
          routeProps.recordEvent({
            eventType: 'onRouteDidPop',
            timestamp: Date.now(),
          });
        }}
        onRouteWillFocus={() => {
          routeProps.recordEvent({
            eventType: 'onRouteWillFocus',
            timestamp: Date.now(),
          });
        }}
        onRouteDidFocus={() => {
          routeProps.recordEvent({
            eventType: 'onRouteDidFocus',
            timestamp: Date.now(),
          });
        }}
        onRouteWillBlur={() => {
          routeProps.recordEvent({
            eventType: 'onRouteWillBlur',
            timestamp: Date.now(),
          });
        }}
        onRouteDidBlur={() => {
          routeProps.recordEvent({
            eventType: 'onRouteDidBlur',
            timestamp: Date.now(),
          });
        }}
      />
      <ScrollView contentContainerStyle={styles.rootContainer}>
        <CardBody>
          <CardTitle
            title={'Navigation Commands'}
            subtitle={`Debug - routeIndex: '${navigation.routeIndex}', routeKey: '${navigation.routeKey}'`}
          />
          <CardButton
            title={'Push Route'}
            subtitle={`Push 'RouteA' into the stack`}
            onPress={() => {
              navigation.push({routeKey: 'RouteA', routeProps});
            }}
          />
          <CardButton
            title={'Pop to Route'}
            subtitle={`Remove all the routes in the stack`}
            onPress={() => {
              navigation.popToRoot();
            }}
          />
          <CardButton
            title={'Remove Previous Route'}
            subtitle={`Remove the previous route in the stack`}
            onPress={() => {
              const activeRoutes = navigation.getActiveRoutes();
              
              if(activeRoutes.length < 2){
                Alert.alert('Error', 'No previous route to remove.');
              } else {
                navigation.removePreviousRoute();
              }; 
            }}
          />
          <CardButton
            title={'Insert Route in Index 0'}
            subtitle={`Insert 'RouteA' at 'routeIndex: 0'`}
            onPress={() => {
              props.navigation.insertRoute({routeKey: 'RouteA', routeProps}, 0);
            }}
        />
        </CardBody>
      </ScrollView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingVertical: 10,
    minHeight: '125%',
  },
});