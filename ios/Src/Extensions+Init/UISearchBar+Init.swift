//
//  UISearchBar+Init.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/20/21.
//

import Foundation

extension UISearchBar.Style {
  init?(string: String) {
    switch string {
      case "default"  : self = .default;
      case "minimal"  : self = .minimal;
      case "prominent": self = .prominent;
        
      default: return nil;
    }
  };
};
