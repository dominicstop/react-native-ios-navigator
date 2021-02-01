//
//  UINavigationItem+Init.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/23/21.
//

import Foundation

extension UINavigationItem.BackButtonDisplayMode {
  init?(string: String){
    switch string {
      case "default": self = .default;
      case "generic": self = .generic;
      case "minimal": self = .minimal;
        
      default: return nil;
    }
  };
};

extension UINavigationItem.LargeTitleDisplayMode {
  init?(string: String) {
    switch string {
      case "always"   : self = .always;
      case "automatic": self = .automatic;
      case "never"    : self = .never;
      
      default: return nil;
    }
  };
};

