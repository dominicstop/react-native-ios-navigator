//
//  RNINavigatorRouteViewManager.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

import Foundation

@objc(RNINavigatorRouteViewManager)
internal class RNINavigatorRouteViewManager: RCTViewManager, RCTInvalidating {
  
  static var sharedBridge: RCTBridge?;
  
  // MARK: - RN Module Setup
  // ----------------------
  
  override static func requiresMainQueueSetup() -> Bool {
    // run init in bg thread
    return false;
  };
  
  override func view() -> UIView! {
    // save a ref to this module's RN bridge instance
    if Self.sharedBridge == nil {
      Self.sharedBridge = self.bridge;
    };
    
    return RNINavigatorRouteView(bridge: self.bridge);
  };
  
  // MARK: - RCTInvalidating
  // ----------------------
  
  @objc func invalidate(){
    /// reset ref to RCTBridge instance
    Self.sharedBridge = nil;
  };
};

