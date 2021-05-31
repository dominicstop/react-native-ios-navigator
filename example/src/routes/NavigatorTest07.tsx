import * as React from 'react';

import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { RouteHeaderView, RouteViewPortal } from 'react-native-ios-navigator';

const AssetImageCoffee = require('../../assets/images/unsplash_coffee.jpg');

export function NavigatorTest07(){
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
          <RouteHeaderView
            style={styles.routeHeader}
            config={{ 
              headerMode: 'fixed',
              headerHeight: 200,
            }}
          >
            <View style={styles.headerBGImageContainer}>
              <Image 
                style={styles.headerBGImage}
                source={AssetImageCoffee}
                resizeMode={'cover'}
              />
            </View>
            <Text style={styles.headerTitle}>
              Hello World
            </Text>
          </RouteHeaderView>
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
    alignItems: 'center', 
    justifyContent: 'center'
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
});