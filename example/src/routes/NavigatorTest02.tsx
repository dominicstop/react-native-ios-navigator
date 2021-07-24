import * as React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';

import { RouteViewPortal, RouteContentProps, useNavRouteEvents } from 'react-native-ios-navigator';
import * as Colors from '../constants/Colors';

export function NavigatorTest02(props: RouteContentProps){
  const [index, setIndex] = React.useState(0);

  useNavRouteEvents('onPressNavBarLeftItem', ({nativeEvent}) => {
    Alert.alert('onPressNavBarLeftItem', `key: ${nativeEvent.key}`);
  });

  return (
    <ScrollView contentContainerStyle={styles.routeContainer}>
      <RouteViewPortal
        routeOptions={{
          routeTitle: `index: ${index}`,
          largeTitleDisplayMode: 'never',
          navBarButtonLeftItemsConfig: [{
            type: 'TEXT',
            title: `index: ${index}`,
            tintColor: 'red',
          }],
        }}
        renderNavBarRightItem={() => (
          <TouchableOpacity onPress={() => {
            Alert.alert('TouchableOpacity', `onPress Custom Right`);
          }}>
            <Text>
              {`Custom Right`}
            </Text>
          </TouchableOpacity>
        )}
        renderNavBarTitleItem={({routeOptions}) => (
          <View style={styles.navBarTitleContainer}>
            <Text style={styles.navBarTitle}>
              {routeOptions.routeTitle ?? 'N/A'}
            </Text>
          </View>
        )}
      />
      <Text style={styles.textTitle}>
        {'Custom Nav Bar Item Test'}
      </Text>
      <Text 
        style={styles.textSubtitle}
        onPress={() => {
          setIndex(prevIndex => prevIndex + 1);
        }}
      >
        {'The nav bar title should increment every time you touch this text'}
      </Text>
      <TouchableOpacity style={styles.button}
        onPress={() => {
          const routeRef = props.navigation.getRefToRoute();
          routeRef.setHidesBackButton(true, true);
        }}
      >
        <Text style={styles.buttonText}>
          {'Hide Back Button'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  routeContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textTitle: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  textSubtitle: {
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.PURPLE.A700,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navBarTitleContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.PURPLE.A700
  },
  navBarTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
});