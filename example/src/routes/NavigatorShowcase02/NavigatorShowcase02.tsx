import * as React from 'react';
import { StyleSheet, View, Text, Animated, ListRenderItem } from 'react-native';

import { RouteViewPortal, RouteContentProps, NavBarAppearanceCombinedConfig } from 'react-native-ios-navigator';

import { iOSVersion } from '../../constants/Constants';

import { RouteHeader } from './RouteHeader';
import { ListHeaderProfile } from './ListHeaderProfile';
import { ListItemPost } from './ListItemPost';

import { ASSETS, POST_ITEMS, PostItem } from './Constants';


const navBarAppearanceConfig: NavBarAppearanceCombinedConfig = ((iOSVersion >= 13)? {
  mode: 'appearance',
  standardAppearance: {
    baseConfig: 'transparentBackground',
    titleTextAttributes: {
      opacity: 0,
    },
    backIndicatorImage: {
      type: 'IMAGE_REQUIRE',
      imageValue: ASSETS.chevronBack,
    },
  },
} : {
  mode: 'legacy',
  navBarPreset: 'clearBackground',
  titleTextAttributes: { 
    opacity: 0,
  },
});


export class NavigatorShowcase02 extends React.Component<RouteContentProps> {

  scrollY = new Animated.Value(0);
  listHeaderTitleY = new Animated.Value(0);

  _handleScrollViewOnScroll = Animated.event([{
    nativeEvent: {
      contentOffset: {
        y: this.scrollY
      }
    }
  }], {
    useNativeDriver: true
  });

  constructor(props: RouteContentProps){
    super(props);
  };

  _handleKeyExtractor = (item: PostItem) => {
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
    return(
      <ListHeaderProfile/>
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

  _renderListItem: ListRenderItem<PostItem> = ({item, index}) => {
    return (
      <ListItemPost
        postItem={item}
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
            navBarAppearanceOverride: navBarAppearanceConfig,
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
          contentContainerStyle={styles.listContentContainer}
          data={POST_ITEMS}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderListItem}
          ListHeaderComponent={this._renderListHeader}
          ListFooterComponent={this._renderListFooter}
          onScroll={this._handleScrollViewOnScroll}
          //onScroll={({nativeEvent}) => console.log('FlatList', nativeEvent)}
          scrollEventThrottle={1}
        />
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  routeContainerStyle: {
    backgroundColor: 'rgb(5,5,5)'
  },
  routeHeader: {
    backgroundColor: 'red',
  },

  listContentContainer: {
    minHeight: 1000,
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
});