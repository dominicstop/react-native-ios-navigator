import * as React from 'react';

import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { HeaderHeightValue, RouteHeaderView, RouteViewPortal } from 'react-native-ios-navigator';

const AssetImageCoffee = require('../../assets/images/unsplash_coffee.jpg');

const headerHeightValues: Array<HeaderHeightValue> = [
  'statusBar',
  'navigationBar',
  'navigationBarWithStatusBar',
  'safeArea',
  'none',
];

let cachedIndex = 0;

function RouteHeaderWithButton(){
  const [headerTopPaddingIndex, setHeaderTopPaddingIndex] = React.useState(cachedIndex);

  const currentHeaderTopPadding = headerHeightValues[
    headerTopPaddingIndex %  headerHeightValues.length
  ];

  return (
    <RouteHeaderView
      style={styles.routeHeader}
      headerTopPadding={currentHeaderTopPadding}
      config={{ 
        headerMode: 'resize',
        headerHeightMin: 'navigationBarWithStatusBar',
        headerHeightMax: 300,
      }}
    >
      <View style={styles.headerBGImageContainer}>
        <Image 
          style={styles.headerBGImage}
          source={AssetImageCoffee}
          resizeMode={'cover'}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => {
            setHeaderTopPaddingIndex(prevValue => prevValue + 1);
            cachedIndex = headerTopPaddingIndex + 1;
          }}
        >
          <Text style={{color: 'white'}}>
            {`headerTopPadding: ${currentHeaderTopPadding}`}
          </Text>
        </TouchableOpacity>
      </View>
    </RouteHeaderView>
  );
};

export function NavigatorTest06(){
  return (
    <React.Fragment>
      <RouteViewPortal
        routeOptions={{
          largeTitleDisplayMode: 'never',
          applyBackButtonConfigToCurrentRoute: true,
          navBarButtonBackItemConfig: {
            type: 'TEXT',
            title: '',
            tintColor: 'white',
          },
          navBarAppearanceOverride: {
            mode: 'legacy',
            navBarPreset: 'clearBackground',
            titleTextAttributes: { 
              opacity: 0 
            },
          },
        }}
        renderRouteHeader={() => (
          <RouteHeaderWithButton/>
        )}
      />
      <ScrollView>
        <View style={{
          height: 1000, 
          alignSelf: 'stretch',
          alignItems: 'center',
          paddingTop: 15,
        }}>
          <Text style={{fontSize: 64, fontWeight: '600'}}>
            Hello World
          </Text>
        </View>
      </ScrollView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  routeHeader: {
  },
  headerBGImageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  headerBGImage: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
  },
  buttonContainer: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'purple',
    borderRadius: 10,
  },
});