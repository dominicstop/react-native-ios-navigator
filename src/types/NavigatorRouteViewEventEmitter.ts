

import type { TSEventEmitter } from "../functions/TSEventEmitter";
import type { OnPressNavBarItemEventObject, OnRouteFocusEventObject, OnRouteBlurEventObject, OnRoutePopEventObject, OnRoutePushEventObject, OnSearchBarCancelButtonClickedEventObject, OnSearchBarSearchButtonClickedEventObject, OnUpdateSearchResultsEventObject } from "./RNINavigatorRouteViewEvents";
import type { KeyMapType } from "./UtilityTypes";

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

export type NavigatorRouteViewEventMap = KeyMapType<NavigatorRouteViewEvents, {
  onRouteWillPush: OnRoutePushEventObject;
  onRouteDidPush : OnRoutePushEventObject;
  onRouteWillPop : OnRoutePopEventObject ;
  onRouteDidPop  : OnRoutePopEventObject ;

  onRouteWillFocus: OnRouteFocusEventObject;
  onRouteDidFocus : OnRouteFocusEventObject;
  onRouteWillBlur : OnRouteBlurEventObject;
  onRouteDidBlur  : OnRouteBlurEventObject;

  onPressNavBarLeftItem : OnPressNavBarItemEventObject;
  onPressNavBarRightItem: OnPressNavBarItemEventObject;

  onUpdateSearchResults         : OnUpdateSearchResultsEventObject;
  onSearchBarCancelButtonClicked: OnSearchBarCancelButtonClickedEventObject;
  onSearchBarSearchButtonClicked: OnSearchBarSearchButtonClickedEventObject;
}>;

export type NavigatorRouteViewEventEmitter = 
  TSEventEmitter<NavigatorRouteViewEvents, NavigatorRouteViewEventMap>;
