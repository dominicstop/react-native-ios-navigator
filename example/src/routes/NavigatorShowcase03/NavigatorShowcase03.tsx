
import * as React from 'react';
import { StyleSheet, View, Text, FlatList, ListRenderItem, TouchableOpacity } from 'react-native';

import { RouteContentProps, RouteViewPortal, RenderNavItem, NavBarAppearancePresets } from 'react-native-ios-navigator';

import { ListItemObject, LIST_ITEMS } from './Constants';
import { ListItem } from './ListItem';
import { RouteHeader } from './RouteHeader';

import * as Colors from '../../constants/Colors';
import type { onChangeSelectedItemTypeIndex } from './ItemTypesMenu';


type NavigatorShowcase03State = {
  items: ListItemObject[],
  isMenuExpanded: boolean;
  selectedItemTypeIndex: number | null;
};

export class NavigatorShowcase03 extends React.Component<RouteContentProps, NavigatorShowcase03State> {

  routeHeaderRef: RouteHeader;

  constructor(props){
    super(props);

    this.state = {
      items: LIST_ITEMS,
      isMenuExpanded: false,
      selectedItemTypeIndex: null
    };
  };

  _handleOnChangeSelectedItemTypeIndex: 
    onChangeSelectedItemTypeIndex = (selectedItemType, index) => {

    const state = this.state;
    const didIndexChange = (state.selectedItemTypeIndex !== index);

    this.setState(didIndexChange? {
      selectedItemTypeIndex: index,
      items: LIST_ITEMS.filter(item => (
        item.itemType === selectedItemType
      )),
    }:{
      selectedItemTypeIndex: null,
      items: LIST_ITEMS
    });

    this.setState({
      selectedItemTypeIndex: didIndexChange ? index : null,
    });
  };

  _handleKeyExtractor = (item: ListItemObject) => {
    return `id:${item.id}`;
  };
  
  _renderNavBarTitle: RenderNavItem = () => {
    const { items } = this.state;
    
    return (
      <View style={styles.navBarTitleContainer}>
        <Text style={styles.textNavBarTitle}>
          {`Showing ${items.length} Items`}
        </Text>
      </View>
    );
  };

  _renderNavBarRightItem: RenderNavItem = () => {
    const state = this.state;

    return (
      <TouchableOpacity
        onPress={() => {
          const isExpanded = !state.isMenuExpanded;

          this.routeHeaderRef.setMenuVisibility(isExpanded);

          this.setState({
            isMenuExpanded: isExpanded,
          });
        }}
      >
        <Text style={styles.navBarRightItemLabel}>
          {state.isMenuExpanded? '⬆️' : '⬇️'}
        </Text>
      </TouchableOpacity>
    );
  };

  _renderRouteHeader = () => {
    const state = this.state;

    return (
      <RouteHeader
        ref={r => { this.routeHeaderRef = r! }}
        onChangeSelectedItemTypeIndex={this._handleOnChangeSelectedItemTypeIndex}
        selectedItemTypeIndex={state.selectedItemTypeIndex}
        isMenuExpanded={state.isMenuExpanded}
      />
    );
  };

  _renderListItem: ListRenderItem<ListItemObject> = ({item}) => {
    return (
      <ListItem
        item={item}
      />
    );
  };

  render(){
    return(
      <React.Fragment>
        <RouteViewPortal
          renderRouteHeader={this._renderRouteHeader}
          renderNavBarTitleItem={this._renderNavBarTitle}
          renderNavBarRightItem={this._renderNavBarRightItem}
          routeOptions={{
            navBarAppearanceOverride: NavBarAppearancePresets.hidden,
            applyBackButtonConfigToCurrentRoute: true,
            backButtonDisplayMode: 'minimal',
            navBarButtonBackItemConfig: {
              type: 'IMAGE_EMPTY',
              tintColor: Colors.PURPLE.A700,
            },
          }}
        />
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContentContainer}
          data={this.state.items}
          horizontal={false}
          contentInsetAdjustmentBehavior={'always'}
          keyExtractor={this._handleKeyExtractor}
          renderItem={this._renderListItem}
        />
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  list: {
  },
  listContentContainer: {
  },

  navBarTitleContainer: {
  },
  textNavBarTitle: {
    color: Colors.PURPLE.A700,
    fontSize: 14,
    fontWeight: '600',
  },

  navBarRightItemLabel: {
    fontSize: 17,
  },
});