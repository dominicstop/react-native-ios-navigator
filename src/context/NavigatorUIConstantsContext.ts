import React from 'react';

import type { OnUIConstantsDidChangeEventObject } from '../types/RNINavigatorViewEvents';

export type NavigatorUIConstantsContextProps = Partial<Pick<OnUIConstantsDidChangeEventObject['nativeEvent'],
  | 'navigatorID'
  | 'safeAreaInsets'
  | 'statusBarHeight'
  | 'navigatorSize'
>>;

export const NavigatorUIConstantsContext = 
  React.createContext<NavigatorUIConstantsContextProps>({});