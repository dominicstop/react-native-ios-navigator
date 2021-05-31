import * as React from 'react';

import { StyleSheet, View, SafeAreaView, Text, Image, Animated, ScrollView, Alert, FlatList, ListRenderItem } from 'react-native';
import { RouteViewEvents, RouteViewPortal, RouteContentProps, RouteHeaderView, NavigatorViewConstants } from 'react-native-ios-navigator';
import { ListItemTrack } from './ListItemTrack';

import type { TrackItem } from './SharedTypes';

import * as Colors  from '../../constants/Colors';


const { navigationBarHeight } = NavigatorViewConstants;

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

const AssetImageCoffee = require('../../../assets/images/unsplash_coffee.jpg');

const ROUTE_HEADER_HEIGHT_MAX = 300;

let TRACK_ID_COUNTER = 0;
const TRACK_ITEMS: Array<TrackItem> = [{
  id: TRACK_ID_COUNTER++,
  title: `It's Okay To Cry`,
  artists: ['SOPHIE'],
}, {
  id: TRACK_ID_COUNTER++,
  title: `Mr. Perfectly Fine (Taylor's Version)`,
  artists: ['Taylor Swift'],
}, {
  id: TRACK_ID_COUNTER++,
  title: `Immaterial`,
  artists: ['SOPHIE'],
}, {
  id: TRACK_ID_COUNTER++,
  title: 'good 4 u',
  artists: ['Olivia Rodrigo'],
}, {
  id: TRACK_ID_COUNTER++,
  title: `Don't lose Ur Head`,
  artists: ['Six', 'Christina Modestou'],
}, {
  id: TRACK_ID_COUNTER++,
  title: 'Michael in the Bathroom',
  artists: ['George Salazar'],
}, {
  id: TRACK_ID_COUNTER++,
  title: 'Little Miss Perfect',
  artists: ['Write Out Loud', 'Joriah Kwamé', 'Taylor Louderman'],
}, {
  id: TRACK_ID_COUNTER++,
  title: 'Screw Loose',
  artists: ['Alli Mauzney'],
}, {
  id: TRACK_ID_COUNTER++,
  title: 'When He Sees Me',
  artists: ['Kimiko Glenn', 'Jesse Mueller', 'Waitress Original Broadway Original Cast'],
}, {
  id: TRACK_ID_COUNTER++,
  title: 'Candy Store',
  artists: ['Jessica Keenan Wynn', 'Alice Lee', 'Elle McLemore'],
}, {
  id: TRACK_ID_COUNTER++,
  title: 'Never Ever Getting Rid of Me',
  artists: ['Christopher Fitzgerald', 'Kimiko Glenn', 'Waitress Original Broadway Original Cast'],
}, {
  id: TRACK_ID_COUNTER++,
  title: 'Cell Block Tango',
  artists: ['Catherine Zeta-Jones', 'Deidre GoodWin', 'Denise Faye', 'Ekaterina Chtchelkanova', 'Mya Harrison', 'Paul Bogaev', 'Susan Misner', 'Taya Diggs'],
}, {
  id: TRACK_ID_COUNTER++,
  title: 'Medicine',
  artists: ['Gus Dapperton'],
}, {
  id: TRACK_ID_COUNTER++,
  title: 'What Is This Feeling',
  artists: ['Reese Lansangan'],
}, {
  id: TRACK_ID_COUNTER++,
  title: `Metamodernity`,
  artists: ['Vansire'],
}, {
  id: TRACK_ID_COUNTER++,
  title: `Boy Bi`,
  artists: ['Mad Thai'],
}, {
  id: TRACK_ID_COUNTER++,
  title: `HIGH CLASS TRAGEDY`,
  artists: ['Gia Ford'],
}, {
  id: TRACK_ID_COUNTER++,
  title: `Friendly Neighborhood Poltergeist`,
  artists: ['Rory Webley'],
}, {
  id: TRACK_ID_COUNTER++,
  title: `McLean's Baby Boy`,
  artists: ['Neighbor Susan'],
}, {
  id: TRACK_ID_COUNTER++,
  title: `Strawberry Sunscreen`,
  artists: ['Lostboycrow'],
}, {
  id: TRACK_ID_COUNTER++,
  title: `Warm Coke`,
  artists: ['Valiant Vermin'],
}];


export class NavigatorShowcase01 extends React.Component<RouteContentProps> {

  scrollY = new Animated.Value(0);

  _handleScrollViewOnScroll = Animated.event([{
    nativeEvent: {
      contentOffset: {
        y: this.scrollY
      }
    }
  }], {
    useNativeDriver: true
  });

