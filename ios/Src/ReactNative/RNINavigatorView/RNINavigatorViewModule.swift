//
//  RNINavigatorViewModule.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/4/21.
//

import Foundation


@objc(RNINavigatorViewModule)
internal class RNINavigatorViewModule: NSObject {
  
  @objc var bridge: RCTBridge!;
  
  @objc static func requiresMainQueueSetup() -> Bool {
    // run init in bg thread
    return false;
  };
  
  func getNavigatorView(_ node: NSNumber) -> RNINavigatorView? {
    return RNIUtilities.getView(
      forNode: node,
      type   : RNINavigatorView.self,
      bridge : self.bridge
    );
  };
  
  // MARK: - Module Commands: Navigator
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
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
      
        // forward push command to navigator
        try navigatorView.push(routeID.intValue, options){
          // resolve promise after "push" is complete
          resolve(nil);
        };
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
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
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
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
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
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
      do {
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
        
        navigatorView.navigationVC.setNavigationBarHidden(isHidden, animated: animated){
          resolve(nil);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
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
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
              
        // forward "popToRoot" command to navigator
        try navigatorView.popToRoot(options){
          resolve(nil);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
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
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
    
        // forward command to navigator
        try navigatorView.removeRoute(
          routeID   : routeID.intValue,
          routeIndex: routeIndex.intValue,
          isAnimated: animated
        ) {
          resolve(nil);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
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
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
    
        // forward "popToRoot" command to navigator
        try navigatorView.replaceRoute(
          prevRouteIndex: prevRouteIndex.intValue,
          prevRouteID   : prevRouteID.intValue,
          nextRouteID   : nextRouteID.intValue,
          isAnimated    : animated
        ) {
          resolve(nil);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
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
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
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
          resolve(nil);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
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
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
    
        // forward "insertRoute" command to navigator
        try navigatorView.insertRoute(
          nextRouteID: nextRouteID.intValue,
          atIndex    : atIndex.intValue,
          isAnimated : animated
        ) {
          resolve(nil);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
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
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
    
        // forward "setRoutes" command to navigator
        try navigatorView.setRoutes(
          nextRouteIDs: nextRouteIDs.compactMap { $0 as? Int },
          isAnimated  : animated
        ) {
          resolve(nil);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
      };
    };
  };
  
  // MARK: - Module Commands: Misc
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
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
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
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
      };
    };
  };
  
  @objc func getNavigatorConstants(
    _ node : NSNumber,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
        
        try navigatorView.getConstants() {
          resolve($0);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
      };
    };
  };
  
  @objc func getNavigatorActiveRoutes(
    _ node : NSNumber,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
        
        resolve(navigatorView.activeRoutesDict);
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
      };
    };
  };
  
  @objc func dismissModal(
    _ node  : NSNumber,
    animated: Bool,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorView` instance that matches node/reactTag
        guard let navigatorView = self.getNavigatorView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
        
        navigatorView.navigationVC.dismiss(animated: animated){
          resolve(nil);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
      };
    };
  };
};
