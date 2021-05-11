import * as React from 'react';

import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Alert, ViewStyle } from 'react-native';
import { RouteViewEvents, RouteViewPortal, RouteContentProps, NavigationObject } from 'react-native-ios-navigator';

import type { NavBarItemsConfig, NavBarBackItemConfig } from '../../../src/types/NavBarItemConfig';
import type { NavBarAppearanceConfig, NavBarAppearanceCombinedConfig } from '../../../src/types/NavBarAppearanceConfig';
import type { StatusBarStyle } from '../../../src/native_components/RNINavigatorRouteView';

import * as Colors  from '../constants/Colors';
import * as Helpers from '../functions/Helpers';
import type { RouteConstantsObject } from 'src/native_modules/RNINavigatorRouteViewModule';


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

const navBarVisibilityModes = ['default', 'visible', 'hidden'];

const statusBarStyles: Array<StatusBarStyle> = ['default', 'lightContent', 'darkContent'];


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
  description: "A nav bar item with `Type: TEXT` that's tinted red + horizontal offset by 10",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item',
    tintColor: 'red',
    titlePositionAdjustment: {
      default: { 
        horizontal: 10,
      }
    },
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
  description: "3 nav bar item with `Type: TEXT`",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item A',
    tintColor: 'white',
    backgroundImage: {
      default: {
        controlState: 'normal',
        imageItem: {
          type: 'IMAGE_RECT',
          imageValue: {
            fillColor: 'rgba(255,0,0,0.5)',
            height: 25,
            width: 75,
            borderRadius: 10
          },
        },
      }
    }
  }, {
    type: 'TEXT',
    key: 'B',
    title: 'Item B',
    tintColor: 'white',
    backgroundImage: {
      default: {
        controlState: 'normal',
        imageItem: {
          type: 'IMAGE_RECT',
          imageValue: {
            fillColor: 'rgba(0,255,0,0.5)',
            height: 25,
            width: 75,
            borderRadius: 15
          },
        },
      },
    },
  }, {
    type: 'TEXT',
    key: 'C',
    title: 'Item C',
    tintColor: 'white',
    backgroundImage: {
      default: {
        controlState: 'normal',
        imageItem: {
          type: 'IMAGE_RECT',
          imageValue: {
            fillColor: 'rgba(0,0,255,0.5)',
            height: 25,
            width: 75,
            borderRadius: 20
          },
        },
      }
    }
  }]
}, {
  description: "3 Nav bar items with gradient bg color",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item A',
    tintColor: 'white',
    backgroundImage: {
      default: {
        controlState: 'normal',
        imageItem: {
          type: 'IMAGE_GRADIENT',
          imageValue: {
            colors: ['red', 'blue', 'green'],
            width: 100,
            height: 50,
          }
        },
      }
    },
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

const navBarAppearanceConfigs: Array<{
  config: NavBarAppearanceConfig,
  description: string
}> = [{
  description: "N/A",
  config: null,
}, {
  description: "Red BG w/ white title",
  config: {
    standardAppearance: {
      backgroundColor: Colors.RED.A700,
      largeTitleTextAttributes: {
        fontSize: 32,
        color: 'white',
        fontWeight: '500',
      },
      titleTextAttributes: {
        color: 'white',
        fontSize: 20,
      },
    }
  }
}, {
  description: "...",
  config: {
    standardAppearance: {
      backgroundColor: 'rgba(0,0,255,0.25)',
      backgroundEffect: 'light',
      largeTitleTextAttributes: {
        fontSize: 32,
        color: 'white',
        fontWeight: '800',
      },
      titleTextAttributes: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
      },
      backIndicatorImage: {
        type: 'IMAGE_SYSTEM',
        imageValue: 'trash'
      },
      shadowColor: 'rgba(0,0,0,0)'
    }
  }
}, {
  description: "...",
  config: {
    standardAppearance: {
      backgroundColor: 'rgba(0,255,0,0.25)',
      backgroundEffect: 'systemUltraThinMaterial',
      largeTitleTextAttributes: {
        fontSize: 24,
        color: 'black',
        fontStyle: 'italic',
      },
      titleTextAttributes: {
        color: 'black',
        fontSize: 16,
        fontStyle: 'italic',
      },
      backIndicatorImage: {
        type: 'IMAGE_SYSTEM',
        imageValue: 'arrow.left'
      },
    }
  },
}, {
  description: "Gradient Test #1",
  config: {
    standardAppearance: {
      backgroundImage: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['red', 'rgba(0,0,255,0.5)'],
          startPoint: 'left',
          endPoint: 'right',
        }
      }
    }
  },
}, {
  description: "Gradient Test #2",
  config: {
    standardAppearance: {
      backgroundEffect: 'systemUltraThinMaterial',
      backgroundImage: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['rgba(255,0,0,0.5)', 'rgba(0,0,255,0.5)'],
          startPoint: 'right',
          endPoint: 'left',
        }
      }
    }
  },
}, {
  description: "Gradient Test #3",
  config: {
    standardAppearance: {
      backgroundImageContentMode: 'scaleAspectFill',
      backgroundImage: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['rgba(255,0,0,0.5)', 'rgba(0,255,0,0.25)'],
          startPoint: 'left',
          endPoint: 'right',
          width: 50,
          height: 50,
        }
      }
    }
  },
}, {
  description: "Shadow Image Test #1",
  config: {
    standardAppearance: {
      backgroundEffect: 'systemUltraThinMaterial',
      backgroundColor: Colors.PURPLE.A100,
      shadowImage: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)'],
          startPoint: 'top',
          endPoint: 'bottom',
          height: 100,
          width: 100,
        }
      },
    }
  },
}];

