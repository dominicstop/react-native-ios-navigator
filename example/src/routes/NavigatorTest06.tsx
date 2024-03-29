import * as React from 'react';

import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { HeaderHeightConfig, HeaderHeightPreset, RouteHeaderView, RouteViewPortal, NavBarAppearancePresets } from 'react-native-ios-navigator';

import { ImageAssets } from '../functions/ImageCache';


const headerHeightPresets: Array<HeaderHeightPreset> = [
  'statusBar',
  'navigationBar',
  'navigationBarWithStatusBar',
  'safeArea',
  'none',
];

let cachedIndex = 0;


export function NavigatorTest06(){
  const [passthroughTouchEvents, setPassthroughTouchEvents] = React.useState(false);
  const [headerTopPaddingIndex, setHeaderTopPaddingIndex] = React.useState(cachedIndex);
  const [extraOffset, setExtraOffset] = React.useState(0);

  const currentHeaderTopPadding: HeaderHeightConfig = {
    preset: headerHeightPresets[
      headerTopPaddingIndex %  headerHeightPresets.length
    ],
  };

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
          navBarAppearanceOverride: NavBarAppearancePresets.hidden,
        }}
        renderRouteHeader={() => (
          <RouteHeaderView
            style={styles.routeHeader}
            headerTopPadding={currentHeaderTopPadding}
            config={{ 
              headerMode: 'resize',
              headerHeightMin: { preset: 'navigationBarWithStatusBar' },
              headerHeightMax: { 
                preset: 'navigationBarWithStatusBar', 
                offset: 200 + extraOffset
              },
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
                  {`headerTopPadding: ${currentHeaderTopPadding.preset}`}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => {
                  setExtraOffset(offset => offset + 10);
                }}
              >
                <Text style={styles.headerButtonText}>
                  {`Increase Offset: ${extraOffset}`}
                </Text>
              </TouchableOpacity>
            </View>
          </RouteHeaderView>
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
    backgroundColor: 'red',
  },
  headerBGImage: {
    width: '100%',
    height: '100%',
    opacity: 0.75,
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
    margin: 5,
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