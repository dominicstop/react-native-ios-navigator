
import type { RNINavigatorRouteViewProps } from "../native_components/RNINavigatorRouteView";

/**
 * `RNINavigatorRouteView` Events
 * This file contains all the route-related events and event objects (e.g. push, pop, blur, focus, search, etc).
 */


//#region - Event Objects
type BaseEventObject = Pick<RNINavigatorRouteViewProps,
  | 'routeID'
  | 'routeKey'
  | 'routeIndex'
>;

// Route Lifecycle-Related Events
// ------------------------------

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

// Navigation Bar Item-Related Events
// ----------------------------------

export type OnPressNavBarItemEventObject = {
  nativeEvent: BaseEventObject & { 
    key  : string;
    type : string;
    index: string;
  };
}; 

// Search Releated Events
// ----------------------

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

export type OnWillDismissSearchControllerEventObject = {
  nativeEvent: BaseEventObject & {
    text?: string;
  };
};

export type OnDidDismissSearchControllerEventObject = {
  nativeEvent: BaseEventObject & {
    text?: string;
  };
};

export type OnWillPresentSearchControllerEventObject = {
  nativeEvent: BaseEventObject & {
    text?: string;
  };
};

export type OnDidPresentSearchControllerEventObject = {
  nativeEvent: BaseEventObject & {
    text?: string;
  };
};

//#endregion

//#region - Event Handler Types

// Route Lifecycle-Related Events
// ------------------------------

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

// Navigation Bar Item-Related Events
// ----------------------------------

export type OnPressNavBarItemEvent = (
  event: Readonly<OnPressNavBarItemEventObject>
) => void;

// Search Releated Events
// ----------------------

export type OnUpdateSearchResultsEvent = (
  event: Readonly<OnUpdateSearchResultsEventObject>
) => void;

export type OnSearchBarCancelButtonClickedEvent = (
  event: Readonly<OnSearchBarCancelButtonClickedEventObject>
) => void;

export type OnSearchBarSearchButtonClickedEvent = (
  event: Readonly<OnSearchBarSearchButtonClickedEventObject>
) => void;

export type OnWillDismissSearchControllerEvent = (
  event: Readonly<OnWillDismissSearchControllerEventObject>
) => void;

export type OnDidDismissSearchControllerEvent = (
  event: Readonly<OnDidDismissSearchControllerEventObject>
) => void;

export type OnWillPresentSearchControllerEvent = (
  event: Readonly<OnWillPresentSearchControllerEventObject>
) => void;

export type OnDidPresentSearchControllerEvent = (
  event: Readonly<OnDidPresentSearchControllerEventObject>
) => void;

//#endregion
