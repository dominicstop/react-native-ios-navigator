import * as React from 'react';

import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NavigatorView, RouteContentProps, RouteViewEvents, NavRoutesConfigMap } from 'react-native-ios-navigator';

import { NavigatorShowcase01 } from './routes/NavigatorShowcase01';
import { NavigatorShowcase02 } from './routes/NavigatorShowcase02';

import { NavigatorExample01 } from './routes/NavigatorExample01';

import { NavigatorTest01 } from './routes/NavigatorTest01';
import { NavigatorTest02 } from './routes/NavigatorTest02';
import { NavigatorTest03 } from './routes/NavigatorTest03';
import { NavigatorTest04 } from './routes/NavigatorTest04';
import { NavigatorTest05 } from './routes/NavigatorTest05';
import { NavigatorTest06 } from './routes/NavigatorTest06';
import { NavigatorTest07 } from './routes/NavigatorTest07';

import { NavigatorDemo01 } from './routes/NavigatorDemo01';
import { NavigatorDemo02 } from './routes/NavigatorDemo02';

import { RouteViewPortalExample01 } from './routes/RouteViewPortalExample01';

import * as Colors  from './constants/Colors';
import * as Helpers from './functions/Helpers';
import { NavigatorTest08 } from './routes/NavigatorTest08';

import { ImageCache } from './functions/ImageCache';


ImageCache.loadImages();

const RouteKeys = {
  Home: 'Home',
  NavigatorExample01: 'NavigatorExample01',

  NavigatorTest01: 'NavigatorTest01',
  NavigatorTest02: 'NavigatorTest02',
  NavigatorTest03: 'NavigatorTest03',
  NavigatorTest04: 'NavigatorTest04',
  NavigatorTest05: 'NavigatorTest05',
  NavigatorTest06: 'NavigatorTest06',
  NavigatorTest07: 'NavigatorTest07',
  NavigatorTest08: 'NavigatorTest08',

  NavigatorDemo01: 'NavigatorDemo01',
  NavigatorDemo02: 'NavigatorDemo02',

  NavigatorShowcase01: 'NavigatorShowcase01',
  NavigatorShowcase02: 'NavigatorShowcase02',

  RouteViewPortalExample01: 'RouteViewPortalExample01',
};

