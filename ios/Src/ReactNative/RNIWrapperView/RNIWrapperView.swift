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
internal class RNIWrapperView: UIView {
  
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
  
  var willChangeSuperview = false;
  private var didChangeSuperview = false;
  
  private var touchHandler: RCTTouchHandler!;
  
  // ---------------------
  // MARK:- Init/Lifecycle
  // ---------------------
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
    self.touchHandler = RCTTouchHandler(bridge: self.bridge);
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  override func layoutSubviews() {
    super.layoutSubviews();
    
    if self.autoSetSizeOnLayout {
      self.notifyForBoundsChange(self.bounds);
    };
  };
  
  override func didMoveToWindow() {
    #if DEBUG
    print("LOG - RNIWrapperView, didMoveToWindow"
      + " - for nativeID: \(self.nativeID ?? "N/A")"
      + " - willChangeSuperview: \(self.willChangeSuperview)"
      + " - didChangeSuperview: \(self.didChangeSuperview)"
      + " - self.window is nil: \(self.window == nil)"
      + " - self.superview is nil: \(self.superview == nil)"
      + " - autoCleanupOnJSUnmount == nil: \(self.autoCleanupOnJSUnmount)"
    );
    #endif
    
    /// * if `willChangeSuperview` is true, don't allow cleanup until
    ///   `didChangeSuperview` is also true.
    /// * Otherwise, if `willChangeSuperview` is false, allow cleanup.
    let triggerCleanup = self.willChangeSuperview ? self.didChangeSuperview : true;
    
    if self.window == nil, self.autoCleanupOnWindowNil, triggerCleanup {
      #if DEBUG
      print("LOG - RNIWrapperView, didMoveToWindow"
        + " - for nativeID: \(self.nativeID ?? "N/A")"
        + " - trigger cleanup"
      );
      #endif
      
      self.cleanup();
    };
    
    if self.window == nil, self.willChangeSuperview {
      self.didChangeSuperview = true;
    };
  };
  
  // ----------------------
  // MARK:- React Lifecycle
  // ----------------------
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    self.reactContent = subview;
    self.touchHandler.attach(to: subview);
  };
  
  // -------------------------
  // MARK:- Internal Functions
  // -------------------------
  
  func notifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge = self.bridge,
          let reactView = self.reactContent
    else { return };
    
    bridge.uiManager.setSize(newBounds.size, for: reactView);
  };
  
  func onJSComponentWillUnmount(isManuallyTriggered: Bool){
    if self.window != nil && self.autoCleanupOnJSUnmount {
      #if DEBUG
      print("LOG - RNIWrapperView, onJSComponentWillUnmount"
        + " - for nativeID: \(self.nativeID ?? "N/A")"
        + " - trigger cleanup"
        + " - autoCleanupOnWindowNil == nil: \(self.autoCleanupOnWindowNil)"
      );
      #endif
      
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
