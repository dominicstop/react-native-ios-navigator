//
//  RCTTextAttributes+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/18/21.
//

import Foundation

extension RCTTextAttributes {
  
  convenience init(dict: NSDictionary){
    self.init();
    
    // MARK: Color
    // set style: color
    if let value   = dict["color"],
       let uiColor = UIColor.parseColor(value: value) {
      
      self.foregroundColor = uiColor;
    };
    
    // set style: backgroundColor
    if let value = dict["backgroundColor"],
       let color = UIColor.parseColor(value: value) {
      
      self.backgroundColor = color;
    };
    
    // set style: opacity
    if let value = dict["opacity"] as? CGFloat {
      self.opacity = value;
    };
    
    // MARK: Font
    // set style: fontFamily
    if let value = dict["fontFamily"] as? String {
      self.fontFamily = value;
    };
    
    // set style: fontSize
    if let value = dict["fontSize"] as? CGFloat {
      self.fontSize = value;
    };
    
    // set style: fontWeight
    if let value = dict["fontWeight"] as? String {
      self.fontWeight = value;
    };
    
    // set style: fontStyle
    if let value = dict["fontStyle"] as? String {
      self.fontStyle = value;
    };
    
    // set style: fontVariant
    if let value = dict["fontVariant"] as? [String] {
      self.fontVariant = value;
    };
    
    // set style: letterSpacing
    if let value = dict["letterSpacing"] as? CGFloat {
      self.letterSpacing = value;
    };
    
    // MARK: Paragraph Styles
    // set style: lineHeight
    if let value = dict["lineHeight"] as? CGFloat {
      self.lineHeight = value;
    };
    
    // set style: textAlign
    if let value     = dict["textAlign"] as? String,
       let textAlign = NSTextAlignment(string: value) {
      
      self.alignment = textAlign;
    };
    
    // MARK: Decoration
    // set style: textDecorationColor
    if let value = dict["textDecorationColor"],
       let color = UIColor.parseColor(value: value) {
      
      self.textDecorationColor = color;
    };
    
    // set style: textDecorationStyle
    if let value = dict["textDecorationStyle"] as? String,
       let decorationStyle = NSUnderlineStyle(string: value) {
      
      self.textDecorationStyle = decorationStyle;
    };
    
    // set style: textDecorationLine
    if let value = dict["textDecorationLine"] as? String,
       let textDecorationLine = RCTTextDecorationLineType(string: value) {
      self.textDecorationLine = textDecorationLine;
    };
    
    
    // MARK: Shadow
    // set style: textShadowOffset
    if let value  = dict["textShadowOffset"] as? NSDictionary,
       let width  = value["width" ] as? CGFloat,
       let height = value["height"] as? CGFloat {
      
      self.textShadowOffset = CGSize(width: width, height: height);
    };
    
    // set style: textShadowRadius
    if let value = dict["textShadowRadius"] as? CGFloat {
      self.textShadowRadius = value;
    };
    
    // set style: textShadowColor
    if let value = dict["textShadowColor"],
       let color = UIColor.parseColor(value: value) {
      
      self.textShadowColor = color;
    };
    
    // MARK: Special
    // set style: textTransform
    if let value = dict["textTransform"] as? String,
       let textTransform = RCTTextTransform(string: value) {
      
      self.textTransform = textTransform;
    };
  };
};
