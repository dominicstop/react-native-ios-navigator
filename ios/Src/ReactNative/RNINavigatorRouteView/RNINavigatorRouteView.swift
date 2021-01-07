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
  
  /** content to show in the navigator */
  var reactView: UIView?;
  
  // -----------------------
  // MARK: RN Exported Props
  // -----------------------
  
  @objc var routeKey: NSString? {
    didSet {
      guard let routeKey = self.routeKey else { return };
      
      #if DEBUG
      print("LOG - NativeView, RNINavigatorRouteView prop"
        + " - didSet, routeKey: \(routeKey)"
      );
      #endif
    }
  };
  
  @objc var routeIndex: NSNumber? {
    didSet {
      guard let routeIndex = self.routeIndex else { return };
      #if DEBUG
      print("LOG - NativeView, RNINavigatorRouteView prop"
        + " - didSet, routeIndex: \(routeIndex)"
      );
      #endif
    }
  };
  
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
  
  // ------------------
  // MARK: RN Lifecycle
  // ------------------
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    /// `RNINavigatorRouteView` will only ever receive 1 child, and that child
    /// is the content to show in the navigator
    if atIndex == 0 {
      self.reactView = subview;
    };
  };
  
  // ----------------------
  // MARK: Public Functions
  // ----------------------
  
  func notifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge    = self.bridge,
          let reactView = self.reactView
    else { return };
    
    // update react view's size
    bridge.uiManager.setSize(newBounds.size, for: reactView);
  };
};
