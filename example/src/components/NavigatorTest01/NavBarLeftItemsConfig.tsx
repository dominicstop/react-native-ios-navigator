import * as React from 'react';

import { ObjectPropertyDisplay } from '../ui/ObjectPropertyDisplay';
import { CardBody, CardButton, CardTitle } from '../ui/Card';

import { SharedSectionProps, navBarItemsConfigs } from './Shared';

import * as Helpers from '../../functions/Helpers';

export function NavBarLeftItemsConfig(props: SharedSectionProps & {
  navBarButtonLeftItemsConfigIndex: number;
}){

  const currentConfig = Helpers.nextItemInCyclicArray(
    props.navBarButtonLeftItemsConfigIndex, 
    navBarItemsConfigs
  );

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'navBarButtonLeftItemsConfig'}
        subtitle={`Current config for the nav bar left item: ${currentConfig?.description ?? 'N/A'}`}
      />
      {(currentConfig.config.length == 0)?(
         <ObjectPropertyDisplay
            key={`config-navBarButtonLeftItemsConfig`}
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
            navBarButtonLeftItemsConfigIndex: 
              prevState.navBarButtonLeftItemsConfigIndex + 1
          }));
        }}
      />
    </CardBody>
  );
};