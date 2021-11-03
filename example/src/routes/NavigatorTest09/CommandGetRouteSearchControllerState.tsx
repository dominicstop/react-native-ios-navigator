import * as React from 'react';

import { useNavigation, RouteSearchControllerState } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardButton } from '../../components/ui/Card';
import { ObjectPropertyDisplay } from '../../components/ui/ObjectPropertyDisplay';


export function CommandGetRouteSearchControllerState(){
  const navigation = useNavigation();
  
  const [results, setResults] = 
    React.useState<undefined | RouteSearchControllerState>(undefined);

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'getRouteSearchControllerState'}
        subtitle={`Trigger NavigationObject.getRouteSearchControllerState`}
      />
      <ObjectPropertyDisplay
        key={`config-RouteViewConstants`}
        object={results}
      />
      <CardButton
        title={`Invoke 'getRouteSearchControllerState'`}
        subtitle={`Trigger command and display results`}
        onPress={async () => {
          const searchControllerState = await navigation.getRouteSearchControllerState();
          setResults(searchControllerState);
        }}
      />
    </CardBody>
  );
};