const navBarAppearanceLegacyConfigs: Array<{
  config: NavBarAppearanceCombinedConfig,
  description: string
}> = [{
  description: 'N/A',
  config: null,
}, {
  description: 'Simple Test',
  config: {
    mode: 'legacy',
    barTintColor: 'red',
    titleTextAttributes: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  },
}, {
  description: 'Gradient BG test',
  config: {
    mode: 'legacy',
    backgroundImage: {
      default: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['red', 'blue'],
          startPoint: 'top',
          endPoint: 'bottom'
        }
      }
    }
  },
}, {
  description: 'Gradient BG test 2',
  config: {
    mode: 'legacy',
    backgroundImage: {
      default: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['red', 'blue', 'green'],
          startPoint: 'left',
          endPoint: 'right'
        }
      }
    }
  },
}, {
  description: 'Gradient BG test 3',
  config: {
    mode: 'legacy',
    backgroundImage: {
      default: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['red', 'blue', 'green'],
          startPoint: 'right',
          endPoint: 'left'
        }
      }
    }
  },
}];

function randomBGColor(){
  return Helpers.randomElement<string>(colors);
};

function ItemTitle(props: any){
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

function Spacer(props: any){
  return(
    <View style={{marginTop: props.space ?? 0}}/>
  );
};

function SpacerLine(props: any){
  return(
    <View style={{
      paddingTop: props.space ?? 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.15)',
    }}/>
  );
};

