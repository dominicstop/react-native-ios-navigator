import type { NavBarItemsConfig, NavBarBackItemConfig } from '../../../src/types/NavBarItemConfig';
import * as React from 'react';

import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { NavigatorView, NavRouteEvents, RouteContentProps, RouteViewEvents, RouteViewPortal } from 'react-native-ios-navigator';

import * as Colors  from '../constants/Colors';
import * as Helpers from '../functions/Helpers';

// NOTE: This is messy.


const colors = [
  Colors.PINK.A700,
  Colors.RED.A700,
  Colors.ORANGE.A700,
  Colors.YELLOW.A700,
  Colors.AMBER.A700,
  Colors.GREEN.A700,
  Colors.LIGHT_GREEN.A700,
  Colors.BLUE.A700,
  Colors.PURPLE.A700,
  Colors.VIOLET.A700,
  Colors.INDIGO.A700,
];

const largeTitleDisplayModes = ['automatic', 'always', 'never'];

const backButtonDisplayModes = ['default', 'generic', 'minimal'];

const navBarItemsConfigs: Array<{
  config: NavBarItemsConfig,
  description: string
}> = [{
  description: 'N/A',
  config: []
}, {
  description: 'A nav bar item with `Type: TEXT`',
  config: [{
    type: 'TEXT',
    title: 'Item',
  }]
}, {
  description: "A nav bar item with `Type: TEXT` that's tinted red",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item',
    tintColor: 'red'
  }]
}, {
  description: "2 nav bar item with `Type: TEXT` that's tinted red and the other blue",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item A',
    tintColor: 'red',
  }, {
    type: 'TEXT',
    key: 'B',
    title: 'Item B',
    tintColor: 'blue'
  }]
}, {
  description: "3 nav bar item with `Type: TEXT` w/ `tintColor` set to red, yellow and blue",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item A',
    tintColor: 'red',
  }, {
    type: 'TEXT',
    key: 'B',
    title: 'Item B',
    tintColor: 'blue'
  }, {
    type: 'TEXT',
    key: 'C',
    title: 'Item C',
    tintColor: 'yellow'
  }]
}, {
  description: "A nav bar item with `Type: SYSTEM_ITEM` w/ `systemItem: 'close'`",
  config: [{
    type: 'SYSTEM_ITEM',
    systemItem: 'close'
  }]
}, {
  description: "A nav bar item with `Type: SYSTEM_ITEM` w/ `systemItem: 'compose' and w/ `tintColor` set to red`",
  config: [{
    type: 'SYSTEM_ITEM',
    systemItem: 'compose',
    tintColor: 'red'
  }]
}, {
  description: "2 nav bar item with `Type: SYSTEM_ITEM` w/ `systemItem` set to 'done', and 'edit', and w/ `tintColor` set to red and blue`",
  config: [{
    type: 'SYSTEM_ITEM',
    systemItem: 'done',
    tintColor: 'red'
  }, {
    type: 'SYSTEM_ITEM',
    systemItem: 'edit',
    tintColor: 'blue'
  }]
}, {
  description: "3 nav bar items that are `Type: SYSTEM_ITEM`",
  config: [{
    type: 'SYSTEM_ITEM',
    systemItem: 'fastForward',
    tintColor: 'red',
  }, {
    type: 'SYSTEM_ITEM',
    systemItem: 'organize',
    tintColor: 'blue'
  }, {
    type: 'SYSTEM_ITEM',
    systemItem: 'pause',
    tintColor: 'orange'
  }]
}, {
  description: "3 nav bar items that are `Type: SYSTEM_ITEM`",
  config: [{
    type: 'SYSTEM_ITEM',
    systemItem: 'play',
    tintColor: 'green',
  }, {
    type: 'SYSTEM_ITEM',
    systemItem: 'redo',
    tintColor: 'pink'
  }, {
    type: 'SYSTEM_ITEM',
    systemItem: 'refresh',
    tintColor: 'yellow'
  }]
}, {
  description: "A nav bar item with `Type: SYSTEM_ITEM`, i.e. a custom right navbar right item.",
  config: [{
    type: 'CUSTOM'
  }]
}, {
  description: "A nav bar item with `Type: IMAGE_SYSTEM`, i.e. a SF Symbols icon. iOS 13+",
  config: [{
    type: 'IMAGE_SYSTEM',
    imageValue: 'trash'
  }]
}, {
  description: "A nav bar item with 2 `Type: IMAGE_SYSTEM`, i.e. SF Symbols icons. Requires iOS 13+",
  config: [{
    type: 'IMAGE_SYSTEM',
    imageValue: 'sunrise',
    tintColor: 'orange',
  }, {
    type: 'IMAGE_SYSTEM',
    imageValue: 'moon.fill',
    tintColor: 'purple',
  }]
}, {
  description: "A nav bar item with 2 `Type: IMAGE_SYSTEM`, i.e. SF Symbols icons. Requires iOS 13+",
  config: [{
    type: 'IMAGE_SYSTEM',
    imageValue: 'tv.fill',
    tintColor: 'red',
  }, {
    type: 'IMAGE_SYSTEM',
    imageValue: 'headphones',
    tintColor: 'blue',
  }, {
    type: 'IMAGE_SYSTEM',
    imageValue: 'airplane',
    tintColor: 'yellow',
  }]
}];

