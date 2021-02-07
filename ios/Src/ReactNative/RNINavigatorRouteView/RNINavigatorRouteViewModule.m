//
//  RNINavigatorRouteViewModule.m
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/24/21.
//


#import "React/RCTBridgeModule.h"


@interface RCT_EXTERN_MODULE(RNINavigatorRouteViewModule, NSObject)

RCT_EXTERN_METHOD(setHidesBackButton: (nonnull NSNumber)node
                  isHidden: (nonnull BOOL) isHidden
                  animated: (nonnull BOOL) animated
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock *)resolve
                  reject : (RCTPromiseRejectBlock  *)reject);

@end
