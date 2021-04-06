//
//  RNINavigatorRouteRegistry.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/23/21.
//

import Foundation

/// Register native routes
public class RNINavigator {
  
  public static let sharedInstance = RNINavigator();
  
  /// The "native" routes to be used in the `NavigatorView`
  @objc public static var routeRegistry: [String: RNINavigatorRouteBaseViewController.Type] = [:];
  
  private var navigatorViewInstances = NSMapTable<NSNumber, RNINavigatorView>.init(
    keyOptions: .copyIn,
    valueOptions: .weakMemory
  );
  
  public var delegate: RNINavigatorDelegate?;
  
  internal func registerNavigatorView(_ instance: RNINavigatorView, forRouteID routeID: NSNumber){
    self.navigatorViewInstances.setObject(instance, forKey: routeID);
    self.delegate?.onNavigatorViewAdded(instance);
  };
  
  public func getNavigatorViewInstances() -> Array<RNINavigatorView> {
    guard let enumerator = self.navigatorViewInstances.objectEnumerator()
    else { return [] };
    
    return enumerator.compactMap {
      $0 as? RNINavigatorView;
    };
  };
  
  public func getNavigatorViewInstance(forNavigatorID key: Int) -> RNINavigatorView? {
    return self.navigatorViewInstances.object(forKey: key as NSNumber);
  };
};

public protocol RNINavigatorDelegate {
  func onNavigatorViewAdded(_ navigatorView: RNINavigatorView);
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