const backButtonItemConfigs: Array<{
  config: NavBarBackItemConfig,
  description: string
}> = [{
  description: "N/A",
  config: null,
}, {
  description: "Custom navbar back item with `Type: TEXT`",
  config: {
    type: 'TEXT',
    title: 'Custom Back'
  }
}, {
  description: "Custom navbar back item with `Type: TEXT` that's tinted 'red'",
  config: {
    type: 'TEXT',
    title: 'Back #2',
    tintColor: 'red'
  }
}, {
  description: "Custom navbar back item with `Type: SYSTEM_ITEM`",
  config: {
    type: 'SYSTEM_ITEM',
    systemItem: 'reply'
  }
}, {
  description: "Custom navbar back item with `Type: SYSTEM_ITEM` that's tinted red",
  config: {
    type: 'SYSTEM_ITEM',
    systemItem: 'rewind',
    tintColor: 'red',
  }
}, {
  description: "Custom navbar back item with `Type: IMAGE_SYSTEM`",
  config: {
    type: 'IMAGE_SYSTEM',
    imageValue: 'mic.fill',
  }
}, {
  description: "Custom navbar back item with `Type: SYSTEM_ITEM` that's tinted green",
  config: {
    type: 'IMAGE_SYSTEM',
    imageValue: 'keyboard',
  }
}, {
  description: "Custom navbar back item with `Type: IMAGE_EMPTY`",
  config: {
    type: 'IMAGE_EMPTY',
  }
}];


function randomBGColor(){
  return Helpers.randomElement<string>(colors);
};

function ItemTitle(props){
  return (
    <React.Fragment>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: props.marginTop ?? 0
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
        }}>
          {props.title ?? ''}
        </Text>
        {props.titleCode && (
          <View style={{
            backgroundColor: Colors.BLUE.A400,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
            marginLeft: 10,
          }}>
            <Text style={{
              color: 'white',
              fontWeight: '600',
              fontSize: 15,
            }}>
              {props.titleCode}
            </Text>
          </View>
        )}
      </View>
      <Text style={{
        marginTop: 7,
        fontWeight: '300',
        fontSize: 14,
        color: 'rgba(0,0,0,0.5)'

      }}>
        {props.subtitle ?? 'subtitle'}
      </Text>
    </React.Fragment>
  );
};

function Spacer(props){
  return(
    <View style={{marginTop: props.space ?? 0}}/>
  );
};

