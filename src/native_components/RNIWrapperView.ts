import { requireNativeComponent, ViewStyle } from 'react-native';


export type RNIWrapperViewProps = {
  style?: ViewStyle;
  nativeID?: String;
  children?: Element;
};

export const RNIWrapperView = 
  requireNativeComponent<RNIWrapperViewProps>('RNIWrapperView');