import type { NativeActiveRoutes } from 'src/native_modules/RNINavigatorViewModule';
import type { EdgeInsets, Rect } from './MiscTypes';

//#region - Event Objects
type EventBaseEventObject = {
  target: number;
  navigatorID: number;
};

export type OnNavRouteViewAddedEventObject = { 
  nativeEvent: EventBaseEventObject & {
    routeID      : number;
    routeKey     : string;
    routeIndex   : number;
    isNativeRoute: boolean;
  };
};

export type OnNavRoutePopEventObject = { 
  nativeEvent: EventBaseEventObject & {
    routeID        : number;
    routeKey       : string;
    routeIndex     : number;
    isUserInitiated: boolean;
  };
};

export type OnNavRouteWillShowEventObject = {
  nativeEvent: EventBaseEventObject & NativeActiveRoutes;
};

export type OnNavRouteDidShowEventObject = {
  nativeEvent: EventBaseEventObject & NativeActiveRoutes;
};

export type OnSetNativeRoutesEventObject = {
  nativeEvent: EventBaseEventObject;
};

export type OnNativeCommandRequestEventObject = { 
  nativeEvent: EventBaseEventObject & {
    commandData: {
      commandKey: 'pushViewController';
      routeID: number;
      routeKey: string;
      isAnimated: boolean;
    } | {
      commandKey: 'push';
      routeKey: string,
      routeProps?: object;
      isAnimated: boolean
    } | {
      commandKey: 'pop';
      isAnimated: boolean;
    };
  };
};

export type OnCustomCommandFromNativeEventObject = { 
  nativeEvent: EventBaseEventObject & {
    commandKey: string;
    commandData: object;
  };
};

export type OnUIConstantsDidChangeEventObject = { 
  nativeEvent: EventBaseEventObject & {
    statusBarHeight: number;
    safeAreaInsets: EdgeInsets;
    navigatorSize: Rect;
  };
};
//#endregion

//#region - Event Handlers
export type OnNavRouteViewAddedEvent = (
  event: Readonly<OnNavRouteViewAddedEventObject>
) => void;

export type OnNavRoutePopEvent = (
  event: Readonly<OnNavRoutePopEventObject>
) => void;

export type OnSetNativeRoutesEvent = (
  event: Readonly<OnSetNativeRoutesEventObject>
) => void;

export type OnNativeCommandRequestEvent = (
  event: Readonly<OnNativeCommandRequestEventObject>
) => void;

export type OnCustomCommandFromNativeEvent = (
  event: Readonly<OnCustomCommandFromNativeEventObject>
) => void;

export type OnNavRouteWillShowEvent = (
  event: Readonly<OnNavRouteWillShowEventObject>
) => void;

export type OnNavRouteDidShowEvent = (
  event: Readonly<OnNavRouteDidShowEventObject>
) => void;

export type OnUIConstantsDidChangeEvent = (
  event: Readonly<OnUIConstantsDidChangeEventObject>
) => void;
//#endregion