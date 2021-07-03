import type { EdgeInsets } from './MiscTypes';


type EventBasePayload = {
  target: number;
  navigatorID: number;
};

export type OnNavRouteViewAddedPayload = { 
  nativeEvent: EventBasePayload & {
    routeID      : number;
    routeKey     : string;
    routeIndex   : number;
    isNativeRoute: boolean;
  };
};

export type OnNavRouteWillPopPayload = { 
  nativeEvent: EventBasePayload & {
    routeKey       : string;
    routeIndex     : number;
    isUserInitiated: boolean;
  };
};

export type OnNavRouteDidPopPayload = { 
  nativeEvent: EventBasePayload & {
    routeKey       : string;
    routeIndex     : number;
    isUserInitiated: boolean;
  };
};

export type OnSetNativeRouteDataPayload = {
  nativeEvent: EventBasePayload;
};

export type OnNativeCommandRequestPayload = { 
  nativeEvent: EventBasePayload & {
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

export type OnCustomCommandFromNativePayload = { 
  nativeEvent: EventBasePayload & {
    commandKey: string;
    commandData: object;
  };
};

export type OnUIConstantsDidChangePayload = { 
  nativeEvent: EventBasePayload & {
    statusBarHeight: number;
    safeAreaInsets: EdgeInsets;
  };
};