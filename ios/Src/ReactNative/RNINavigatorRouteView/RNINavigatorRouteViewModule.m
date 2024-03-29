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

RCT_EXTERN_METHOD(getRouteConstants: (nonnull NSNumber)node
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock *)resolve
                  reject : (RCTPromiseRejectBlock  *)reject);

RCT_EXTERN_METHOD(getRouteSearchControllerState: (nonnull NSNumber)node
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock *)resolve
                  reject : (RCTPromiseRejectBlock  *)reject);

RCT_EXTERN_METHOD(setRouteSearchControllerState: (nonnull NSNumber)node
                  state                        : (        NSDictionary *)state
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock *)resolve
                  reject : (RCTPromiseRejectBlock  *)reject);

@end
