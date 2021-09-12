import { useContext } from 'react';

import { NavigatorUIConstantsContext, NavigatorUIConstantsContextProps } from '../context/NavigatorUIConstantsContext';
import { NavigatorError, NavigatorErrorCodes } from '../functions/NavigatorError';


export function useNavigatorUIConstants(): NavigatorUIConstantsContextProps {
  const constants = useContext(NavigatorUIConstantsContext);

  if(constants == null){
    throw new NavigatorError({
      code: NavigatorErrorCodes.libraryError,
      message: "unable to get UI constants object via context"
    });
  };

  return constants;
};