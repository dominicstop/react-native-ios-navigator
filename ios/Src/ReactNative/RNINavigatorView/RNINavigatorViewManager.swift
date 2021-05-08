//
//  RNINavigatorViewManager.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import Foundation

@objc(RNINavigatorViewManager)
internal class RNINavigatorViewManager: RCTViewManager {
  
  // --------------------
  // MARK:- Shared Bridge
  // --------------------
  
  private static var didSetObserver = false;
  
  static weak var sharedBridge: RCTBridge? {
    willSet {
      #if DEBUG
      let key = NSNotification.Name(rawValue: "RCTBridgeWillReloadNotification");
      
      if !Self.didSetObserver {
        // bridge set, listen for bridge reload
        NotificationCenter.default.addObserver(Self.self,
          selector: #selector(Self.onRCTBridgeWillReloadNotification),
          name: key,
          object: nil
        );
      };
      #endif
    }
  };
  
  #if DEBUG
  @objc static func onRCTBridgeWillReloadNotification(_ notification: Notification) {
    /// reset RCTBridge instance
    Self.sharedBridge = nil;
  };
  #endif
  
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
