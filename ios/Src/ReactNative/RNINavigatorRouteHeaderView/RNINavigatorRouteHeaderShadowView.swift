//
//  RNINavigatorRouteHeaderShadowView.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/2/21.
//

import Foundation

class RNINavigatorRouteHeaderShadowView: RCTShadowView {
  class RouteHeaderLocalData: NSObject {
    var insets: UIEdgeInsets?;
  };
  
  var overrideTopPadding = false;
  var overrideHorizontalPadding = false;
  
  // cache the original padding values received from react
  var reactPaddingTop  : YGValue?;
  var reactPaddingLeft : YGValue?;
  var reactPaddingRight: YGValue?;
  
  override var paddingTop: YGValue {
    set {
      self.reactPaddingTop = newValue;
      
      if !self.overrideTopPadding {
        super.paddingTop = newValue;
      };
    }
    get { super.paddingTop }
  };
  
  override var paddingLeft: YGValue {
    set {
      self.reactPaddingLeft = newValue;
      
      if !self.overrideHorizontalPadding {
        super.paddingLeft = newValue;
      };
    }
    get { super.paddingTop }
  };
  
  override var paddingRight: YGValue {
    set {
      self.reactPaddingRight = newValue;
      
      if !self.overrideTopPadding {
        super.paddingRight = newValue;
      };
    }
    get { super.paddingTop }
  };
  
  override func setLocalData(_ localData: NSObject!) {
    guard let headerLocalData = localData as? RouteHeaderLocalData,
          let insets = headerLocalData.insets
    else {
      // restore to the original react values
      self.resetPadding();
      return;
    };
    
    self.overrideTopPadding = true;
    super.paddingTop = YGValue(value: Float(insets.top  ), unit: .point);
    
    self.overrideHorizontalPadding = true;
    
    super.paddingLeft  = YGValue(value: Float(insets.left ), unit: .point);
    super.paddingRight = YGValue(value: Float(insets.right), unit: .point);
    
    self.didSetProps(["paddingTop", "paddingRight", "paddingRight"]);
  };
  
  func resetPadding(){
    var changedProps: [String] = [];
    
    if !self.overrideTopPadding {
      changedProps.append("paddingTop");
      self.overrideTopPadding = false;
      
      super.paddingTop = self.reactPaddingTop ?? YGValue(value: 0, unit: .point);
    };
    
    if !self.overrideHorizontalPadding {
      changedProps += ["paddingLeft", "paddingRight"]
      self.overrideHorizontalPadding = false;
      
      super.paddingLeft  = self.reactPaddingLeft  ?? YGValue(value: 0, unit: .point);
      super.paddingRight = self.reactPaddingRight ?? YGValue(value: 0, unit: .point);
    };
    
    self.didSetProps(changedProps);
  };
};
