//
//  UIView+Init.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/28/21.
//

import Foundation

extension UIView.KeyframeAnimationOptions {
  init(animationOptions: UIView.AnimationOptions) {
    self.init(rawValue: animationOptions.rawValue)
  };
};

extension UIView.ContentMode {
  init?(string: String) {
    switch string {
      case "top"            : self = .top;
      case "topLeft"        : self = .topLeft;
      case "topRight"       : self = .topRight;
      case "left"           : self = .left;
      case "center"         : self = .center;
      case "right"          : self = .right;
      case "bottom"         : self = .bottom;
      case "bottomLeft"     : self = .bottomLeft;
      case "bottomRight"    : self = .bottomRight;
      case "redraw"         : self = .redraw;
      case "scaleAspectFill": self = .scaleAspectFill;
      case "scaleToFill"    : self = .scaleToFill;
      case "scaleAspectFit" : self = .scaleAspectFit;
        
      default: return nil;
    };
  }
};
