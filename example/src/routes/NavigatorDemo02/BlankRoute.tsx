import * as React from 'react';
import { Text, SafeAreaView, StyleSheet } from 'react-native';

import type { RouteContentProps } from 'react-native-ios-navigator';


export function BlankRoute(props: RouteContentProps & {
  index: number;
  color: string;
}){
  const textStyle = {
    color: props.color
  };

  return(
    <SafeAreaView style={styles.rootContainer}>
      <Text 
        style={[textStyle, styles.textIndexCount]}
        adjustsFontSizeToFit={true}
      >
        {props.index}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textIndexCount: {
    fontSize: 84,
    fontWeight: '700',
    padding: 10,
    opacity: 0.5,
  },
});