import * as React from 'react';

import { CardBody, CardButton, CardRowLabelDisplay, CardTitle } from '../../components/ui/Card';

import { SharedSectionProps, statusBarStyles } from './Shared';

import * as Helpers from '../../functions/Helpers';


export function StatusBarStyleConfig(props: SharedSectionProps & {
  statusBarStyleIndex: number;
}){

  const currentStatusBarStyle = 
    Helpers.nextItemInCyclicArray(props.statusBarStyleIndex, statusBarStyles);

  return(
    <CardBody>
      <CardTitle
        title={'Status Bar Style'}
        subtitle={`Change the 'statusBarStyle (UIStatusBarStyle)'`}
      />
      <CardRowLabelDisplay
        value={currentStatusBarStyle}
      />
      <CardButton
        title={'Update `statusBarStyle`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          props.requestSetState((prevState) => ({
            statusBarStyleIndex: (prevState.statusBarStyleIndex ?? 0) + 1
          }));
        }}
      />
      <CardButton
        title={'Push `NavigatorTest01`'}
        subtitle={'Push route w/ statusBarStyle: `lightContent`'}
        onPress={() => {
          props.navigation.push({
            routeKey: 'NavigatorTest01',
            routeOptions: {
              statusBarStyle: 'lightContent',
            },
          });
        }}
      />
    </CardBody>
  );
};