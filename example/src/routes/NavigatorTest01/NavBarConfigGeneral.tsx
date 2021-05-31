import * as React from 'react';

import { CardBody, CardButton, CardRowLabelDisplay, CardTitle, CardRowTextInput } from '../../components/ui/Card';
import { SpacerLine } from '../../components/ui/Spacer';

import { SharedSectionProps, largeTitleDisplayModes } from './Shared';

import * as Helpers from '../../functions/Helpers';


export function NavBarConfigGeneral(props: SharedSectionProps & {
  displayModeIndex: number;
}){
  
  const inputPromptRef     = React.useRef(null);
  const inputRouteTitleRef = React.useRef(null);

  const currentTitleDisplayMode = 
    Helpers.nextItemInCyclicArray(props.displayModeIndex, largeTitleDisplayModes);
  
  return(
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'RouteOptions.routeTitle'}
        subtitle={`Update the navbar title via the \`RouteViewPortal\` comp.`}
      />
      <CardRowTextInput
        ref={inputRouteTitleRef}
        placeholder={'Navbar Title...'}
      />
      <CardButton
        title={'Update Title'}
        subtitle={`Update the navBar's title`}
        onPress={() => {
          props.requestSetState({
            routeTitle: inputRouteTitleRef.current.getText()
          });
        }}
      />
      <SpacerLine/>
      <CardTitle
        title={'Set'}
        pillTitle={'RouteOptions.prompt'}
        subtitle={`Update the navbar prompt via the \`RouteViewPortal\` comp. The prompt is a single line of text at the top.`}
        extraMarginTop={24}
      />
      <CardRowTextInput
        ref={inputPromptRef}
        placeholder={'Navbar Prompt...'}
      />
      <CardButton
        title={'Update Prompt'}
        subtitle={`Update the navBar's prompt text`}
        onPress={() => {
          props.requestSetState({
            routePrompt: inputPromptRef.current.getText()
          });
        }}
      />
      <SpacerLine/>
      <CardTitle
        title={'Set'}
        pillTitle={'RouteOptions.titleDisplayMode'}
        subtitle={`Cycle to the next display mode`}
        extraMarginTop={24}
      />
      <CardRowLabelDisplay
        value={currentTitleDisplayMode}
      />
      <CardButton
        title={'Update `titleDisplayMode`'}
        subtitle={`Cycle to the next display mode`}
        onPress={() => {
          props.requestSetState(prevState => ({
            displayModeIndex: prevState.displayModeIndex + 1
          }))
        }}
      />
    </CardBody>
  );
};