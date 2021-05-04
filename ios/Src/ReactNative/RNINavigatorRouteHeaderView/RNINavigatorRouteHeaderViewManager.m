//
//  RNINavigatorRouteHeaderViewManager.m
//  react-native-ios-navigator
//
//  Created by Dominic Go on 4/14/21.
//

#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNINavigatorRouteHeaderViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(config, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(headerTopPadding, NSString);

@end

