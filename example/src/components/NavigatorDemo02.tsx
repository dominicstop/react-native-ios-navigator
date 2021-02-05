import * as React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { NavigatorView, NavRouteEvents, RouteContentProps, useNavRouteLifeCycle } from 'react-native-ios-navigator';

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

function BlankRoute(props: RouteContentProps){
  return(
    <View>
    </View>
  );
};


let nestIndex = 0;

export function NavigatorDemo02(props: RouteContentProps){
  const navRef = React.useRef<NavigatorView>();

  useNavRouteLifeCycle('onRouteDidPush', true, async () => {
    if(nestIndex > 12) return;
    
    await Helpers.timeout(100);
    await navRef.current.push({
      routeKey: 'NestedNavigatorRoute',
      routeProps: { index: (nestIndex + 1)},
    });

    nestIndex++;
  });

  // @ts-ignore
  const currentIndex = (props.navigation?.routeProps?.index ?? 0);

  const currentColor = (DemoUtils.colors[
    currentIndex % DemoUtils.colors.length
  ]);

  const prevColor = (DemoUtils.colors[
    currentIndex % (DemoUtils.colors.length - 1)
  ]);

  return(
    <SafeAreaView style={{flex: 1}}>
      <NavigatorView
        ref={navRef}
        initialRouteKey={'BlankRoute'}
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
        routes={[{
          routeKey: 'BlankRoute',
          routeOptionsDefault: {
            backButtonDisplayMode: ((currentIndex % 2 == 0)
              ? 'default'
              : 'generic'
            )
          },
          renderRoute: () => (
            <BlankRoute/>
          ),
        }, {
          routeKey: 'NestedNavigatorRoute',
          routeOptionsDefault: {
            navBarButtonRightItemsConfig: [{
              type: 'IMAGE_SYSTEM',
              imageValue: ((currentIndex % 2 == 0)
                ? 'heart'
                : 'heart.fill'
              )
            }]
          },
          renderRoute: () => (
            <NavigatorDemo02/>
          ),
          renderNavBarTitleItem: () => (
            <View style={{
              backgroundColor: 'white',
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 3
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: prevColor,
              }}>
                {`Nested: ${currentIndex + 1}`}
              </Text>
            </View>
          ),
        }]}
      />
    </SafeAreaView>
  );
};