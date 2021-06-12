import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking } from 'react-native';

import { COLOR_PRESETS, UI_CONSTANTS } from './Constants';


export function ListHeaderProfile(){
  return (
    <View style={styles.rootContainer}>
      <View style={styles.followButtonContainer}>
        <TouchableOpacity 
          style={styles.followButton}
          onPress={() => {
            Linking.openURL('https://twitter.com/godominic');
          }}
        >
          <Text style={styles.followButtonText}>
            {'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.profileNameText}>
        {'Dominic Go 🇵🇭'}
      </Text>
      <Text style={styles.profileUsernameText}>
        {'@GoDominic'}
      </Text>
      <Text style={styles.profileBioText}>
        {'hello world ✨'}
      </Text>
      <Text style={styles.profileJoinedDateText}>
        {'• Joined April 2019'}
      </Text>
      <View style={styles.followingFollowerContainer}>
        <Text style={styles.followingFollowerText}>
          <Text style={styles.followingFollowerValueText}>
            {'2,400'}
          </Text>
          {' '}
          <Text style={styles.followingFollowerLabelText}>
            {'Following'}
          </Text>
        </Text>
        <Text style={[styles.followingFollowerText, styles.followerText]}>
          <Text style={styles.followingFollowerValueText}>
            {'100'}
          </Text>
          {' '}
          <Text style={styles.followingFollowerLabelText}>
            {'Followers'}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    paddingBottom: 15,
    paddingHorizontal: 10,
    borderBottomColor: COLOR_PRESETS.lineSeparator,
    borderBottomWidth: 1,
  },

  followButtonContainer: {
    minHeight: UI_CONSTANTS.listHeaderTopPadding,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    marginRight: 5,
  },
  followButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 17,
    paddingVertical: 7,
    borderRadius: 15,
    borderColor: COLOR_PRESETS.profileButton,
    borderWidth: 1.25,
  },
  followButtonText: {
    color: COLOR_PRESETS.profileButton,
    fontWeight: '700',
  },


  profileNameText: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 3,
  },
  profileUsernameText: {
    fontSize: 16,
    fontWeight: '400',
    color: COLOR_PRESETS.secondaryLabel,
    marginBottom: 12,
  },

  profileBioText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  profileJoinedDateText: {
    color: COLOR_PRESETS.secondaryLabel,
    fontSize: 16,
    marginBottom: 10,
  },

  followingFollowerContainer: {
    flexDirection: 'row',
  },
  followingFollowerText: {
    fontSize: 16,
  },
  followingFollowerValueText: {
    color: 'white',
    fontWeight: '500',
  },
  followingFollowerLabelText: {
    color: COLOR_PRESETS.secondaryLabel,
  },
  followerText: {
    marginLeft: 12,
  },
});