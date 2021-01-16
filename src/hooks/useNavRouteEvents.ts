import { useContext, useEffect, useRef } from 'react';

import type { NavRouteEvents } from '../components/NavigatorRouteView';
import { NavRouteViewContext } from '../context/NavRouteViewContext';


export function useNavRouteEvents(eventName: NavRouteEvents, once: boolean, handler: () => void){
  const { getEmitterRef } = useContext(NavRouteViewContext);
  
  // Create a ref that stores handler
  const savedHandler = useRef(null);

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const emitterRef = getEmitterRef();

    // create event listener that calls handler function stored in ref
    const eventListener = (params) => savedHandler.current(params);

    if(once){
      emitterRef.once(eventName, eventListener);

    } else {
      // subscribe to events
      emitterRef.addListener(eventName, eventListener);
    };

    return () => {
      if(!once){
        // remove event listener on cleanup
        emitterRef.removeListener(eventName, eventListener);
      };
    };
  });
};