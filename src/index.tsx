import { requireNativeComponent, ViewStyle } from 'react-native';

type IosNavigatorProps = {
  color: string;
  style: ViewStyle;
};


export const IosNavigatorViewManager = requireNativeComponent<IosNavigatorProps>(
  'IosNavigatorView'
);

export default IosNavigatorViewManager;
