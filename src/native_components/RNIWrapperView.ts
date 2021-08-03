import React from 'react';
import { requireNativeComponent, ViewStyle } from 'react-native';

import { RNIWrapperViewModule } from '../native_modules/RNIWrapperViewModule';

import * as Helpers from '../functions/Helpers';


export type RNIWrapperViewProps = {
  style?: ViewStyle;
  nativeID?: String;
  children?: Element;
  shouldNotifyComponentWillUnmount?: boolean;
};


const COMPONENT_NAME = 'RNIWrapperView';

const NativeComponent = 
  requireNativeComponent<RNIWrapperViewProps>(COMPONENT_NAME);


export class RNIWrapperView extends React.PureComponent<RNIWrapperViewProps> {
  nativeRef!: React.Component<RNIWrapperViewProps>;

  private _handleNativeRef = (ref: React.Component<RNIWrapperViewProps>) => {
    this.nativeRef = ref;
  };

  componentWillUnmount(){
    const shouldNotifyComponentWillUnmount = 
      this.props.shouldNotifyComponentWillUnmount ?? false;

    if(shouldNotifyComponentWillUnmount){
      this.notifyComponentWillUnmount(false);
    };
  };

  notifyComponentWillUnmount = (isManuallyTriggered: boolean = true) => {
    RNIWrapperViewModule.notifyComponentWillUnmount(
      Helpers.getNativeNodeHandle(this.nativeRef), 
      { isManuallyTriggered }
    );
  };

  render(){
    const props = this.props;

    return React.createElement(NativeComponent, {
      ...props,
      ref: this._handleNativeRef,
      shouldNotifyComponentWillUnmount: 
        props.shouldNotifyComponentWillUnmount ?? false,
    });
  };
};