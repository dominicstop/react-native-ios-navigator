import { useContext, useEffect, useRef } from 'react';
import type { onPressNavBarItem, onRoutePopEvent, onRoutePushEvent } from 'src/native_components/RNINavigatorRouteView';

import type { NavRouteEvents } from '../components/NavigatorRouteView';
import { NavRouteViewContext } from '../context/NavRouteViewContext';

/** Route push/pop events */
type NavRouteLifeCycleEvents = 
  | (NavRouteEvents.onRouteWillPush  | 'onRouteWillPush' )
  | (NavRouteEvents.onRouteDidPush   | 'onRouteDidPush'  )
  | (NavRouteEvents.onRouteWillPop   | 'onRouteWillPop'  )
  | (NavRouteEvents.onRouteDidPop    | 'onRouteDidPop'   )
  | (NavRouteEvents.onRouteWillFocus | 'onRouteWillFocus')
  | (NavRouteEvents.onRouteDidFocus  | 'onRouteDidFocus' )
  | (NavRouteEvents.onRouteWillBlur  | 'onRouteWillBlur' )
  | (NavRouteEvents.onRouteDidBlur   | 'onRouteDidBlur'  )

/** Route navigation bar item events */
type NavBarItemEvents = 
  | (NavRouteEvents.onPressNavBarBackItem  | 'onPressNavBarBackItem' )
  | (NavRouteEvents.onPressNavBarLeftItem  | 'onPressNavBarLeftItem' )
  | (NavRouteEvents.onPressNavBarRightItem | 'onPressNavBarRightItem')

function useNavRouteEvents(
  eventName: NavRouteLifeCycleEvents | NavBarItemEvents,
  once: boolean, 
  handler: Function
){
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

export function useNavRouteLifeCycle(
  eventName: NavRouteLifeCycleEvents, 
  once: boolean, 
  handler: onRoutePushEvent | onRoutePopEvent
){
  useNavRouteEvents(eventName, once, handler);
};

export function useNavBarItemEvents(
  eventName: NavBarItemEvents, 
  once: boolean, 
  handler: onPressNavBarItem
){
  useNavRouteEvents(eventName, once, handler);
};
