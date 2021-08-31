import * as React from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

import { ITEM_TYPES_LIST, ListItemType } from './Constants';
import type { onChangeSelectedItemTypeIndex } from './ItemTypesMenu';

import * as Colors from '../../constants/Colors';


type RouteHeaderTabsProps = {
  onChangeSelectedItemTypeIndex: onChangeSelectedItemTypeIndex;
  selectedItemTypeIndex: number | null;
};


export class RouteHeaderTabs extends React.Component<RouteHeaderTabsProps> {

  _handleKeyExtractor = (item: ListItemType) => {
    return `id:${item}`;
  };

  _renderItem: ListRenderItem<ListItemType> = ({item, index}) => {
    const props = this.props;
    const isSelected = props.selectedItemTypeIndex === index;

    const listItemContainerStyle: ViewStyle = {
      backgroundColor: isSelected
        ? Colors.PURPLE.A700
        : Colors.PURPLE[100]
    };

    const listItemLabelStyle: TextStyle = {
      color: (isSelected
        ? 'white'
        : Colors.PURPLE[1000]
      ),
      fontWeight: (isSelected
        ? '800'
        : '500'
      ),
    };
    
    return (
      <TouchableOpacity 
        style={[styles.listItemContainer, listItemContainerStyle]}
        onPress={() => {
          this.props.onChangeSelectedItemTypeIndex(item, index);
        }}
      >
        <React.Fragment>
          <Text style={[styles.listItemLabel, listItemLabelStyle]}>
            {item}
          </Text>
        </React.Fragment>
      </TouchableOpacity>
    );
  };
  
  render(){
    const props = this.props;
    return(
      <FlatList
        style={styles.flatList}
        contentContainerStyle={styles.flatListContentContainer}
        extraData={props.selectedItemTypeIndex}
        data={ITEM_TYPES_LIST}
        keyExtractor={this._handleKeyExtractor}
        renderItem={this._renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    );
  };
};

const styles = StyleSheet.create({
  flatList: {
    height: 23,
    marginBottom: 7,
  },
  flatListContentContainer: {
    
  },
  listItemContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 75,
  },
  listItemLabel: {

  },
});