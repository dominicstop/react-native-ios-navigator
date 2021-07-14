import { useContext, useEffect, useRef } from 'react';

import type { OnPressNavBarItemEvent, OnRoutePopEvent, OnRoutePushEvent } from '../types/RNINavigatorRouteViewEvents';
import type { NavigatorRouteViewEvents } from '../types/NavigatorRouteViewEventEmitter';

import { NavRouteViewContext } from '../context/NavRouteViewContext';


/** Route push/pop events */
type NavRouteLifeCycleEvents = 
  | (NavigatorRouteViewEvents.onRouteWillPush  | 'onRouteWillPush' )
  | (NavigatorRouteViewEvents.onRouteDidPush   | 'onRouteDidPush'  )
  | (NavigatorRouteViewEvents.onRouteWillPop   | 'onRouteWillPop'  )
  | (NavigatorRouteViewEvents.onRouteDidPop    | 'onRouteDidPop'   )
  | (NavigatorRouteViewEvents.onRouteWillFocus | 'onRouteWillFocus')
  | (NavigatorRouteViewEvents.onRouteDidFocus  | 'onRouteDidFocus' )
  | (NavigatorRouteViewEvents.onRouteWillBlur  | 'onRouteWillBlur' )
  | (NavigatorRouteViewEvents.onRouteDidBlur   | 'onRouteDidBlur'  )

/** Route navigation bar item events */
type NavBarItemEvents = 
  | (NavigatorRouteViewEvents.onPressNavBarLeftItem  | 'onPressNavBarLeftItem' )
  | (NavigatorRouteViewEvents.onPressNavBarRightItem | 'onPressNavBarRightItem')

function useNavRouteEvents(
  eventName: NavRouteLifeCycleEvents | NavBarItemEvents,
  handler: Function
){
  const { navigation } = useContext(NavRouteViewContext);
  
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
    const emitterRef = navigation.getRefToNavRouteEmitter();

    // create event listener that calls handler function stored in ref
    const eventListener = (params: any) => savedHandler.current(params);

    // subscribe to events
    emitterRef.addListener(eventName, eventListener);

    return () => {
      // remove event listener on cleanup
      emitterRef.removeListener(eventName, eventListener);
    };
  });
};

export function useNavRouteLifeCycle(
  eventName: NavRouteLifeCycleEvents, 
  handler: OnRoutePushEvent | OnRoutePopEvent
){
  useNavRouteEvents(eventName, handler);
};

export function useNavBarItemEvents(
  eventName: NavBarItemEvents, 
  handler: OnPressNavBarItemEvent
){
  useNavRouteEvents(eventName, handler);
};
