//
//  RNINavigatorManager.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/23/21.
//

import Foundation

/// This is singleton class for interacting + configuring the `RNINavigatorView`
public class RNINavigatorManager {
  
  public static let sharedInstance = RNINavigatorManager();
  
  /// The "native" routes to be used in the `NavigatorView`.
  @objc public static var routeRegistry: [String: RNINavigatorRouteBaseViewController.Type] = [:];
  
  /// Contains a map of all the active `RNINavigatorView` instances in the app
  /// (usually there's only 1 navigator for the entire app).
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
    
    #if DEBUG
    print("LOG - RNINavigatorManager: registerNavigatorView"
      + " - for navigatorID: \(navigatorID)"
      + " - instance count: \(self.navigatorViewInstances.count)"
    );
    #endif
  };
  
  public func getNavigatorViewInstances() -> Array<RNINavigatorView> {
    guard let enumerator = self.navigatorViewInstances.objectEnumerator()
    else { return [] };
    
    #if DEBUG
    print("LOG - RNINavigatorManager: getNavigatorViewInstances"
      + " - enumerator: \(enumerator.underestimatedCount)"
    );
    #endif
    
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
