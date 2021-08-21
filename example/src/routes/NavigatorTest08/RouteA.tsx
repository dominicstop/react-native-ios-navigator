import * as React from 'react';
import { StyleSheet, ScrollView, Alert  } from 'react-native';

import { RouteContentProps, RouteViewEvents, RouteViewPortal } from 'react-native-ios-navigator';

import { CardBody, CardButton, CardTitle } from '../../components/ui/Card';
import { RouteKeys } from './NavigatorTest08';

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
      <ScrollView contentContainerStyle={styles.rootContainer}>
        <CardBody>
          <CardTitle
            title={'Navigation Commands'}
            subtitle={`Debug - routeIndex: '${navigation.routeIndex}', routeKey: '${navigation.routeKey}'`}
          />
          <CardButton
            title={'Push RouteA'}
            subtitle={`Push 'RouteA' into the stack`}
            onPress={() => {
              navigation.push({routeKey: RouteKeys.RouteA});
            }}
          />
          <CardButton
            title={'Push RouteB'}
            subtitle={`Push 'RouteA' into the stack`}
            onPress={() => {
              navigation.push({routeKey: RouteKeys.RouteB});
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
            title={'Remove All Previous Routes'}
            subtitle={`Remove all the previous route in the stack`}
            onPress={() => {
              const activeRoutes = navigation.getActiveRoutes();
              
              if(activeRoutes.length < 2){
              } else {
                navigation.removeAllPrevRoutes();
              }; 
            }}
          />
          <CardButton
            title={'Insert RouteA in Index 0'}
            subtitle={`Insert 'RouteA' at 'routeIndex: 0'`}
            onPress={() => {
              props.navigation.insertRoute({routeKey: RouteKeys.RouteA}, 0);
            }}
        />
        <CardButton
          title={'Insert RouteB in Index 0'}
          subtitle={`Insert 'RouteB' at 'routeIndex: 0'`}
          onPress={() => {
            props.navigation.insertRoute({routeKey: RouteKeys.RouteB}, 0);
          }}
        />
        <CardButton
          title={'Replace Prev. Route'}
          subtitle={`Replace previous route with 'RouteB'`}
          onPress={async () => {
            try {
              await props.navigation.replacePreviousRoute({routeKey: RouteKeys.RouteB});
            } catch(error){
              Alert.alert('Error', error.toString());
            };
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
    minHeight: '200%',
  },
});