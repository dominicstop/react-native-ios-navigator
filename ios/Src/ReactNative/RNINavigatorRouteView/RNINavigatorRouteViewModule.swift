//
//  RNINavigatorRouteViewModule.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/21/21.
//

import Foundation


@objc(RNINavigatorRouteViewModule)
class RNINavigatorRouteViewModule: NSObject {
  
  static func getNavBarItem(_ node: NSNumber) -> RNIRouteNavBarItemView? {
    guard let bridge     = RNIRouteNavBarItemViewManager.sharedBridge,
          let view       = bridge.uiManager?.view(forReactTag: node),
          let navBarItem = view as? RNIRouteNavBarItemView
    else { return nil };
    
    return navBarItem;
  };
  
  static func getRouteView(_ node: NSNumber) -> RNINavigatorRouteView? {
    guard let bridge    = RNINavigatorRouteViewManager.sharedBridge,
          let view      = bridge.uiManager?.view(forReactTag: node),
          let routeView = view as? RNINavigatorRouteView
    else { return nil };
    
    return routeView;
  };
  
  // ---------------------
  // MARK: Module Commands
  // ---------------------
  
  @objc func registerNativeComponent(
    _ node  : NSNumber,
    compNode: NSNumber,
    nativeID: NSString,
    resolve : @escaping RCTPromiseResolveBlock,
    reject  : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      guard let routeView  = Self.getRouteView(node),
            let navBarItem = Self.getNavBarItem(compNode)
      else {
        // construct error message for promise
        let errorMessage = (
            "NativeModule, RNINavigatorRouteViewModule: registerNativeComponent"
          + " - for node: \(node)"
          + " - for compNode: \(compNode)"
          + " - Error: guard check failed"
          + " - no corresponding manager found for node"
        );
        
        #if DEBUG
        print("LOG - \(errorMessage)");
        #endif
        
        // reject promise w/: code, message, error
        reject("LIB_ERROR", errorMessage, nil);
        return;
      };
      
      #if DEBUG
      print("LOG - NativeModule, RCTPopoverViewModule: registerNativeComponent"
        + " - for node: \(node)"
      );
      #endif
      
      routeView.registerNativeComponent(
        nativeID : nativeID as String,
        component: navBarItem
      );
      
      resolve([:]);
    };
  };
};
