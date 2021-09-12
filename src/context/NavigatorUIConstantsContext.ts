import React from 'react';

import type { OnUIConstantsDidChangeEventObject } from '../types/RNINavigatorViewEvents';

export type NavigatorUIConstantsContextProps = Pick<OnUIConstantsDidChangeEventObject['nativeEvent'],
  | 'navigatorID'
  | 'safeAreaInsets'
  | 'statusBarHeight'
  | 'navigatorSize'
>;

export const NavigatorUIConstantsContext = 
  React.createContext<Partial<NavigatorUIConstantsContextProps>>({});