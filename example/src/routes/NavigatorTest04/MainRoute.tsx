import * as React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import { RouteContentProps, RouteTransitionConfig, RouteTransitionTypes, RouteTransitionTypesEnum, RouteViewPortal } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardButton, CardRowStepper, CardRowSwitch } from '../../../src/components/ui/Card';
import { ObjectPropertyDisplay } from '../../../src/components/ui/ObjectPropertyDisplay';
import { Spacer, SpacerLine } from '../../../src/components/ui/Spacer';

import * as Colors  from '../../constants/Colors';
import * as Helpers from '../../functions/Helpers';


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

let colorIndex = 0;

function getBGColor(){
  return Helpers.nextItemInCyclicArray(colorIndex++, colors);
};

const transitionTypes = 
  Object.keys(RouteTransitionTypesEnum).slice(1) as Array<RouteTransitionTypes>;

export function MainRoute(props: RouteContentProps<{
  prevDuration ?: number; 
  prevTypeIndex?: number;
  prevUseRouteOptions?: boolean;
}>){
  const { routeProps, routeIndex } = props.navigation;

  const [bgColor] = React.useState(getBGColor());

  const [transitionTypeIndex, setTransitionTypeIndex] = 
    React.useState(routeProps?.prevTypeIndex ?? 0);

  const [transitionDuration, setTransitionDuration] = 
    React.useState(routeProps?.prevDuration ?? 500);

  const [useRouteOptions, setUseRouteOptions] = 
    React.useState(routeProps?.prevUseRouteOptions ?? false);

  const routeContainerStyle = { backgroundColor: bgColor };

  const transitionConfig: RouteTransitionConfig = {
    type: Helpers.nextItemInCyclicArray(transitionTypeIndex, transitionTypes),
    duration: transitionDuration / 1000,
  };

  return (
    <React.Fragment>
      <RouteViewPortal
        routeOptions={{
          routeTitle: `Route #${routeIndex}`,
          navBarAppearanceOverride: {
            mode: 'legacy',
            titleTextAttributes: {
              fontStyle: 'italic',
              fontSize: 18,
              fontWeight: '400',
            },
          },
          ...(useRouteOptions && {
            transitionConfigPush: transitionConfig,
            transitionConfigPop: transitionConfig,
          })
        }}
      />
      <SafeAreaView style={[styles.routeContainer, routeContainerStyle]}>
        <CardBody style={styles.cardBody}>
          <CardTitle
            title={'Configure'}
            pillTitle={'RouteTransitionConfig'}
          />
          <Spacer/>
          <ObjectPropertyDisplay
            object={transitionConfig}
          />
          <CardRowSwitch
            title={"Use via RouteOptions"}
            subtitle={(useRouteOptions
              ? "Apply transitions via 'RoutePortal.routeOptions'"
              : "Apply transitions via navigation command options"
            )}
            value={useRouteOptions}
            onValueChange={setUseRouteOptions}
            
          />
          <CardRowStepper
            title={'Transition Duration'}
            value={transitionDuration}
            stepperAmount={250}
            onValueChange={(value) => {
              setTransitionDuration(value)
            }}
          />
          <CardButton
            title={'Change Transition Type'}
            subtitle={"Cycle to the next 'RouteTransitionTypes'"}
            onPress={() => {
              setTransitionTypeIndex(currentIndex => currentIndex + 1);
            }}
          />
          
          <SpacerLine />
          <CardButton
            title={'Push Route'}
            subtitle={(useRouteOptions
              ? "Push new route with no transition config"
              : "Push new route with transition"
            )}
            onPress={() => {
              const nav = props.navigation;
              nav.push({
                routeKey: 'MainRoute',
                routeProps: {
                  prevDuration: transitionDuration,
                  prevTypeIndex: transitionTypeIndex,
                  prevUseRouteOptions: useRouteOptions,
                },
              }, {
                transitionConfig
              });
            }}
          />
          {!useRouteOptions && (
            <CardButton
              title={'Pop Route'}
              subtitle={"Pop current route with transition"}
              onPress={() => {
                const nav = props.navigation;
                nav.pop({
                  transitionConfig
                });
              }}
            />
          )}
        </CardBody>
      </SafeAreaView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  routeContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardBody: {
    marginHorizontal: 12,
  },
});