const RouteItems = [{ 
  routeKey: RouteKeys.NavigatorShowcase01,
  title: 'Music Playlist',
  desc: 'A route showing a playlist with a list of tracks.'
}, { 
  routeKey: RouteKeys.NavigatorShowcase02,
  title: 'Profile',
  desc: 'A route showing a generic profile layout.'
}, { 
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
  routeKey: RouteKeys.NavigatorTest05,
  title: 'Multiple Initial Routes',
  desc: (
      `Tester for the 'initialRoutes' prop, e.g. testing setting multiple react and`
    + ` native routes on first mount.`
  )
}, {
  routeKey: RouteKeys.NavigatorTest06,
  title: 'Route Header Test #1',
  desc: `Tester for a route with a 'RouteHeaderView' that expands`
}, {
  routeKey: RouteKeys.NavigatorTest07,
  title: 'Route Header Test #2',
  desc: `Tester for a route with a 'RouteHeaderView' that's fixed.`
}, {
  routeKey: RouteKeys.NavigatorTest08,
  title: 'RouteViewEvents Test',
  desc: (
      `Tester for listening to the different route view events via`
    + `the RouteViewEvents component`
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
}, { 
  routeKey: RouteKeys.RouteViewPortalExample01,
  title: 'RouteViewPortal Example'
}];

const ROUTES: NavRoutesConfigMap = {
  [RouteKeys.Home]: {
    routeOptionsDefault: {
      routeTitle: "Home",
      searchBarConfig: {
        placeholder: "Search Routes",
        returnKeyType: 'done',
        obscuresBackgroundDuringPresentation: false,
        hidesSearchBarWhenScrolling: true,
        textColor: {
          dynamic: {
            light: Colors.PURPLE.A700,
            dark : Colors.PURPLE[100],
          }
        },
        tintColor: {
          dynamic: {
            light: Colors.PURPLE.A700,
            dark : Colors.PURPLE[100],
          }
        },
        leftIconTintColor: {
          dynamic: {
            light: Colors.PURPLE.A700,
            dark : Colors.PURPLE[100],
          }
        },
        placeholderTextColor: Colors.PURPLE[300],
        searchTextFieldBackgroundColor: Helpers.hexToRGBA(Colors.PURPLE.A100, 0.1),
      },
    },
    renderRoute: () => (
      <HomeRoute/>
    ),
  }, 
  [RouteKeys.NavigatorShowcase01]:{
    renderRoute: () => (
      <NavigatorShowcase01/>
    ),
  }, 
  [RouteKeys.NavigatorShowcase02]: {
    renderRoute: () => (
      <NavigatorShowcase02/>
    ),
  }, 
  [RouteKeys.NavigatorExample01]: {
    renderRoute: () => (
      <NavigatorExample01/>
    ),
  },
  [RouteKeys.NavigatorTest01]: {
    renderRoute: () => (
      <NavigatorTest01/>
    ),
  }, 
  [RouteKeys.NavigatorTest02]: {
    renderRoute: () => (
      <NavigatorTest02/>
    ),
  }, 
  [RouteKeys.NavigatorTest03]: {
    renderRoute: () => (
      <NavigatorTest03/>
    ),
  }, 
  [RouteKeys.NavigatorTest04]: {
    renderRoute: () => (
      <NavigatorTest04/>
    ),
  },
  [RouteKeys.NavigatorTest05]: {
    renderRoute: () => (
      <NavigatorTest05/>
    ),
  },
  [RouteKeys.NavigatorTest06]: {
    renderRoute: () => (
      <NavigatorTest06/>
    ),
  },
  [RouteKeys.NavigatorTest07]: {
    renderRoute: () => (
      <NavigatorTest07/>
    ),
  },
  [RouteKeys.NavigatorTest08]: {
    routeOptionsDefault: {
      largeTitleDisplayMode: 'never',
    },
    renderRoute: () => (
      <NavigatorTest08/>
    ),
  },
  [RouteKeys.NavigatorDemo01]: {
    routeOptionsDefault: {
      largeTitleDisplayMode: 'never',
    },
    renderRoute: () => (
      <NavigatorDemo01/>
    ),
  }, 
  [RouteKeys.NavigatorDemo02]: {
    routeOptionsDefault: {
      largeTitleDisplayMode: 'never',
    },
    renderRoute: () => (
      <NavigatorDemo02
        triggerPop={null}
      />
    ),
  },
  [RouteKeys.RouteViewPortalExample01]: {
    renderRoute: () => (
      <RouteViewPortalExample01/>
    ),
  }
};


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

type HomeRouteState = {
  searchBarText?: string;
};

class HomeRoute extends React.PureComponent<RouteContentProps, HomeRouteState> {
  static styles = StyleSheet.create({
    rootContentContainer: {
      paddingBottom: 100,
    },
    rootContainerEmpty: {
      flex: 1,
      marginTop: 15,
      alignItems: 'center',
    },
    titleEmptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.PURPLE[300],
    },
  });
  
  constructor(props: RouteContentProps){
    super(props);

    this.state = {
      searchBarText: null,
    };
  };

  // @ts-ignore
  _handleOnPressItem = async (routeKey: string) => {
    const navigation = this.props.navigation;
    await navigation.push({routeKey});
  };

  _renderItem = ({item, index}: {
    item: typeof RouteItems[number];
    index: number;
  }) => {

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
    const { searchBarText } = this.state;

    const hasSearchBarText       = searchBarText != null;
    const searchBarTextLowerCase = searchBarText?.toLowerCase();

    const items = (hasSearchBarText
      // true - filter `RouteItems` that matches `searchBarText`
      ? RouteItems.filter(item => (
          item.routeKey
            .toLocaleLowerCase()
            .includes(searchBarTextLowerCase)
          || item.title
            .toLocaleLowerCase()
            .includes(searchBarTextLowerCase)
          || item.desc
            .toLocaleLowerCase()
            .includes(searchBarTextLowerCase)
        ))
      // false - no filter
      : RouteItems
    );

    return (
      <React.Fragment>
        <RouteViewEvents
          onUpdateSearchResults={({nativeEvent}) => {
            this.setState({ searchBarText: nativeEvent.text });
          }}
          onSearchBarSearchButtonClicked={({nativeEvent}) => {
            this.setState({ searchBarText: nativeEvent.text });
          }}
        />
        <FlatList
          contentContainerStyle={styles.rootContentContainer}
          data={items}
          keyExtractor={(item) => item.routeKey}
          renderItem={this._renderItem}
          ListEmptyComponent={(
            <View style={styles.rootContainerEmpty}>
              <Text style={styles.titleEmptyText}>
                {'Nothing to Show 😔'}
              </Text>
            </View>
          )}
        />
      </React.Fragment>
    );
  }; 
};

export default function App() {
  return (
    <NavigatorView
      ref={r => {this.navRef = r}}
      style={styles.container}
      routes={ROUTES}
      initialRoutes={[{routeKey: RouteKeys.Home}]}
      isInteractivePopGestureEnabled={true}
      navBarPrefersLargeTitles={true}
      onCustomCommandFromNative={({nativeEvent}) => {
        Alert.alert(
          nativeEvent.commandKey, 
          JSON.stringify(nativeEvent.commandData)
        );
      }}
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
