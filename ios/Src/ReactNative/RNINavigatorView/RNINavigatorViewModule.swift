//
//  RNINavigatorViewModule.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/4/21.
//

import Foundation

protocol RNINavigatorViewModuleEventsDelegate: AnyObject {
  func onNavRouteViewAdded(routeKey: NSString, routeIndex: NSNumber);
};

@objc(RNINavigatorViewModule)
class RNINavigatorViewModule: RCTEventEmitter {
  
  // ------------------
  // MARK: Nested Types
  // ------------------
  
  /// Each `Manager` instance has a corresponding view instance, specifically,
  /// each instance of this manager is paired with a `RNINavigatorView` instance.
  class Manager {
    
    // --------------------------
    // MARK: Manager - Properties
    // --------------------------
    
    var node: NSNumber?;
    weak var navigatorView: RNINavigatorView? {
      didSet {
        // set the delegate to receive events from `RNINavigatorView` instance
        self.navigatorView?.moduleEventsDelegate = self;
      }
    };
    
    // -----------------------
    // MARK: Manager - Methods
    // -----------------------
    
    
    func setNode(){
      //
    };
  };
  
  enum Events: String, CaseIterable {
    /** a new `RNINavigatorRouteView` was added in `RNINavigatorView` */
    case onNavRouteViewAdded;
  };
  
  // --------------------------
  // MARK: Module - Properties
  // --------------------------
  
  var managers = [Int: Manager]();
  
  // --------------------
  // MARK: Module - Setup
  // --------------------
  
  @objc override static func requiresMainQueueSetup() -> Bool {
    return false;
  };
  
  override func supportedEvents() -> [String]! {
    return Self.Events.allCases.map { $0.rawValue };
  };
  
  
  // ---------------------
  // MARK: Module Commands
  // ---------------------
  
  /// This "command" is used to create a new `Manager` instance that will be
  /// responsible for a "RNINavigatorView" instance that matches `node`.
  @objc func setNode(
    _ node : NSNumber,
    resolve: @escaping RCTPromiseResolveBlock,
    reject : @escaping RCTPromiseRejectBlock
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
            "NativeModule, RCTPopoverViewModule: setNode"
          + " - with params - node: \(node)"
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
      
      self.managers[node.intValue] = {
        let manager = Manager();
        manager.node = node;
        manager.navigatorView = navigatorView;
        
        return manager;
      }();
      
      // resolve promise
      resolve([:]);
    };
  };
  
  // TODO: Add options param
  @objc func push(
    _ node  : NSNumber,
    routeKey: NSString,
    resolve : @escaping RCTPromiseResolveBlock,
    reject  : @escaping RCTPromiseRejectBlock
  ){
    
    DispatchQueue.main.async {
      // get manager/view instance that matches node/reactTag
      guard let manager = self.managers[node.intValue],
            let navigatorView = manager.navigatorView
      else {
        // construct error message for promise
        let errorMessage = (
            "NativeModule, RCTPopoverViewModule: push"
          + " - for node: \(node)"
          + " - with params - routeKey: \(routeKey)"
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
      print("LOG - NativeModule, RCTPopoverViewModule: push"
        + " - for node: \(node)"
        + " - with params - routeKey: \(routeKey)"
      );
      #endif
      
      // forward push command to navigator
      navigatorView.push(routeKey: routeKey);
      
      // resolve promise
      resolve([:]);
    };
  };
};

// ----------------------------------------------------
// MARK: Manager - RNINavigatorViewModuleEventsDelegate
// ----------------------------------------------------

extension RNINavigatorViewModule.Manager: RNINavigatorViewModuleEventsDelegate {
  
  func onNavRouteViewAdded(routeKey: NSString, routeIndex: NSNumber) {
    #if DEBUG
    print("LOG - NativeModule, RNINavigatorView.Manager"
      + " - RNINavigatorViewModuleEventsDelegate: onNavRouteViewAdded"
      + " - for node: \(self.node ?? -1)"
      + " - with params - routeKey: \(routeKey)"
      + " - routeIndex: \(routeIndex)"
    );
    #endif
  };
};
