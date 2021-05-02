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
  
  var reactPaddingTop: YGValue?;
  var overrideTopPadding = false;
  
  override func setLocalData(_ localData: NSObject!) {
    guard let headerLocalData = localData as? RouteHeaderLocalData,
          let insets = headerLocalData.insets
    else {
      self.overrideTopPadding = false;
      self.paddingTop = self.reactPaddingTop ?? YGValue(value: 0, unit: .point);
      return;
    };
    
    
    self.overrideTopPadding = true;
    super.paddingTop = YGValue(value: Float(insets.top), unit: .point);
    self.didSetProps(["paddingTop"]);
  };
  
  override var paddingTop: YGValue {
    set {
      self.reactPaddingTop = newValue;
      
      if !self.overrideTopPadding {
        super.paddingTop = newValue;
      };
    }
    get { super.paddingTop }
  };
};
