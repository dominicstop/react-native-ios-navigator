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
RCT_EXPORT_VIEW_PROPERTY(onSetNativeRoutes, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNativeCommandRequest, RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onNavRouteWillPop, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNavRouteDidPop, RCTBubblingEventBlock);

// ----------------------------
// MARK:- Export Props - Values
// ----------------------------

RCT_EXPORT_VIEW_PROPERTY(navigatorID, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(nativeRoutes, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(initialRouteKeys, NSArray);

// MARK: General/Misc. Config
RCT_EXPORT_VIEW_PROPERTY(isNavBarTranslucent, BOOL);
RCT_EXPORT_VIEW_PROPERTY(navBarPrefersLargeTitles, BOOL);
RCT_EXPORT_VIEW_PROPERTY(isInteractivePopGestureEnabled, BOOL);

// MARK: Navigation Bar: Customization
RCT_EXPORT_VIEW_PROPERTY(navBarAppearance, NSDictionary);

@end
