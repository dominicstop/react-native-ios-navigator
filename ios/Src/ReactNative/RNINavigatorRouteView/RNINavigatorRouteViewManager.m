//
//  RNINavigatorRouteViewManager.m
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNINavigatorRouteViewManager, RCTViewManager)

// ---------------------------
// MARK: Export Props - Events
// ---------------------------

RCT_EXPORT_VIEW_PROPERTY(onNavRouteWillPush, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNavRouteDidPush , RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onNavRouteWillPop, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNavRouteDidPop , RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onPressNavBarBackItem , RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPressNavBarLeftItem , RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPressNavBarRightItem, RCTBubblingEventBlock);

// ---------------------------
// MARK: Export Props - Values
// ---------------------------

RCT_EXPORT_VIEW_PROPERTY(routeKey  , NSString);
RCT_EXPORT_VIEW_PROPERTY(routeIndex, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(routeTitle, NSString);

// Navbar item config
RCT_EXPORT_VIEW_PROPERTY(navBarButtonBackItemConfig  , NSArray);
RCT_EXPORT_VIEW_PROPERTY(navBarButtonLeftItemsConfig , NSArray);
RCT_EXPORT_VIEW_PROPERTY(navBarButtonRightItemsConfig, NSArray);

// Navbar back button item config
RCT_EXPORT_VIEW_PROPERTY(leftItemsSupplementBackButton, BOOL);
RCT_EXPORT_VIEW_PROPERTY(backButtonTitle, NSString);
RCT_EXPORT_VIEW_PROPERTY(backButtonDisplayMode, NSString);
RCT_EXPORT_VIEW_PROPERTY(hidesBackButton, BOOL);

@end
