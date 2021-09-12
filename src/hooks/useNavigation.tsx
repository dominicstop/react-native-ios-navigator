import { useContext } from 'react';

import type { NavigationObject } from '../types/NavigationObject';

import { NavigationContext } from '../context/NavigationContext';
import { NavigatorError, NavigatorErrorCodes } from '../functions/NavigatorError';


export function useNavigation(): NavigationObject {
  const { navigation } = useContext(NavigationContext);

  if(navigation == null){
    throw new NavigatorError({
      code: NavigatorErrorCodes.libraryError,
      message: "unable to get navigation object via context"
    });
  };

  return navigation;
};