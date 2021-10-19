//
//  RNINavigatorRouteHeaderViewManager.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 4/14/21.
//

import Foundation

@objc(RNINavigatorRouteHeaderViewManager)
internal class RNINavigatorRouteHeaderViewManager: RCTViewManager, RCTInvalidating {
  
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
    
    return RNINavigatorRouteHeaderView(bridge: self.bridge);
  };
  
  override func shadowView() -> RCTShadowView! {
    return RNINavigatorRouteHeaderShadowView();
  };
  
  @objc func invalidate(){
    /// reset ref to RCTBridge instance
    Self.sharedBridge = nil;
  };
};
