//
//  RNINavigatorViewModule.m
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/4/21.
//

#import "React/RCTBridgeModule.h"


@interface RCT_EXTERN_MODULE(RNINavigatorViewModule, NSObject)


RCT_EXTERN_METHOD(push    : (nonnull NSNumber      )node
                  routeKey: (nonnull NSString     *)routeKey
                  options : (nonnull NSDictionary *)options
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock *)resolve
                  reject : (RCTPromiseRejectBlock  *)reject);


RCT_EXTERN_METHOD(pop    : (nonnull NSNumber      )node
                  options: (nonnull NSDictionary *)options
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

RCT_EXTERN_METHOD(setNavigationBarHidden: (nonnull NSNumber)node
                  isHidden: (nonnull BOOL) isHidden
                  animated: (nonnull BOOL) animated
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock *)resolve
                  reject : (RCTPromiseRejectBlock  *)reject);

RCT_EXTERN_METHOD(popToRoot: (nonnull NSNumber      )node
                  options  : (nonnull NSDictionary *)options
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

RCT_EXTERN_METHOD(removeRoute: (nonnull NSNumber  )node
                  routeKey   : (nonnull NSString *)routeKey
                  routeIndex : (nonnull NSNumber  )routeIndex
                  animated   : (nonnull BOOL      )animated
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

RCT_EXTERN_METHOD(removeRoutes : (nonnull NSNumber )node
                  itemsToRemove: (nonnull NSArray *)itemsToRemove
                  animated     : (nonnull BOOL     )animated
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

RCT_EXTERN_METHOD(replaceRoute  : (nonnull NSNumber  )node
                  prevRouteIndex: (nonnull NSNumber  )prevRouteIndex
                  prevRouteKey  : (nonnull NSString *)prevRouteKey
                  nextRouteKey  : (nonnull NSString *)nextRouteKey
                  animated      : (nonnull BOOL      )animated
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

RCT_EXTERN_METHOD(insertRoute : (nonnull NSNumber  )node
                  nextRouteKey: (nonnull NSString *)nextRouteKey
                  atIndex     : (nonnull NSNumber  )atIndex
                  animated    : (nonnull BOOL      )animated
                  // promise blocks -----------------------
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject : (RCTPromiseRejectBlock )reject);

@end
