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
  return (
    <SafeAreaView style={styles.testContainer}>
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
      <RouteViewPortal
        routeOptions={{
          largeTitleDisplayMode: 'never',
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  testContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});