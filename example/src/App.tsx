import * as React from 'react';

import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { NavigatorView, RouteContentProps } from 'react-native-ios-navigator';

import { NavigatorExample01 } from './components/NavigatorExample01';

import { NavigatorTest01 } from './components/NavigatorTest01';
import { NavigatorTest02 } from './components/NavigatorTest02';
import { NavigatorTest03 } from './components/NavigatorTest03';
import { NavigatorTest04 } from './components/NavigatorTest04';

import { NavigatorDemo01 } from './components/NavigatorDemo01';
import { NavigatorDemo02 } from './components/NavigatorDemo02';

import * as Colors from './constants/Colors';


const RouteKeys = {
  Home: 'Home',
  NavigatorExample01: 'NavigatorExample01',
  NavigatorTest01: 'NavigatorTest01',
  NavigatorTest02: 'NavigatorTest02',
  NavigatorTest03: 'NavigatorTest03',
  NavigatorTest04: 'NavigatorTest04',
  NavigatorDemo01: 'NavigatorDemo01',
  NavigatorDemo02: 'NavigatorDemo02',
};

const RouteItems = [{ 
  routeKey: RouteKeys.NavigatorExample01,
  title: 'Basic Nested',
  desc: 'Nested navigator example w/ basic navigation (e.g. push and pop).',
}, {
  routeKey: RouteKeys.NavigatorTest01,
  title: 'Navbar Config',
  desc: (
      `Test for all the different ways a navigator bar can be configured,`
    + ` e.g. this is a test for setting/updating the 'RouteOptions'.`
  ),
}, {
  routeKey: RouteKeys.NavigatorTest02,
  title: 'Navbar Custom Title',
  desc: (
      `Test for showing a custom nav. bar title item and testing whether it`
    + ` updates property when the props updates.`
  )
}, { 
  routeKey: RouteKeys.NavigatorTest03,
  title: 'Navigation Commands',
  desc: (
      `Tester for all the navigation commands currently supported, e.g.`
    + ` push, pop, 'popToRoot', etc.`
  )
}, { 
  routeKey: RouteKeys.NavigatorTest04,
  title: 'Push/Pop Transitions',
  desc: (
      `Tester for the preset transitions that can be used for the push and pop`
    + ` navigation commands.`
  )
}, { 
  routeKey: RouteKeys.NavigatorDemo01,
  title: 'Navigator Nested Layout',
  desc: (
      `Automatic demo for showing nested navigators in varying configurations`
    + ` any layout. Also tests whether the 'push'/'pop' can be chained together`
    + ' via async/await + nav. events.'
  )
}, { 
  routeKey: RouteKeys.NavigatorDemo02,
  title: 'Navigator Recursive Nest',
  desc: (
      `Automatic demo for showing nested navigators, specifically this demos`
    + ` a customized nav. bar and tests whether they layout properly when they're`
    + ` continuously stacked/nested on top of one another.`
    + ` This also tests functional usage + hooks.`
  )
}];


function RouteItem(props: {
  routeKey: string;
  title: string;
  desc: string;
  index: number;
  onPress: Function;
}){
  return (
    <View style={styles.routeItemContainer}>
      <View style={styles.routeItemTitleContainer}>
        <Text style={styles.textRouteItemTitleBullet}>
          {`${props.index + 1}.`}
        </Text>
        <Text style={styles.textRouteItemTitle}>
          {props.routeKey}
        </Text>
      </View>
      <View style={styles.routeItemContentContainer}>
        <Text style={styles.routeItemTitleText}>
          {props.title}
        </Text>
        <Text style={styles.routeItemDescText}>
          {props.desc}
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.onPress(props.routeKey);
          }}
          style={styles.routeItemButton}
        >
          <Text style={styles.routeItemButtonText}>
            {'Go to Route'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


class HomeRoute extends React.PureComponent<RouteContentProps> {
  static styles = StyleSheet.create({
    rootContainer: {
      paddingBottom: 100,
    },
  });

  // @ts-ignore
  _handleOnPressItem = async (routeKey: string) => {
    const navigation = this.props.navigation;
    await navigation.push({routeKey});
  };

  _renderItem = ({item, index}: {
    item: typeof RouteItems[number];
    index: number;
  }) => {
    const { styles } = HomeRoute;

    return (
      <RouteItem
        key={item.routeKey}
        title={item.title}
        routeKey={item.routeKey}
        desc={item.desc}
        index={index}
        onPress={this._handleOnPressItem}
      />
    );
  };

  render(){
    const { styles } = HomeRoute;

    return (
      <React.Fragment>
        <FlatList
          contentContainerStyle={styles.rootContainer}
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
      initialRoutes={[{routeKey: RouteKeys.Home}]}
      isInteractivePopGestureEnabled={true}
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
        routeKey: RouteKeys.NavigatorTest03,
        renderRoute: () => (
          <NavigatorTest03/>
        ),
      }, {
        routeKey: RouteKeys.NavigatorTest04,
        renderRoute: () => (
          <NavigatorTest04/>
        ),
      }, {
        routeKey: RouteKeys.NavigatorDemo01,
        routeOptionsDefault: {
          largeTitleDisplayMode: 'never',
        },
        renderRoute: () => (
          <NavigatorDemo01/>
        ),
      }, {
        routeKey: RouteKeys.NavigatorDemo02,
        routeOptionsDefault: {
          largeTitleDisplayMode: 'never',
        },
        renderRoute: () => (
          // @ts-ignore
          <NavigatorDemo02/>
        ),
      }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  routeItemContainer: {
    overflow: 'hidden',
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 13,
    backgroundColor: Colors.PURPLE[50],
  },
  routeItemTitleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.PURPLE.A400,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  routeItemContentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textRouteItemTitleBullet: {
    color: 'white',
    fontSize: 17,
    marginRight: 7,
    fontWeight: '300',
  },
  textRouteItemTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  routeItemTitleText: {
    color: Colors.PURPLE[1100],
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  routeItemDescText: {
    color: Colors.PURPLE[1100],
    opacity: 0.9,
    fontWeight: '300',
  },
  routeItemButton: {
    backgroundColor: Colors.PURPLE.A700,
    borderRadius: 10,
    marginTop: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeItemButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
