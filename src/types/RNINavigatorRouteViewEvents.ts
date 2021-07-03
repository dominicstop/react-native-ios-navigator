/// `RNINavigatorRouteView` Events

//#region - Event Objects
type BaseEventObject = {
  routeID: number;
  routeKey: string;
  routeIndex: number;
};

export type OnRoutePushEventObject = {
  nativeEvent: BaseEventObject & { 
    isAnimated: boolean;
  };
};

export type OnRouteFocusBlurEventObject = {
  nativeEvent: BaseEventObject & { 
    isAnimated: boolean;
  };
};

// TODO: Add `isAnimated` param 
export type OnRoutePopEventObject = {
  nativeEvent: BaseEventObject & {
    isUserInitiated: boolean;
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

export type OnRouteFocusBlurEvent = (
  event: OnRouteFocusBlurEventObject
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
