//
//  CGRect+Helpers.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 6/5/21.
//

import Foundation

extension CGRect {
  var dictionary: Dictionary<String, CGFloat> {[
    "x": self.origin.x,
    "y": self.origin.y,
    "height": self.size.height,
    "width": self.size.width,
  ]};
};
