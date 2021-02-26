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
  
  // ----------------------
  // MARK:- Module Commands
  // ----------------------
  
  @objc func push(
    _ node  : NSNumber,
    routeKey: NSString,
    options : NSDictionary,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = Self.getNavigatorView(node) else {
          throw RNIError.commandFailed(
            source : "RNINavigatorViewModule.push",
            message:
                "Unable to `push` because no corresponding `RNINavigatorView` "
              + "instance found for the given node",
            debug:
                "for node: \(node)"
              + " - with params, routeKey: \(routeKey)"
          );
        };
      
        // forward push command to navigator
        try navigatorView.push(routeKey, options){
          // resolve promise after "push" is complete
          resolve([:]);
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
  
  @objc func pop(
    _ node  : NSNumber,
    options : NSDictionary,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = Self.getNavigatorView(node) else {
          throw RNIError.commandFailed(
            source : "RNINavigatorViewModule.pop",
            message:
                "Unable to `pop` because no corresponding `RNINavigatorView` "
              + "instance found for the given node",
            debug: "for node: \(node)"
          );
        };

        // forward "pop" command to navigator
        try navigatorView.pop(options){
          // resolve promise after "pop" is complete
          resolve([
            "routeKey"  : $0,
            "routeIndex": $1
          ]);
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
  
  @objc func setNavigationBarHidden(
    _ node  : NSNumber,
    isHidden: Bool,
    animated: Bool,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){

    DispatchQueue.main.async {
      // get `RNINavigatorView` instance that matches node/reactTag
      guard let navigatorView = Self.getNavigatorView(node) else {
        // construct error message for promise
        let errorMessage = (
            "NativeModule, RNINavigatorViewModule: setNavigationBarHidden"
          + " - for node: \(node)"
          + " - Error: guard check failed"
          + " - no corresponding view found for node"
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
        + " - with args - isHidden: \(isHidden)"
        + " - animated: \(animated)"
      );
      #endif
      
      navigatorView.navigationVC.setNavigationBarHidden(isHidden, animated: animated){
        resolve([:]);
      };
    };
  };
  
  @objc func popToRoot(
    _ node  : NSNumber,
    options : NSDictionary,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = Self.getNavigatorView(node) else {
          throw RNIError.commandFailed(
            source : "RNINavigatorViewModule.popToRoot",
            message:
                "Unable to `popToRoot` because no corresponding `RNINavigatorView` "
              + "instance found for the given node",
            debug: "for node: \(node)"
          );
        };
              
        // forward "popToRoot" command to navigator
        try navigatorView.popToRoot(options){
          resolve([:]);
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
  
  @objc func removeRoute(
    _ node    : NSNumber,
    routeKey  : NSString,
    routeIndex: NSNumber,
    animated  : Bool,
    resolve   : @escaping RCTPromiseResolveBlock,
    reject    : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = Self.getNavigatorView(node) else {
          throw RNIError.commandFailed(
            source : "RNINavigatorViewModule.removeRoute",
            message:
                "Unable to `popToRoot` because no corresponding `RNINavigatorView` "
              + "instance found for the given node",
            debug: "for node: \(node)"
          );
        };
    
        // forward "popToRoot" command to navigator
        try navigatorView.removeRoute(
          routeKey  : routeKey as String,
          routeIndex: routeIndex.intValue,
          isAnimated: animated
        ) {
          resolve([:]);
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
  
  @objc func replaceRoute(
    _ node        : NSNumber,
    prevRouteIndex: NSNumber,
    prevRouteKey  : NSString,
    nextRouteKey  : NSString,
    animated      : Bool,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = Self.getNavigatorView(node) else {
          throw RNIError.commandFailed(
            source : "RNINavigatorViewModule.replaceRoute",
            message:
                "Unable to `replaceRoute` because no corresponding `RNINavigatorView` "
              + "instance found for the given node",
            debug: "for node: \(node)"
          );
        };
    
        // forward "popToRoot" command to navigator
        try navigatorView.replaceRoute(
          prevRouteIndex: prevRouteIndex.intValue,
          prevRouteKey  : prevRouteKey as String ,
          nextRouteKey  : nextRouteKey as String ,
          isAnimated    : animated
        ) {
          resolve([:]);
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
  
  @objc func insertRoute(
    _ node      : NSNumber,
    nextRouteKey: NSString,
    atIndex     : NSNumber,
    animated    : Bool,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = Self.getNavigatorView(node) else {
          throw RNIError.commandFailed(
            source : "RNINavigatorViewModule.insertRoute",
            message:
                "Unable to `insertRoute` because no corresponding `RNINavigatorView` "
              + "instance found for the given node",
            debug: "for node: \(node)"
          );
        };
    
        // forward "insertRoute" command to navigator
        try navigatorView.insertRoute(
          nextRouteKey: nextRouteKey as String,
          atIndex     : atIndex.intValue,
          isAnimated  : animated
        ) {
          resolve([:]);
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
