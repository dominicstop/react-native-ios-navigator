import * as React from 'react';

import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NavigatorView, RouteContentProps } from 'react-native-ios-navigator';

import { NavigatorExample01 } from './components/NavigatorExample01';
import { NavigatorTest01 } from './components/NavigatorTest01';

import * as Colors from './constants/Colors';

const RouteKeys = {
  Home: 'Home',
  NavigatorExample01: 'NavigatorExample01',
  NavigatorTest01: 'NavigatorTest01',
};

const RouteItems = [{ 
  routeKey: RouteKeys.NavigatorExample01,
}, {
  routeKey: RouteKeys.NavigatorTest01,
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
    await navRef.setNavigationBarHidden(true, true);
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
      <FlatList
        style={styles.rootContainer}
        data={RouteItems}
        keyExtractor={(item) => item.routeKey}
        renderItem={this._renderItem}
      />
    );
  }; 
};

export default function App() {
  return (
    <View style={styles.container}>
      <NavigatorView
        ref={r => this.navRef = r}
        initialRouteKey={RouteKeys.Home}
        routes={[{
          routeKey: RouteKeys.Home,
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
