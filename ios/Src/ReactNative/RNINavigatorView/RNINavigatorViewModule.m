//
//  RNINavigatorViewModule.m
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/4/21.
//

#import "React/RCTBridgeModule.h"


@interface RCT_EXTERN_MODULE(RNINavigatorViewModule, NSObject)

RCT_EXTERN_METHOD(setNode: (nonnull NSNumber)node
                  // promise blocks ----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

RCT_EXTERN_METHOD(push    : (nonnull NSNumber)node
                  routeKey: (nonnull NSString *)routeKey
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);


RCT_EXTERN_METHOD(pop: (nonnull NSNumber)node
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

RCT_EXTERN_METHOD(setNavigationBarHidden: (nonnull NSNumber)node
                  isHidden: (nonnull BOOL) isHidden
                  animated: (nonnull BOOL) animated
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

@end
