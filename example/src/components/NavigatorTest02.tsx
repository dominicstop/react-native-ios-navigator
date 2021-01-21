import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { RouteViewPortal, NavigatorView, NavRouteEvents, RouteContentProps, useNavRouteEvents } from 'react-native-ios-navigator';
import * as Colors from '../constants/Colors';

function ExampleRoute(props: RouteContentProps){
  const [index, setIndex] = React.useState(0);

  return (
    <View style={styles.routeContainer}>
      <RouteViewPortal
        renderNavBarLeftItem={() => (
          <Text>
            {`Custom Left`}
          </Text>
        )}
        renderNavBarTitleItem={() => (
          <View style={styles.navBarTitleContainer}>
            <Text style={styles.navBarTitle}>
              {`Title: ${index}`}
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
          console.log(index);
          setIndex(prevIndex => prevIndex + 1);
          const navRef = props.getRefToNavigator();
          navRef.forceUpdate();
        }}
      >
        {'The nav bar title should increment every time you touch this text'}
      </Text>
    </View>
  );
};

export function NavigatorTest02() {
  return(
    <View style={styles.rootContainer}>
      <NavigatorView
        ref={r => this.navRef = r}
        initialRouteKey={'routeA'}
        routes={[{
          routeKey: 'routeA',
          routeOptions: {
            routeTitle: "Route A",
          },
          renderRoute: () => (
            <ExampleRoute/>
          ),
        }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  routeContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  textTitle: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  textSubtitle: {
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 12,
    borderRadius: 12,
  },
  navBarTitleContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.PURPLE.A700,
    borderRadius: 10,
  },
  navBarTitle: {
    color: 'white',
    fontWeight: 'bold'
  },
});