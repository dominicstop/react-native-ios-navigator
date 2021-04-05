//
//  RNINavigatorRouteRegistry.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/23/21.
//

import Foundation

/// Register native routes
public class RNINavigator {
  
  @objc public static var routeRegistry: [String: RNINavigatorRouteBaseViewController.Type] = [:];
  
};

/// Send commands to the `RNINavigatorView` instance
public protocol RNINavigatorNativeCommands: AnyObject {
  
  func pushViewController(
    _ viewController: RNINavigatorRouteBaseViewController,
    animated: Bool
  );
  
  func push(
    routeKey: String,
    routeProps: Dictionary<String, Any>?,
    animated: Bool	
  );
  
  func pop(animated: Bool);
  
};
