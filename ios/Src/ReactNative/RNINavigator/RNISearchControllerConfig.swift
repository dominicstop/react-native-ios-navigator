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
  
  let searchTextFieldBackgroundColor: UIColor?;
  
  // MARK: SearchControllerConfig
  let hidesSearchBarWhenScrolling: Bool?;
  
  let obscuresBackgroundDuringPresentation: Bool?;
  let hidesNavigationBarDuringPresentation: Bool?;
  let automaticallyShowsCancelButton: Bool?;
  
  // MARK: Custom
  let leftIconTintColor: UIColor?;
  let placeholderTextColor: UIColor?;

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
    
    self.searchTextFieldBackgroundColor = {
      guard let value  = dict["searchTextFieldBackgroundColor"],
            let color  = UIColor.parseColor(value: value)
      else { return nil };
      
      return color;
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
    
    // MARK: Custom
    self.leftIconTintColor = {
      guard let value  = dict["leftIconTintColor"],
            let color  = UIColor.parseColor(value: value)
      else { return nil };
      
      return color;
    }();
    
    self.placeholderTextColor = {
      guard let value  = dict["placeholderTextColor"],
            let color  = UIColor.parseColor(value: value)
      else { return nil };
      
      return color;
    }();
  };
  
  func updateSearchController(
    _ searchController: UISearchController,
    searchBarTextField: UITextField? = nil,
    searchBarPlaceholderLabel: UILabel? = nil
  ) {
    let searchBar = searchController.searchBar;
    
    // MARK: SearchBarConfig
    searchBar.placeholder    = self.placeholder;
    searchBar.searchBarStyle = self.searchBarStyle;
    
    searchBar.tintColor    = self.tintColor;
    searchBar.barTintColor = self.barTintColor;
    
    searchBar.isTranslucent = self.isTranslucent ?? true;
    
    if #available(iOS 13.0, *) {
      searchBar.searchTextField.textColor = self.textColor;
      
    } else if let searchBarTextField = searchBarTextField {
      searchBarTextField.textColor = self.textColor;
    };
    
    searchBar.returnKeyType = self.returnKeyType ?? .search;
    
    if let color = self.searchTextFieldBackgroundColor {
      if #available(iOS 13.0, *) {
        searchBar.searchTextField.backgroundColor = color
        
      } else if let searchBarTextField = searchBarTextField {
        #warning("Handle reset to default...")
        searchBarTextField.backgroundColor = color;
      };
    };
    
    // MARK: SearchControllerConfig
    searchController.obscuresBackgroundDuringPresentation =
      self.obscuresBackgroundDuringPresentation ?? false;
    
    searchController.hidesNavigationBarDuringPresentation =
      self.hidesNavigationBarDuringPresentation ?? true;
    
    if #available(iOS 13.0, *) {
      searchController.automaticallyShowsCancelButton =
        self.automaticallyShowsCancelButton ?? true;
    };
    
    // MARK: Custom
    if let searchBarTextField = searchBarTextField,
       let searchBarPlaceholderLabel = searchBarPlaceholderLabel {
      
      #warning("Handle reset to default + appearance change...")
      if let color = self.leftIconTintColor,
         let searchIcon = searchBarTextField.leftView as? UIImageView {
          
        searchIcon.image = searchIcon.image?.withRenderingMode(.alwaysTemplate);
        searchIcon.tintColor = color;
      };
      
      #warning("Handle reset to default...")
      if let color = self.placeholderTextColor {
        searchBarPlaceholderLabel.textColor = color;
      };
    };
  };
};
