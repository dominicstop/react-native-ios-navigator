import * as React from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NavigatorView, RouteContentProps } from 'react-native-ios-navigator';

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

// extend
interface ExampleRouteProps extends RouteContentProps {
  routeKey: string;
  routeIndex: number;
};

function ExampleRoute(props: ExampleRouteProps){
  const [bgColor] = React.useState(randomBGColor());

  const routeContainerStyle = { backgroundColor: bgColor };

  return (
    <View style={[styles.routeContainer, routeContainerStyle]}>
      <Text style={styles.textRoute}>
        {`Debug: ${props.routeKey} - ${props.routeIndex}`}
      </Text>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          const navRef = props.getRefToNavigator();
          navRef.push({routeKey: 'routeA'});
        }}
      >
        <Text style={styles.buttonText}>
          {'Push: RouteA'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          const navRef = props.getRefToNavigator();
          navRef.push({routeKey: 'routeB', routeOptions: {
            routeTitle: `Route B${props.routeIndex + 1}`
          }});
        }}
      >
        <Text style={styles.buttonText}>
          {'Push: RouteB'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export class NavigatorExample01 extends React.Component<RouteContentProps> {
  navRef: NavigatorView;

  async componentDidMount(){
    // ref to the parent/root navigator
    const navRef = this.props.getRefToNavigator();
    await Helpers.timeout(1000);
    navRef.setNavigationBarHidden(true, true);
  };

  render(){
    const props = this.props;

    return(
      <View style={styles.rootContainer}>
        <NavigatorView
          ref={r => this.navRef = r}
          initialRouteKey={'routeA'}
          routes={[{
            routeKey: 'routeA',
            routeOptions: {
              routeTitle: "Route A",
            },
            renderRoute: (route, index) => (
              <ExampleRoute
                routeIndex={index}
                routeKey={route.routeKey}
              />
            ),
          }, {
            routeKey: 'routeB',
            routeOptions: {
              routeTitle: "Route B",
            },
            renderRoute: (route, index) => (
              <ExampleRoute
                routeIndex={index}
                routeKey={route.routeKey}
              />
            ),
          }]}
        />
      </View>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  routeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  textRoute: {
    fontSize: 32,
  },
  buttonContainer: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 12,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
  }
});