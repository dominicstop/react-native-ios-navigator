//
//  NSTextAlignment+Init.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/18/21.
//

import Foundation

extension NSTextAlignment {
  init?(string: String) {
    switch string {
      case "center"   : self = .center;
      case "justified": self = .justified;
      case "left"     : self = .left;
      case "natural"  : self = .natural;
      case "right"    : self = .right;
        
      default: return nil;
    };
  }
};
