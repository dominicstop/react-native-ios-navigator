import * as React from 'react';

import { StyleSheet, View, Text, Animated, ListRenderItem } from 'react-native';
import { RouteViewPortal, RouteContentProps } from 'react-native-ios-navigator';

import { RouteHeader } from './RouteHeader';
import { ListItemTrack } from './ListItemTrack';

import type { TrackItem } from './SharedTypes';

import * as Colors from '../../constants/Colors';
import { navBarAppearanceConfigHidden } from '../../constants/Constants';


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
    useNativeDriver: true,
  });

  constructor(props: RouteContentProps){
    super(props);
  };

  _handleKeyExtractor = (item: TrackItem) => {
    return `id:${item.id}`;
  };

  _renderRouteHeader = () => {
    return (
      <RouteHeader
        scrollY={this.scrollY}
      />
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
      <View style={styles.listFooterContainer}>
        <Text style={styles.listFooterSymbolText}>
          {'💚'}
        </Text>
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
            navBarAppearanceOverride: navBarAppearanceConfigHidden,
            applyBackButtonConfigToCurrentRoute: true,
            backButtonDisplayMode: 'minimal',
            navBarButtonBackItemConfig: {
              type: 'IMAGE_EMPTY',
              tintColor: 'white',
            },
          }}
          renderRouteHeader={this._renderRouteHeader}
        />
        <Animated.FlatList
          style={styles.list}
          data={TRACK_ITEMS}
          horizontal={false}
          indicatorStyle={'white'}
          contentInsetAdjustmentBehavior={'always'}
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

  listFooterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 100,
  },
  listFooterSymbolText: {
    fontSize: 24,
    opacity: 0.75,
  },

  list: {
  },
});