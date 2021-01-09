//
//  RNIUtilities.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/9/21.
//

import Foundation

class RNIUtilities {
  
  /// If you remove a "react view" from the view hierarchy (e.g. via `removeFromSuperview`),
  /// it won't be released, because it's being retained by the `_viewRegistry`
  /// ivar inside the shared `UIManager` (singleton) instance.
  ///
  /// The `_viewRegistry` keeps a ref. to all of the "react views" in the app.
  /// This explains how you can get a ref. to a view via `viewForReactTag` and
  /// `viewForNativeID` (which also means that `reactTag`/`node` is just an index,
  /// i.e. it's just a number that gets inc. everytime a "react view" is added).
  ///
  /// If you are **absolutely sure** that a particular `reactView` is no longer
  /// being used, this helper func. will remove `reactView` (and all of it's
  /// subviews) in the `_viewRegistry`.
  static func recursivelyRemoveFromViewRegistry(bridge: RCTBridge, reactView: UIView) {
    
    /// Get a ref to the `_viewRegistry` ivar in the `RCTUIManager` instance.
    /// Note: Unlike objc properties, ivars are "private" so they aren't
    /// automagically exposed/bridged to swift.
    guard let value = bridge.uiManager.value(forKey: "_viewRegistry"),
          /// Note: key: `NSNumber` (the `reactTag`), and value: `UIView`
          let viewRegistry  = value as? NSMutableDictionary
    else { return };
    
    // recursively remove subviews
    func removeView(_ v: UIView){
      /// if this really is a "react view" then it should have a `reactTag`
      if let reactTag = v.reactTag {
        /// remove this "react view" from `_viewRegistry`
        viewRegistry.removeObject(forKey: reactTag);
        
        #if DEBUG
        print("LOG - RNIUtilities: recursivelyRemoveFromViewRegistry"
          + " - for reactTag: \(reactTag)"
        );
        #endif
      };
      
      /// remove other subviews...
      for subview in v.subviews {
        removeView(subview);
        subview.removeReactSubview(subview);
      };
      
      /// remove other react subviews...
      if let reactView = v.reactSubviews() {
        for subview in reactView {
          removeView(subview);
          subview.removeReactSubview(subview);
        };
      };
    };
    
    DispatchQueue.main.async {
      // start recursively removing views...
      removeView(reactView);
    };
  };
};
