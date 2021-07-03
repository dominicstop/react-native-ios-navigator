import React from 'react';

import type { OnUIConstantsDidChangePayload } from '../types/RNINavigatorViewEvents';

export type NavigatorUIConstantsContextProps = Pick<OnUIConstantsDidChangePayload['nativeEvent'],
  | 'navigatorID'
  | 'safeAreaInsets'
  | 'statusBarHeight'
>;

export const NavigatorUIConstantsContext = 
  React.createContext<Partial<NavigatorUIConstantsContextProps>>({});