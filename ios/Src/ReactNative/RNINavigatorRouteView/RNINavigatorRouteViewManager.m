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

RCT_EXPORT_VIEW_PROPERTY(onNavRouteWillPush, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNavRouteDidPush , RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onNavRouteWillPop, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNavRouteDidPop , RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onPressNavBarBackItem , RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPressNavBarLeftItem , RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onPressNavBarRightItem, RCTBubblingEventBlock);

// ----------------------------
// MARK:- Export Props - Values
// ----------------------------

RCT_EXPORT_VIEW_PROPERTY(routeKey  , NSString);
RCT_EXPORT_VIEW_PROPERTY(routeIndex, NSNumber);

// MARK: Props - Transition Config
RCT_EXPORT_VIEW_PROPERTY(transitionConfigPush, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(transitionConfigPop, NSDictionary);

// MARK: Props - Navbar Config
RCT_EXPORT_VIEW_PROPERTY(prompt, NSString);
RCT_EXPORT_VIEW_PROPERTY(routeTitle, NSString);
RCT_EXPORT_VIEW_PROPERTY(largeTitleDisplayMode, NSString);

// MARK: Props - Navbar item config
RCT_EXPORT_VIEW_PROPERTY(navBarButtonBackItemConfig  , NSArray); // why array?
RCT_EXPORT_VIEW_PROPERTY(navBarButtonLeftItemsConfig , NSArray);
RCT_EXPORT_VIEW_PROPERTY(navBarButtonRightItemsConfig, NSArray);

// MARK: Props - Navbar back button item config
RCT_EXPORT_VIEW_PROPERTY(leftItemsSupplementBackButton, BOOL);
RCT_EXPORT_VIEW_PROPERTY(backButtonTitle, NSString);
RCT_EXPORT_VIEW_PROPERTY(backButtonDisplayMode, NSString);
RCT_EXPORT_VIEW_PROPERTY(hidesBackButton, BOOL);

@end
