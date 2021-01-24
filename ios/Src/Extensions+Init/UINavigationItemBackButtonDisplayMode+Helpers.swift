//
//  UINavigationItemBackButtonDisplayMode+Helpers.swift
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
