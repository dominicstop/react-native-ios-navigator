import * as React from 'react';

import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { HeaderHeightValue, RouteHeaderView, RouteViewPortal } from 'react-native-ios-navigator';

import { navBarAppearanceConfigHidden } from '../constants/Constants';
import { ImageAssets } from '../functions/ImageCache';


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
          source={ImageAssets.BGCoverCoffee}
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
          <Text style={styles.headerButtonText}>
            {`headerTopPadding: ${currentHeaderTopPadding}`}
          </Text>
        </TouchableOpacity>
      </View>
    </RouteHeaderView>
  );
};

export function NavigatorTest06(){
  const [passthroughTouchEvents, setPassthroughTouchEvents] = React.useState(false);

  return (
    <React.Fragment>
      <RouteViewPortal
        routeOptions={{
          largeTitleDisplayMode: 'never',
          applyBackButtonConfigToCurrentRoute: true,
          allowTouchEventsToPassThroughNavigationBar: passthroughTouchEvents,
          statusBarStyle: 'lightContent',
          navBarButtonBackItemConfig: {
            type: 'TEXT',
            title: '',
            tintColor: 'white',
          },
          navBarAppearanceOverride: navBarAppearanceConfigHidden,
        }}
        renderRouteHeader={() => (
          <RouteHeaderWithButton/>
        )}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Image
          style={styles.contentImageTest}
          source={ImageAssets.BGCoverCoffee}
        />
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => {
            setPassthroughTouchEvents(prevValue => !prevValue);
          }}
        >
          <Text style={styles.headerButtonText}>
            {`allowTouchEventsToPassThroughNavigationBar: ${passthroughTouchEvents}`}
          </Text>
        </TouchableOpacity>
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
  headerButtonText: {
    color: 'white'
  },

  scrollViewContentContainer: {
    minHeight: 1000,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  contentImageTest: {
    width: 100, 
    height: 100, 
    borderRadius: 10, 
    margin: 10,
  },
});