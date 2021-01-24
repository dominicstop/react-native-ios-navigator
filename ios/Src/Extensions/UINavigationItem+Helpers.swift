//
//  UINavigationItem+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/24/21.
//

import Foundation

extension UINavigationItem {
  
  /// `setHidesBackButton` with competion handler
  func setHidesBackButton(_ hidden: Bool, animated: Bool, completion: @escaping (() -> ())){
    if animated {
      CATransaction.begin();
      CATransaction.setCompletionBlock { completion() };
      
      self.setHidesBackButton(hidden, animated: animated);
      CATransaction.commit()
      
    } else {
      self.setHidesBackButton(hidden, animated: animated);
      completion();
    };
  };
};
