import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Switch, GestureResponderEvent } from 'react-native';

import * as Colors  from '../../constants/Colors';


export const CardBody: React.FC = (props) => {
  return (
    <View style={styles.cardBodyContainer}>
      {props.children}
    </View>
  );
};

/**
 * ```
 * ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
 *              .─────────────.   
 * │ Title     (  Pill  Title  ) │
 *              `─────────────'   
 * │ Subtitle...                 │
 *  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ 
 * ```
 */                           
export function CardTitle(props: {
  extraMarginTop?: number;
  //
  title?: string;
  pillTitle?: string;
  subtitle?: string;
}){
  return (
    <React.Fragment>
      <View style={[styles.cardTitleContainer, { marginTop: props.extraMarginTop ?? 0 }]}>
        <Text style={styles.cardTitle}>
          {props.title ?? ''}
        </Text>
        {props.pillTitle && (
          <View style={styles.cardPillContainer}>
            <Text style={styles.cardPillTitleText}>
              {props.pillTitle}
            </Text>
          </View>
        )}
      </View>
      {props.subtitle && (
        <Text style={styles.cardSubtitleText}>
          {props.subtitle ?? 'subtitle'}
        </Text>
      )}
    </React.Fragment>
  );
};

/**
 * ```
 * ┌─────────────────────────────┐
 * │ Title                       │
 * │ Subtitle                    │
 * └─────────────────────────────┘
 * ```
 */         
export function CardButton(props: {
  title: string;
  subtitle: string;
  onPress: (event: GestureResponderEvent) => void;
}){
  return(
    <TouchableOpacity 
      style={styles.cardButtonContainer}
      onPress={props.onPress}
    >
      <React.Fragment>
        <Text style={styles.cardButtonTitleText}>
          {props.title}
        </Text>
        <Text style={styles.cardButtonSubtitleText}>
          {props.subtitle}
        </Text>
      </React.Fragment>
    </TouchableOpacity>
  );
};

/**
 * ```
 * ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ 
 *   Label              Value │
 * └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ 
 * ```
 */                            
export function CardRowLabelDisplay(props: {
  label?: string;
  value?: string | number;
}){
  return (
    <View style={styles.cardRowLabelDisplayContainer}>
      <Text style={styles.cardRowLabelDisplayLabelText}>
        {props.label ?? 'Current Value'}
      </Text>
      <Text style={styles.cardRowLabelDisplayValueText}>
        {props.value ?? 'N/A'}
      </Text>
    </View>
  );
};

/**
 * ```
 * ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
 *   Title               ┌──┬─┐   
 * │ Subtitle            └──┴─┘  │
 *  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ 
 * ```
 */                               
export function CardRowSwitch(props: {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}){
  return(
    <View style={styles.cardRowSwitchContainer}>
      <View style={styles.cardRowSwitchLabelContainer}>
        <Text style={styles.cardRowSwitchLabelText}>
          {props.title ?? 'title'}
        </Text>
        <Text style={styles.cardRowSwitchSubtitleText}>
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

export class CardRowTextInput extends React.PureComponent<{
  placeholder?: string
}> {
  
  state = {
    textInput: '',
  };

  getText = () => {
    return this.state.textInput;
  };

  _handleOnChangeText = (text: string) => {
    this.setState({textInput: text});
  };

  render(){
    const props = this.props;

    return(
      <TextInput
        style={styles.cardRowTextInput}
        onChangeText={this._handleOnChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={Colors.INDIGO[300]}
      />
    );
  };
};

const styles = StyleSheet.create({
  //#region - CardBody
  cardBodyContainer: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    marginHorizontal: 10,
    marginVertical: 10,
    backgroundColor: Colors.PURPLE[50],
    borderRadius: 10,
  },
  //#endregion

  //#region - CardTitle
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardPillContainer: {
    backgroundColor: Colors.BLUE.A400,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginLeft: 10,
  },
  cardPillTitleText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  cardSubtitleText: {
    marginTop: 7,
    fontWeight: '300',
    fontSize: 14,
    color: 'rgba(0,0,0,0.5)'
  },
  //#endregion

  //#region - CardButton
  cardButtonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.PURPLE.A200,
    borderRadius: 10,
    marginTop: 12,
  },
  cardButtonTitleText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700'
  },
  cardButtonSubtitleText: {
    color: 'white',
    fontWeight: '400'
  },
  //#endregion

  //#region - CardRowLabelDisplay
  cardRowLabelDisplayContainer: {
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: Colors.INDIGO[100],
    borderRadius: 10,
    alignItems: 'center',
  },
  cardRowLabelDisplayLabelText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.PURPLE[1100],
    opacity: 0.75,
  },
  cardRowLabelDisplayValueText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.PURPLE[1100],
    opacity: 0.4,
  },
  //#endregion

  //#region - CardRowSwitch
  cardRowSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  cardRowSwitchLabelContainer: {
    flex: 1,
    marginRight: 10,
  },
  cardRowSwitchLabelText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.PURPLE[1200],
  },
  cardRowSwitchSubtitleText: {
    flex: 1,
    fontSize: 16,
    opacity: 0.5,
    color: Colors.PURPLE[1100],
  },
  //#endregion

  //#region - CardRowTextInput
  cardRowTextInput: {
    backgroundColor: Colors.INDIGO[100],
    fontSize: 16,
    color: Colors.INDIGO[900],
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 12,
  },
  //#endregion
});

