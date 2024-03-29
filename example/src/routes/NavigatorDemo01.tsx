import * as React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { NavBarAppearanceCombinedConfig, NavCommandPopOptions, NavCommandPushOptions, NavigatorView, RouteContentProps, RouteTransitionTypes, RouteTransitionTypesEnum, RouteViewEvents } from 'react-native-ios-navigator';

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

const transitionTypes: Array<RouteTransitionTypes> = 
  Object.values(RouteTransitionTypesEnum).slice(1);

const sharedNavBarConfig: NavBarAppearanceCombinedConfig = {
  mode: 'legacy',
  tintColor: 'white',
  largeTitleTextAttributes: {
    color: 'white',
    fontSize: 38,
    fontWeight: '800',
    fontStyle: 'italic',
  },
};

let colorIndex = 0;
function getNextColor(){
  return Helpers.nextItemInCyclicArray(colorIndex++, colors);
};

function BlankRoute(props: RouteContentProps & {
  offsetA?: number
  offsetB?: number
}){
  const [bgColor] = React.useState(getNextColor());
  const containerStyle = { backgroundColor: bgColor };

  const offset = (
    (props.offsetA ?? 0) +
    (props.offsetB ?? 0)
  );

  return (
    <View style={[styles.centeredContentContainer, containerStyle]}>
      <Text style={styles.textCenteredTitle}>
        {`${offset + props.navigation.routeIndex + 1}`}
      </Text>
    </View>
  );
};

//#region - Nest Test A

// ┌─────┬─────┐
// │.....│.....│
// │..1..│..2..│
// │.....│.....│
// ├─────┼─────┤
// │.....│.....│
// │..3..│..4..│
// │.....│.....│
// └─────┴─────┘
class NestTestA2 extends React.PureComponent<RouteContentProps & {
  offsetB?: number;
  onDidFinish?: () => void;
}> {
  navRefA: NavigatorView;
  navRefB: NavigatorView;

  pushAndPop = async (total: number) => {
    const props = this.props;

    const offset = props.offsetB ?? 0;

    for (let i = 0; i < total; i++) {
      const pushOptions: NavCommandPushOptions = {
        transitionConfig: {
          type: Helpers.nextItemInCyclicArray(i, transitionTypes),
          duration: 0.4,
        }
      };
      
      await Promise.all([
        this.navRefA.push({
          routeKey: 'BlankRoute', 
          routeOptions: { routeTitle: `A2-${i + 1 + offset}`},
          routeProps: { offsetB: 0 },
        }, pushOptions),

        this.navRefB.push({
          routeKey: 'BlankRoute', 
          routeOptions: { routeTitle: `A2-${i + 2 + offset}`},
          routeProps: { offsetB: 1 },
        }, pushOptions),
      ]);
    };

    for (let i = 0; i < total; i++) {
      const popOptions: NavCommandPopOptions = {
        transitionConfig: {
          type: Helpers.nextItemInCyclicArray(i, transitionTypes),
          duration: 0.4,
        }
      };

      await Promise.all([
        this.navRefA.pop(popOptions),
        this.navRefB.pop(popOptions),
      ]);
    };
  };

  _handleOnRouteDidPush = async () => {
    const props = this.props;

    await this.pushAndPop(transitionTypes.length);

    await Promise.all([
      this.navRefA.setNavigationBarHidden(true, true),
      this.navRefB.setNavigationBarHidden(true, true),
    ]);

    await this.pushAndPop(1);
    props.onDidFinish?.();
  };

  render(){
    const props = this.props;
    return(
      <React.Fragment>
        <RouteViewEvents
          onRouteDidPush={this._handleOnRouteDidPush}
        />
        <SafeAreaView style={styles.rowContainer}>
          <NavigatorView
            ref={r => { this.navRefA = r }}
            initialRoutes={[{routeKey: 'BlankRoute'}]}
            navBarAppearance={sharedNavBarConfig}
            routes={{
              BlankRoute: {
                routeOptionsDefault: {
                  routeTitle: "Left",
                },
                renderRoute: () => (
                  <BlankRoute
                    offsetA={0}
                    offsetB={props.offsetB}
                  />
                ),
              }
            }}
          />
          <NavigatorView
            ref={r => { this.navRefB = r }}
            initialRoutes={[{routeKey: 'BlankRoute'}]}
            navBarAppearance={sharedNavBarConfig}
            routes={{
              BlankRoute: {
                routeOptionsDefault: {
                  routeTitle: "Right",
                },
                renderRoute: () => (
                  <BlankRoute
                    offsetA={1}
                    offsetB={props.offsetB}
                  />
                ),
              }
            }}
          />
        </SafeAreaView>
      </React.Fragment>
    );
  };
};

