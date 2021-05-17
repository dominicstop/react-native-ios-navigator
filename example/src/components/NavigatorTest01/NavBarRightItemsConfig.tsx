import * as React from 'react';

import { CardBody, CardButton, CardTitle } from '../ui/Card';
import { ObjectPropertyDisplay } from '../ui/ObjectPropertyDisplay';

import { SharedSectionProps, navBarItemsConfigs } from './Shared';

import * as Helpers from '../../functions/Helpers';


export function NavBarRightItemsConfig(props: SharedSectionProps & {
  navBarButtonRightItemsConfigIndex: number;
}){

  const currentConfig = 
    Helpers.nextItemInCyclicArray(props.navBarButtonRightItemsConfigIndex, navBarItemsConfigs);

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'navBarButtonRightItemsConfig'}
        subtitle={`Current config for the nav bar right item: ${currentConfig?.description ?? 'N/A'}`}
      />
      {(currentConfig.config.length == 0)?(
         <ObjectPropertyDisplay
            key={`config-NavBarRightItemsConfig`}
            object={null}
          />
      ):(
        // @ts-ignore
        currentConfig.config.map((config, index) =>
          <ObjectPropertyDisplay
            key={`config-${index}`}
            object={config}
          />
        )
      )}
      <CardButton
        title={'Update config'}
        subtitle={`Cycle to the next nav bar item config`}
        onPress={() => {
          props.requestSetState(prevState => ({
            navBarButtonRightItemsConfigIndex: 
              prevState.navBarButtonRightItemsConfigIndex + 1
          }));
        }}
      />
    </CardBody>
  );
};
