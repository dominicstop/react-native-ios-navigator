//
//  RNINavigatorViewManager.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import Foundation

@objc(RNINavigatorViewManager)
class RNINavigatorViewManager: RCTViewManager {
  
  override static func requiresMainQueueSetup() -> Bool {
    // run init in bg thread
    return false;
  };
  
  override func view() -> UIView! {
    return RNINavigatorView(bridge: self.bridge);
  };
};
