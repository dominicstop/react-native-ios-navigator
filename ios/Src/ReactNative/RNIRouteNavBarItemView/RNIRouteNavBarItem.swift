//
//  RNIRouteNavBarItemView.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/21/21.
//

import UIKit

class RNIRouteNavBarItemView: UIView {
  // ----------------
  // MARK: Properties
  // ----------------
  
  /// ref to the RN view manager singleton's bridge instance
  weak var bridge: RCTBridge!;
  
  var reactContent: UIView!;
  
  // --------------------
  // MARK: Init/Lifecycle
  // --------------------
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    self.bridge = bridge;
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  // ------------------
  // MARK: RN Lifecycle
  // ------------------
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    if atIndex == 0 {
      self.reactContent = subview;
    };
  };
};
