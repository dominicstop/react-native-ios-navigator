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
  
  internal static var navigatorViewInstances = NSMapTable<NSNumber, RNINavigatorView>.init(
    keyOptions: .copyIn,
    valueOptions: .weakMemory
  );
  
  public static func getNavigatorViewInstances() -> Array<RNINavigatorView> {
    guard let enumerator = Self.navigatorViewInstances.objectEnumerator()
    else { return [] };
    
    return enumerator.compactMap {
      $0 as? RNINavigatorView;
    };
  };
  
  public static func getNavigatorViewInstance(forNavigatorID key: Int) -> RNINavigatorView? {
    return Self.navigatorViewInstances.object(forKey: key as NSNumber);
  };
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
