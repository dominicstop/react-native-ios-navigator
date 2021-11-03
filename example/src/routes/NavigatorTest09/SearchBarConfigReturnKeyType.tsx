import * as React from 'react';

import { useNavigation, ReturnKeyType } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardRowLabelDisplay, CardButton } from '../../components/ui/Card';

import * as Helpers from '../../functions/Helpers';


const VALUES: Array<ReturnKeyType | undefined> =  [
  undefined, 
  'default',
  'go',
  'google',
  'join',
  'next',
  'route',
  'search',
  'send',
  'yahoo',
  'done',
  'emergencyCall',
  'continue',
];

export function SearchBarConfigReturnKeyType(){
  const navigation = useNavigation();
  
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const currentSelectedValue =
    Helpers.nextItemInCyclicArray(selectedIndex, VALUES);

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'returnKeyType'}
        subtitle={`Set SearchBarConfig.returnKeyType`}
      />
      <CardRowLabelDisplay
        value={currentSelectedValue ?? 'N/A'}
      />
      <CardButton
        title={'Update `returnKeyType`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          const routeOptions = navigation.routeOptions;

          const nextSelectedValue =
            Helpers.nextItemInCyclicArray(selectedIndex + 1, VALUES);

          navigation.setRouteOptions({
            searchBarConfig: {
              ...routeOptions.searchBarConfig,
              returnKeyType: nextSelectedValue,
            },
          });

          setSelectedIndex(prevIndex =>  prevIndex + 1);
        }}
      />
    </CardBody>
  );
};