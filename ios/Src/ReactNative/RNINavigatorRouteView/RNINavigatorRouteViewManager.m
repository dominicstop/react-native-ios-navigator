//
//  RNINavigatorRouteViewManager.m
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNINavigatorRouteViewManager, RCTViewManager)

// ----------------------------
// MARK:- Export Props - Events
// ----------------------------

RCT_EXPORT_VIEW_PROPERTY(onRouteWillPush, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onRouteDidPush , RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onRouteWillPop, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onRouteDidPop , RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onRouteWillFocus, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onRouteDidFocus , RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onRouteWillBlur, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onRouteDidBlur , RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onPressNavBarLeftItem , RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPressNavBarRightItem, RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onUpdateSearchResults, RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onSearchBarCancelButtonClicked, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onSearchBarSearchButtonClicked, RCTBubblingEventBlock);

// ----------------------------
// MARK:- Export Props - Values
// ----------------------------

RCT_EXPORT_VIEW_PROPERTY(routeID   , NSNumber);
RCT_EXPORT_VIEW_PROPERTY(routeKey  , NSString);
RCT_EXPORT_VIEW_PROPERTY(routeIndex, NSNumber);

RCT_EXPORT_VIEW_PROPERTY(statusBarStyle, NSString);

// MARK: Props - Transition Config
RCT_EXPORT_VIEW_PROPERTY(transitionConfigPush, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(transitionConfigPop, NSDictionary);

// MARK: Props - Navbar Config
RCT_EXPORT_VIEW_PROPERTY(prompt, NSString);
RCT_EXPORT_VIEW_PROPERTY(routeTitle, NSString);
RCT_EXPORT_VIEW_PROPERTY(largeTitleDisplayMode, NSString);
RCT_EXPORT_VIEW_PROPERTY(searchBarConfig, NSDictionary);

// MARK: Props - Navbar item config
RCT_EXPORT_VIEW_PROPERTY(navBarButtonBackItemConfig  , NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(navBarButtonLeftItemsConfig , NSArray);
RCT_EXPORT_VIEW_PROPERTY(navBarButtonRightItemsConfig, NSArray);

// MARK: Props - Navbar back button item config
RCT_EXPORT_VIEW_PROPERTY(hidesBackButton, BOOL);
RCT_EXPORT_VIEW_PROPERTY(leftItemsSupplementBackButton, BOOL);
RCT_EXPORT_VIEW_PROPERTY(backButtonTitle, NSString);
RCT_EXPORT_VIEW_PROPERTY(backButtonDisplayMode, NSString);
RCT_EXPORT_VIEW_PROPERTY(applyBackButtonConfigToCurrentRoute, BOOL);

// MARK: Props - NavigationConfigOverride-related
RCT_EXPORT_VIEW_PROPERTY(navBarAppearanceOverride, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(navigationBarVisibility, NSString);
RCT_EXPORT_VIEW_PROPERTY(allowTouchEventsToPassThroughNavigationBar, BOOL);

@end
