import * as React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { NavigatorView, RouteContentProps, useNavRouteEvents } from 'react-native-ios-navigator';

import * as Colors  from '../constants/Colors';
import * as Helpers from '../functions/Helpers';


class DemoUtils {
  static colors = [
    Colors.PINK.A700,
    Colors.RED.A700,
    Colors.ORANGE.A700,
    Colors.YELLOW.A700,
    Colors.AMBER.A700,
    Colors.GREEN.A700,
    Colors.LIGHT_GREEN.A700,
    Colors.BLUE.A700,
    Colors.PURPLE.A700,
    Colors.VIOLET.A700,
    Colors.INDIGO.A700,
  ];

  static randomBGColor(){
    return Helpers.randomElement<string>(DemoUtils.colors);
  };
};

function BlankRoute(_: RouteContentProps){
  return(
    <View/>
  );
};

export function NavigatorDemo02(props: RouteContentProps & {
  triggerPop?: () => void;
  incrementColorIndex?: () => void;
}){
  const navRef = React.useRef<NavigatorView>();
  const [colorIndexOffset, setColorIndexOffset] = React.useState(0);

  const currentIndex = 
    // @ts-ignore
    (props.navigation?.routeProps?.index ?? 0) + colorIndexOffset;

  useNavRouteEvents('onRouteDidPush', async () => {
    if(currentIndex < 12) {
      await navRef.current.push({
        routeKey: 'NestedNavigatorRoute',
        routeProps: { index: (currentIndex + 1)},
      });

    } else {
      for (let i = 0; i < 12; i++) {
        setColorIndexOffset(prev => prev + 1);
        props.incrementColorIndex();
        await Helpers.timeout(250);
      };

      props.triggerPop();
    };
  });

  const currentColor = (DemoUtils.colors[
    currentIndex % DemoUtils.colors.length
  ]);

  const prevColor = (DemoUtils.colors[
    currentIndex % (DemoUtils.colors.length - 1)
  ]);

  return(
    <SafeAreaView style={styles.routeRootContainer}>
      <NavigatorView
        ref={navRef}
        initialRoutes={[{routeKey: 'BlankRoute'}]}
        navBarAppearance={{
          mode: 'legacy',
          barTintColor: currentColor,
          tintColor: 'white',
          titleTextAttributes: {
            color: 'white',
            fontWeight: 'bold',
            fontStyle: 'italic',
            fontSize: 18,
          }
        }}
        navBarPrefersLargeTitles={false}
        routes={{
          BlankRoute: {
            routeOptionsDefault: {
              backButtonDisplayMode: ((currentIndex % 2 === 0)
                ? 'default'
                : 'generic'
              )
            },
            renderRoute: () => (
              <BlankRoute/>
            ),
          }, 
          NestedNavigatorRoute: {
            routeOptionsDefault: {
              navBarButtonRightItemsConfig: [{
                type: 'IMAGE_SYSTEM',
                imageValue: ((currentIndex % 2 === 0)
                  ? 'heart'
                  : 'heart.fill'
                )
              }]
            },
            renderRoute: () => (
              <NavigatorDemo02
                incrementColorIndex={() => {
                  setColorIndexOffset(prev => prev + 1);
                  props.incrementColorIndex?.();
                }}
                triggerPop={async () => {
                  if (props.triggerPop){
                    await navRef.current.pop();
                    props.triggerPop();

                  } else {
                    await navRef.current.pop();
                  };
                }}
              />
            ),
            renderNavBarTitleItem: () => (
              <View style={styles.navBarTitleContainer}>
                <Text style={[styles.navBarTitleText, { color: prevColor }]}>
                  {`Nested: ${currentIndex + 1}`}
                </Text>
              </View>
            ),
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  routeRootContainer: {
    flex: 1,
  },
  navBarTitleContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3
  },
  navBarTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});