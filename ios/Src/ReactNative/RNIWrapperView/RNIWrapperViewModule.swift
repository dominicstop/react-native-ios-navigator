//
//  RNIWrapperViewModule.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 8/3/21.
//

import Foundation

@objc(RNIWrapperViewModule)
internal class RNIWrapperViewModule: NSObject {
  
  @objc var bridge: RCTBridge!;
  
  @objc static func requiresMainQueueSetup() -> Bool {
    // run init in bg thread
    return false;
  };
  
  func getWrapperView(_ node: NSNumber) -> RNIWrapperView? {
    // get shared bridge instance from view manager
    guard let bridge      = self.bridge,
          let view        = bridge.uiManager?.view(forReactTag: node),
          let wrapperView = view as? RNIWrapperView
    else { return nil };
    
    return wrapperView;
  };
  
  // ---------------------------------
  // MARK:- Module Commands: Navigator
  // ---------------------------------
  
  @objc func notifyComponentWillUnmount(
    _ node: NSNumber,
    params: NSDictionary
  ){
    DispatchQueue.main.async {
      // get `RNIWrapperView` instance that matches node/reactTag
      guard let wrapperView = self.getWrapperView(node) else {
        #if DEBUG
        print(
            "LOG - ViewManager, RNIWrapperViewModule: notifyComponentWillUnmount"
          + " - for node: \(node)"
          + " - no corresponding view found for node"
          + " - the view might have already been unmounted..."
        );
        #endif
        return;
      };
      
      wrapperView.onJSComponentWillUnmount(
        isManuallyTriggered: params["isManuallyTriggered"] as? Bool ?? false
      );
    };
  };
};
