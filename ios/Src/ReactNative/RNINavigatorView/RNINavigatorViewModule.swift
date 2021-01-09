//
//  RNINavigatorViewModule.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/4/21.
//

import Foundation


@objc(RNINavigatorViewModule)
class RNINavigatorViewModule: RCTEventEmitter {
  
  // ------------------
  // MARK: Nested Types
  // ------------------
  
  /// Each instance of `RNINavigatorView` is paired with a "manager".
  /// The job of the manager is to hold a ref to a `RNINavigatorView` so that the
  /// `RNINavigatorViewModule` native module (which is a singleton) can forward
  /// the commands it receives from the JS comp. to the corresponding native
  /// view instance: (JS:Component -> N:Module -> N:View).
  class Manager {
    
    // --------------------------
    // MARK: Manager - Properties
    // --------------------------
    
    var node: NSNumber;
    
    /// a ref to `RNINavigatorViewModule` singleton instance
    weak var module: RNINavigatorViewModule?;
    
    /// a ref to the `RNINavigatorView` that this manager is responsible for
    weak var navigatorView: RNINavigatorView? {
      didSet {
        /// set the delegate to receive events from `RNINavigatorView` instance
        self.navigatorView?.eventsDelegate = self;
      }
    };
    
    // -----------------------
    // MARK: Manager - Methods
    // -----------------------
    
    init(node: NSNumber, module: RNINavigatorViewModule, navigatorView: RNINavigatorView) {
      self.node = node;
      self.module = module;
      self.navigatorView = navigatorView;
    };
  };
  
  enum Events: String, CaseIterable {
    // TODO: Impl.
    case placeholder;
  };
  
  // --------------------------
  // MARK: Module - Properties
  // --------------------------
  
  /// dict. that holds the manager instance.
  /// each "manager" corresponds to a `RNINavigatorView`
  var managers = [Int: Manager]();
  
  // --------------------
  // MARK: Module - Setup
  // --------------------
  
  @objc override static func requiresMainQueueSetup() -> Bool {
    return false;
  };
  
  /// Note: The events are global, i.e. the events will be sent to all
  /// instances of the emitter across our app.
  override func supportedEvents() -> [String]! {
    return Self.Events.allCases.map { $0.rawValue };
  };
  
  // ---------------------
  // MARK: Module Commands
  // ---------------------
  
  /// This "command" is used to create a new `Manager` instance that will be
  /// responsible for some "RNINavigatorView" instance that matches `node`.
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
      
      self.managers[node.intValue] = Manager(
        node         : node,
        module       : self,
        navigatorView: navigatorView
      );
      
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
        
        /// remove manager bc's it's `navigatorView` is nil
        self.managers.removeValue(forKey: node.intValue);
        
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
      navigatorView.push(routeKey: routeKey){
        // resolve promise after "push" is complete
        resolve([:]);
      };
    };
  };
};

// ----------------------------------------------
// MARK: Manager - RNINavigatorViewEventsDelegate
// ----------------------------------------------

extension RNINavigatorViewModule.Manager: RNINavigatorViewEventsDelegate {
  // TODO: Impl.
};
