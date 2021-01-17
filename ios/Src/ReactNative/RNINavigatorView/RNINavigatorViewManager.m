//
//  RNINavigatorViewManager.m
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNINavigatorViewManager, RCTViewManager)

// ---------------------------
// MARK: Export Props - Events
// ---------------------------

RCT_EXPORT_VIEW_PROPERTY(onNavRouteViewAdded, RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onNavRouteWillPop, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNavRouteDidPop , RCTBubblingEventBlock);

// ---------------------------
// MARK: Export Props - Values
// ---------------------------

RCT_EXPORT_VIEW_PROPERTY(navigationBarStyle, NSString);
RCT_EXPORT_VIEW_PROPERTY(navigationBarIsTranslucent, BOOL);
RCT_EXPORT_VIEW_PROPERTY(navigationBarTintColor, NSNumber);

@end
