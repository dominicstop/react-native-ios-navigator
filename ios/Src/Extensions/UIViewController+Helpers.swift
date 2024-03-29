//
//  UIViewController+Helpers.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/2/21.
//

import UIKit

extension UIViewController {
  
  var isCurrentlyInFocus: Bool {
    self.navigationController?.topViewController === self
  };
  
  var navBarHeight: CGFloat {
    guard let navigationController =
            self.navigationController ?? self as? UINavigationController
    else { return 0 };
    
    return navigationController.navigationBar.frame.height;
  };
  
  var statusBarHeight: CGFloat {
    guard !UIApplication.shared.isStatusBarHidden else { return 0 };
    
    if #available(iOS 13.0, *) {
      let window = self.view.window
        ?? UIApplication.shared.windows.filter { $0.isKeyWindow }.first;
      
      return window?.windowScene?.statusBarManager?.statusBarFrame.size.height ?? 0;
    };
    
    return UIApplication.shared.statusBarFrame.size.height;
  };
  
  var navBarWithStatusBarHeight: CGFloat {
    self.statusBarHeight + self.navBarHeight;
  };
  
  var synthesizedSafeAreaInsets: UIEdgeInsets {
    if #available(iOS 11.0, *) {
      return self.view.safeAreaInsets;
      
    } else {
      return UIEdgeInsets(
        top: self.topLayoutGuide.length,
        left: 0,
        bottom: self.bottomLayoutGuide.length,
        right: 0
      );
    };
  };
  
  var secondToLastViewController: UIViewController? {
    guard let navController = self.navigationController,
          navController.viewControllers.count >= 2
    else { return nil };
          
    return navController.viewControllers[navController.viewControllers.count - 2];
  };
  
  var previousViewController: UIViewController? {
    guard let viewControllers = self.navigationController?.viewControllers,
              let currentIndex = viewControllers.firstIndex(of: self),
              currentIndex >= 2
    else { return nil };
      
    return viewControllers[currentIndex - 1];
  };
  
  var lastViewController: UIViewController? {
    self.navigationController?.viewControllers.last
  };
  
  var isLastViewController: Bool {
    self.lastViewController === self;
  };
};
