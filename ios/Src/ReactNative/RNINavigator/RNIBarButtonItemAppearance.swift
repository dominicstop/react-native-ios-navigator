//
//  RNIBarButtonItemAppearance.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 9/28/21.
//

import Foundation

struct RNIBarButtonItemStateAppearance {
  
  let titleTextAttributes: RCTTextAttributes?;
  let titlePositionAdjustment: UIOffset?;
  
  let backgroundImage: RNIImageItem?;
  let backgroundImagePositionAdjustment: UIOffset?;
  
  init?(dict: NSDictionary){
    self.titleTextAttributes = {
      guard let styleDict = dict["titleTextAttributes"] as? NSDictionary
      else { return nil };
      
      return RCTTextAttributes(dict: styleDict);
    }();
    
    self.titlePositionAdjustment = {
      guard let offsetDict = dict["titlePositionAdjustment"] as? NSDictionary
      else { return nil };
      
      return UIOffset(dictionary: offsetDict);
    }();
    
    self.backgroundImage = {
      guard let imageDict = dict["backgroundImage"] as? NSDictionary,
            let imageItem = RNIImageItem(dict: imageDict)
      else { return nil };
      
      return imageItem;
    }();
    
    self.backgroundImagePositionAdjustment = {
      guard let offsetDict = dict["backgroundImagePositionAdjustment"] as? NSDictionary
      else { return nil };
      
      return UIOffset(dictionary: offsetDict);
    }();
  };
  
  @available(iOS 13.0, *)
  func apply(to item: UIBarButtonItemStateAppearance){
    if let textStyle = self.titleTextAttributes {
      item.titleTextAttributes = textStyle.effectiveTextAttributes();
    };
    
    if let offset = self.titlePositionAdjustment {
      item.titlePositionAdjustment = offset;
    };
    
    if let imageItem = self.backgroundImage {
      item.backgroundImage = imageItem.image;
    };
    
    if let offset = self.backgroundImagePositionAdjustment {
      item.backgroundImagePositionAdjustment = offset;
    };
  };
};

struct RNIBarButtonItemAppearance {
  
  let style: UIBarButtonItem.Style;
  
  // MARK: Bar Button State Appearance
  
  let normal     : RNIBarButtonItemStateAppearance?;
  let disabled   : RNIBarButtonItemStateAppearance?;
  let highlighted: RNIBarButtonItemStateAppearance?;
  let focused    : RNIBarButtonItemStateAppearance?;
  
  init?(dict: NSDictionary){
    guard let style = UIBarButtonItem.Style(string: dict["style"] as? String)
    else { return nil };
    
    self.style = style;
    
    // MARK: Section - Setup "Bar Button State Appearance"
    
    self.normal = {
      guard let configDict = dict["normal"] as? NSDictionary
      else { return nil };

      return RNIBarButtonItemStateAppearance(dict: configDict);
    }();
    
    self.disabled = {
      guard let configDict = dict["disabled"] as? NSDictionary
      else { return nil };

      return RNIBarButtonItemStateAppearance(dict: configDict);
    }();
    
    self.highlighted = {
      guard let configDict = dict["highlighted"] as? NSDictionary
      else { return nil };

      return RNIBarButtonItemStateAppearance(dict: configDict);
    }();
    
    self.focused = {
      guard let configDict = dict["focused"] as? NSDictionary
      else { return nil };

      return RNIBarButtonItemStateAppearance(dict: configDict);
    }();
  };
  
  @available(iOS 13.0, *)
  func create() -> UIBarButtonItemAppearance {
    let item = UIBarButtonItemAppearance(style: self.style);
    
    self.normal?     .apply(to: item.normal);
    self.disabled?   .apply(to: item.disabled);
    self.highlighted?.apply(to: item.highlighted);
    self.focused?    .apply(to: item.focused);
    
    return item;
  };
};
