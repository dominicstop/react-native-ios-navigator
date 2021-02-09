//
//  UIBarMetrics+Init.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 2/9/21.
//

import UIKit

extension UIBarMetrics: CaseIterable {
  static public var allCases: [UIBarMetrics] = [
    .default,
    .defaultPrompt,
    .compact,
    .compactPrompt,
  ];
  
  init?(string: String){
    switch string {
      case "default"      : self = .default;
      case "defaultPrompt": self = .defaultPrompt;
      case "compact"      : self = .compact;
      case "compactPrompt": self = .compactPrompt;
        
      default: return nil;
    }
  };
};
