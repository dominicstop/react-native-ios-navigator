import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import * as Colors from '../../constants/Colors';

import type { SearchEventData } from './SharedTypes';


export function SearchEventsListItem(props: {
  eventListItem: SearchEventData,
  index: number
}){
  const { eventListItem } = props;

  const date = new Date(eventListItem.timestamp);
  const dateString = date.toISOString();
  const timeString = dateString.substr(11, 12);

  const hasPropertyText     = (eventListItem.text != null);
  const hasPropertyIsActive = (eventListItem.isActive != null);

  return(
    <View style={styles.rootContainer}>
      <View style={styles.rowHeadingContainer}>
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
      {(hasPropertyText || hasPropertyIsActive) && (
        <View style={styles.rowDetailsContainer}>
          <Text style={styles.textLabelValue}>
            <Text style={styles.textLabel}>
              {'text: '}
            </Text>
            <Text style={styles.textValue}>
              {hasPropertyText? eventListItem.text : 'N/A'}
            </Text>
          </Text>
          <Text style={[styles.textLabelValue, styles.secondColumn]}>
            <Text style={styles.textLabel}>
              {'isActive: '}
            </Text>
            <Text style={styles.textValue}>
              {hasPropertyIsActive? (eventListItem.isActive? 'true' : 'false') : 'N/A'}
            </Text>
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: Colors.PURPLE[25],
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 7,
    borderRadius: 10,
  },
  rowHeadingContainer: {
    flexDirection: 'row',
  },
  textEventIndex: {
    fontWeight: '600',
    marginRight: 10,
    color: Colors.BLUE.A700,
  },
  textEventName: {
    flex: 1,
    color: Colors.BLUE[900],
    marginRight: 7,
  },
  textTimestamp: {
    fontWeight: '600',
    color: Colors.PURPLE.A700,
    fontVariant: ['tabular-nums'],
  },
  rowDetailsContainer: {
    flexDirection: 'row',
  },
  secondColumn: {
    marginLeft: 10,
  },
  textLabelValue: {
    flex: 1,
  },
  textLabel: {
    fontWeight: '500',
    color: Colors.PURPLE[1000],
  },
  textValue: {
    color: Colors.BLUE[1000],
  },
});