import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import * as Colors from '../../constants/Colors';

import type { EventData } from './SharedTypes';


export function EventListItem(props: {
  eventListItem: EventData,
  index: number
}){
  const { eventListItem } = props;

  const date = new Date(eventListItem.timestamp);
  const dateString = date.toISOString();
  const timeString = dateString.substr(11, 12);

  return(
    <View style={styles.rootContainer}>
      <Text style={styles.textEventIndex}>
        {`${props.index + 1}.`}
      </Text>
      <Text style={styles.textEventName}>
        {eventListItem.eventType}
      </Text>
      <Text style={styles.textTimestamp}>
        {timeString}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.PURPLE[25],
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 7,
    borderRadius: 10,
  },
  textEventIndex: {
    fontWeight: '600',
    marginRight: 10,
    color: Colors.BLUE.A700,
  },
  textEventName: {
    flex: 1,
    color: Colors.PURPLE[1000],
  },
  textTimestamp: {
    fontWeight: '600',
    color: Colors.PURPLE.A700,
    fontVariant: ['tabular-nums'],
  },
});