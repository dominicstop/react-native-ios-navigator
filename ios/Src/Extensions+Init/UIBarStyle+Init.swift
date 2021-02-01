//
//  UIBarStyle+Init.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/17/21.
//

import Foundation

extension UIBarStyle {
  init?(string: String){
    switch string {
      case "default"         : self = .default;
      case "black"           : self = .black;
      case "blackTranslucent": self = .blackTranslucent;
      case "blackOpaque"     : self = .blackOpaque;
      
      default: return nil;
    };
  };
};