// ┌─────┬─────┐
// │.....│.....│
// │..1..│..2..│
// │.....│.....│
// └─────┴─────┘
class NestTestA1 extends React.PureComponent<{
  onDidFinish?: () => void;
}> {
  navRefA: NavigatorView;
  navRefB: NavigatorView;

  callback: () => void;

  pushAndPop = async (total: number) => {
    for (let i = 0; i < total; i++) {
      await Promise.all([
        this.navRefA.push({routeKey: 'BlankRoute', routeOptions: {
          routeTitle: `A1-${i + 1}`
        }}),
        this.navRefB.push({routeKey: 'BlankRoute', routeOptions: {
          routeTitle: `A1-${i + 2}`
        }}),
      ]);
    };

    for (let i = 0; i < total; i++) {
      await Promise.all([
        this.navRefA.pop(),
        this.navRefB.pop(),
      ]);
    };
  };

  _handleOnRouteDidPush = async () => {
    const props = this.props;

    await this.pushAndPop(2);

    await Promise.all([
      this.navRefA.setNavigationBarHidden(true, true),
      this.navRefB.setNavigationBarHidden(true, true),
    ]);

    // NestTestA2: Start
    await Promise.all([
      this.navRefA.push({routeKey: 'NestTestA2', routeOptions: {
        routeTitle: 'A1-3'
      }}),
      this.navRefB.push({routeKey: 'NestTestA2', routeOptions: {
        routeTitle: 'A1-4'
      }}),
    ]);

    // NestTestA2: End
    await new Promise<void>(resolve => {
      this.callback = resolve;
    });

    await Promise.all([
      this.navRefA.setNavigationBarHidden(false, true),
      this.navRefB.setNavigationBarHidden(false, true),
    ]);

    await Promise.all([
      this.navRefA.pop(),
      this.navRefB.pop(),
    ]);

    await this.pushAndPop(1);

    props.onDidFinish?.();
  };

  render(){
    return(
      <React.Fragment>
        <RouteViewEvents
          onRouteDidPush={this._handleOnRouteDidPush}
        />
        <SafeAreaView style={styles.rootContainer}>
          <NavigatorView
            ref={r => { this.navRefA = r }}
            initialRoutes={[{routeKey: 'BlankRoute'}]}
            navBarAppearance={sharedNavBarConfig}
            routes={{
              BlankRoute: {
                routeOptionsDefault: {
                  routeTitle: "Top",
                },
                renderRoute: () => (
                  <BlankRoute
                    offsetA={0}
                  />
                ),
              }, 
              NestTestA2: {
                routeOptionsDefault: {
                  routeTitle: "A2",
                },
                renderRoute: () => (
                  <NestTestA2
                    offsetB={0}
                    onDidFinish={() => {
                      this.callback?.();
                    }}
                  />
                ),
              }
            }}
          />
          <NavigatorView
            ref={r => { this.navRefB = r }}
            initialRoutes={[{routeKey: 'BlankRoute'}]}
            navBarAppearance={sharedNavBarConfig}
            routes={{
              BlankRoute: {
                routeOptionsDefault: {
                  routeTitle: "Bottom",
                },
                renderRoute: () => (
                  <BlankRoute
                    offsetA={1}
                  />
                ),
              },
              NestTestA2: {
                routeOptionsDefault: {
                  routeTitle: "A2",
                },
                renderRoute: () => (
                  <NestTestA2
                    offsetB={2}
                    onDidFinish={() => {
                      this.callback?.();
                    }}
                  />
                ),
              }
            }}
          />
        </SafeAreaView>
      </React.Fragment>
    );
  };
};
//#endregion


/**
 * 
 */
export class NavigatorDemo01 extends React.Component {
  navRef: NavigatorView;
  callbackA1: () => void;

  pushAndPopBlank = async (total: number) => {
    for (let i = 0; i < total; i++) {
      await Promise.all([
        this.navRef.push({routeKey: 'BlankRoute', routeOptions: {
          routeTitle: `${i + 1}`
        }}),
      ]);
    };

    for (let i = 0; i < total; i++) {
      await this.navRef.pop();
    };
  };

  _handleOnRouteDidPush = async () => {
    await Helpers.timeout(750);

    await this.pushAndPopBlank(1);

    await this.navRef.setNavigationBarHidden(true, true);

    // NestTestA1: Start
    await this.navRef.push({routeKey: 'NestTestA1'});

    // NestTestA1: Finished
    // `callbackA1` is called when `NestTestA1` et. al. is done
    // pushing/popping.
    await new Promise<void>(resolve => {
      this.callbackA1 = resolve;
    });

    await this.navRef.setNavigationBarHidden(false, true);

    // pop: NestTestA1
    // Go back to the very beginning
    await this.navRef.pop();
    await this.pushAndPopBlank(1);

  };

  render(){
    return(
      <React.Fragment>
        <RouteViewEvents
          onRouteDidPush={this._handleOnRouteDidPush}
        />
        <SafeAreaView style={styles.rootContainer}>
          <NavigatorView
            ref={r => { this.navRef = r }}
            initialRoutes={[{routeKey: 'BlankRoute'}]}
            navBarAppearance={sharedNavBarConfig}
            routes={{
              BlankRoute: {
                routeOptionsDefault: {
                  routeTitle: "Start",
                },
                renderRoute: () => (
                  <BlankRoute/>
                ),
              }, 
              NestTestA1: {
                routeOptionsDefault: {
                  routeTitle: "A",
                },
                renderRoute: () => (
                  <NestTestA1
                    onDidFinish={() => {
                      this.callbackA1?.();
                    }}
                  />
                ),
              }
            }}
          />
        </SafeAreaView>
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  centeredContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCenteredTitle: {
    fontWeight: '900',
    color: 'white',
    fontSize: 64,
  },
});