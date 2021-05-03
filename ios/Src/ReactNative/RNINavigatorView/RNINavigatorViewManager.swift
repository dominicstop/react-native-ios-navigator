//
//  RNINavigatorViewManager.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import Foundation

@objc(RNINavigatorViewManager)
internal class RNINavigatorViewManager: RCTViewManager {
  
  static weak var sharedBridge: RCTBridge?;
  
  // ----------------------
  // MARK:- RN Module Setup
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
    
    // send a ref to bridge instance
    return RNINavigatorView(bridge: self.bridge);
  };
};
