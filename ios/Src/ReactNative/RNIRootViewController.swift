//
//  RNIRootViewController.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/6/21.
//

import UIKit

@objc public class RNIRootViewController: UIViewController {
  public override var childForStatusBarStyle: UIViewController? {
    self.children.last;
  };
};
