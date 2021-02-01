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
