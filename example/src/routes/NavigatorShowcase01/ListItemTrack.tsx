import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, FlatList, ListRenderItem } from 'react-native';
import type { TrackItem } from './SharedTypes';

import * as Colors  from '../../constants/Colors';
import * as Helpers from '../../functions/Helpers';

const AlbumColors = [
  Colors.PINK.A700,
  Colors.RED.A700,
  Colors.ORANGE.A700,
  Colors.AMBER.A700,
  Colors.YELLOW.A700,
  Colors.GREEN.A700,
  Colors.BLUE.A700,
  Colors.PURPLE.A700,
  Colors.VIOLET.A700,
];

const ALBUM_HEIGHT = 50;

export function ListItemTrack(props: {
  trackItem: TrackItem;
  index: number;
}){
  const trackItem = props.trackItem;

  const bgColor = Helpers.nextItemInCyclicArray(props.index, AlbumColors);

  // e.g. 'artist1, artist2, etc.'
  const artistName = trackItem.artists.reduce((acc, curr, index) => (
    acc + (index > 0 ? `, ${curr}` : curr)
  ), '');

  return (
    <View style={styles.rootContainer}>
      <View style={[styles.leftTrackAlbumContainer, { backgroundColor: bgColor }]}>
        <Text style={styles.leftTrackAlbumLetterText}>
          {trackItem.title.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.rightTrackDetailsContainer}>
        <Text style={styles.trackTitleText}>
          {trackItem.title}
        </Text>
        <Text 
          style={styles.trackArtistText}
          lineBreakMode={'tail'}
          numberOfLines={1}
        >
          {artistName}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row'
  },
  leftTrackAlbumContainer: {
    aspectRatio: 1,
    height: ALBUM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftTrackAlbumLetterText: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  rightTrackDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  trackTitleText: {
    color: 'white',
    marginBottom: 3,
    fontSize: 16,
    fontWeight: '500',
  },
  trackArtistText: {
    alignContent: 'stretch',
    color: Colors.GREY[300],
  },
});