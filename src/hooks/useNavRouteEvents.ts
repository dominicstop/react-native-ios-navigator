import { useContext, useEffect, useRef } from 'react';

import type { NavigatorRouteViewEvents, NavigatorRouteViewEventMap } from '../types/NavigatorRouteViewEventEmitter';
import type { EnumValuesLiteral } from '../types/UtilityTypes';

import { NavigationContext } from '../context/NavigationContext';

import { NavigatorError, NavigatorErrorCodes } from '../functions/NavigatorError';


export function useNavRouteEvents<
  T extends EnumValuesLiteral<NavigatorRouteViewEvents>,
  K extends NavigatorRouteViewEventMap[T]
>(
  eventName: T,
  handler: (event: K) => void
){
  const { navigation } = useContext(NavigationContext);

  if(navigation == null){
    throw new NavigatorError({
      code: NavigatorErrorCodes.libraryError,
      message: "unable to get navigation object via context"
    });
  };
  
  // Create a ref that stores handler
  const savedHandler = useRef<Function | null>(null);

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const emitterRef = navigation.getRefToNavRouteEmitter();

    if(emitterRef == null) {
      throw new NavigatorError({
        code: NavigatorErrorCodes.libraryError,
        message: "unable to get ref. to the route event emitter"
      });
    };

    // create event listener that calls handler function stored in ref
    const eventListener = (params: any) => savedHandler.current!(params);

    // subscribe to events
    emitterRef.addListener(eventName, eventListener);

    return () => {
      // remove event listener on cleanup
      emitterRef.removeListener(eventName, eventListener);
    };
  });
};