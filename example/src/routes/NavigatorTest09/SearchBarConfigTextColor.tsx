import * as React from 'react';

import { useNavigation } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardRowColorPicker } from '../../components/ui/Card';

export function SearchBarConfigTextColor(){
  const navigation = useNavigation();

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'textColor'}
        subtitle={`Set the SearchBarConfig.textColor`}
      />
      <CardRowColorPicker
        onSelectItem={(color) => {
          const routeOptions = navigation.routeOptions;

          navigation.setRouteOptions({
            searchBarConfig: {
              ...routeOptions.searchBarConfig,
              textColor: color,
            },
          });
        }}
      />
    </CardBody>
  );
};