//
//  RNISearchControllerConfig.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/20/21.
//

import Foundation

struct RNISearchControllerConfig {
  
  // MARK: SearchBarConfig
  let placeholder: String?;
  let searchBarStyle: UISearchBar.Style;
  let isTranslucent: Bool?;
  
  let tintColor: UIColor?;
  let barTintColor: UIColor?;
  let textColor: UIColor?;
  
  let returnKeyType: UIReturnKeyType?;
  
  // MARK: SearchControllerConfig
  let hidesSearchBarWhenScrolling: Bool?;
  
  let obscuresBackgroundDuringPresentation: Bool?;
  let hidesNavigationBarDuringPresentation: Bool?;
  let automaticallyShowsCancelButton: Bool?;
  
  init(from dict: NSDictionary) {
    // MARK: SearchBarConfig
    self.placeholder = dict["placeholder"] as? String;
    
    self.searchBarStyle = {
      guard let string = dict["placeholder"] as? String,
            let style  = UISearchBar.Style(string: string)
      else { return .default };
      
      return style;
    }();
    
    self.isTranslucent = dict["isTranslucent"] as? Bool;
    
    self.tintColor = {
      guard let value  = dict["tintColor"],
            let color  = UIColor.parseColor(value: value)
      else { return nil };
      
      return color;
    }();
    
    self.barTintColor = {
      guard let value  = dict["barTintColor"],
            let color  = UIColor.parseColor(value: value)
      else { return nil };
      
      return color;
    }();
    
    self.textColor = {
      guard let value  = dict["textColor"],
            let color  = UIColor.parseColor(value: value)
      else { return nil };
      
      return color;
    }();
    
    self.returnKeyType = {
      guard let string = dict["returnKeyType"] as? String,
            let type   = UIReturnKeyType(string: string)
      else { return nil };
      
      return type;
    }();
    
    // MARK: SearchControllerConfig
    self.hidesSearchBarWhenScrolling =
      dict["hidesSearchBarWhenScrolling"] as? Bool;
    
    self.obscuresBackgroundDuringPresentation =
      dict["obscuresBackgroundDuringPresentation"] as? Bool;
    
    self.hidesNavigationBarDuringPresentation =
      dict["hidesNavigationBarDuringPresentation"] as? Bool;
    
    self.automaticallyShowsCancelButton =
      dict["automaticallyShowsCancelButton"] as? Bool;
  };
  
  func updateSearchController(_ searchController: UISearchController) {
    let searchBar = searchController.searchBar;
    
    // MARK: SearchBarConfig
    searchBar.placeholder    = self.placeholder;
    searchBar.searchBarStyle = self.searchBarStyle;
    
    searchBar.tintColor    = self.tintColor;
    searchBar.barTintColor = self.barTintColor;
    
    if let flag = self.isTranslucent {
      searchBar.isTranslucent = flag;
    };
    
    if #available(iOS 13.0, *) {
      searchBar.searchTextField.textColor = self.textColor;
    };
    
    if let type = self.returnKeyType {
      searchBar.returnKeyType = type;
    };
    
    // MARK: SearchControllerConfig
    if let flag = self.obscuresBackgroundDuringPresentation {
      searchController.obscuresBackgroundDuringPresentation = flag;
    };
    
    if let flag = self.hidesNavigationBarDuringPresentation {
      searchController.hidesNavigationBarDuringPresentation = flag;
    };
    
    if #available(iOS 13.0, *),
       let flag = self.automaticallyShowsCancelButton {
      
      searchController.automaticallyShowsCancelButton = flag;
    };
  };
};
