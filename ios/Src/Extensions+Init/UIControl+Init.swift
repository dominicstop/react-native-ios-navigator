//
//  UIControl+Init.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 2/10/21.
//

import UIKit;

extension UIControl.State {
  init?(string: String){
    switch string {
      case "normal"     : self = .normal;
      case "highlighted": self = .highlighted;
      case "disabled"   : self = .disabled;
      case "selected"   : self = .selected;
      case "focused"    : self = .focused;
        
      default: return nil;
    }
  };
};
