import * as React from 'react';

import { useNavigation } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardRowLabelDisplay, CardButton } from '../../components/ui/Card';

import * as Helpers from '../../functions/Helpers';


const VALUES: Array<boolean| undefined> = 
  [undefined, false, true];

export function SearchBarConfigIsTranslucent(){
  const navigation = useNavigation();
  
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const currentSelectedValue =
    Helpers.nextItemInCyclicArray(selectedIndex, VALUES);

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'searchBarStyle'}
        subtitle={`Set SearchBarConfig.isTranslucent`}
      />
      <CardRowLabelDisplay
        value={
          (currentSelectedValue == null) ? 'N/A'  : 
          (currentSelectedValue        ) ? 'true' : 'false'
        }
      />
      <CardButton
        title={'Update `isTranslucent`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          const routeOptions = navigation.routeOptions;

          const nextSelectedValue =
            Helpers.nextItemInCyclicArray(selectedIndex + 1, VALUES);

          navigation.setRouteOptions({
            searchBarConfig: {
              ...routeOptions.searchBarConfig,
              isTranslucent: nextSelectedValue,
            },
          });

          setSelectedIndex(prevIndex =>  prevIndex + 1);
        }}
      />
    </CardBody>
  );
};