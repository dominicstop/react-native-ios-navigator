//
//  RNINavigatorRouteViewManager.m
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNINavigatorRouteViewManager, RCTViewManager)

// ---------------------------
// MARK: Export Props - Values
// ---------------------------

RCT_EXPORT_VIEW_PROPERTY(routeKey, NSString);
RCT_EXPORT_VIEW_PROPERTY(routeIndex, NSNumber);

@end
