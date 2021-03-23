//
//  RNINavigatorRouteRegistry.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/23/21.
//

import Foundation

/// Register native routes
public class RNINavigator {
  
  #if DEBUG
  @objc static var routeRegistry: [String: RNINavigatorRouteBaseViewController.Type] =
    ["TestNativeRoute": RNIExampleRouteViewController.self];
  #else
  @objc static var routeRegistry: [String: RNINavigatorRouteBaseViewController.Type] = [:];
  #endif
  
};
