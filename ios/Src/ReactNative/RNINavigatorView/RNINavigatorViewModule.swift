//
//  RNINavigatorViewModule.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/4/21.
//

import Foundation


@objc(RNINavigatorViewModule)
internal class RNINavigatorViewModule: NSObject {
  
  static func getNavigatorView(_ node: NSNumber) -> RNINavigatorView? {
    // get shared bridge instance from view manager
    guard let bridge  = RNINavigatorViewManager.sharedBridge,
          let view    = bridge.uiManager?.view(forReactTag: node),
          let navView = view as? RNINavigatorView
    else { return nil };
    
    return navView;
  };
  
  // ---------------------------------
  // MARK:- Module Commands: Navigator
  // ---------------------------------
  
  @objc func push(
    _ node : NSNumber,
    routeID: NSNumber,
    options: NSDictionary,
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
              + " - with params, routeID: \(routeID)"
          );
        };
      
        // forward push command to navigator
        try navigatorView.push(routeID.intValue, options){
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
    routeID   : NSNumber,
    routeIndex: NSNumber,
    animated  : Bool,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
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
    
        // forward command to navigator
        try navigatorView.removeRoute(
          routeID   : routeID.intValue,
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
    prevRouteID   : NSNumber,
    nextRouteID   : NSNumber,
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
          prevRouteID   : prevRouteID.intValue,
          nextRouteID   : nextRouteID.intValue,
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
  
  @objc func removeRoutes(
    _ node       : NSNumber,
    itemsToRemove: NSArray,
    animated     : Bool,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = Self.getNavigatorView(node) else {
          throw RNIError.commandFailed(
            source : "RNINavigatorViewModule.removeRoutes",
            message:
                "Unable to `popToRoot` because no corresponding `RNINavigatorView` "
              + "instance found for the given node",
            debug: "for node: \(node)"
          );
        };
    
        // forward command to navigator
        try navigatorView.removeRoutes(
          itemsToRemove: itemsToRemove.compactMap {
            guard let dict       = $0 as? NSDictionary,
                  let routeID    = dict["routeID"] as? Int,
                  let routeIndex = dict["routeIndex"] as? Int
            else { return nil };
            
            return (routeID: routeID, routeIndex: routeIndex);
          },
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
  
  @objc func insertRoute(
    _ node     : NSNumber,
    nextRouteID: NSNumber,
    atIndex    : NSNumber,
    animated   : Bool,
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
          nextRouteID: nextRouteID.intValue,
          atIndex    : atIndex.intValue,
          isAnimated : animated
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
  
  @objc func setRoutes(
    _ node      : NSNumber,
    nextRouteIDs: NSArray,
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
            source : "RNINavigatorViewModule.setRoutes",
            message:
                "Unable to `setRoutes` because no corresponding `RNINavigatorView` "
              + "instance found for the given node",
            debug: "for node: \(node)"
          );
        };
    
        // forward "setRoutes" command to navigator
        try navigatorView.setRoutes(
          nextRouteIDs: nextRouteIDs.compactMap { $0 as? Int },
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
  
  // ----------------------------
  // MARK:- Module Commands: Misc
  // ----------------------------
  
  @objc func getNativeRouteKeys(_ callback: RCTResponseSenderBlock) {
    // extract keys
    let keys = RNINavigatorManager.routeRegistry.keys.map { $0 };
    callback([keys]);
  };
  
  @objc func sendCustomCommandToNative(
    _ node     : NSNumber,
    commandKey : NSString,
    commandData: NSDictionary?,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = Self.getNavigatorView(node) else {
          throw RNIError.commandFailed(
            source : "RNINavigatorViewModule.sendCustomCommandToNative",
            message:
                "Unable to `insertRoute` because no corresponding `RNINavigatorView` "
              + "instance found for the given node",
            debug: "for node: \(node)"
          );
        };
        
        try navigatorView.didReceiveCustomCommandFromJS(
          commandKey as String,
          commandData as? Dictionary<String, Any>,
          resolve: {
            resolve($0);
          },
          reject: {
            reject("LIB_ERROR", $0, nil);
          }
        );
        
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
