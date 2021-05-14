//
//  RNINavigatorRouteViewModule.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/24/21.
//

import Foundation


@objc(RNINavigatorRouteViewModule)
internal class RNINavigatorRouteViewModule: NSObject {
  
  @objc var bridge: RCTBridge!;
  
  func getRouteView(_ node: NSNumber) -> RNINavigatorRouteView? {
    return RNIUtilities.getView(
      forNode: node,
      type   : RNINavigatorRouteView.self,
      bridge : self.bridge
    );
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
      guard let routeView = self.getRouteView(node),
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
  
  @objc func getRouteConstants(
    _ node : NSNumber,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorRouteView` instance that matches node/reactTag
        guard let routeView = self.getRouteView(node) else {
          // construct error message for promise
          let errorMessage = (
              "NativeModule, RNINavigatorRouteViewModule: getConstants"
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
        print("LOG - NativeModule, RNINavigatorRouteViewModule: getRouteConstants"
          + " - for node: \(node)"
        );
        #endif
        
        try routeView.getConstants() {
          resolve($0);
        };
        
      } catch {
        let message = RNIError.constructErrorMessage(error);
        
        #if DEBUG
        print("ERROR - \(message)");
        #endif
        
        // reject promise w/: code, message, error
        reject("LIB_ERROR", message, nil);
      };
    };
  };
};

