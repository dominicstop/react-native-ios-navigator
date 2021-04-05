//
//  RouteRegistry.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 4/6/21.
//

import Foundation
import react_native_ios_navigator

@objc class RouteRegistry: NSObject {
  @objc static func registerRoutes(){
    print("register routes");
    
    RNINavigator.routeRegistry["TestNativeRoute"] =
      RNIExampleRouteViewController.self;
  };
};
