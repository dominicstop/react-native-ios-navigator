import * as React from 'react';

import type { RouteContentProps } from 'react-native-ios-navigator';

import { CardBody, CardButton, CardTitle } from '../../components/ui/Card';


export function NavigationCommandsConfig(props: RouteContentProps){
  return(
    <CardBody>
      <CardTitle
        title={'Navigation Commands'}
        subtitle={`Test out the navigation commands`}
      />
      <CardButton
        title={'Push `NavigatorTest03`'}
        subtitle={'Push a new route with fade animation'}
        onPress={() => {
          props.navigation.push({
            routeKey: 'NavigatorTest03',
          }, {
            transitionConfig: {
              type: 'CrossFade'
            }
          });
        }}
      />
      <CardButton
        title={'Pop Current'}
        subtitle={'Pop the current route with fade animation'}
        onPress={() => {
          props.navigation.pop();
        }}
      />
      <CardButton
        title={'Pop Current'}
        subtitle={'Pop the current route'}
        onPress={() => {
          props.navigation.pop();
        }}
      />
    </CardBody>
  );
};
