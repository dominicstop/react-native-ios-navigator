//
//  NavigatorManagerListener.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 4/7/21.
//

import Foundation
import react_native_ios_navigator


@objc class NavigatorManagerListener: NSObject, RNINavigatorDelegate {
  static var sharedInstance: NavigatorManagerListener? = nil;
  
  @objc static func setup(){
    let instance = NavigatorManagerListener();
    RNINavigatorManager.sharedInstance.delegate = instance;
    
    Self.sharedInstance = instance;
  };
  
  func onNavigatorViewAdded(_ navigatorView: RNINavigatorView, _ navigatorID: Int) {
    print("navigatorView added w/ navigatorID: \(navigatorID)");
  };
};
