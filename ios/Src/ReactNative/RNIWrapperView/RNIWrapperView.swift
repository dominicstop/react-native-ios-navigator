//
//  RNIWrapperView.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 2/1/21.
//

import UIKit

@objc protocol RNIWrapperViewDelegate: AnyObject {
  @objc optional func onJSComponentWillUnmount(sender: RNIWrapperView, isManuallyTriggered: Bool);
};

/// Holds react views that have been detached, and are no longer managed by RN.
class RNIWrapperView: UIView {
  
  var bridge: RCTBridge!;
  var reactContent: UIView?;
  
  weak var delegate: RNIWrapperViewDelegate?;
  
  private(set) var didTriggerCleanup = false;
  
  /// Determines whether `cleanup` is auto called on JS comp. unmount
  var autoCleanupOnJSUnmount = true;
  
  /// Determines whether `cleanup` is called when this view is removed from the
  /// view hierarchy (i.e. the window ref. becomes nil).
  var autoCleanupOnWindowNil = false;
  
  var autoSetSizeOnLayout = true;
  
  private var touchHandler: RCTTouchHandler!;
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
    self.touchHandler = RCTTouchHandler(bridge: self.bridge);
  };
  
  override func layoutSubviews() {
    super.layoutSubviews();
    
    if self.autoSetSizeOnLayout {
      self.notifyForBoundsChange(self.bounds);
    };
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  override func didMoveToWindow() {
    if self.window == nil && self.autoCleanupOnWindowNil {
      self.cleanup();
    };
  };
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    self.reactContent = subview;
    self.touchHandler.attach(to: subview);
  };
  
  func notifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge    = self.bridge,
          let reactView = self.reactContent
    else { return };
    
    // update react view's size
    bridge.uiManager.setSize(newBounds.size, for: reactView);
  };
  
  func onJSComponentWillUnmount(isManuallyTriggered: Bool){
    if self.window != nil && self.autoCleanupOnJSUnmount {
      self.cleanup();
    };
    
    self.delegate?.onJSComponentWillUnmount?(
      sender: self,
      isManuallyTriggered: isManuallyTriggered
    );
  };
  
  func cleanup(){
    guard !self.didTriggerCleanup else { return };
    self.didTriggerCleanup = true;
    
    self.touchHandler.detach(from: self.reactContent);
    
    RNIUtilities.recursivelyRemoveFromViewRegistry(
      bridge: self.bridge,
      reactView: self
    );
  };
};
