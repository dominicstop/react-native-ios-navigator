//
//  UIEdgeInsets.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 6/5/21.
//

import Foundation

extension UIEdgeInsets {
  var dictionary: Dictionary<String, CGFloat> {[
    "top"   : self.top   ,
    "bottom": self.bottom,
    "left"  : self.left  ,
    "right" : self.right ,
  ]};
};
