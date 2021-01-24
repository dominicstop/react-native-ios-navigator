//
//  RCTTextTransform+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/18/21.
//

import Foundation

extension RCTTextTransform {
  init?(string: String){
    switch string {
      case "capitalize": self = .capitalize;
      case "lowercase" : self = .lowercase;
      case "none"      : self = .none;
      case "undefined" : self = .undefined;
      case "uppercase" : self = .uppercase;
        
      default: return nil;
    };
  };
};
