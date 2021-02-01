//
//  RCTTextDecorationLineType+Init.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/18/21.
//

import Foundation

extension RCTTextDecorationLineType {
  init?(string: String){
    switch string {
      case "none"                  : self = .none;
      case "strikethrough"         : self = .strikethrough;
      case "underline"             : self = .underline;
      case "underlineStrikethrough": self = .underlineStrikethrough;
        
      default: return nil;
    };
  };
};
