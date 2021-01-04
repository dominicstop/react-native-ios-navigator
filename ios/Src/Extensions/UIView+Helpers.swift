//
//  UIView+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/3/21.
//

import Foundation

extension UIView {
  var parentViewController: UIViewController? {
    var parentResponder: UIResponder? = self;
    
    while parentResponder != nil {
      parentResponder = parentResponder!.next;
      
      if let viewController = parentResponder as? UIViewController {
        return viewController;
      };
    };
    
    return nil;
  };
};
