//
//  RNINavigatorRouteViewManager.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

import Foundation

@objc(RNINavigatorRouteViewManager)
class RNINavigatorRouteViewManager: RCTViewManager {
  
  // -------------------
  // MARK: Shared Bridge
  // -------------------
  
  static var sharedBridge: RCTBridge? {
    didSet {
      #if DEBUG
      print("RNINavigatorRouteViewManager, sharedBridge: didSet");
      
      // when RN app reloads, set `sharedBridge` to nil
      NotificationCenter.default.addObserver(Self.self,
        selector: #selector(Self.resetSharedBridge),
        name: NSNotification.Name(rawValue: "RCTBridgeWillReloadNotification"),
        object: nil
      );
      #endif
    }
  };
  
  #if DEBUG
  /// invalidate RCTBridge instance
  @objc static func resetSharedBridge() {
    print("RNINavigatorRouteViewManager: resetSharedBridge...");
    Self.sharedBridge = nil;
  };
  #endif
  
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
    
    return RNINavigatorRouteView(bridge: self.bridge);
  };
};

