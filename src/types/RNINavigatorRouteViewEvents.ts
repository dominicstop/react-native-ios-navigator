/**
 * `RNINavigatorRouteView` Events
 * This file contains all the route-related events and event objects (e.g. push, pop, blur, focus, search, etc).
 */

//#region - Event Objects
type BaseEventObject = {
  routeID: number;
  routeKey: string;
  routeIndex: number;
};

export type OnRoutePushEventObject = {
  nativeEvent: BaseEventObject;
};

export type OnRoutePopEventObject = {
  nativeEvent: BaseEventObject & {
    isUserInitiated: boolean;
  };
};

export type OnRouteFocusEventObject = {
  nativeEvent: BaseEventObject & { 
    isAnimated: boolean;
    isFirstFocus: boolean;
  };
};

export type OnRouteBlurEventObject = {
  nativeEvent: BaseEventObject & { 
    isAnimated: boolean;
  };
};

export type OnPressNavBarItemEventObject = {
  nativeEvent: BaseEventObject & { 
    key  : string;
    type : string;
    index: string;
  };
}; 

export type OnUpdateSearchResultsEventObject = {
  nativeEvent: BaseEventObject & { 
    text?: string;
    isActive: boolean;
  };
}; 

export type OnSearchBarCancelButtonClickedEventObject = {
  nativeEvent: BaseEventObject;
}; 

export type OnSearchBarSearchButtonClickedEventObject = {
  nativeEvent: BaseEventObject & { 
    text?: string;
  };
};
//#endregion

//#region - Event Handler Types
export type OnRoutePushEvent = (
  event: Readonly<OnRoutePushEventObject>
) => void;

export type OnRouteFocusEvent = (
  event: Readonly<OnRouteFocusEventObject>
) => void;

export type OnRouteBlurEvent = (
  event: Readonly<OnRouteBlurEventObject>
) => void;

export type OnRoutePopEvent = (
  event: Readonly<OnRoutePopEventObject>
) => void;

export type OnPressNavBarItemEvent = (
  event: Readonly<OnPressNavBarItemEventObject>
) => void;

export type OnUpdateSearchResultsEvent = (
  event: Readonly<OnUpdateSearchResultsEventObject>
) => void;

export type OnSearchBarCancelButtonClickedEvent = (
  event: Readonly<OnSearchBarCancelButtonClickedEventObject>
) => void;

export type OnSearchBarSearchButtonClickedEvent = (
  event: Readonly<OnSearchBarSearchButtonClickedEventObject>
) => void;
//#endregion
