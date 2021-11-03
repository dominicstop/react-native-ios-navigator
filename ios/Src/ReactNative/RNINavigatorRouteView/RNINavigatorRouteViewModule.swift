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
  
  @objc static func requiresMainQueueSetup() -> Bool {
    // run init in bg thread
    return false;
  };
  
  // MARK: - Module Commands
  // -----------------------
    
  @objc func setHidesBackButton(
    _ node  : NSNumber,
    isHidden: Bool,
    animated: Bool,
    resolve : @escaping RCTPromiseResolveBlock,
    reject  : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        guard let routeView = self.getRouteView(node),
              let routeVC = routeView.routeVC
        else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)",
            message: "no corresponding 'routeVC' found for the 'routeView'"
          );
        };
        
        routeVC.navigationItem.setHidesBackButton(isHidden, animated: animated){
          resolve(nil);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
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
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
        
        try routeView.getConstants() {
          resolve($0);
        };
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
      };
    };
  };
  
  @objc func getRouteSearchControllerState(
    _ node : NSNumber,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorRouteView` instance that matches node/reactTag
        guard let routeView = self.getRouteView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
        
        guard let routeVC = routeView.routeVC else {
          throw RNINavigatorError(
            code: .libraryError,
            domain: "\(String(describing: Self.self)).\(#function)",
            message: "No corresponding route view controller found for route view"
          );
        };
        
        guard #available(iOS 11.0, *),
              let searchVC = routeVC.navigationItem.searchController else {
          throw RNINavigatorError(
            code: .libraryError,
            domain: "\(String(describing: Self.self)).\(#function)",
            message: "No search controller found for the route view controller"
          );
        };
        
        let searchVCState =
          RNIRouteSearchControllerState(searchController: searchVC);
        
        resolve(searchVCState.dictionary);
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
      };
    };
  };
  
  @objc func setRouteSearchControllerState(
    _ node: NSNumber,
    state : NSDictionary,
    // promise blocks ------------------------
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      do {
        // get `RNINavigatorRouteView` instance that matches node/reactTag
        guard let routeView = self.getRouteView(node) else {
          throw RNINavigatorError(
            code: .invalidReactTag,
            domain: "\(String(describing: Self.self)).\(#function)"
          );
        };
        
        guard let routeVC = routeView.routeVC else {
          throw RNINavigatorError(
            code: .libraryError,
            domain: "\(String(describing: Self.self)).\(#function)",
            message: "No corresponding route view controller found for route view"
          );
        };
        
        guard #available(iOS 11.0, *),
              let searchVC = routeVC.navigationItem.searchController else {
          throw RNINavigatorError(
            code: .libraryError,
            domain: "\(String(describing: Self.self)).\(#function)",
            message: "No search controller found for the route view controller"
          );
        };
        
        let searchVCState =
          RNIRouteSearchControllerState(dict: state);
        
        searchVCState.apply(to: searchVC);
        resolve(nil);
        
      } catch {
        let error = error as? RNINavigatorError;
        reject(error?.code.rawValue , error?.createJSONString(), nil);
      };
    };
  };
};

