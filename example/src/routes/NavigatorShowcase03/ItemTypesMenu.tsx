import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';

import { ITEM_TYPES_LIST, ListItemType, UI_CONSTANTS } from './Constants';
import * as Colors from '../../constants/Colors';


export type onChangeSelectedItemTypeIndex =
 (type: `${ListItemType}` | null, index: number | null) => void;

type ItemTypesListProps = {
  onChangeSelectedItemTypeIndex: onChangeSelectedItemTypeIndex;
  selectedItemTypeIndex: number | null;
};


function ItemType(props: {
  type: `${ListItemType}`;
  index: number;
  onPress: (type: `${ListItemType}`, index: number) => void;
}){
  return (
    <TouchableOpacity 
      style={styles.itemContainer}
      activeOpacity={0.5}
      onPress={() => {
        props.onPress(props.type, props.index);
      }}
    >
      <React.Fragment>
        <Text>
          <Text>
            {`${props.index + 1}. `}
          </Text>
          <Text>
            {props.type}
          </Text>
        </Text>
      </React.Fragment>
    </TouchableOpacity>
  );
};

export class ItemTypesMenu extends React.Component<ItemTypesListProps> {

  menuIndicatorTranslateY: Animated.Value;
  menuIndicatorOpacity: Animated.Value;

  constructor(props){
    super(props);

    this.menuIndicatorTranslateY = 
      new Animated.Value(props.selectedItemTypeIndex ?? 0);

    this.menuIndicatorOpacity = 
      new Animated.Value(props.selectedItemTypeIndex ?? 0);
  };

  shouldComponentUpdate = (nextProps: ItemTypesListProps) => {
    const prevProps = this.props;

    const didIndexChange = (prevProps.selectedItemTypeIndex !== nextProps.selectedItemTypeIndex);

    const nextSelectedItemTypeIndex = 
      nextProps.selectedItemTypeIndex ?? 
      prevProps.selectedItemTypeIndex ?? 0;

    const prevIndicatorVisibility = 
      (prevProps.selectedItemTypeIndex == null) ? 0 : 1;

    const nextIndicatorVisibility = 
      (nextProps.selectedItemTypeIndex == null) ? 0 : 1;

    const didIndicatorVisibilityChange = 
      (prevIndicatorVisibility !== nextIndicatorVisibility);

    if(didIndexChange || didIndicatorVisibilityChange){
      const animation = Animated.parallel([
        didIndexChange && Animated.spring(this.menuIndicatorTranslateY, {
          toValue: nextSelectedItemTypeIndex * UI_CONSTANTS.menuItemHeight,
          bounciness: 9,
          speed: 13,
          useNativeDriver: true,
        }),
        didIndicatorVisibilityChange && Animated.timing(this.menuIndicatorOpacity, {
          toValue: nextIndicatorVisibility,
          duration: 250,
          useNativeDriver: true,
        }),
      ]);
      
      animation.start();
    };

    return (true);
  };

  _handleOnPressMenuItem = (type: `${ListItemType}`, index: number) => {
    this.props.onChangeSelectedItemTypeIndex(type, index);
  };

  render(){
    const menuIndicatorStyle = {
      opacity: this.menuIndicatorOpacity,
      transform: [{
        translateY: this.menuIndicatorTranslateY
      }]
    };

    return (
      <React.Fragment>
        <Animated.View style={[styles.menuIndicator, menuIndicatorStyle]}/>
        {ITEM_TYPES_LIST.map((type, index) => (
          <ItemType
            key={`container-${type}`}
            type={type}
            index={index}
            onPress={this._handleOnPressMenuItem}
          />
        ))}
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  itemContainer: {
    marginHorizontal: 10,
    height: UI_CONSTANTS.menuItemHeight,
    justifyContent: 'center',
  },
  backgroundIndicator: {
    position: 'absolute',
    width: '100%',
    height: UI_CONSTANTS.menuItemHeight,
    backgroundColor: Colors.PURPLE[100],
  },

  menuIndicator: {
    position: 'absolute',
    width: '100%',
    height: UI_CONSTANTS.menuItemHeight,
    backgroundColor: Colors.PURPLE[100],
  },
});