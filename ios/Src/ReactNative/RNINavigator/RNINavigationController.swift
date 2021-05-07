//
//  RNINavigationController.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/6/21.
//

import UIKit;

class RNINavigationController: UINavigationController {
  
  /// Use the the current active view controller's `preferredStatusBarStyle`,
  /// the "active view controller" can either be `topViewController` (the last
  /// view controller pushed), or `presentedViewController` (the current presented
  /// "modal" view controller).
  ///
  /// Note: Placing this in an extension as an `open override` doesn't seem to work,
  /// so a subclass was needed.
  public override var childForStatusBarStyle: UIViewController? {
    return self.visibleViewController;
  };
};
