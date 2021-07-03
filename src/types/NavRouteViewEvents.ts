type BaseEventPayload = {
  routeID: number;
  routeKey: string;
  routeIndex: number;
};

export type OnRoutePushEvent = (event: {
  nativeEvent: BaseEventPayload & { 
    isAnimated: boolean;
  };
}) => void;

export type OnRouteFocusBlurEvent = (event: {
  nativeEvent: BaseEventPayload & { 
    isAnimated: boolean;
  };
}) => void;

// TODO: Add `isAnimated` param 
export type OnRoutePopEvent = (event: {
  nativeEvent: BaseEventPayload & {
    isUserInitiated: boolean;
  };
}) => void;

export type OnPressNavBarItem = (event: {
  nativeEvent: BaseEventPayload & { 
    key  : string;
    type : string;
    index: string;
  };
}) => void;

export type OnUpdateSearchResults = (event: {
  nativeEvent: BaseEventPayload & { 
    text?: string;
    isActive: boolean;
  };
}) => void;

export type OnSearchBarCancelButtonClicked = (event: {
  nativeEvent: BaseEventPayload;
}) => void;

export type OnSearchBarSearchButtonClicked = (event: {
  nativeEvent: BaseEventPayload & { 
    text?: string;
  };
}) => void;