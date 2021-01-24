//
//  UIBarButtonItemStyle+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/22/21.
//

import Foundation


extension UIBarButtonItem.Style {
  init?(string: String){
    switch string {
      case "done" : self = .done;
      case "plain": self = .plain;
        
      default: return nil;
    };
  };
  
  init?(string: String?){
    guard let string = string else { return nil };
    self.init(string: string);
  };
};
