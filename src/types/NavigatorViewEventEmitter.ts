import type { TSEventEmitter } from "../functions/TSEventEmitter";
import type { OnNavRoutePopEventObject, OnNavRouteViewAddedEventObject, OnSetNativeRoutesEventObject } from "./RNINavigatorViewEvents";
import type { KeyMapType } from "./UtilityTypes";

export enum NavigatorViewEvents {
  onNavRouteViewAdded = "onNavRouteViewAdded",
  onSetNativeRoutes   = "onSetNativeRoutes"  ,
  onNavRouteDidPop    = "onNavRouteDidPop"   ,
};

export type NavigatorViewEventMap = KeyMapType<NavigatorViewEvents, {
  onNavRouteViewAdded: OnNavRouteViewAddedEventObject,
  onSetNativeRoutes  : OnSetNativeRoutesEventObject  ,
  onNavRouteDidPop   : OnNavRoutePopEventObject      ,
}>

export type NavigatorViewEventEmitter = 
  TSEventEmitter<NavigatorViewEvents, NavigatorViewEventMap>;
