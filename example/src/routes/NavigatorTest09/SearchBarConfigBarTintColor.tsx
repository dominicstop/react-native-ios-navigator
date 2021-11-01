import * as React from 'react';

import { useNavigation } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardRowColorPicker } from '../../components/ui/Card';

export function SearchBarConfigBarTintColor(){
  const navigation = useNavigation();

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'barTintColor'}
        subtitle={`Set the SearchBarConfig.barTintColor`}
      />
      <CardRowColorPicker
        onSelectItem={(color) => {
          const routeOptions = navigation.routeOptions;

          navigation.setRouteOptions({
            searchBarConfig: {
              ...routeOptions.searchBarConfig,
              barTintColor: color,
            },
          });
        }}
      />
    </CardBody>
  );
};