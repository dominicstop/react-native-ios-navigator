import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

import { RouteViewPortal } from 'react-native-ios-navigator';

import * as Colors from '../constants/Colors';

export function RouteViewPortalExample01(){
  const [index, setIndex] = React.useState(0);

  return (
    <SafeAreaView style={styles.routeContainer}>
      <RouteViewPortal
        routeOptions={{
          // Change the navigation bar title text
          routeTitle: `index: ${index}`,

          // Disable large tile
          largeTitleDisplayMode: 'never',

          // Set the status bar tint to 'white'
          statusBarStyle: 'lightContent',
          
          navBarAppearanceOverride: {
            mode: 'appearance',
            useStandardAppearanceAsDefault: true,
            standardAppearance: {

              // Set the navigation bar tint to red
              backgroundColor: Colors.RED.A700,

              // Make the back button text white
              backButtonAppearance: {
                style: 'plain',
                normal: {
                  titleTextAttributes: {
                    color: 'white',
                    fontSize: 16,
                    fontWeight: '600',
                  },
                },
              },

              // Make the back button icon white
              backIndicatorImage: {
                type: 'IMAGE_SYSTEM',
                imageValue: {
                  systemName: 'chevron.left',
                  weight: 'semibold',
                },
                imageOptions: {
                  tint: 'white',
                  renderingMode: 'alwaysOriginal',
                },
              },
            }
          },
        }}

        // Use a custom component for navigation bar title
        renderNavBarTitleItem={({routeOptions}) => (
          <TouchableOpacity 
            style={styles.buttonContainer}
            onPress={() => {
              // Reset the index when pressed
              setIndex(0);
            }}
          >
            <Text style={styles.buttonLabel}>
              {routeOptions.routeTitle ?? 'N/A'}
            </Text>
          </TouchableOpacity>
        )}

        // Use a custom component for navigation bar right item
        renderNavBarRightItem={() => (
          <View style={styles.navBarLeftItemContainer}>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.buttonRightSpace]}
              onPress={() => {
                // Decrement the index when pressed
                setIndex(prevIndex => (prevIndex - 1));
              }}
            >
              <Text style={styles.buttonLabel}>
                {`--`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              // Increment the index when pressed
              setIndex(prevIndex => (prevIndex + 1));
            }}
          >
            <Text style={styles.buttonLabel}>
              {`++`}
            </Text>
          </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.rootContainer}>
        <Text style={styles.textTitle}>
          {`Current Index: ${index}`}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  routeContainer: {
    flex: 1,
  },
  rootContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
  },
  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.RED.A700,
    textDecorationLine: 'underline',
    textDecorationColor: Colors.RED[900],
  },
  navBarLeftItemContainer: {
    flexDirection: 'row',
  },
  buttonRightSpace: {
    marginRight: 10,
  },
  buttonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: Colors.RED[100],
  },
  buttonLabel: {
    color: Colors.RED[800],
    fontWeight: 'bold', 
  },
});