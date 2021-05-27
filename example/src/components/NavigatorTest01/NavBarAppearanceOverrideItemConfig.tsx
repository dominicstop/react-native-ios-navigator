import * as React from 'react';

import { ObjectPropertyDisplay } from '../ui/ObjectPropertyDisplay';
import { CardBody, CardButton, CardRowLabelDisplay, CardTitle, CardRowSwitch } from '../ui/Card';
import { SpacerLine } from '../ui/Spacer';

import { SharedSectionProps, navBarVisibilityModes } from './Shared';

import * as Helpers from '../../functions/Helpers';

import type { NavBarAppearanceCombinedConfig } from '../../../../src/types/NavBarAppearanceConfig';


export function NavBarAppearanceOverrideItemConfig(props: SharedSectionProps & {
  currentAppearanceOverrideConfig: NavBarAppearanceCombinedConfig;
  navBarVisibilityModeIndex: number;
  isUsingLegacyConfig: boolean;
  applyNavBarAppearanceToCurrentRoute: boolean;
}){

  const currentNavBarVisibilityMode = 
    Helpers.nextItemInCyclicArray(props.navBarVisibilityModeIndex, navBarVisibilityModes);

  const subtilePrefix = "This updates the navigation bar's current appearance using the " + (
    props.parentState.isUsingLegacyConfig
      ? "legacy appearance API by temp. overriding the 'legacy customization'-related nav bar properties."
      : "iOS 13+ appearance API via the appearance-related properties in the 'navigationItem'."
  );

  const subtitleSuffix = (
    + "Note that once you use the iOS 13+ appearance API, the legacy appearance API will"
    + " no longer work. Choose and to stick one, switching between them is unsupported."
  );
  
  return(
    <CardBody>
      <CardTitle
        title={'Set '}
        pillTitle={'NavBarAppearanceConfig'}
        subtitle={subtilePrefix + ' \n\n ' + subtitleSuffix}
      />
      <CardRowSwitch
        title={'Apply to current route'}
        value={props.parentState.applyNavBarAppearanceToCurrentRoute}
        onValueChange={(value) => {
          props.requestSetState({
            applyNavBarAppearanceToCurrentRoute: value
          });
        }}
      />
      <CardRowSwitch
        title={'Use legacy appearance'}
        value={props.parentState.isUsingLegacyConfig}
        onValueChange={(value) => {
          props.requestSetState({
            isUsingLegacyConfig: value
          });
        }}
      />
      <ObjectPropertyDisplay
        key={`config-NavBarAppearanceOverrideItemConfig`}
        object={props.currentAppearanceOverrideConfig}
      />
      <CardButton
        title={'Update config'}
        subtitle={`Cycle to the next preset config`}
        onPress={() => {
          props.requestSetState((prevState) => (props.isUsingLegacyConfig ? {
            navBarAppearanceLegacyConfigsIndex: 
              prevState.navBarAppearanceLegacyConfigsIndex + 1
          } : {
            navBarAppearanceConfigsIndex: 
              prevState.navBarAppearanceConfigsIndex + 1
          }));
        }}
      />

      <SpacerLine/>
      <CardTitle
        title={'Set'}
        pillTitle={'RouteOptions.navigationBarVisibility'}
        subtitle={`Will temp. override the current/default navigation bar visibility for this route.`}
        extraMarginTop={24}
      />
      <CardRowLabelDisplay
        value={currentNavBarVisibilityMode}
      />
      <CardButton
        title={'Update `navigationBarVisibility`'}
        subtitle={`Cycle to the next mode`}
        onPress={() => {
          props.requestSetState((prevState) => ({
            navBarVisibilityModeIndex: prevState.navBarVisibilityModeIndex + 1
          }));
        }}
      />

      {!props.applyNavBarAppearanceToCurrentRoute && (
        <CardButton
          title={'Push Route w/ Config'}
            subtitle={`Push a route with the current navbar appearance config`}
            onPress={() => {
              props.navigation.push({
                routeKey: 'NavigatorTest01',
                routeOptions: {
                  navBarAppearanceOverride: props.currentAppearanceOverrideConfig,
                  navigationBarVisibility: currentNavBarVisibilityMode
                }
              })
            }}
          />
      )}
    </CardBody>
  );
};
