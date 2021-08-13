import * as React from 'react';

import { StyleSheet, View, Text, FlatList } from 'react-native';
import { RouteContentProps, RouteViewEvents } from 'react-native-ios-navigator';

import { RouteItem } from './RouteItem';
import { RouteItems } from './Constants';

import * as Colors from '../../constants/Colors';


type HomeRouteState = {
  searchBarText?: string;
};

export class HomeRoute extends React.PureComponent<RouteContentProps, HomeRouteState> {
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