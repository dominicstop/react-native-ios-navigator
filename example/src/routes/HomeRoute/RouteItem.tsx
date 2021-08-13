import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import * as Colors from '../../constants/Colors';

export function RouteItem(props: {
  routeKey: string;
  title: string;
  desc: string;
  index: number;
  onPress: Function;
}){
  return (
    <View style={styles.routeItemContainer}>
      <View style={styles.routeItemTitleContainer}>
        <Text style={styles.textRouteItemTitleBullet}>
          {`${props.index + 1}.`}
        </Text>
        <Text style={styles.textRouteItemTitle}>
          {props.routeKey}
        </Text>
      </View>
      <View style={styles.routeItemContentContainer}>
        <Text style={styles.routeItemTitleText}>
          {props.title}
        </Text>
        <Text style={styles.routeItemDescText}>
          {props.desc}
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.onPress(props.routeKey);
          }}
          style={styles.routeItemButton}
        >
          <Text style={styles.routeItemButtonText}>
            {'Go to Route'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  routeItemContainer: {
    overflow: 'hidden',
    borderRadius: 10,
    marginTop: 15,
    marginHorizontal: 13,
    backgroundColor: Colors.PURPLE[50],
  },
  routeItemTitleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.PURPLE.A400,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  routeItemContentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  textRouteItemTitleBullet: {
    color: 'white',
    fontSize: 17,
    marginRight: 7,
    fontWeight: '300',
  },
  textRouteItemTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  routeItemTitleText: {
    color: Colors.PURPLE[1100],
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  routeItemDescText: {
    color: Colors.PURPLE[1100],
    opacity: 0.9,
    fontWeight: '300',
  },
  routeItemButton: {
    backgroundColor: Colors.PURPLE.A700,
    borderRadius: 10,
    marginTop: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeItemButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

