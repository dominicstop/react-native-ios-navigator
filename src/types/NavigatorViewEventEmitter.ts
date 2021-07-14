import type { EventEmitter } from "../functions/EventEmitter";
import type { OnNavRouteViewAddedEventObject, OnSetNativeRoutesEventObject } from "./RNINavigatorViewEvents";

export enum NavigatorViewEvents {
  onNavRouteViewAdded = "onNavRouteViewAdded",
  onSetNativeRoutes   = "onSetNativeRoutes"  ,
};

export type NavigatorViewEventEmitter = EventEmitter<typeof NavigatorViewEvents, {
  onNavRouteViewAdded: OnNavRouteViewAddedEventObject,
  onSetNativeRoutes  : OnSetNativeRoutesEventObject,
}>;
