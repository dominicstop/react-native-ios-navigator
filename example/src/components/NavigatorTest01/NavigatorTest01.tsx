import * as React from 'react';

import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { RouteViewEvents, RouteViewPortal, RouteContentProps } from 'react-native-ios-navigator';

import { SharedSectionProps, navBarItemsConfigs, backButtonItemConfigs, navBarAppearanceConfigs, navBarAppearanceLegacyConfigs, largeTitleDisplayModes, backButtonDisplayModes, navBarVisibilityModes, statusBarStyles } from './Shared';
import { NavBarConfigGeneral } from './NavBarConfigGeneral';

import { NavBarBackItemsConfig } from './NavBarBackItemsConfig';
import { NavBarRightItemsConfig } from './NavBarRightItemsConfig';
import { NavBarLeftItemsConfig } from './NavBarLeftItemsConfig';
import { NavBarTitleItemConfig } from './NavBarTitleItemConfig';

import { NavBarAppearanceOverrideItemConfig } from './NavBarAppearanceOverrideItemConfig';

import { StatusBarStyleConfig } from './StatusBarStyleConfig';
import { RouteViewConstants } from './RouteViewConstants';
import { NavigatorViewConstants } from './NavigatorViewConstants';
import { NavigationCommandsConfig } from './NavigationCommandsConfig';

import { Spacer } from '../ui/Spacer';

import * as Colors  from '../../constants/Colors';
import * as Helpers from '../../functions/Helpers';

import type { NavBarAppearanceCombinedConfig } from '../../../../src/types/NavBarAppearanceConfig';


// NOTE: This is messy.

export type NavigatorTest01State = {
  routeTitle?: string;
  routePrompt?: string;
  displayModeIndex: number;

  navBarButtonRightItemsConfigIndex: number;
  navBarButtonLeftItemsConfigIndex: number;
  backButtonItemsConfigIndex: number;
  renderNavBarTitleItem: boolean;


  applyNavBarAppearanceToCurrentRoute?: boolean;
  isUsingLegacyConfig: boolean;

  navBarAppearanceConfigsIndex: number;
  navBarAppearanceLegacyConfigsIndex: number;
  navBarVisibilityModeIndex: number;

  leftItemsSupplementBackButton: boolean;
  hidesBackButton: boolean,

  statusBarStyleIndex?: number;

  backButtonTitle?: string;
  backButtonDisplayModeIndex: number;
  applyBackButtonConfigToCurrentRoute: boolean;
};


export class NavigatorTest01 extends React.Component<RouteContentProps, NavigatorTest01State> {
  
  constructor(props: RouteContentProps){
    super(props);

    this.state  = {
      routeTitle: null,
      routePrompt: null,
      displayModeIndex: 0,

      renderNavBarTitleItem: false,
      navBarButtonRightItemsConfigIndex: 0,
      navBarButtonLeftItemsConfigIndex: 0,
      backButtonItemsConfigIndex: 0,

      applyNavBarAppearanceToCurrentRoute: false,
      isUsingLegacyConfig: true,
      navBarAppearanceConfigsIndex: 0,
      navBarAppearanceLegacyConfigsIndex: 0,
      navBarVisibilityModeIndex: 0,

      leftItemsSupplementBackButton: false,
      hidesBackButton: false,

      statusBarStyleIndex: null,

      backButtonTitle: null,
      backButtonDisplayModeIndex: 0,
      applyBackButtonConfigToCurrentRoute: false,
    };
  };
  
  _handleRequestSetState = (
    nextState: 
      | ((prevState: NavigatorTest01State) => Partial<NavigatorTest01State>)
      | Partial<NavigatorTest01State>
  ) => {
    this.setState((prevState) => ({
      ...prevState, ...((typeof nextState === 'function')
        ? nextState(prevState)
        : nextState
      )
    }));
  };

