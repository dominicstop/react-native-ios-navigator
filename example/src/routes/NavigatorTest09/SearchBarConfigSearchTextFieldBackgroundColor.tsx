import * as React from 'react';

import { useNavigation } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardRowColorPicker } from '../../components/ui/Card';

export function SearchBarConfigSearchTextFieldBackgroundColor(){
  const navigation = useNavigation();

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'searchTextFieldBackgroundColor'}
        subtitle={`Set the SearchBarConfig.searchTextFieldBackgroundColor`}
      />
      <CardRowColorPicker
        onSelectItem={(color) => {
          const routeOptions = navigation.routeOptions;

          navigation.setRouteOptions({
            searchBarConfig: {
              ...routeOptions.searchBarConfig,
              searchTextFieldBackgroundColor: color,
            },
          });
        }}
      />
    </CardBody>
  );
};