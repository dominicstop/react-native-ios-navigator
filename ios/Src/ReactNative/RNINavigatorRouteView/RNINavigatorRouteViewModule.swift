//
//  RNINavigatorRouteViewModule.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/24/21.
//

import Foundation


@objc(RNINavigatorRouteViewModule)
class RNINavigatorRouteViewModule: NSObject {
  
  static func getRouteView(_ node: NSNumber) -> RNINavigatorRouteView? {
    // get shared bridge instance from view manager
    guard let bridge    = RNINavigatorRouteViewManager.sharedBridge,
          let view      = bridge.uiManager?.view(forReactTag: node),
          let routeView = view as? RNINavigatorRouteView
    else { return nil };
    
    return routeView;
  };
  
  // ----------------------
  // MARK:- Module Commands
  // ----------------------
    
  @objc func setHidesBackButton(
    _ node  : NSNumber,
    isHidden: Bool,
    animated: Bool,
    resolve : @escaping RCTPromiseResolveBlock,
    reject  : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      // get `RNINavigatorRouteView` instance that matches node/reactTag
      guard let routeView = Self.getRouteView(node),
            let routeVC    = routeView.routeVC
      else {
        // construct error message for promise
        let errorMessage = (
            "NativeModule, RNINavigatorRouteViewModule: setHidesBackButton"
          + " - for node: \(node)"
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
      print("LOG - NativeModule, RNINavigatorRouteViewModule: setHidesBackButton"
        + " - for node: \(node)"
      );
      #endif
      
      routeVC.navigationItem.setHidesBackButton(isHidden, animated: animated){
        resolve([:]);
      };
    };
  };
};

