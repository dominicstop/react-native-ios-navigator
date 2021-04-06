//
//  NavigatorManagerListener.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 4/7/21.
//

import Foundation
import react_native_ios_navigator


@objc class NavigatorManagerListener: NSObject {
  static var sharedInstance: NavigatorManagerListener? = nil;
  
  /// For some reason, on an objc + swift project, `{}()` syntax isn't evaluated,
  /// so we have to explicitly set the singleton via invoking this func from objc.
  /// If you update the `AppDelegate` to use swift, maybe this isn't needed.
  @objc static func setup(){
    let instance = NavigatorManagerListener();
    RNINavigatorManager.sharedInstance.delegate = instance;
    
    Self.sharedInstance = instance;
  };
};

extension NavigatorManagerListener: RNINavigatorManagerDelegate {
  func onNavigatorViewAdded(_ navigatorView: RNINavigatorView, _ navigatorID: Int) {
    print("navigatorView added w/ navigatorID: \(navigatorID)");
  };
};