  render(){
    const props = this.props;
    const state = this.state;

    const navBarAppearanceLegacyConfig = Helpers.nextItemInCyclicArray(
      state.navBarAppearanceLegacyConfigsIndex, 
      navBarAppearanceLegacyConfigs
    );

    const navBarAppearanceConfig =  Helpers.nextItemInCyclicArray(
      state.navBarAppearanceConfigsIndex, 
      navBarAppearanceConfigs
    );

    const navBarAppearanceOverride: NavBarAppearanceCombinedConfig = state.isUsingLegacyConfig ? (
      navBarAppearanceLegacyConfig.config && {
        mode: 'legacy',
        ...navBarAppearanceLegacyConfig.config,
      }
    ):(
      navBarAppearanceConfig.config && {
        mode: 'appearance',
        ...navBarAppearanceConfig.config,
      }
    );

    const sharedProps: SharedSectionProps = {
      navigation : props.navigation,
      parentState: state,
      requestSetState: this._handleRequestSetState
    };

    return (
      <React.Fragment>
        <RouteViewPortal
          routeOptions={{
            largeTitleDisplayMode: Helpers.nextItemInCyclicArray(
              state.displayModeIndex, 
              largeTitleDisplayModes
            ),
            
            routeTitle: state.routeTitle,
            prompt: state.routePrompt,

            navBarButtonRightItemsConfig: Helpers.nextItemInCyclicArray(
              state.navBarButtonRightItemsConfigIndex, 
              navBarItemsConfigs
            ).config,

            navBarButtonLeftItemsConfig: Helpers.nextItemInCyclicArray(
              state.navBarButtonLeftItemsConfigIndex, 
              navBarItemsConfigs
            ).config,

            navBarButtonBackItemConfig: Helpers.nextItemInCyclicArray(
              state.backButtonItemsConfigIndex, 
              backButtonItemConfigs
            ).config,

            leftItemsSupplementBackButton: state.leftItemsSupplementBackButton,
            hidesBackButton: state.hidesBackButton,
            applyBackButtonConfigToCurrentRoute: state.applyBackButtonConfigToCurrentRoute,

            backButtonDisplayMode: Helpers.nextItemInCyclicArray(
              state.backButtonDisplayModeIndex, 
              backButtonDisplayModes
            ),
            
            backButtonTitle: state.backButtonTitle,

            navBarAppearanceOverride: (state.applyNavBarAppearanceToCurrentRoute
              ? navBarAppearanceOverride
              : null
            ),

            // should be null at first... 
            statusBarStyle: (state.statusBarStyleIndex == null? null : (
              Helpers.nextItemInCyclicArray(
                state.statusBarStyleIndex, 
                statusBarStyles
              )
            )),

            navigationBarVisibility: (state.applyNavBarAppearanceToCurrentRoute
              ? Helpers.nextItemInCyclicArray(
                  state.navBarVisibilityModeIndex, 
                  navBarVisibilityModes
                )
              : null
            ),
          }}
          renderNavBarLeftItem={() => (
            <View style={{
              paddingHorizontal: 10, 
              paddingVertical: 5,
              backgroundColor: Colors.PURPLE.A700,
              borderRadius: 10,
            }}>
              <Text style={{
                color: 'white',
                fontWeight: 'bold'
              }}>
                {'Custom Left'}
              </Text>
            </View>
          )}
          renderNavBarRightItem={() => (
            <View style={{
              paddingHorizontal: 10, 
              paddingVertical: 5,
              backgroundColor: Colors.PURPLE.A700,
              borderRadius: 10,
            }}>
              <Text style={{
                color: 'white',
                fontWeight: 'bold'
              }}>
                {'Custom Right'}
              </Text>
            </View>
          )}
          {...(state.renderNavBarTitleItem && ({
            renderNavBarTitleItem: (params) => (
              <View style={{
                paddingHorizontal: 10, 
                paddingVertical: 5,
                backgroundColor: Colors.PURPLE.A700,
                borderRadius: 10,
              }}>
                <Text style={{
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  {`Custom: ${params.routeOptions?.routeTitle}`}
                </Text>
              </View>
            )
          }))}
        />
        <RouteViewEvents
          onPressNavBarRightItem={({nativeEvent}) => {
            Alert.alert(
              'onPressNavBarRightItem', 
              `key: ${nativeEvent.key}`
            );
          }}
          onPressNavBarLeftItem={({nativeEvent}) => {
            Alert.alert('onPressNavBarLeftItem', (
                `key: ${nativeEvent.key}`
              + ` - index: ${nativeEvent.index}`
              + ` - type: ${nativeEvent.type}`
            ));
          }}
        />
        <ScrollView style={styles.rootContainer}>
          <NavBarConfigGeneral
            {...sharedProps}
            displayModeIndex={state.displayModeIndex}
          />
          <NavBarLeftItemsConfig
            {...sharedProps}
            navBarButtonLeftItemsConfigIndex={state.navBarButtonLeftItemsConfigIndex}
          />
          <NavBarRightItemsConfig
            {...sharedProps}
            navBarButtonRightItemsConfigIndex={state.navBarButtonRightItemsConfigIndex}
          />
          <NavBarBackItemsConfig
            {...sharedProps}
            backButtonDisplayModeIndex={state.backButtonDisplayModeIndex}
            backButtonItemsConfigIndex={state.backButtonItemsConfigIndex}
          />
          <NavBarTitleItemConfig
            {...sharedProps}
          />
          <NavBarAppearanceOverrideItemConfig
            {...sharedProps}
            currentAppearanceOverrideConfig={navBarAppearanceOverride}
            navBarVisibilityModeIndex={state.navBarVisibilityModeIndex}
            applyNavBarAppearanceToCurrentRoute={state.applyNavBarAppearanceToCurrentRoute}
            isUsingLegacyConfig={state.isUsingLegacyConfig}
          />
          <StatusBarStyleConfig
            {...sharedProps}
            statusBarStyleIndex={state.statusBarStyleIndex}
          />
          <RouteViewConstants
            {...sharedProps}
          />
          <NavigatorViewConstants {...sharedProps}/>
          <NavigationCommandsConfig
            {...sharedProps}
          />
          <Spacer space={100}/>
        </ScrollView>
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  centeredContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCenteredTitle: {
    fontWeight: '900',
    color: 'white',
    fontSize: 64,
  },
});