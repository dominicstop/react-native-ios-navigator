//
//  UINavigationItemLargeTitleDisplayMode+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/24/21.
//

import Foundation

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
