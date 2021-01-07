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

RCT_EXPORT_VIEW_PROPERTY(onNavRouteViewAdded  , RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNavRouteViewRemoved, RCTBubblingEventBlock);

RCT_EXPORT_VIEW_PROPERTY(onNavRouteWillPop, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onNavRouteDidPop , RCTBubblingEventBlock);

@end
