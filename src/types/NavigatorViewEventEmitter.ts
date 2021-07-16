import type { TSEventEmitter } from "../functions/TSEventEmitter";
import type { OnNavRouteViewAddedEventObject, OnSetNativeRoutesEventObject } from "./RNINavigatorViewEvents";
import type { KeyMapType } from "./UtilityTypes";

export enum NavigatorViewEvents {
  onNavRouteViewAdded = "onNavRouteViewAdded",
  onSetNativeRoutes   = "onSetNativeRoutes"  ,
};

export type NavigatorViewEventMap = KeyMapType<NavigatorViewEvents, {
  onNavRouteViewAdded: OnNavRouteViewAddedEventObject,
  onSetNativeRoutes  : OnSetNativeRoutesEventObject,
}>

export type NavigatorViewEventEmitter = 
  TSEventEmitter<NavigatorViewEvents, NavigatorViewEventMap>;
