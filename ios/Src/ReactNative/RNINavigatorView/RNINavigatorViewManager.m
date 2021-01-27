//
//  RNINavigatorViewManager.m
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNINavigatorViewManager, RCTViewManager)

// ----------------------------
// MARK:- Export Props - Events
// ----------------------------

RCT_EXPORT_VIEW_PROPERTY(onNavRouteViewAdded, RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onNavRouteWillPop, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNavRouteDidPop , RCTBubblingEventBlock);

// ----------------------------
// MARK:- Export Props - Values
// ----------------------------

RCT_EXPORT_VIEW_PROPERTY(isInteractivePopGestureEnabled, BOOL);

// MARK: Navigation Bar: General/Misc. Config
RCT_EXPORT_VIEW_PROPERTY(navBarPrefersLargeTitles, BOOL);

// MARK: Navigation Bar: Legacy Customizations
RCT_EXPORT_VIEW_PROPERTY(navBarStyle, NSString);
RCT_EXPORT_VIEW_PROPERTY(navBarIsTranslucent, BOOL);
RCT_EXPORT_VIEW_PROPERTY(navBarTintColor, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(navBarTitleTextStyle, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(navBarLargeTitleTextAttributes, NSDictionary);

@end
