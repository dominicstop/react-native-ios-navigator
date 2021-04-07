//
//  RNINavigatorViewDelegate.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 4/7/21.
//

import UIKit

public protocol RNINavigatorViewDelegate: AnyObject {
  
  func didReceiveCustomCommand(
    _ key: String,
    _ data: Dictionary<String, Any>?,
    // promise blocks -------------------
    _ resolve: @escaping (Any?   ) -> Void,
    _ reject : @escaping (String?) -> Void
  );
  
};
