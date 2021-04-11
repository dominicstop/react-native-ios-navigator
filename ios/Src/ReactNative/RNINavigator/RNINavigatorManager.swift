//
//  RNINavigatorManager.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/23/21.
//

import Foundation

/// Register native routes
public class RNINavigatorManager {
  
  public static let sharedInstance = RNINavigatorManager();
  
  /// The "native" routes to be used in the `NavigatorView`
  @objc public static var routeRegistry: [String: RNINavigatorRouteBaseViewController.Type] = [:];
  
  private var navigatorViewInstances = NSMapTable<NSNumber, RNINavigatorView>.init(
    keyOptions: .copyIn,
    valueOptions: .weakMemory
  );
  
  public var delegate: RNINavigatorManagerDelegate?;
  
  internal func registerNavigatorView(
    _ instance: RNINavigatorView,
    forNavigatorID navigatorID: NSNumber
  ){
    self.navigatorViewInstances.setObject(instance, forKey: navigatorID);
    self.delegate?.onNavigatorViewAdded(instance, navigatorID.intValue);
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

public protocol RNINavigatorManagerDelegate {
  func onNavigatorViewAdded(_ navigatorView: RNINavigatorView, _ navigatorID: Int);
};
