//
//  UIViewController+Helpers.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/2/21.
//

import UIKit

extension UIViewController {
  
  var isCurrentlyInFocus: Bool {
    self.navigationController?.topViewController == self
  };
  
  var navBarHeight: CGFloat {
    self.navigationController?.navigationBar.frame.height ?? 0;
  };
  
  var statusBarHeight: CGFloat {
    if #available(iOS 13.0, *) {
      let window = self.view.window
        ?? UIApplication.shared.windows.filter { $0.isKeyWindow }.first;
      
      return window?.windowScene?.statusBarManager?.statusBarFrame.height ?? 0;
    };
    
    return UIApplication.shared.statusBarFrame.height;
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
};
