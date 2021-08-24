import type { TSEventEmitter } from '@dominicstop/ts-event-emitter';

import type { OnNavRouteDidShowEventObject, OnNavRoutePopEventObject, OnNavRouteViewAddedEventObject, OnSetNativeRoutesEventObject } from "./RNINavigatorViewEvents";
import type { KeyMapType } from "./UtilityTypes";

export enum NavigatorViewEvents {
  onNavRouteViewAdded = "onNavRouteViewAdded",
  onSetNativeRoutes   = "onSetNativeRoutes"  ,
  onNavRouteDidPop    = "onNavRouteDidPop"   ,
  onNavRouteDidShow   = "onNavRouteDidShow"  ,
};

export type NavigatorViewEventMap = KeyMapType<NavigatorViewEvents, {
  onNavRouteViewAdded: OnNavRouteViewAddedEventObject,
  onSetNativeRoutes  : OnSetNativeRoutesEventObject  ,
  onNavRouteDidPop   : OnNavRoutePopEventObject      ,
  onNavRouteDidShow  : OnNavRouteDidShowEventObject ,
}>

export type NavigatorViewEventEmitter = 
  TSEventEmitter<NavigatorViewEvents, NavigatorViewEventMap>;