  routeHeaderLargeTitleOpacity = this.scrollY.interpolate({
    inputRange: [-ROUTE_HEADER_HEIGHT_MAX, -(ROUTE_HEADER_HEIGHT_MAX / 2)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  routeHeaderBGOpacity = this.scrollY.interpolate({
    inputRange: [-(ROUTE_HEADER_HEIGHT_MAX / 2), -(navigationBarHeight + 24)],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  routeHeaderCollapsedBGOpacity = this.scrollY.interpolate({
    inputRange: [-(ROUTE_HEADER_HEIGHT_MAX / 2), -(navigationBarHeight + 24)],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  routeHeaderCollapsedTitleTranslateY = this.scrollY.interpolate({
    inputRange: [-(ROUTE_HEADER_HEIGHT_MAX / 2), -(navigationBarHeight + 24)],
    outputRange: [15, 0],
    extrapolate: 'clamp',
  });

  constructor(props: RouteContentProps){
    super(props);
  };

  _handleKeyExtractor = (item: TrackItem) => {
    return `id:${item.id}`;
  };

  _renderRouteHeader = () => {
    return (
      <RouteHeaderView
        style={styles.routeHeader}
        headerTopPadding={'statusBar'}
        config={{
          headerMode: 'resize',
          headerHeightMax: ROUTE_HEADER_HEIGHT_MAX,
          headerHeightMin: 'navigationBarWithStatusBar',
        }}
      >
        <Animated.View style={[
          styles.routeHeaderExpandedBGImageContainer,
          { opacity: this.routeHeaderBGOpacity }
        ]}>
          <Image
            style={styles.routeHeaderBGImage}
            source={AssetImageCoffee}
            resizeMode={'cover'}
          />
        </Animated.View>
        <Animated.Text style={[
          styles.routeHeaderExpandedLargeTitleText, 
          { opacity: this.routeHeaderLargeTitleOpacity }
        ]}>
          {'Coffee Tunes'}
        </Animated.Text>
        <AnimatedSafeAreaView style={[
          styles.routeHeaderCollapsedBG,
          { opacity: this.routeHeaderCollapsedBGOpacity }
        ]}/>
        <View style={styles.routeHeaderCollapsedContainer}>
          <Animated.Text style={[styles.routeHeaderCollapsedTitle, {
            opacity: this.routeHeaderCollapsedBGOpacity,
            transform: [{ 
              translateY: this.routeHeaderCollapsedTitleTranslateY 
            },
          ]}]}>
            {'Coffee Tunes'}
          </Animated.Text>
        </View>
        <View style={styles.routeHeaderPlayButtonContainer}>
          <Text style={styles.routeHeaderPlayButtonText}>
            {'▶'}
          </Text>
        </View>
      </RouteHeaderView>
    );
  };

  _renderListHeader  = () => {
    return (
      <View style={styles.listHeaderContainer}>
        <Text style={styles.listHeaderAuthor}>
          {'by dominicStop'}
        </Text>
        <Text style={styles.listHeaderPlaylistCountAndDuration}>
          {'25 tracks · 92 minutes'}
        </Text>
        <Text style={styles.listHeaderPlaylistDesc}>
          {'Music to listen to while drinking coffee, jazz hands optional but highly recommended.'}
        </Text>
      </View>
    );
  };

  _renderListFooter = () => {
    return (
      <View style={{marginBottom: 200}}>
        
      </View>
    );
  };

  _renderListItem: ListRenderItem<TrackItem> = ({item, index}) => {
    return (
      <ListItemTrack
        trackItem={item}
        index={index}
      />
    );
  };

  render(){
    return(
      <React.Fragment>
        <RouteViewPortal
          routeOptions={{
            largeTitleDisplayMode: 'never',
            statusBarStyle: 'lightContent',
            routeContainerStyle: styles.routeContainerStyle,
            navBarAppearanceOverride: {
              mode: 'legacy',
              navBarPreset: 'clearBackground',
              titleTextAttributes: { 
                opacity: 0,
              },
            },
            applyBackButtonConfigToCurrentRoute: true,
            navBarButtonBackItemConfig: {
              type: 'TEXT',
              tintColor: 'white',
              title: '',
            },
          }}
          renderRouteHeader={this._renderRouteHeader}
        />
        <Animated.FlatList
          data={TRACK_ITEMS}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderListItem}
          ListHeaderComponent={this._renderListHeader}
          ListFooterComponent={this._renderListFooter}
          onScroll={this._handleScrollViewOnScroll}
          scrollEventThrottle={1}
        />
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  routeContainerStyle: {
    backgroundColor: 'rgb(20, 20, 20)'
  },
  routeHeader: {
  },
  routeHeaderPlayButtonContainer: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50/2,
    position: 'absolute',
    right: 0,
    bottom: -(50/2),
    marginRight: 10,
    backgroundColor: Colors.GREEN.A700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeHeaderPlayButtonText: {
    color: 'white',
    fontSize: 26,
    marginLeft: 4,
  },
  routeHeaderExpandedBGImageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  routeHeaderBGImage: {
    width: '100%',
    height: '100%',
  },
  routeHeaderExpandedLargeTitleText: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    margin: 10,
    fontSize: 42,
    color: 'white',
    fontWeight: '900',
  },

  routeHeaderCollapsedBG: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: Colors.ORANGE[900],
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.75,
    shadowRadius: 12,
    shadowColor: "black",
  },
  routeHeaderCollapsedContainer: {
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    height: navigationBarHeight,
  },
  routeHeaderCollapsedTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
  
  listHeaderContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 10,
  },
  listHeaderAuthor: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 5,
  },
  listHeaderPlaylistCountAndDuration: {
    color: Colors.GREY[400],
    marginBottom: 8,
  },
  listHeaderPlaylistDesc: {
    color: 'white',
  },
});