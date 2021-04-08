//
//  RNINavigatorViewDelegate.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 4/7/21.
//

import UIKit

public protocol RNINavigatorViewDelegate: AnyObject {
  
  func didReceiveCustomCommandFromJS(
    _ key: String,
    _ data: Dictionary<String, Any>?,
    // promise blocks -------------------
    _ resolve: @escaping (Any?   ) -> Void,
    _ reject : @escaping (String?) -> Void
  );
  
};

/// Send commands to the `RNINavigatorView` instance
public protocol RNINavigatorNativeCommands: AnyObject {
  
  func pushViewController(
    _ viewController: RNINavigatorRouteBaseViewController,
    animated: Bool
  );
  
  func push(
    routeKey: String,
    routeProps: Dictionary<String, Any>?,
    animated: Bool
  );
  
  func pop(animated: Bool);
  
  func sendCustomCommandToJS(key: String, data: Dictionary<String, Any>);
  
};
