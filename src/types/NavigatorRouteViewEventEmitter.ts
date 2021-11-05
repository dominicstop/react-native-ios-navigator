

import type { TSEventEmitter } from '@dominicstop/ts-event-emitter';

import type { OnPressNavBarItemEventObject, OnRouteFocusEventObject, OnRouteBlurEventObject, OnRoutePopEventObject, OnRoutePushEventObject, OnSearchBarCancelButtonClickedEventObject, OnSearchBarSearchButtonClickedEventObject, OnUpdateSearchResultsEventObject, OnWillDismissSearchControllerEventObject, OnDidDismissSearchControllerEventObject, OnWillPresentSearchControllerEventObject, OnDidPresentSearchControllerEventObject } from "./RNINavigatorRouteViewEvents";
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

  onWillDismissSearchController = "onWillDismissSearchController",
  onDidDismissSearchController  = "onDidDismissSearchController" ,
  onWillPresentSearchController = "onWillPresentSearchController",
  onDidPresentSearchController  = "onDidPresentSearchController" ,
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

  onWillDismissSearchController: OnWillDismissSearchControllerEventObject;
  onDidDismissSearchController : OnDidDismissSearchControllerEventObject;
  onWillPresentSearchController: OnWillPresentSearchControllerEventObject;
  onDidPresentSearchController : OnDidPresentSearchControllerEventObject;
}>;

export type NavigatorRouteViewEventEmitter = 
  TSEventEmitter<NavigatorRouteViewEvents, NavigatorRouteViewEventMap>;
