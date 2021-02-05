import * as React from 'react';

import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NavigatorView, RouteContentProps } from 'react-native-ios-navigator';

import { NavigatorExample01 } from './components/NavigatorExample01';
import { NavigatorTest01 } from './components/NavigatorTest01';
import { NavigatorTest02 } from './components/NavigatorTest02';
import { NavigatorDemo01 } from './components/NavigatorDemo01';

import * as Colors from './constants/Colors';

const RouteKeys = {
  Home: 'Home',
  NavigatorExample01: 'NavigatorExample01',
  NavigatorTest01: 'NavigatorTest01',
  NavigatorTest02: 'NavigatorTest02',
  NavigatorDemo01: 'NavigatorDemo01',
};

const RouteItems = [{ 
  routeKey: RouteKeys.NavigatorExample01,
}, {
  routeKey: RouteKeys.NavigatorTest01,
}, {
  routeKey: RouteKeys.NavigatorTest02,
}, { 
  routeKey: RouteKeys.NavigatorDemo01,
},];


class HomeRoute extends React.PureComponent<RouteContentProps> {
  static styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    navRouteItem: {
      paddingHorizontal: 10,
      paddingVertical: 15,
    },
    navRouteContainer: {
    },
    textNavRouteTitleIndicator: {
      color: Colors.GREY[900],
    },
    textNavRouteTitle: {
      fontSize: 16,
      color: Colors.GREY[700],
    },
  });

  _handleOnPressItem = async ({item, index}) => {
    const navigation = this.props.navigation;

    if(item.routeKey != RouteKeys.NavigatorTest02){
      //await navRef.setNavigationBarHidden(true, true);
    };

    await navigation.push({routeKey: item.routeKey});
  };

  _renderItem = ({item, index}) => {
    const { styles } = HomeRoute;

    return (
      <TouchableOpacity 
        style={styles.navRouteItem}
        onPress={() => this._handleOnPressItem({item, index})}
      >
        <View style={styles.navRouteContainer}>
          <Text style={styles.textNavRouteTitle}>
            <Text style={styles.textNavRouteTitleIndicator}>
              {`${index + 1}. `}
            </Text>
            {item.routeKey}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render(){
    const { styles } = HomeRoute;

    return (
      <React.Fragment>
        <FlatList
          style={styles.rootContainer}
          data={RouteItems}
          keyExtractor={(item) => item.routeKey}
          renderItem={this._renderItem}
        />
      </React.Fragment>
    );
  }; 
};

export default function App() {
  return (
    <NavigatorView
      ref={r => this.navRef = r}
      style={styles.container}
      initialRouteKey={RouteKeys.Home}
      isInteractivePopGestureEnabled={false}
      navBarPrefersLargeTitles={true}
      routes={[{
        routeKey: RouteKeys.Home,
        routeOptionsDefault: {
          routeTitle: "Home",
        },
        renderRoute: () => (
          <HomeRoute/>
        ),
      }, {
        routeKey: RouteKeys.NavigatorExample01,
        renderRoute: () => (
          <NavigatorExample01/>
        ),
      }, {
        routeKey: RouteKeys.NavigatorTest01,
        renderRoute: () => (
          <NavigatorTest01/>
        ),
      }, {
        routeKey: RouteKeys.NavigatorTest02,
        renderRoute: () => (
          <NavigatorTest02/>
        ),
      }, {
        routeKey: RouteKeys.NavigatorDemo01,
        routeOptionsDefault: {
          largeTitleDisplayMode: 'never',
        },
        renderRoute: () => (
          <NavigatorDemo01/>
        ),
      }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
