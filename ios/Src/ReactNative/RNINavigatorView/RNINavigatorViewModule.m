//
//  RNINavigatorViewModule.m
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/4/21.
//

#import "React/RCTBridgeModule.h"


@interface RCT_EXTERN_MODULE(RNINavigatorViewModule, NSObject)

RCT_EXTERN_METHOD(push    : (nonnull NSNumber *)node
                  routeKey: (nonnull NSString *)routeKey
                  resolve : (RCTPromiseResolveBlock)resolve
                  reject  : (RCTPromiseRejectBlock )reject);

@end
