import React from 'react';
import { requireNativeComponent, ViewStyle, UIManager, findNodeHandle } from 'react-native';


export type RNIWrapperViewProps = {
  style?: ViewStyle;
  nativeID?: String;
  children?: Element;
};

type NativeComponentCommands = {
  notifyComponentWillUnmount: any;
};

const COMPONENT_NAME = 'RNIWrapperView';

const NativeComponent = 
  requireNativeComponent<RNIWrapperViewProps>(COMPONENT_NAME);

const NativeCommands: NativeComponentCommands = 
  // @ts-ignore
  UIManager[COMPONENT_NAME].Commands;


export class RNIWrapperView extends React.PureComponent<RNIWrapperViewProps> {
  nativeRef: React.Component<RNIWrapperViewProps>;

  private _handleNativeRef = (ref: React.Component<RNIWrapperViewProps>) => {
    this.nativeRef = ref;
  };

  notifyComponentWillUnmount = (isManuallyTriggered: boolean) => {
    console.log('findNodeHandle(this.nativeRef): ', findNodeHandle(this.nativeRef));
    
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.nativeRef),
      NativeCommands.notifyComponentWillUnmount,
      [{isManuallyTriggered}]
    );
  };

  render(){
    const props = this.props;

    return React.createElement(NativeComponent, {
      ...props,
      ref: this._handleNativeRef,
    });
  };
};