//
//  RNINavigatorViewManager.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import Foundation

@objc(RNINavigatorViewManager)
class RNINavigatorViewManager: RCTViewManager {
  
  // ----------------------
  // MARK: Shared Instances
  // ----------------------
  
  static weak var sharedBridge: RCTBridge? {
    didSet {
      #if DEBUG
      print("RNINavigatorViewManager, sharedBridge: didSet");
      
      // when RN app reloads, set `sharedBridge` to nil
      NotificationCenter.default.addObserver(Self.self,
        selector: #selector(Self.resetSharedBridge),
        name: NSNotification.Name(rawValue: "RCTBridgeWillReloadNotification"),
        object: nil
      );
      #endif
    }
  };
  
  /// invalidate RCTBridge instance
  @objc static func resetSharedBridge() {
    #if DEBUG
    print("RNINavigatorViewManager: resetSharedBridge...");
    #endif
    Self.sharedBridge = nil;
  };
  
  // ---------------------
  // MARK: RN Module Setup
  // ---------------------

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
