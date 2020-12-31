//
//  RNINavigatorRouteView.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

import UIKit;

class RNINavigatorRouteView: UIView {
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  weak var bridge: RCTBridge!;
  
  // ----------------
  // MARK: Initialize
  // ----------------
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
};
