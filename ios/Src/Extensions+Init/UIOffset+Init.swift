//
//  UIOffset+Init.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/30/21.
//

import Foundation

extension UIOffset {
  init(dictionary: NSDictionary) {
    self.init();
    
    if let vertical = dictionary["vertical"] as? CGFloat {
      self.vertical = vertical;
    };
    
    if let horizontal = dictionary["horizontal"] as? CGFloat {
      self.horizontal = horizontal;
    };
  }
};
