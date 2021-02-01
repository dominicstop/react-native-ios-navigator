//
//  RNIWrapperView.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 2/1/21.
//

import UIKit

class RNIWrapperView: UIView {
  
  var bridge: RCTBridge?;
  var reactContent: UIView?;
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
  };
  
  override func layoutSubviews() {
    super.layoutSubviews();
    self.notifyForBoundsChange(self.bounds);
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    self.reactContent = subview;
  };
  
  func notifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge    = self.bridge,
          let reactView = self.reactContent
    else { return };
    
    // update react view's size
    bridge.uiManager.setSize(newBounds.size, for: reactView);
  };
};
