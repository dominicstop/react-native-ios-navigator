//
//  UINavigationBar+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 2/1/21.
//

import UIKit;

extension UINavigationBar {
  
  var isShadowHidden: Bool {
    get {
      if #available(iOS 13.0, *) {
        return self.standardAppearance.shadowColor == nil;
        
      } else if #available(iOS 11.0, *) {
        return self.shadowImage != nil;
        
      } else {
        return (
          self.shadowImage != nil &&
          self.backgroundImage(for: .default) != nil
        );
      };
    }
  };
  
  func setShadowHidden(_ isHidden: Bool, newShadowColor: UIColor?){
    let newShadowImage = isHidden ? UIImage() : nil;
    let newShadowColor = isHidden ? .clear : newShadowColor;
    
    if #available(iOS 13.0, *) {
      let appearance = [
        self.standardAppearance,
        self.compactAppearance,
        self.scrollEdgeAppearance
      ];
      
      appearance.forEach {
        $0?.shadowColor = newShadowColor;
        $0?.shadowImage = nil;
      };
      
    } else if #available(iOS 11.0, *) {
      self.shadowImage = newShadowImage
      
    } else {
      self.setBackgroundImage(newShadowImage, for: .default);
      self.shadowImage = newShadowImage;
    };
  };
  
  func removeBackground() {
    self.isTranslucent = true;
    
    self.setBackgroundImage(UIImage(), for: .default);
    self.barTintColor = .clear;
    
    if #available(iOS 13.0, *) {
      let appearance = [
        self.standardAppearance,
        self.compactAppearance,
        self.scrollEdgeAppearance
      ];
      
      appearance.forEach {
        $0?.backgroundColor  = nil;
        $0?.shadowColor      = nil;
        $0?.shadowImage      = nil;
        $0?.backgroundEffect = nil;
      };
    };
  };
};
