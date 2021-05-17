import * as React from 'react';

import { CardBody, CardButton, CardRowLabelDisplay, CardTitle, CardRowTextInput, CardRowSwitch } from '../ui/Card';
import { ObjectPropertyDisplay } from '../ui/ObjectPropertyDisplay';
import { SpacerLine } from '../ui/Spacer';

import { SharedSectionProps, backButtonItemConfigs, backButtonDisplayModes } from './Shared';

import * as Helpers from '../../functions/Helpers';


export function NavBarBackItemsConfig(props: SharedSectionProps & {
  backButtonItemsConfigIndex: number;
  backButtonDisplayModeIndex: number;
}){
  const backButtonTitleRef = React.useRef(null);

  const currentBackConfig = 
    Helpers.nextItemInCyclicArray(props.backButtonItemsConfigIndex, backButtonItemConfigs);

  const currentBackDisplayMode = 
    Helpers.nextItemInCyclicArray(props.backButtonDisplayModeIndex, backButtonDisplayModes);

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'navBarButtonBackItemsConfig'}
        subtitle={`Note: This will configure the next route's back item. Current config for the navbar back item: ${currentBackConfig?.description ?? 'N/A'}`}
      />
      <ObjectPropertyDisplay
        object={currentBackConfig?.config}
      />
      <CardButton
        title={'Update config'}
        subtitle={`Cycle to the next back item config`}
        onPress={() => {
          props.requestSetState(prevState => ({
            backButtonItemsConfigIndex:  prevState.backButtonItemsConfigIndex + 1
          }));
        }}
      />
      <SpacerLine/>
      <CardTitle
        title={'Configure'}
        pillTitle={'navBarBackButtonItem'}
        subtitle={`Misc. configurations for the back button`}
        extraMarginTop={24}
      />
      <CardRowSwitch
        title={`leftItemsSupplementBackButton`}
        value={props.parentState.leftItemsSupplementBackButton}
        onValueChange={value => {
          props.requestSetState({
            leftItemsSupplementBackButton: value,
          });
        }}
      />
      <CardRowSwitch
        title={`applyBackButtonConfigToCurrentRoute`}
        value={props.parentState.applyBackButtonConfigToCurrentRoute}
        onValueChange={value => {
          props.requestSetState({
            applyBackButtonConfigToCurrentRoute: value,
          });
        }}
      />
      <CardRowSwitch
        title={`hidesBackButton`}
        value={props.parentState.hidesBackButton}
        onValueChange={value => {
          props.requestSetState({
            hidesBackButton: value,
          });
        }}
      />
      <SpacerLine/>
      <CardTitle
        title={'Set'}
        pillTitle={'RouteOptions.backButtonDisplayMode'}
        subtitle={`Update the navbar display mode of the Back button. Requires iOS 14.0+. When the backBarButtonItem property is nil, this is used to determine the title of the Back button.`}
        extraMarginTop={24}
      />
      <CardRowLabelDisplay value={currentBackDisplayMode}/>
      <CardButton
        title={'Update `backButtonDisplayMode`'}
        subtitle={`Cycle to the next mode`}
        onPress={() => {
          props.requestSetState(prevState => ({
            backButtonDisplayModeIndex: prevState.backButtonDisplayModeIndex + 1
          }))
        }}
      />
      <CardTitle
        title={'Set'}
        pillTitle={'RouteOptions.backButtonTitle'}
        subtitle={`Update the navbar prompt via the \`RouteViewPortal\` comp. The prompt is a single line of text at the top.`}
        extraMarginTop={24}
      />
      <CardRowTextInput
        ref={backButtonTitleRef}
        placeholder={'backButtonTitle...'}
      />
      <CardButton
        title={'Update backButtonTitle'}
        subtitle={`Update the navBar's backButtonTitle text`}
        onPress={() => {
          props.requestSetState({
            backButtonTitle: backButtonTitleRef.current.getText()
          });
        }}
      />
      <CardButton
        title={'Push Route'}
        subtitle={`Show route with the current back button config`}
        onPress={() => {
          const navigation = props.navigation;
          navigation.push({routeKey: 'NavigatorTest01'});
        }}
      />
    </CardBody>
  );
};
