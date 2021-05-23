//
//  UISearchBar+Helpers.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/23/21.
//

import Foundation


extension UISearchBar {
  var textField: UITextField? {
    if #available(iOS 13, *) {
      return searchTextField
    };
    
    for subview in subviews {
      if let view = subview.subviews.first(where: { $0 is UITextField }){
        return (view as! UITextField);
      };
    };
    
    return nil;
  };
  
  var placeholderLabel: UILabel? {
    guard let textField = self.textField else { return nil };
    
    for subview in textField.subviews {
      if let label = subview as? UILabel {
        return label;
      };
    };
    
    return nil;
  };
};
