import * as React from 'react';

import { StyleSheet, View, Text, Image } from 'react-native';

import { ASSETS, COLOR_PRESETS, PostItem, UI_CONSTANTS } from './Constants';


export function ListItemPost(props: {
  postItem: PostItem;
  index: number;
}){
  return (
    <View style={styles.rootContainer}>
      <Image 
        style={styles.profileContainer}
        source={ASSETS.headerProfile}
      />
      <View style={styles.rightContainer}>

        <Text style={styles.profileNameBaseText}>
          <Text style={styles.profileNameText}>
            {'Dominic Go 🇵🇭 '}
          </Text>
          {' '}
          <Text style={styles.profileUserNameText}>
            {'@GoDominic'}
          </Text>
          {' '}
          <Text style={styles.postDateText}>
            {`• ${props.postItem.date}`}
          </Text>
        </Text>
        <Text style={styles.postBodyText}>
          {props.postItem.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomColor: COLOR_PRESETS.lineSeparator,
    borderBottomWidth: 1,
  },
  profileContainer: {
    height: UI_CONSTANTS.postProfileSize,
    width: UI_CONSTANTS.postProfileSize,
    borderRadius: (UI_CONSTANTS.postProfileSize / 2),
    backgroundColor: 'white',
    marginRight: 12,
  },
  rightContainer: {
    flex: 1,
  },

  profileNameBaseText: {
    marginBottom: 7,
  },
  profileNameText: {
    color: 'white',
    fontWeight: '600',
  },
  profileUserNameText: {
    color: COLOR_PRESETS.secondaryLabel,
  },
  postDateText: {
    color: COLOR_PRESETS.secondaryLabel,
  },

  postBodyText: {
    color: 'white',
  },
});