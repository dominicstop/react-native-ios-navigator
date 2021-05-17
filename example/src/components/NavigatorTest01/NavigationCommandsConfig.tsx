import * as React from 'react';

import type { RouteContentProps } from 'react-native-ios-navigator';

import { CardBody, CardButton, CardTitle } from '../ui/Card';


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
              type: 'FadePush'
            }
          });
        }}
      />
      <CardButton
        title={'Pop Current'}
        subtitle={'Pop the current route with fade animation'}
        onPress={() => {
          props.navigation.pop({
            transitionConfig: {
              type: 'FadePop'
            }
          });
        }}
      />
    </CardBody>
  );
};
