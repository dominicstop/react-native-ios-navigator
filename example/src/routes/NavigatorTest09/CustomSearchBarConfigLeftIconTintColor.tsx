import * as React from 'react';

import { useNavigation } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardRowColorPicker } from '../../components/ui/Card';


export function CustomSearchBarConfigLeftIconTintColor(){
  const navigation = useNavigation();

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'leftIconTintColor'}
        subtitle={`Set the CustomSearchBarConfig.leftIconTintColor`}
      />
      <CardRowColorPicker
        onSelectItem={(color) => {
          const routeOptions = navigation.routeOptions;

          navigation.setRouteOptions({
            searchBarConfig: {
              ...routeOptions.searchBarConfig,
              leftIconTintColor: color,
            },
          });
        }}
      />
    </CardBody>
  );
};