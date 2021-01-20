//
//  RNINavigatorRouteViewModule.m
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/21/21.
//

#import "React/RCTBridgeModule.h"


@interface RCT_EXTERN_MODULE(RNINavigatorRouteViewModule, NSObject)


RCT_EXTERN_METHOD(registerNativeComponent: (nonnull NSNumber)node
                  compNode: (nonnull NSNumber) compNode
                  nativeID: (NSString *) nativeID
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

@end
