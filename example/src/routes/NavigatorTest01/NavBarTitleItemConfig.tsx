import * as React from 'react';

import { CardBody, CardRowSwitch, CardTitle } from '../../components/ui/Card';

import type { SharedSectionProps } from './Shared';


export function NavBarTitleItemConfig(props: SharedSectionProps){
  return(
    <CardBody>
      <CardTitle
        title={'Toggle '}
        pillTitle={'renderNavBarTitleItem'}
        subtitle={`Render a custom component for the navbar title`}
      />
      <CardRowSwitch
        title={`renderNavBarTitleItem`}
        value={props.parentState.renderNavBarTitleItem}
        onValueChange={value => {
          props.requestSetState({
            renderNavBarTitleItem: value,
          });
        }}
      />
    </CardBody>
  );
};