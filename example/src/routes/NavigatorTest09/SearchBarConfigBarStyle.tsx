import * as React from 'react';

import { UISearchBarStyle, useNavigation } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardRowLabelDisplay, CardButton } from '../../components/ui/Card';

import * as Helpers from '../../functions/Helpers';


const SEARCH_BAR_STYLES: Array<UISearchBarStyle | undefined> = 
  [undefined, 'default', 'minimal', 'prominent'];

export function SearchBarConfigBarStyle(){
  const navigation = useNavigation();
  
  const [searchBarStyleIndex, setSearchBarStyleIndex] = React.useState(0);

  const currentSearchBarStyle =
    Helpers.nextItemInCyclicArray(searchBarStyleIndex, SEARCH_BAR_STYLES);

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'searchBarStyle'}
        subtitle={`Set the SearchBarConfig.searchBarStyle`}
      />
      <CardRowLabelDisplay
        value={currentSearchBarStyle ?? 'N/A'}
      />
      <CardButton
        title={'Update `searchBarStyle`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          const routeOptions = navigation.routeOptions;

          const nextSearchBarStyle =
            Helpers.nextItemInCyclicArray(searchBarStyleIndex + 1, SEARCH_BAR_STYLES);

          navigation.setRouteOptions({
            searchBarConfig: {
              ...routeOptions.searchBarConfig,
              searchBarStyle: nextSearchBarStyle,
            },
          });

          setSearchBarStyleIndex(prevIndex =>  prevIndex + 1);
        }}
      />
    </CardBody>
  );
};