import * as React from 'react';

import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NavigatorView, RouteContentProps } from 'react-native-ios-navigator';

import { NavigatorExample01 } from './components/NavigatorExample01';
import { NavigatorTest01 } from './components/NavigatorTest01';
import { NavigatorTest02 } from './components/NavigatorTest02';

import * as Colors from './constants/Colors';

const RouteKeys = {
  Home: 'Home',
  NavigatorExample01: 'NavigatorExample01',
  NavigatorTest01: 'NavigatorTest01',
  NavigatorTest02: 'NavigatorTest02',
};

const RouteItems = [{ 
  routeKey: RouteKeys.NavigatorExample01,
}, {
  routeKey: RouteKeys.NavigatorTest01,
}, {
  routeKey: RouteKeys.NavigatorTest02,
}];


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
    const navRef = this.props.getRefToNavigator();

    if(item.routeKey != RouteKeys.NavigatorTest02){
      //await navRef.setNavigationBarHidden(true, true);
    };

    await navRef.push({routeKey: item.routeKey});
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
    <View style={styles.container}>
      <NavigatorView
        ref={r => this.navRef = r}
        initialRouteKey={RouteKeys.Home}
        navBarPrefersLargeTitles={true}
        routes={[{
          routeKey: RouteKeys.Home,
          defaultRouteOptions: {
            routeTitle: "Initial Route Title",
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
        }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
