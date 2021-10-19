//
//  RNINavigatorViewManager.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import Foundation

@objc(RNINavigatorViewManager)
internal class RNINavigatorViewManager: RCTViewManager, RCTInvalidating {
  
  static var sharedBridge: RCTBridge?;
  
  // MARK: - RN Module Setup
  // ----------------------

  override static func requiresMainQueueSetup() -> Bool {
    // run init in bg thread
    return true;
  };
  
  override func view() -> UIView! {
    // save a ref to this module's RN bridge instance
    if Self.sharedBridge == nil {
      Self.sharedBridge = self.bridge;
    };
    
    // send a ref to bridge instance
    return RNINavigatorView(bridge: self.bridge);
  };
  
  override func constantsToExport() -> [AnyHashable : Any]! {
    let navController = UINavigationController();
    let navigationBar = navController.navigationBar;
    
    let navBarHeight = navigationBar.frame.height;
    
    return ["navigationBarHeight": navBarHeight];
  };
  
  // MARK: - RCTInvalidating
  // ----------------------
  
  func invalidate() {
    // reset ref to RCTBridge instance
    Self.sharedBridge = nil;
    
    // cleanup - remove all current navigators
    RNINavigatorManager.sharedInstance.cleanup();
  };
};
