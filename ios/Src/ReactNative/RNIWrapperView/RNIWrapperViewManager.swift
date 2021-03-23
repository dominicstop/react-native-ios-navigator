//
//  RNIWrapperViewManager.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 2/1/21.
//

import Foundation

@objc(RNIWrapperViewManager)
internal class RNIWrapperViewManager: RCTViewManager {
  
  static func getWrapperView(_ node: NSNumber) -> RNIWrapperView? {
    // get shared bridge instance from view manager
    guard let bridge      = RNIWrapperViewManager.sharedBridge,
          let view        = bridge.uiManager?.view(forReactTag: node),
          let wrapperView = view as? RNIWrapperView
    else { return nil };
    
    return wrapperView;
  };
  
  // --------------------
  // MARK:- Shared Bridge
  // --------------------
  
  static var sharedBridge: RCTBridge? {
    didSet {
      #if DEBUG
      print("RNIWrapperViewManager, sharedBridge: didSet");
      
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
    print("RNIWrapperViewManager: resetSharedBridge...");
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
    
    return RNIWrapperView(bridge: self.bridge);
  };
  
  //
  
  @objc func notifyComponentWillUnmount(_ node: NSNumber, params: NSDictionary){
    DispatchQueue.main.async {
      // get `RNIWrapperView` instance that matches node/reactTag
      guard let wrapperView = Self.getWrapperView(node) else {
        #if DEBUG
        print(
            "LOG - ViewManager, RNIWrapperViewManager: notifyComponentWillUnmount"
          + " - for node: \(node)"
          + " - Error: guard check failed"
          + " - no corresponding view found for node"
        );
        #endif
        return;
      };
      
      wrapperView.onJSComponentWillUnmount(
        isManuallyTriggered: params["isManuallyTriggered"] as? Bool ?? false
      );
    };
  };
};

