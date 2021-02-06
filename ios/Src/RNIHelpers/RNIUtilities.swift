//
//  RNIUtilities.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/9/21.
//

import Foundation;

/// Refs to the shared/singleton instances.
///
/// Note: Getting a ref. to a particular `RCTModule` requires having a ref.
/// to `RCTBridge`. So you either have to pass `RCTBridge` or the `RCTModule`
/// around if you want to use it, which is a bit inconvenient, so we save a ref.
/// to module.
class RNISharedInstances {
  static weak var imageLoader: RCTImageLoader?;
};

class RNIUtilities {
  
  /// If you remove a "react view" from the view hierarchy (e.g. via
  /// `removeFromSuperview`), it won't be released, because it's being retained
  /// by the `_viewRegistry` ivar in the shared `UIManager` (singleton) instance.
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
          /// Note - key: `NSNumber` (the `reactTag`), and value: `UIView`
          let viewRegistry = value as? NSMutableDictionary
    else { return };
    
    // recursively remove subviews
    func removeView(_ v: UIView){
      /// if this really is a "react view" then it should have a `reactTag`
      if let reactTag = v.reactTag {
        v.removeFromSuperview();
        
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
      };
      
      /// remove other react subviews...
      if let reactView = v.reactSubviews() {
        for subview in reactView {
          removeView(subview);
        };
      };
    };
    
    DispatchQueue.main.async {
      // start recursively removing views...
      removeView(reactView);
    };
  };
  
  /// Get a ref. to the shared/singleton `RCTImageLoader` module instance.
  static func getImageLoader(bridge: RCTBridge) -> RCTImageLoader {
    
    if RNISharedInstances.imageLoader == nil,
       let module      = bridge.module(for: RCTImageLoader.self),
       let imageLoader = module as? RCTImageLoader {
      
      // init. `SharedInstance` for the first time
      RNISharedInstances.imageLoader = imageLoader;
      return imageLoader;
    };
    
    return RNISharedInstances.imageLoader!;
  };
  
  // Note: Before using this, make sure you have `getImageLoader` in your
  // component/module's init.
  static func loadImage(dict: NSDictionary, completion: @escaping RCTImageLoaderCompletionBlock){
    guard let imageLoader = RNISharedInstances.imageLoader,
          let imageSource = RCTConvert.rctImageSource(dict)
    else { return };
  
    DispatchQueue.global(qos: .default).async {
      imageLoader.loadImage(with: imageSource.request, callback: completion);
    };
  };
};
