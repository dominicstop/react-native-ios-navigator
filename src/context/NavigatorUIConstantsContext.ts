import React from 'react';

import type { OnUIConstantsDidChangePayload } from 'src/native_components/RNINavigatorView';

export type NavigatorUIConstantsContextProps = Pick<OnUIConstantsDidChangePayload['nativeEvent'],
  | 'navigatorID'
  | 'safeAreaInsets'
  | 'statusBarHeight'
>;

export const NavigatorUIConstantsContext = 
  React.createContext<Partial<NavigatorUIConstantsContextProps>>({});