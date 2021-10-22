import * as React from 'react';

import type { NavRouteStackItem, NavRouteStackItemPartialMetadata, RouteContentProps } from 'react-native-ios-navigator';

import { Spacer, SpacerLine } from '../../components/ui/Spacer';
import { CardBody, CardButton, CardTitle } from '../../components/ui/Card';
import { ObjectPropertyDisplay } from '../../components/ui/ObjectPropertyDisplay';

import * as Helpers from '../../functions/Helpers';


export function GetNavigationObjectForRoute(props: RouteContentProps){
  const navigation = props.navigation;

  const routeMetadataConfigs: Array<NavRouteStackItemPartialMetadata> = [{
    routeKey: navigation.routeKey,
  }, {
    routeIndex: navigation.routeIndex,
  }, {
    routeID: navigation.routeID,
  }, {
    routeKey: navigation.routeKey,
    routeIndex: navigation.routeIndex,
  }, {
    routeKey: navigation.routeKey,
    routeID: navigation.routeID,
  }, {
    routeIndex: navigation.routeIndex,
    routeID: navigation.routeID,
  }, {
    routeKey: navigation.routeKey,
    routeIndex: navigation.routeIndex,
    routeID: navigation.routeID,
  }];

  const [index, setIndex] = React.useState(0);

  const currentMetadataConfig = 
    Helpers.nextItemInCyclicArray(index, routeMetadataConfigs);

  const [commandResults, setCommandResults] = React.useState<NavRouteStackItem | undefined>();

  return(
    <CardBody>
      <CardTitle
        pillTitle={'navigator.getNavigationObjectForRoute'}
      />
      <Spacer/>
      <CardTitle
        title={'Command Argument Config'}
        subtitle={`Find the route that matches the following criteria.`}
      />
      <ObjectPropertyDisplay
        object={currentMetadataConfig}
      />
      <CardButton
        title={'Next Config'}
        subtitle={'Cycle to next config...'}
        onPress={() => {
          setIndex(prevIndex => prevIndex + 1);
          setCommandResults(undefined);
        }}
      />
      <CardButton
        title={'Trigger Command'}
        subtitle={'Find the route that matches the current config'}
        onPress={() => {
          const results = navigation.getMatchingRouteStackItem(currentMetadataConfig);
          setCommandResults(results);
        }}
      />
      <SpacerLine/>
      {(commandResults != null) && (
        <React.Fragment>
          <Spacer/>
          <CardTitle
            title={'Command Results'}
            subtitle={`Based on the provided route metadata, here is the matching route in the navigation stack...`}
          />
          <ObjectPropertyDisplay
            object={commandResults}
          />
        </React.Fragment>
      )}
    </CardBody>
  );
};
