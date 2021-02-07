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

const NativeComponent = 
  requireNativeComponent<RNIWrapperViewProps>('RNIWrapperView');

const NativeCommands: NativeComponentCommands = 
  UIManager["RNIWrapperView"].Commands;


export class RNIWrapperView extends React.PureComponent<RNIWrapperViewProps> {
  nativeRef: React.Component<RNIWrapperViewProps>;

  private _handleNativeRef = (ref: React.Component<RNIWrapperViewProps>) => {
    this.nativeRef = ref;
  };

  notifyComponentWillUnmount = (isManuallyTriggered: boolean) => {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this.nativeRef),
      NativeCommands.notifyComponentWillUnmount,
      [{isManuallyTriggered}]
    );
  };

  componentWillUnmount(){
    this.notifyComponentWillUnmount(false);
  };

  render(){
    const props = this.props;

    return React.createElement(NativeComponent, {
      ...props,
      ref: this._handleNativeRef,
    });
  };
};