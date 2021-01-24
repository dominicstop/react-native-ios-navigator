//
//  NSUnderlineStyle+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/18/21.
//

import Foundation

extension NSUnderlineStyle {
  init?(string: String){
    switch string {
      case "byWord"           : self = .byWord;
      case "double"           : self = .double;
      case "patternDash"      : self = .patternDash;
      case "patternDashDot"   : self = .patternDashDot;
      case "patternDashDotDot": self = .patternDashDotDot;
      case "patternDot"       : self = .patternDot;
      case "single"           : self = .single;
      case "thick"            : self = .thick;
        
      // RN-Specific
      case "solid" : self = .single;
      case "dotted": self = .patternDot;
      case "dashed": self = .patternDash;
      
      default: return nil;
    };
  };
};
