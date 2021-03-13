import * as React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, SafeAreaView } from 'react-native';

import { RouteViewPortal, RouteContentProps, useNavBarItemEvents } from 'react-native-ios-navigator';
import * as Colors from '../constants/Colors';


function ButtonWithSubtitle(props: {
  title: string,
  subtitle: string,
  onPress: () => void,
}){
  return(
    <TouchableOpacity
      onPress={props.onPress}
      style={{
        backgroundColor: Colors.PURPLE.A700,
        borderRadius: 10,
        overflow: 'hidden',
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginHorizontal: 15,
        marginVertical: 10,
      }}
    >
      <View>
        <Text style={{
          color: 'white',
          fontSize: 16,
          fontWeight: '500'
        }}>
          {props.title}
        </Text>
        <Text style={{
          color: 'white',
          fontSize: 16,
          fontWeight: '300',
          opacity: 0.8,
        }}>
          {props.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export function NavigatorTest03(props: RouteContentProps){
  const [isNavBarHidden, setIsNavBarHidden] = React.useState(false);

  return (
    <ScrollView contentContainerStyle={styles.testContainer}>
      <RouteViewPortal
        routeOptions={{
          largeTitleDisplayMode: 'never',
        }}
      />
      <ButtonWithSubtitle
        title={'Push `NavigatorTest03`'}
        subtitle={'Push a new route'}
        onPress={() => {
          props.navigation.push({routeKey: 'NavigatorTest03'});
        }}
      />
      <ButtonWithSubtitle
        title={'Pop Current Route'}
        subtitle={'Go back to the previous route.'}
        onPress={() => {
          props.navigation.pop();
        }}
      />
      <ButtonWithSubtitle
        title={'Pop to Root'}
        subtitle={'Go back to the first route.'}
        onPress={() => {
          props.navigation.popToRoot();
        }}
      />
      <ButtonWithSubtitle
        title={'Remove Route: 01'}
        subtitle={'Remove route with `routeIndex: 1`'}
        onPress={() => {
          props.navigation.removeRoute(1);
        }}
      />
      <ButtonWithSubtitle
        title={'Remove Route: 01, 02'}
        subtitle={'Remove route with `routeIndex: 1...2`'}
        onPress={() => {
          props.navigation.removeRoutes([1,2]);
        }}
      />
      <ButtonWithSubtitle
        title={'Toggle `isNavBarHidden`'}
        subtitle={`Toggle the navigation bar visibility`}
        onPress={() => {
          props.navigation.setNavigationBarHidden(!isNavBarHidden, true);
          setIsNavBarHidden(!isNavBarHidden);
        }}
      />
      <ButtonWithSubtitle
        title={'Replace Route: 01'}
        subtitle={'Replace route with `routeIndex: 1` w/ `routeKey: Home`'}
        onPress={() => {
          props.navigation.replaceRoute(1, {routeKey: 'Home'});
        }}
      />
      <ButtonWithSubtitle
        title={'Insert Route: 01'}
        subtitle={'Insert route at `routeIndex: 1` w/ `routeKey: NavigatorTest01`'}
        onPress={() => {
          props.navigation.insertRoute({routeKey: 'NavigatorTest01'}, 1);
        }}
      />

      <View style={{marginTop: 30}}/>
      <ButtonWithSubtitle
        title={'Set Routes: Reverse Sort'}
        subtitle={'Sort the routes in reverse order'}
        onPress={() => {
          props.navigation.setRoutes((routes) => [...routes].reverse());
        }}
      />
      <ButtonWithSubtitle
        title={'Set Routes: Insert Route Front'}
        subtitle={'Insert route w/ `routeKey: NavigatorTest01`'}
        onPress={() => {
          props.navigation.setRoutes((routes) => [...routes, {routeKey: 'NavigatorTest01'}]);
        }}
      />
      <ButtonWithSubtitle
        title={'Set Routes: Remove Current'}
        subtitle={'Remove the topmost route'}
        onPress={() => {
          props.navigation.setRoutes((routes) => routes.slice(0, routes.length - 1));
        }}
      />

      <View style={{marginTop: 30}}/>
      <ButtonWithSubtitle
        title={'Replace Route: 0'}
        subtitle={'Replace the 1st route w/ `routeKey: NavigatorTest01`'}
        onPress={() => {
          props.navigation.replaceRoute(0,{routeKey: 'NavigatorTest01'});
        }}
      />
      <ButtonWithSubtitle
        title={'Remove Route: 0'}
        subtitle={'Remove the first route'}
        onPress={() => {
          props.navigation.removeRoute(0);
        }}
      />
      <ButtonWithSubtitle
        title={'Remove Route: 01'}
        subtitle={'Remove route with `routeIndex: 1`'}
        onPress={() => {
          props.navigation.removeRoute(1);
        }}
      />

      <View style={{marginTop: 30}}/>
      <ButtonWithSubtitle
        title={'Remove Prev. Route'}
        subtitle={'Remove prev. route'}
        onPress={() => {
          props.navigation.removePreviousRoute();
        }}
      />
      <ButtonWithSubtitle
        title={'Remove All Prev. Routes'}
        subtitle={'Remove all the prev. routes'}
        onPress={() => {
          props.navigation.removeAllPrevRoutes();
        }}
      />
      <ButtonWithSubtitle
        title={'Replace Current Route'}
        subtitle={'Replace current route w/ `routeKey: NavigatorTest01`'}
        onPress={() => {
          props.navigation.replaceCurrentRoute({routeKey: 'NavigatorTest01'});
        }}
      />
      <ButtonWithSubtitle
        title={'Replace Prev. Route'}
        subtitle={'Replace prev. route w/ `routeKey: NavigatorTest01`'}
        onPress={() => {
          props.navigation.replacePreviousRoute({routeKey: 'NavigatorTest01'});
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  testContainer: {
    paddingTop: 25,
    paddingBottom: 100,
  },
});