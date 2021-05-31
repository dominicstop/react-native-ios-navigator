import * as React from 'react';

import type { RouteContentProps, RouteConstantsObject } from 'react-native-ios-navigator';

import { CardBody, CardButton, CardTitle } from '../../components/ui/Card';
import { ObjectPropertyDisplay } from '../../components/ui/ObjectPropertyDisplay';


export function RouteViewConstants(props: RouteContentProps){
  const [routeConstantsObject, setRouteConstantsObject] = React.useState<RouteConstantsObject>(null);

  return(
    <CardBody>
      <CardTitle
        title={'Route View Constants'}
        subtitle={`Async. get the route view constants from native`}
      />
      <ObjectPropertyDisplay
        key={`config-RouteViewConstants`}
        object={routeConstantsObject}
      />
      <CardButton
        title={'Invoke `getRouteConstants`'}
        subtitle={'Get values from `RNINavigatorRouteView.getConstants`'}
        onPress={async () => {
          const constants = await props.navigation.getRouteConstants();
          setRouteConstantsObject(constants);
        }}
      />
    </CardBody>
  );
};