import * as React from 'react';

import { useNavigation } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardRowColorPicker } from '../../components/ui/Card';


export function CustomSearchBarConfigPlaceholderTextColor(){
  const navigation = useNavigation();

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'placeholderTextColor'}
        subtitle={`Set the CustomSearchBarConfig.placeholderTextColor`}
      />
      <CardRowColorPicker
        onSelectItem={(color) => {
          const routeOptions = navigation.routeOptions;

          navigation.setRouteOptions({
            searchBarConfig: {
              ...routeOptions.searchBarConfig,
              placeholderTextColor: color,
            },
          });
        }}
      />
    </CardBody>
  );
};