function SpacerLine(props){
  return(
    <View style={{
      paddingTop: props.space ?? 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.15)',
    }}/>
  );
};

function ButtonPrimary(props){
  return(
    <TouchableOpacity 
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: Colors.PURPLE.A200,
        borderRadius: 10,
        marginTop: 12,
      }}
      onPress={props.onPress}
    >
      <View>
        <Text style={{
          color: 'white',
          fontSize: 16,
          fontWeight: '700'
        }}>
          {props.title}
        </Text>
        <Text style={{
          color: 'white',
          fontWeight: '400'
        }}>
          {props.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

function ItemContainer(props) {
  return (
    <View style={{
      paddingHorizontal: 12,
      paddingVertical: 15,
      marginHorizontal: 10,
      marginVertical: 10,
      backgroundColor: Colors.PURPLE[50],
      borderRadius: 10,
    }}>
      {props.children}
    </View>
  );
};

function RowLabelText(props){
  return (
    <View style={{
      flexDirection: 'row',
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 5,
      backgroundColor: Colors.INDIGO[100],
      borderRadius: 10,
      alignItems: 'center',
    }}>
      <Text style={{
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: Colors.PURPLE[1100],
        opacity: 0.75,
      }}>
        {props.label ?? 'Current Value'}
      </Text>
      <Text style={{
        fontSize: 16,
        fontWeight: '500',
        color: Colors.PURPLE[1100],
        opacity: 0.4,
      }}>
        {props.value ?? 'Value'}
      </Text>
    </View>
  );
};

function ObjectPropertyDisplay(props: {
  object: object,
}){
  if(props.object == null) return null;
  const objectKeys = Object.keys(props.object);
  
  return(
    <View style={{
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 5,
      backgroundColor: Colors.INDIGO[100],
      borderRadius: 10,
    }}>
      {objectKeys.map((objKey, index) => (
        <View 
          key={`container-${objKey}-${index}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text 
            key={`label-${objKey}-${index}`}
            style={{
              flex: 1,
              fontSize: 16,
              fontWeight: '500',
              color: Colors.PURPLE[1100],
              opacity: 0.75,
            }}
          >
            {`${objKey}: `}
          </Text>
          <Text 
            key={`value-${objKey}-${index}`}
              style={{
              fontSize: 16,
              fontWeight: '500',
              color: Colors.PURPLE[1100],
              opacity: 0.4,
            }}
          >
            {`'${props.object[objKey]}'`}
          </Text>
        </View>
      ))}
    </View>
  );
};

class StyledTextInput extends React.PureComponent<{
  placeholder: string
}> {
  state = {
    textInput: '',
  };

  getText = () => {
    return this.state.textInput;
  };

  render(){
    const props = this.props;

    return(
      <TextInput
        onChangeText={(text) => {
          this.setState({textInput: text});
        }}
        placeholder={props.placeholder}
        placeholderTextColor={Colors.INDIGO[300]}
        style={{
          backgroundColor: Colors.INDIGO[100],
          fontSize: 16,
          color: Colors.INDIGO[900],
          paddingHorizontal: 12,
          paddingVertical: 7,
          borderRadius: 10,
          marginTop: 12,
        }}
      />
    );
  };
};

function SwitchRow(props){
  return(
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
    }}>
      <View style={{
        flex: 1,
        marginRight: 10,
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '500',
          color: Colors.PURPLE[1200],
        }}>
          {props.title ?? 'title'}
        </Text>
        <Text style={{
          flex: 1,
          fontSize: 16,
          opacity: 0.5,
          color: Colors.PURPLE[1100],
        }}>
          {props.subtitle ?? 'Toggle the value'}
        </Text>
      </View>
      <Switch
        value={props.value ?? false}
        onValueChange={props.onValueChange}
        trackColor={{
          true: Colors.PURPLE.A700,
          false: Colors.PURPLE.A100
        }}
      />
    </View>
  );
};

function NavBarConfigGeneral(props){
  const inputRouteTitleRef = React.useRef();
  const inputPromptRef = React.useRef();

  const currentTitleDisplayMode = largeTitleDisplayModes[
    props.parentState.displayModeIndex % 
    largeTitleDisplayModes.length
  ];

  return(
    <ItemContainer>
      <ItemTitle
        title={'Set'}
        titleCode={'RouteOptions.routeTitle'}
        subtitle={`Update the navbar title via the \`RouteViewPortal\` comp.`}
      />
      <StyledTextInput
        ref={inputRouteTitleRef}
        placeholder={'Navbar Title...'}
      />
      <ButtonPrimary
        title={'Update Title'}
        subtitle={`Update the navBar's title`}
        onPress={() => {
          const parentRef = props.getParentRef();
          parentRef.setState({
            // @ts-ignore
            routeTitle: inputRouteTitleRef.current.getText()
          });
        }}
      />
      <SpacerLine/>
      <ItemTitle
        title={'Set'}
        titleCode={'RouteOptions.prompt'}
        subtitle={`Update the navbar prompt via the \`RouteViewPortal\` comp. The prompt is a single line of text at the top.`}
        marginTop={24}
      />
      <StyledTextInput
        ref={inputPromptRef}
        placeholder={'Navbar Prompt...'}
      />
      <ButtonPrimary
        title={'Update Prompt'}
        subtitle={`Update the navBar's prompt text`}
        onPress={() => {
          const parentRef = props.getParentRef();
          parentRef.setState({
            // @ts-ignore
            routePrompt: inputPromptRef.current.getText()
          });
        }}
      />
      <SpacerLine/>
      <ItemTitle
        title={'Set'}
        titleCode={'RouteOptions.titleDisplayMode'}
        subtitle={`Cycle to the next display mode`}
        marginTop={24}
      />
      <RowLabelText
        value={currentTitleDisplayMode}
      />
      <ButtonPrimary
        title={'Update `titleDisplayMode`'}
        subtitle={`Cycle to the next display mode`}
        onPress={() => {
          const parentRef = props.getParentRef();
          parentRef.setState(prevState => ({
            // @ts-ignore
            displayModeIndex: prevState.displayModeIndex + 1
          }))
        }}
      />
    </ItemContainer>
  );
};

function NavBarBackItemsConfig(props){
  const currentConfig = backButtonItemConfigs[
    props.parentState.backButtonItemsConfigIndex %
    navBarItemsConfigs.length
  ];

  const backButtonTitleRef = React.useRef();

  return (
    <ItemContainer>
      <ItemTitle
        title={'Set'}
        titleCode={'navBarButtonBackItemsConfig'}
        subtitle={`Note: This will configure the next route's back item. Current config for the navbar back item: ${currentConfig?.description ?? 'N/A'}`}
      />
      <ObjectPropertyDisplay
        object={currentConfig?.config}
      />
      <ButtonPrimary
        title={'Update config'}
        subtitle={`Cycle to the next back item config`}
        onPress={() => {
          const parentRef = props.getParentRef();
          parentRef.setState(prevState => ({
            // @ts-ignore
            backButtonItemsConfigIndex: 
              prevState.backButtonItemsConfigIndex + 1
          }));
        }}
      />
      <SpacerLine/>
      <ItemTitle
        title={'Configure'}
        titleCode={'navBarBackButtonItem'}
        subtitle={`Misc. configurations for the back button`}
        marginTop={24}
      />
      <SwitchRow
        title={`leftItemsSupplementBackButton`}
        value={props.parentState.leftItemsSupplementBackButton}
        onValueChange={value => {
          const parentRef = props.getParentRef();
          parentRef.setState({
            leftItemsSupplementBackButton: value,
          });
        }}
      />
      <SwitchRow
        title={`applyToPrevBackConfig`}
        value={props.parentState.applyToPrevBackConfig}
        onValueChange={value => {
          const parentRef = props.getParentRef();
          parentRef.setState({
            applyToPrevBackConfig: value,
          });
        }}
      />
      <SwitchRow
        title={`hidesBackButton`}
        value={props.parentState.hidesBackButton}
        onValueChange={value => {
          const parentRef = props.getParentRef();
          parentRef.setState({
            hidesBackButton: value,
          });
        }}
      />
      <SpacerLine/>
      <ItemTitle
        title={'Set'}
        titleCode={'RouteOptions.backButtonDisplayMode'}
        subtitle={`Update the navbar display mode of the Back button. Requires iOS 14.0+. When the backBarButtonItem property is nil, this is used to determine the title of the Back button.`}
        marginTop={24}
      />
      <RowLabelText value={backButtonDisplayModes[
        props.parentState.backButtonDisplayModeIndex %
        backButtonDisplayModes.length
      ]}/>
      <ButtonPrimary
        title={'Update `backButtonDisplayMode`'}
        subtitle={`Cycle to the next mode`}
        onPress={() => {
          const parentRef = props.getParentRef();
          parentRef.setState(prevState => ({
            // @ts-ignore
            backButtonDisplayModeIndex: 
              prevState.backButtonDisplayModeIndex + 1
          }))
        }}
      />
      <ItemTitle
        title={'Set'}
        titleCode={'RouteOptions.backButtonTitle'}
        subtitle={`Update the navbar prompt via the \`RouteViewPortal\` comp. The prompt is a single line of text at the top.`}
        marginTop={24}
      />
      <StyledTextInput
        ref={backButtonTitleRef}
        placeholder={'backButtonTitle...'}
      />
      <ButtonPrimary
        title={'Update backButtonTitle'}
        subtitle={`Update the navBar's backButtonTitle text`}
        onPress={() => {
          const parentRef = props.getParentRef();
          parentRef.setState({
            // @ts-ignore
            backButtonTitle: backButtonTitleRef.current.getText()
          });
        }}
      />
      <ButtonPrimary
        title={'Push Route'}
        subtitle={`Show route with the current back button config`}
        onPress={() => {
          const navigation = props.parentProps.navigation;
          navigation.push({routeKey: 'NavigatorTest01'});
        }}
      />
    </ItemContainer>
  );
};

function NavBarRightItemsConfig(props){
  const currentConfig = navBarItemsConfigs[
    props.parentState.navBarButtonRightItemsConfigIndex %
    navBarItemsConfigs.length
  ];

  return (
    <ItemContainer>
      <ItemTitle
        title={'Set'}
        titleCode={'navBarButtonRightItemsConfig'}
        subtitle={`Current config for the nav bar right item: ${currentConfig?.description ?? 'N/A'}`}
      />
      {currentConfig.config.map((config, index) =>
        <ObjectPropertyDisplay
          key={`config-${index}`}
          object={config}
        />
      )}
      <ButtonPrimary
        title={'Update config'}
        subtitle={`Cycle to the next nav bar item config`}
        onPress={() => {
          const parentRef = props.getParentRef();
          parentRef.setState(prevState => ({
            // @ts-ignore
            navBarButtonRightItemsConfigIndex: 
              prevState.navBarButtonRightItemsConfigIndex + 1
          }));
        }}
      />
    </ItemContainer>
  );
};

function NavBarLeftItemsConfig(props){
  const currentConfig = navBarItemsConfigs[
    props.parentState.navBarButtonLeftItemsConfigIndex %
    navBarItemsConfigs.length
  ];

  return (
    <ItemContainer>
      <ItemTitle
        title={'Set'}
        titleCode={'navBarButtonLeftItemsConfig'}
        subtitle={`Current config for the nav bar left item: ${currentConfig?.description ?? 'N/A'}`}
      />
      {currentConfig.config.map((config, index) =>
        <ObjectPropertyDisplay
          key={`config-${index}`}
          object={config}
        />
      )}
      <ButtonPrimary
        title={'Update config'}
        subtitle={`Cycle to the next nav bar item config`}
        onPress={() => {
          const parentRef = props.getParentRef();
          parentRef.setState(prevState => ({
            // @ts-ignore
            navBarButtonLeftItemsConfigIndex: 
              prevState.navBarButtonLeftItemsConfigIndex + 1
          }));
        }}
      />
    </ItemContainer>
  );
};

function NavBarTitleItemConfig(props){
  return(
    <ItemContainer>
      <ItemTitle
        title={'Toggle '}
        titleCode={'renderNavBarTitleItem'}
        subtitle={`Render a custom component for the navbar title`}
      />
      <SwitchRow
        title={`renderNavBarTitleItem`}
        value={props.parentState.renderNavBarTitleItem}
        onValueChange={value => {
          const parentRef = props.getParentRef();
          parentRef.setState({
            renderNavBarTitleItem: value,
          });
        }}
      />
    </ItemContainer>
  );
};


export class NavigatorTest01 extends React.Component {
  state = {
    routeTitle: null,
    routePrompt: null,
    displayModeIndex: 0,

    navBarButtonRightItemsConfigIndex: 0,
    navBarButtonLeftItemsConfigIndex: 0,
    backButtonItemsConfigIndex: 0,

    leftItemsSupplementBackButton: false,
    hidesBackButton: false,
    backButtonTitle: null,
    backButtonDisplayModeIndex: 0,
    applyToPrevBackConfig: false,

    renderNavBarTitleItem: false,
  };

  render(){
    const props = this.props;
    const state = this.state;
    
    return(
      <ScrollView style={styles.rootContainer}>
        <RouteViewPortal
          routeOptions={{
            // @ts-ignore
            largeTitleDisplayMode: largeTitleDisplayModes[state.displayModeIndex % largeTitleDisplayModes.length],
            routeTitle: state.routeTitle,
            prompt: state.routePrompt,
            navBarButtonRightItemsConfig: navBarItemsConfigs[
              state.navBarButtonRightItemsConfigIndex %
              navBarItemsConfigs.length
            ].config,
            navBarButtonLeftItemsConfig: navBarItemsConfigs[
              state.navBarButtonLeftItemsConfigIndex %
              navBarItemsConfigs.length
            ].config,
            navBarButtonBackItemConfig: {
              applyToPrevBackConfig: state.applyToPrevBackConfig,
              ...(
                backButtonItemConfigs[
                  state.backButtonItemsConfigIndex %
                  backButtonItemConfigs.length
                ].config
              ),
            },
            leftItemsSupplementBackButton: state.leftItemsSupplementBackButton,
            hidesBackButton: state.hidesBackButton,
            // @ts-ignore
            backButtonDisplayMode: backButtonDisplayModes[
              state.backButtonDisplayModeIndex %
              backButtonDisplayModes.length
            ],
            backButtonTitle: state.backButtonTitle
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
            renderNavBarTitleItem: () => (
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
                  {'Custom Title'}
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
            Alert.alert(
              'onPressNavBarLeftItem', 
              `key: ${nativeEvent.key}`
            );
          }}
        />
        <NavBarConfigGeneral
          getParentRef={() => this}
          parentState={state}
          onSetRoutePrompt={(prompt) => {
            this.setState({routePrompt: prompt});
          }}
        />
        <NavBarLeftItemsConfig
          getParentRef={() => this}
          parentState={state}
        />
        <NavBarRightItemsConfig
          getParentRef={() => this}
          parentState={state}
        />
        <NavBarBackItemsConfig
          getParentRef={() => this}
          parentState={state}
          parentProps={props}
        />
        <NavBarTitleItemConfig
          getParentRef={() => this}
          parentState={state}
        />
        <Spacer space={100}/>
      </ScrollView>
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