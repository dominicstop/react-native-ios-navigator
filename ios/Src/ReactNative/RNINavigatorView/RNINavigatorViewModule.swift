//
//  RNINavigatorViewModule.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/4/21.
//

import Foundation

@objc(RNINavigatorViewModule)
class RNINavigatorViewModule: NSObject {
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return false;
  };
  
  // TODO: Add options param
  @objc func push(
    _ node  : NSNumber,
    routeKey: NSString,
    resolve : @escaping RCTPromiseResolveBlock,
    reject  : @escaping RCTPromiseRejectBlock
  ){
    // get shared bridge instance from view manager
    guard let bridge = RNINavigatorViewManager.sharedBridge
    else { return };
    
    DispatchQueue.main.async {
      // get view instance that matches node/reactTag
      guard let view          = bridge.uiManager?.view(forReactTag: node),
            let navigatorView = view as? RNINavigatorView
      else {
        // construct error message for promise
        let errorMessage = (
            "NativeModule, RCTPopoverViewModule: push"
          + " - with params - node: \(node)"
          + " - routeKey: \(routeKey)"
          + " - Error: guard check failed"
          + " - could not get `RNINavigatorView` instance"
        );
        
        #if DEBUG
        print("LOG - \(errorMessage)");
        #endif
        
        // reject promise w/: code, message, error
        reject("LIB_ERROR", errorMessage, nil);
        return;
      };
      
      #if DEBUG
      print("LOG - NativeModule, RCTPopoverViewModule: push"
        + " - with params - node: \(node)"
        + " - routeKey: \(routeKey)"
      );
      #endif
      
      // forward push command to navigator
      navigatorView.push(routeKey: routeKey);
      
      // resolve promise
      resolve([:]);
    };
  };
};
