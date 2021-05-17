import * as React from 'react';

import { CardBody, CardRowSwitch, CardRowLabelDisplay, CardTitle, CardRowTextInput } from '../ui/Card';
import { SpacerLine } from '../ui/Spacer';

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