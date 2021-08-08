//
//  RNIUtilities.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/9/21.
//

import Foundation;


internal class RNIUtilities {
  
  /// If you remove a "react view" from the view hierarchy (e.g. via
  /// `removeFromSuperview`), it won't be released, because it's being retained
  /// by the `_viewRegistry` ivar in the shared `UIManager` (singleton) instance.
  ///
  /// The `_viewRegistry` keeps a ref. to all of the "react views" in the app.
  /// This explains how you can get a ref. to a view via `viewForReactTag` and
  /// `viewForNativeID` (which also means that `reactTag`/`node` is just an index,
  /// i.e. it's just a number that gets inc. every-time a "react view" is added).
  ///
  /// If you are **absolutely sure** that a particular `reactView` is no longer
  /// being used, this helper func. will remove `reactView` (and all of it's
  /// subviews) in the `_viewRegistry`.
  static func recursivelyRemoveFromViewRegistry(bridge: RCTBridge, reactView: UIView) {
    
    func getRegistry(forKey key: String) -> NSMutableDictionary? {
      return bridge.uiManager.value(forKey: key) as? NSMutableDictionary;
    };
    
    /// Get a ref to the `_viewRegistry` and `_shadowViewRegistry` ivar in the
    /// `RCTUIManager` instance.
    /// * Note: Unlike objc properties, ivars are "private" so they aren't
    ///   automagically exposed/bridged to swift.
    /// * Note: key: `NSNumber` (the `reactTag`), and value: `UIView`
    guard let viewRegistry       = getRegistry(forKey: "_viewRegistry"),
          let shadowViewRegistry = getRegistry(forKey: "_shadowViewRegistry")
    else { return };
    
    #if DEBUG
    // Protect from: Thread 1: EXC_BAD_ACCESS 
    let prevCountViewRegistry       = NSDictionary(dictionary: viewRegistry).count;
    let prevCountShadowViewRegistry = NSDictionary(dictionary: shadowViewRegistry).count;
    
    var removedViews: [NSNumber] = [];
    #endif
    
    func removeView(_ v: UIView){
      /// if this really is a "react view" then it should have a `reactTag`
      if let reactTag = v.reactTag,
         viewRegistry[reactTag] != nil {
        
        #if DEBUG
        removedViews.append(reactTag);
        #endif
        
        /// remove from view hierarchy
        v.removeFromSuperview();
        
        /// remove this "react view" from the registry
        viewRegistry      .removeObject(forKey: reactTag);
        shadowViewRegistry.removeObject(forKey: reactTag);
      };
      
      /// remove other subviews...
      v.subviews.forEach {
        removeView($0);
      };
      
      /// remove other react subviews...
      v.reactSubviews()?.forEach {
        removeView($0);
      };
    };
    
    DispatchQueue.main.async {
      // start recursively removing views...
      removeView(reactView);
      
      RCTSharedApplication()

      #if DEBUG
      let nextCountViewRegistry       = viewRegistry      .allValues.count;
      let nextCountShadowViewRegistry = shadowViewRegistry.allValues.count;
      
      print("LOG - RNIUtilities: recursivelyRemoveFromViewRegistry"
        + " - removedViews count: \(removedViews.count)"
        + " - prevCountViewRegistry: \(prevCountViewRegistry)"
        + " - prevCountShadowViewRegistry: \(prevCountShadowViewRegistry)"
        + " - nextCountViewRegistry: \(nextCountViewRegistry)"
        + " - nextCountShadowViewRegistry: \(nextCountShadowViewRegistry)"
      );
      #endif
    };
  };
  
  /// Recursive climb the responder chain until `T` is found.
  /// Useful for finding the corresponding view controller of a view.
  static func getParent<T>(responder: UIResponder, type: T.Type) -> T? {
    var parentResponder: UIResponder? = responder;
    
    while parentResponder != nil {
      parentResponder = parentResponder?.next;
      
      if let parent = parentResponder as? T {
        return parent;
      };
    };
    
    return nil;
  };
  
  static func getView<T>(
    forNode node: NSNumber,
    type: T.Type,
    bridge: RCTBridge?
  ) -> T? {
    guard let bridge = bridge,
          let view   = bridge.uiManager?.view(forReactTag: node)
    else { return nil };
    
    return view as? T;
  };
  
  static func recursivelyGetAllSubviews(for view: UIView) -> [UIView] {
    var views: [UIView] = [];
    
    for subview in view.subviews {
      views += Self.recursivelyGetAllSubviews(for: subview);
      views.append(subview);
    };

    return views;
  };
  
  static func compareImages(_ a: UIImage?, _ b: UIImage?) -> Bool {
    if (a == nil && b == nil){
      // both are nil, equal
      return true;
      
    } else if a == nil || b == nil {
      // one is nil, not equal
      return false;
      
    } else if a == b {
      // same ref to the object, true
      return true;
      
    } else if a!.size != b!.size {
      // size diff, not equal
      return false;
    };
    
    // compare raw data
    return a!.isEqual(b!);
  };
};