function ButtonPrimary(props: any){
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

function ItemContainer(props: any) {
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

function RowLabelText(props: any){
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
  style?: ViewStyle,
}){
  if(props.object == null){
    return (
      <View style={{
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: Colors.INDIGO[100],
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        ...(props.style ?? {}),
      }}>
        <Text style={{opacity: 0.75}}>
          {'Nothing to show'}
        </Text>
      </View>
    );
    
  } else {
    const objectKeys = Object.keys(props.object);

    return(
      <View style={{
        marginTop: 12,
        paddingHorizontal: 12,
        paddingVertical: 5,
        backgroundColor: Colors.INDIGO[100],
        borderRadius: 10,
        ...(props.style ?? {}),
      }}>
        {objectKeys.map((objKey, index) => {
          // @ts-ignore
          const value = props.object[objKey];
          const isValueObj = (typeof value === 'object' && value !== null);

          return isValueObj?(
            <View key={`container-${objKey}-${index}`}>
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
              <ObjectPropertyDisplay
                key={`value-ObjectPropertyDisplay-${objKey}-${index}`}
                object={value}
                style={{
                  marginTop: 0,
                  paddingHorizontal: 7,
                  paddingVertical: 5,
                }}
              />
            </View>
          ):(
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
                {/** @ts-ignore */}
                {isValueObj? `...`: `'${props.object[objKey]}'`}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };
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

function SwitchRow(props: {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}){
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

type NavigatorTest01State = typeof NavigatorTest01.prototype.state;

type SharedSectionProps = {
  parentState: NavigatorTest01State;
  getParentRef: () => typeof NavigatorTest01.prototype;
};

function NavBarConfigGeneral(props: any){
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
          // @ts-ignore
          parentRef.setState(prevState => ({
            // @ts-ignore
            displayModeIndex: prevState.displayModeIndex + 1
          }))
        }}
      />
    </ItemContainer>
  );
};

function NavBarBackItemsConfig(props: any){
  const currentConfig = backButtonItemConfigs[
    props.parentState.backButtonItemsConfigIndex %
    backButtonItemConfigs.length
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
          // @ts-ignore
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
        // @ts-ignore
        onValueChange={value => {
          const parentRef = props.getParentRef();
          parentRef.setState({
            leftItemsSupplementBackButton: value,
          });
        }}
      />
      <SwitchRow
        title={`applyBackButtonConfigToCurrentRoute`}
        value={props.parentState.applyBackButtonConfigToCurrentRoute}
        // @ts-ignore
        onValueChange={value => {
          const parentRef = props.getParentRef();
          parentRef.setState({
            applyBackButtonConfigToCurrentRoute: value,
          });
        }}
      />
      <SwitchRow
        title={`hidesBackButton`}
        value={props.parentState.hidesBackButton}
        // @ts-ignore
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
          // @ts-ignore
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

function NavBarRightItemsConfig(props: any){
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
      <ButtonPrimary
        title={'Update config'}
        subtitle={`Cycle to the next nav bar item config`}
        onPress={() => {
          const parentRef = props.getParentRef();
          // @ts-ignore
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

function NavBarLeftItemsConfig(props: any){
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
      <ButtonPrimary
        title={'Update config'}
        subtitle={`Cycle to the next nav bar item config`}
        onPress={() => {
          const parentRef = props.getParentRef();
          // @ts-ignore
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

function NavBarTitleItemConfig(props: any){
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
        // @ts-ignore
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

function NavBarAppearanceOverrideItemConfig(props: SharedSectionProps & {
  currentAppearanceOverrideConfig: NavBarAppearanceCombinedConfig
}){

  const currentNavBarVisibilityMode = navBarVisibilityModes[
    props.parentState.navBarVisibilityModeIndex % 
    navBarVisibilityModes.length
  ];

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
    <ItemContainer>
      <ItemTitle
        title={'Set '}
        titleCode={'NavBarAppearanceConfig'}
        subtitle={subtilePrefix + ' \n\n ' + subtitleSuffix}
      />
      <SwitchRow
        title={'Apply to current route'}
        value={props.parentState.applyNavBarAppearanceToCurrentRoute}
        onValueChange={(value) => {
          const parentRef = props.getParentRef();

          parentRef.setState({
            applyNavBarAppearanceToCurrentRoute: value
          });
        }}
      />
      <SwitchRow
        title={'Use legacy appearance'}
        value={props.parentState.isUsingLegacyConfig}
        onValueChange={(value) => {
          const parentRef = props.getParentRef();

          parentRef.setState({
            isUsingLegacyConfig: value
          });
        }}
      />
      <ObjectPropertyDisplay
        key={`config-NavBarAppearanceOverrideItemConfig`}
        object={props.currentAppearanceOverrideConfig}
      />
      <ButtonPrimary
        title={'Update config'}
        subtitle={`Cycle to the next preset config`}
        onPress={() => {
          const { isUsingLegacyConfig } = props.parentState;
          const parentRef = props.getParentRef();

          parentRef.setState((prevState: NavigatorTest01State) => (isUsingLegacyConfig ? {
            navBarAppearanceLegacyConfigsIndex: 
              prevState.navBarAppearanceLegacyConfigsIndex + 1
          } : {
            navBarAppearanceConfigsIndex: 
              prevState.navBarAppearanceConfigsIndex + 1
          }));
        }}
      />

      <SpacerLine/>
      <ItemTitle
        title={'Set'}
        titleCode={'RouteOptions.navigationBarVisibility'}
        subtitle={`Will temp. override the current/default navigation bar visibility for this route.`}
        marginTop={24}
      />
      <RowLabelText
        value={currentNavBarVisibilityMode}
      />
      <ButtonPrimary
        title={'Update `navigationBarVisibility`'}
        subtitle={`Cycle to the next mode`}
        onPress={() => {
          const parentRef = props.getParentRef();

          parentRef.setState((prevState: NavigatorTest01State) => ({
            navBarVisibilityModeIndex: prevState.navBarVisibilityModeIndex + 1
          }));
        }}
      />


      {!props.parentState.applyNavBarAppearanceToCurrentRoute && (
        <ButtonPrimary
          title={'Push Route w/ Config'}
            subtitle={`Push a route with the current navbar appearance config`}
            onPress={() => {
              const { isUsingLegacyConfig } = props.parentState;
              const parentRef = props.getParentRef();

              parentRef.props.navigation.push({
                routeKey: 'NavigatorTest01',
                routeOptions: {
                  navBarAppearanceOverride: props.currentAppearanceOverrideConfig,
                  // @ts-ignore
                  navigationBarVisibility: currentNavBarVisibilityMode
                }
              })
            }}
          />
      )}
    </ItemContainer>
  );
};

function StatusBarStyleConfig(props: SharedSectionProps & {
  navigation: NavigationObject
}){
  const currentStatusBarStyle = statusBarStyles[
    props.parentState.statusBarStyleIndex % 
    statusBarStyles.length
  ];

  return(
    <ItemContainer>
      <ItemTitle
        title={'Status Bar Style'}
        subtitle={`Change the 'statusBarStyle (UIStatusBarStyle)'`}
      />
      <RowLabelText
        value={currentStatusBarStyle}
      />
      <ButtonPrimary
        title={'Update `statusBarStyle`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          const parentRef = props.getParentRef();

          parentRef.setState((prevState: NavigatorTest01State) => ({
            statusBarStyleIndex: prevState.statusBarStyleIndex + 1
          }));
        }}
      />
      <ButtonPrimary
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
    </ItemContainer>
  );
};

function RouteViewConstants(props: RouteContentProps & {
  navigation: NavigationObject
}){
  const [routeConstantsObject, setRouteConstantsObject] = React.useState<RouteConstantsObject>(null);

  return(
    <ItemContainer>
      <ItemTitle
        title={'Route View Constants'}
        subtitle={`Async. get the route view constants from native`}
      />
      <ObjectPropertyDisplay
        key={`config-RouteViewConstants`}
        object={routeConstantsObject}
      />
      <ButtonPrimary
        title={'Invoke `getRouteConstants`'}
        subtitle={'Get values from `NavigatorRouteView.getConstants`'}
        onPress={async () => {
          const constants = await props.navigation.getRouteConstants();
          setRouteConstantsObject(constants);
        }}
      />
    </ItemContainer>
  );
};

function NavigationCommandsConfig(props: RouteContentProps){
  return(
    <ItemContainer>
      <ItemTitle
        title={'Navigation Commands'}
        subtitle={`Test out the navigation commands`}
      />
      <ButtonPrimary
        title={'Push `NavigatorTest03`'}
        subtitle={'Push a new route with fade animation'}
        onPress={() => {
          props.navigation.push({
            routeKey: 'NavigatorTest03',
          }, {
            transitionConfig: {
              type: 'FadePush'
            }
          });
        }}
      />
      <ButtonPrimary
        title={'Pop Current'}
        subtitle={'Pop the current route with fade animation'}
        onPress={() => {
          props.navigation.pop({
            transitionConfig: {
              type: 'FadePop'
            }
          });
        }}
      />
    </ItemContainer>
  );
};

export class NavigatorTest01 extends React.Component<RouteContentProps> {
  state = {
    // @ts-ignore
    routeTitle: null,

    // @ts-ignore
    routePrompt: null,
    displayModeIndex: 0,

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

    statusBarStyleIndex: 0,

    // @ts-ignore
    backButtonTitle: null,
    backButtonDisplayModeIndex: 0,
    applyBackButtonConfigToCurrentRoute: false,

    renderNavBarTitleItem: false,
  };

  render(){
    const props = this.props;
    const state = this.state;

    const navBarAppearanceLegacyConfig = navBarAppearanceLegacyConfigs[
      state.navBarAppearanceLegacyConfigsIndex %
      navBarAppearanceLegacyConfigs.length
    ];

    const navBarAppearanceConfig = navBarAppearanceConfigs[
      state.navBarAppearanceConfigsIndex %
      navBarAppearanceConfigs.length
    ];

    const navBarAppearanceOverride: NavBarAppearanceCombinedConfig = state.isUsingLegacyConfig ? (
      navBarAppearanceLegacyConfig.config && {
        mode: 'legacy',
        ...navBarAppearanceLegacyConfig.config,
      }
    ) : (
      navBarAppearanceConfig.config && {
        mode: 'appearance',
        ...navBarAppearanceConfig.config,
      }
    );
    
    return(
      <ScrollView style={styles.rootContainer}>
        <RouteViewPortal
          routeOptions={{
            // @ts-ignore
            largeTitleDisplayMode: largeTitleDisplayModes[
              state.displayModeIndex % 
              largeTitleDisplayModes.length
            ],

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

            navBarButtonBackItemConfig: backButtonItemConfigs[
              state.backButtonItemsConfigIndex %
              backButtonItemConfigs.length
            ].config,

            leftItemsSupplementBackButton: state.leftItemsSupplementBackButton,
            hidesBackButton: state.hidesBackButton,

            applyBackButtonConfigToCurrentRoute: state.applyBackButtonConfigToCurrentRoute,

            // @ts-ignore
            backButtonDisplayMode: backButtonDisplayModes[
              state.backButtonDisplayModeIndex %
              backButtonDisplayModes.length
            ],

            backButtonTitle: state.backButtonTitle,
            navBarAppearanceOverride: (state.applyNavBarAppearanceToCurrentRoute
              ? navBarAppearanceOverride
              : null
            ),

            // should be null at first... 
            // TODO: cleanup - use -1 to signify null
            statusBarStyle: (state.statusBarStyleIndex == 0 ? null : (
              statusBarStyles[
                state.statusBarStyleIndex % 
                statusBarStyles.length
              ]
            )),

            // @ts-ignore
            navigationBarVisibility: (state.applyNavBarAppearanceToCurrentRoute
              ? navBarVisibilityModes[
                  state.navBarVisibilityModeIndex % 
                  navBarVisibilityModes.length
                ]
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
            Alert.alert(
              'onPressNavBarLeftItem', 
              `key: ${nativeEvent.key}`
            );
          }}
        />
        <NavBarConfigGeneral
          getParentRef={() => this}
          parentState={state}
          // @ts-ignore
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
        <NavBarAppearanceOverrideItemConfig
          getParentRef={() => this}
          parentState={state}
          currentAppearanceOverrideConfig={navBarAppearanceOverride}
        />
        <StatusBarStyleConfig
          getParentRef={() => this}
          parentState={state}
          navigation={this.props.navigation}
        />
        <RouteViewConstants
          navigation={this.props.navigation}
        />
        <NavigationCommandsConfig
          navigation={this.props.navigation}
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