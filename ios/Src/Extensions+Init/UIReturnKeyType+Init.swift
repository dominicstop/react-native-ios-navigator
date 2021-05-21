//
//  UIReturnKeyType+Init.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/21/21.
//

import Foundation

extension UIReturnKeyType {
  public init?(string: String) {
    switch string {
      case "default"      : self = .`default`;
      case "go"           : self = .go;
      case "google"       : self = .google;
      case "join"         : self = .join;
      case "next"         : self = .next;
      case "route"        : self = .route;
      case "search"       : self = .search;
      case "send"         : self = .send;
      case "yahoo"        : self = .yahoo;
      case "done"         : self = .done;
      case "emergencyCall": self = .emergencyCall;
      case "continue"     : self = .`continue`;
        
      default: return nil;
    };
  };
};
