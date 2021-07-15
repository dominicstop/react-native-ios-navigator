

import type { TSEventEmitter } from "../functions/TSEventEmitter";
import type { OnPressNavBarItemEventObject, OnRouteFocusBlurEventObject, OnRoutePopEventObject, OnRoutePushEventObject, OnSearchBarCancelButtonClickedEventObject, OnSearchBarSearchButtonClickedEventObject, OnUpdateSearchResultsEventObject } from "./RNINavigatorRouteViewEvents";

export enum NavigatorRouteViewEvents {
  // Navigator Route - push/pop events
  onRouteWillPush = "onRouteWillPush",
  onRouteDidPush  = "onRouteDidPush" ,
  onRouteWillPop  = "onRouteWillPop" ,
  onRouteDidPop   = "onRouteDidPop"  ,

  // Navigator Route - focus/blur events
  onRouteWillFocus = "onRouteWillFocus",
  onRouteDidFocus  = "onRouteDidFocus" ,
  onRouteWillBlur  = "onRouteWillBlur" ,
  onRouteDidBlur   = "onRouteDidBlur"  ,

  // Navbar item `onPress` events
  onPressNavBarLeftItem  = "onPressNavBarLeftItem" ,
  onPressNavBarRightItem = "onPressNavBarRightItem",

  // Search-related events
  onUpdateSearchResults = "onUpdateSearchResults",
  
  onSearchBarCancelButtonClicked = "onSearchBarCancelButtonClicked",
  onSearchBarSearchButtonClicked = "onSearchBarSearchButtonClicked",
};

export type NavigatorRouteViewEventEmitter = TSEventEmitter<typeof NavigatorRouteViewEvents, {
  onRouteWillPush: OnRoutePushEventObject,
  onRouteDidPush : OnRoutePushEventObject,
  onRouteWillPop : OnRoutePopEventObject ,
  onRouteDidPop  : OnRoutePopEventObject ,

  onRouteWillFocus: OnRouteFocusBlurEventObject,
  onRouteDidFocus : OnRouteFocusBlurEventObject,
  onRouteWillBlur : OnRouteFocusBlurEventObject,
  onRouteDidBlur  : OnRouteFocusBlurEventObject,

  onPressNavBarLeftItem : OnPressNavBarItemEventObject,
  onPressNavBarRightItem: OnPressNavBarItemEventObject,

  onUpdateSearchResults         : OnUpdateSearchResultsEventObject,
  onSearchBarCancelButtonClicked: OnSearchBarCancelButtonClickedEventObject,
  onSearchBarSearchButtonClicked: OnSearchBarSearchButtonClickedEventObject,
}>;
