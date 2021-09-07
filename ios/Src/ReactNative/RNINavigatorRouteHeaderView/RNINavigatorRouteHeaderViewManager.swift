//
//  RNINavigatorRouteHeaderViewManager.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 4/14/21.
//

import Foundation

@objc(RNINavigatorRouteHeaderViewManager)
internal class RNINavigatorRouteHeaderViewManager: RCTViewManager {
  
  // MARK:- Shared Bridge
  // --------------------
  
  static var sharedBridge: RCTBridge? {
    didSet {
      #if DEBUG
      print("RNINavigatorRouteHeaderViewManager, sharedBridge: didSet");
      
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
  /// reset RCTBridge instance
  @objc static func resetSharedBridge() {
    print("RNIWrapperViewManager: resetSharedBridge...");
    Self.sharedBridge = nil;
  };
  #endif
  
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
    
    return RNINavigatorRouteHeaderView(bridge: self.bridge);
  };
  
  override func shadowView() -> RCTShadowView! {
    return RNINavigatorRouteHeaderShadowView();
  };
};
