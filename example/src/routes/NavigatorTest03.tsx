import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import { RouteViewPortal, RouteContentProps } from 'react-native-ios-navigator';

import { CardButton } from '../components/ui/Card';
import { Spacer } from '../components/ui/Spacer';


export function NavigatorTest03(props: RouteContentProps){
  const [isNavBarHidden, setIsNavBarHidden] = React.useState(false);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
      <RouteViewPortal
        routeOptions={{
          largeTitleDisplayMode: 'never',
        }}
      />
      <CardButton
        title={'Push `NavigatorTest03`'}
        subtitle={'Push a new route'}
        onPress={() => {
          props.navigation.push({routeKey: 'NavigatorTest03'});
        }}
      />
      <CardButton
        title={'Pop Current Route'}
        subtitle={'Go back to the previous route.'}
        onPress={() => {
          props.navigation.pop();
        }}
      />
      <CardButton
        title={'Pop to Root'}
        subtitle={'Go back to the first route.'}
        onPress={() => {
          props.navigation.popToRoot();
        }}
      />
      <CardButton
        title={'Remove Route: 01'}
        subtitle={'Remove route with `routeIndex: 1`'}
        onPress={() => {
          props.navigation.removeRoute(1);
        }}
      />
      <CardButton
        title={'Remove Route: 01, 02'}
        subtitle={'Remove route with `routeIndex: 1...2`'}
        onPress={() => {
          props.navigation.removeRoutes([1,2]);
        }}
      />
      <CardButton
        title={'Toggle `isNavBarHidden`'}
        subtitle={`Toggle the navigation bar visibility`}
        onPress={() => {
          props.navigation.setNavigationBarHidden(!isNavBarHidden, true);
          setIsNavBarHidden(!isNavBarHidden);
        }}
      />
      <CardButton
        title={'Replace Route: 01'}
        subtitle={'Replace route with `routeIndex: 1` w/ `routeKey: Home`'}
        onPress={() => {
          props.navigation.replaceRoute(1, {routeKey: 'Home'});
        }}
      />
      <CardButton
        title={'Insert Route: 01'}
        subtitle={'Insert route at `routeIndex: 1` w/ `routeKey: NavigatorTest01`'}
        onPress={() => {
          props.navigation.insertRoute({routeKey: 'NavigatorTest01'}, 1);
        }}
      />

      <Spacer space={30}/>
      <CardButton
        title={'Set Routes: Reverse Sort'}
        subtitle={'Sort the routes in reverse order'}
        onPress={() => {
          props.navigation.setRoutes((routes) => [...routes].reverse());
        }}
      />
      <CardButton
        title={'Set Routes: Insert Route Front'}
        subtitle={'Insert route w/ `routeKey: NavigatorTest01`'}
        onPress={() => {
          props.navigation.setRoutes((routes) => [...routes, {routeKey: 'NavigatorTest01'}]);
        }}
      />
      <CardButton
        title={'Set Routes: Remove Current'}
        subtitle={'Remove the topmost route'}
        onPress={() => {
          props.navigation.setRoutes((routes) => routes.slice(0, routes.length - 1));
        }}
      />

      <Spacer space={30}/>
      <CardButton
        title={'Replace Route: 0'}
        subtitle={'Replace the 1st route w/ `routeKey: NavigatorTest01`'}
        onPress={() => {
          props.navigation.replaceRoute(0,{routeKey: 'NavigatorTest01'});
        }}
      />
      <CardButton
        title={'Remove Route: 0'}
        subtitle={'Remove the first route'}
        onPress={() => {
          props.navigation.removeRoute(0);
        }}
      />
      <CardButton
        title={'Remove Route: 01'}
        subtitle={'Remove route with `routeIndex: 1`'}
        onPress={() => {
          props.navigation.removeRoute(1);
        }}
      />

      <Spacer space={30}/>
      <CardButton
        title={'Remove Prev. Route'}
        subtitle={'Remove prev. route'}
        onPress={() => {
          props.navigation.removePreviousRoute();
        }}
      />
      <CardButton
        title={'Remove All Prev. Routes'}
        subtitle={'Remove all the prev. routes'}
        onPress={() => {
          props.navigation.removeAllPrevRoutes();
        }}
      />
      <CardButton
        title={'Replace Current Route'}
        subtitle={'Replace current route w/ `routeKey: NavigatorTest01`'}
        onPress={() => {
          props.navigation.replaceCurrentRoute({routeKey: 'NavigatorTest01'});
        }}
      />
      <CardButton
        title={'Replace Prev. Route'}
        subtitle={'Replace prev. route w/ `routeKey: NavigatorTest01`'}
        onPress={() => {
          props.navigation.replacePreviousRoute({routeKey: 'NavigatorTest01'});
        }}
      />

      <Spacer space={30}/>
      <CardButton
        title={'Push Native Route'}
        subtitle={'Push a native route: `TestNativeRoute`'}
        onPress={() => {
          props.navigation.push({
            routeKey: 'TestNativeRoute',
            routeProps: { message: "Hello from JS" },
          });
        }}
      />
      <CardButton
        title={'Replace w/ Native Route`'}
        subtitle={'Replace current route with: `TestNativeRoute``'}
        onPress={() => {
          props.navigation.replaceCurrentRoute({routeKey: 'TestNativeRoute'});
        }}
      />
      <CardButton
        title={'Insert w/ Native Route`'}
        subtitle={'Insert native route `TestNativeRoute` at index 1'}
        onPress={() => {
          props.navigation.insertRoute({routeKey: 'TestNativeRoute'}, 1);
        }}
      />
      <CardButton
        title={'SetRoutes w/ Native Route`'}
        subtitle={'Insert native route `TestNativeRoute` in the front.'}
        onPress={() => {
          props.navigation.setRoutes((routes) => ([
            ...routes, { routeKey: `TestNativeRoute` }
          ]));
        }}
      />

      <Spacer space={30}/>
      <CardButton
        title={'Trigger `sendCustomCommandToNative`'}
        subtitle={'Send custom command to the current navigator.'}
        onPress={() => {
          props.navigation.sendCustomCommandToNative('Test01', {
            message: 'Hello' 
          });
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    paddingTop: 25,
    paddingBottom: 100,
    paddingHorizontal: 12,
  },
});