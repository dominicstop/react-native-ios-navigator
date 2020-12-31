//
//  RNINavigatorRouteViewManager.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

import Foundation

@objc(RNINavigatorRouteViewManager)
class RNINavigatorRouteViewManager: RCTViewManager {
  
  override static func requiresMainQueueSetup() -> Bool {
    // run init in bg thread
    return false;
  };
  
  override func view() -> UIView! {
    return RNINavigatorView(bridge: self.bridge);
  };
};

