//
//  RNINavigatorRouteViewModule.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/24/21.
//

import Foundation


@objc(RNINavigatorRouteViewModule)
internal class RNINavigatorRouteViewModule: NSObject {
  
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
      guard let routeView = RNIUtilities.getView(
              forNode: node,
              type   : RNINavigatorRouteView.self,
              bridge : RNINavigatorRouteViewManager.sharedBridge
            ),
            let routeVC = routeView.routeVC
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

