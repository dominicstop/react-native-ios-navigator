//
//  UIStatusBarStyle+Init.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/7/21.
//

import Foundation

extension UIStatusBarStyle {
  init?(string: String){
    switch string {
      case "default" : self = .default;
      case "lightContent": self = .lightContent;
        
      case "darkContent" :
        if #available(iOS 13.0, *) {
          self = .darkContent;
          
        } else {
          return nil;
        };
        
      default: return nil;
    }
  };
};
