import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { NavigatorView } from 'react-native-ios-navigator';

import { NavigatorExample01 } from './components/NavigatorExample01';

export default function App() {
  return (
    <NavigatorExample01/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
