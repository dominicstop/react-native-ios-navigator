import * as React from 'react';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';

import type { ListItemObject } from './Constants';

import * as Colors  from '../../constants/Colors';
import * as Helpers from '../../functions/Helpers';

const colors_base = [
  Colors.PINK,
  Colors.RED,
  Colors.ORANGE,
  Colors.YELLOW,
  Colors.AMBER,
  Colors.GREEN,
  Colors.LIGHT_GREEN,
  Colors.BLUE,
  Colors.PURPLE,
  Colors.VIOLET,
  Colors.INDIGO,
];

const colors_dark    = colors_base.map(color => color['900']);
const colors_vibrant = colors_base.map(color => color.A700);

export function ListItem(props: {
  item: ListItemObject;
}){

  const index = props.item.id;

  const color_dark    = Helpers.nextItemInCyclicArray(index, colors_dark);
  const color_vibrant = Helpers.nextItemInCyclicArray(index, colors_vibrant);


  const leftContainerStyle: ViewStyle = {
    backgroundColor: color_vibrant,
  };

  const textItemTypeStyle: TextStyle = {
    color: color_dark,
  };

  const textTitleStyle: TextStyle = {
    color: Helpers.hexToRGBA(color_dark, 1, -40),
  };

  return (
    <View style={styles.rootContainer}>
      <View style={[styles.leftContainer, leftContainerStyle]}>
        <View style={styles.itemTypeContainer}> 
          <Text style={[styles.textItemType, textItemTypeStyle]}>
            {props.item.itemType}
          </Text>
        </View>
        <Text style={styles.textItemIndex}>
          {index + 1}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={[styles.textTitle, textTitleStyle]}>
          {props.item.title}
        </Text>
        <Text style={styles.textSubtitle}>
          {props.item.subtitle}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'row',
  },

  leftContainer: {
    width: 75,
    minHeight: 75,
  },
  rightContainer: {
    flex: 1,
    padding: 10,
  },

  itemTypeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 7,
  },
  textItemType: {
    fontStyle: 'italic',
    fontWeight: '500',
  },
  textItemIndex: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 5,
    fontWeight: '800',
    fontSize: 22,
    color: 'rgba(255,255,255,0.75)',
  },

  textTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  textSubtitle: {
    fontSize: 12,
    fontWeight: '300',
    color: Colors.GREY[900]
  },
});