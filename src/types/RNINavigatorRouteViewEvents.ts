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
  event: OnRoutePushEventObject
) => void;

export type OnRouteFocusEvent = (
  event: OnRouteFocusEventObject
) => void;

export type OnRouteBlurEvent = (
  event: OnRouteBlurEventObject
) => void;

export type OnRoutePopEvent = (
  event: OnRoutePopEventObject
) => void;

export type OnPressNavBarItemEvent = (
  event: OnPressNavBarItemEventObject
) => void;

export type OnUpdateSearchResultsEvent = (
  event: OnUpdateSearchResultsEventObject
) => void;

export type OnSearchBarCancelButtonClickedEvent = (
  event: OnSearchBarCancelButtonClickedEventObject
) => void;

export type OnSearchBarSearchButtonClickedEvent = (
  event: OnSearchBarSearchButtonClickedEventObject
) => void;
//#endregion
