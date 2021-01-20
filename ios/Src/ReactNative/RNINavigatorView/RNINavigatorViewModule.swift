//
//  RNINavigatorViewModule.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/4/21.
//

import Foundation


@objc(RNINavigatorViewModule)
class RNINavigatorViewModule: NSObject {
  
  static func getNavigatorView(_ node: NSNumber) -> RNINavigatorView? {
    // get shared bridge instance from view manager
    guard let bridge  = RNINavigatorViewManager.sharedBridge,
          let view    = bridge.uiManager?.view(forReactTag: node),
          let navView = view as? RNINavigatorView
    else { return nil };
    
    return navView;
  };
  
  // ---------------------
  // MARK: Module Commands
  // ---------------------
  
  // TODO: Add options param
  @objc func push(
    _ node  : NSNumber,
    routeKey: NSString,
    resolve : @escaping RCTPromiseResolveBlock,
    reject  : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      // get `RNINavigatorView` instance that matches node/reactTag
      guard let navigatorView = Self.getNavigatorView(node) else {
        // construct error message for promise
        let errorMessage = (
            "NativeModule, RNINavigatorViewModule: push"
          + " - for node: \(node)"
          + " - with params - routeKey: \(routeKey)"
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
      print("LOG - NativeModule, RNINavigatorViewModule: push"
        + " - for node: \(node)"
        + " - with params - routeKey: \(routeKey)"
      );
      #endif
      
      // forward push command to navigator
      navigatorView.push(routeKey: routeKey){
        // resolve promise after "push" is complete
        resolve([:]);
      };
    };
  };
  
  // TODO: Add options param
  @objc func pop(
    _ node  : NSNumber,
    resolve : @escaping RCTPromiseResolveBlock,
    reject  : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      // get `RNINavigatorView` instance that matches node/reactTag
      guard let navigatorView = Self.getNavigatorView(node) else {
        // construct error message for promise
        let errorMessage = (
            "NativeModule, RNINavigatorViewModule: pop"
          + " - for node: \(node)"
          + " - Error: guard check failed"
          + " - no corresponding manager found for node"
          + " - make sure that `setNode` command is called first."
        );
        
        #if DEBUG
        print("LOG - \(errorMessage)");
        #endif
        
        // reject promise w/: code, message, error
        reject("LIB_ERROR", errorMessage, nil);
        return;
      };
      
      #if DEBUG
      print("LOG - NativeModule, RNINavigatorViewModule: pop"
        + " - for node: \(node)"
      );
      #endif
      
      // forward "pop" command to navigator
      navigatorView.pop(){
        // resolve promise after "pop" is complete
        resolve([
          "routeKey"  : $0,
          "routeIndex": $1
        ]);
      };
    };
  };
  
  @objc func setNavigationBarHidden(
    _ node  : NSNumber,
    isHidden: Bool,
    animated: Bool,
    resolve : @escaping RCTPromiseResolveBlock,
    reject  : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      // get `RNINavigatorView` instance that matches node/reactTag
      guard let navigatorView = Self.getNavigatorView(node) else {
        // construct error message for promise
        let errorMessage = (
            "NativeModule, RNINavigatorViewModule: setNavigationBarHidden"
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
      print("LOG - NativeModule, RNINavigatorViewModule: setNavigationBarHidden"
        + " - for node: \(node)"
      );
      #endif
      
      navigatorView.navigationVC.setNavigationBarHidden(isHidden, animated: animated){
        resolve([:]);
      };
    };
  };
};
