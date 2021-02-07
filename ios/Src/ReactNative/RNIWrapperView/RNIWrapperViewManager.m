//
//  RNIWrapperViewManager.m
//  IosNavigatorExample
//
//  Created by Dominic Go on 2/1/21.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNIWrapperViewManager, RCTViewManager)

RCT_EXTERN_METHOD(notifyComponentWillUnmount:(nonnull NSNumber *)node
                  params:(nonnull NSDictionary *)count);


@end

