import * as React from 'react';

import { CardBody, CardButton, CardTitle } from '../../components/ui/Card';
import { ObjectPropertyDisplay } from '../../components/ui/ObjectPropertyDisplay';

import type { RouteContentProps, NavigatorConstantsObject } from 'react-native-ios-navigator';


export function NavigatorViewConstants(props: RouteContentProps){
  const [navigatorConstantsObject, setNavigatorConstantsObject] = React.useState<NavigatorConstantsObject>(null);

  return(
    <CardBody>
      <CardTitle
        title={'Navigator View Constants'}
        subtitle={`Async. get the navigator view constants from native`}
      />
      <ObjectPropertyDisplay
        key={`config-RouteViewConstants`}
        object={navigatorConstantsObject}
      />
      <CardButton
        title={'Invoke `getNavigatorConstants`'}
        subtitle={'Get values from `RNINavigatorView.getConstants`'}
        onPress={async () => {
          const constants = await props.navigation.getNavigatorConstants();
          setNavigatorConstantsObject(constants);
        }}
      />
    </CardBody>
  );
};