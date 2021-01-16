import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { NavigatorView, NavRouteEvents, RouteContentProps, useNavRouteEvents } from 'react-native-ios-navigator';

import * as Colors  from '../constants/Colors';
import * as Helpers from '../functions/Helpers';


const colors = [
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

function randomBGColor(){
  return Helpers.randomElement<string>(colors);
};

function NestTestContent(props: RouteContentProps & {
  offset: number
}){
  const [bgColor] = React.useState(randomBGColor());
  const rootContainerStyle = { backgroundColor: bgColor };

  return(
    <View style={[styles.nestTestContentContainer, rootContainerStyle]}>
      <Text style={styles.textNestTestContentTitle}>
        {props.routeIndex + props.offset}
      </Text>
    </View>
  );
};

class NestTest extends React.PureComponent<{
  offset: number
}> {
  navRef: NavigatorView;

  async componentDidMount(){
    await Helpers.timeout(1000);

    const level = 4;

    for(let i = 0; i < level; i++) {
      await Promise.all([
        Helpers.timeout(750),
        this.navRef.push({routeKey: 'routeA', routeOptions: {
          routeTitle: `${i + 1}`
        }})
      ]);
    };

    for(let i = 0; i < level; i++) {
      await Promise.all([
        Helpers.timeout(750),
        this.navRef.pop(),
      ]);
    };
  };

  render(){
    const props = this.props;

    return(
      <NavigatorView
        ref={r => this.navRef = r}
        initialRouteKey={'routeA'}
        routes={[{
          routeKey: 'routeA',
          routeOptions: {
            routeTitle: "Route A",
          },
          renderRoute: () => (
            <NestTestContent
              offset={props.offset}
            />
          ),
        }]}
      />
    );
  };
};

/**
 * 
 */
export function NavigatorTest01() {
  return(
    <View style={styles.rootContainer}>
      <View style={styles.rowContainer}>
        <NestTest offset={1}/>
        <NestTest offset={2}/>
      </View>
      <View style={styles.rowContainer}>
        <NestTest offset={3}/>
        <NestTest offset={4}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  nestTestContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNestTestContentTitle: {
    fontWeight: '900',
    color: 'white',
    fontSize: 64,
  },
});