//
//  RNISearchControllerConfig.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/20/21.
//

import Foundation

struct RNISearchControllerConfig {
  
  private static var defaultPlaceholderTextColor: UIColor?;
  private static var defaultLeftIconTintColor: UIColor?;
  private static var defaultSearchBarTextFieldBackgroundColor: UIColor?;
  
  // MARK: SearchBarConfig
  let placeholder: String?;
  let prompt: String?;
  
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
    
    self.prompt = dict["prompt"] as? String;
    
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
    searchBar.placeholder = self.placeholder;
    searchBar.prompt      = self.prompt;
    
    searchBar.searchBarStyle = self.searchBarStyle;
    searchBar.isTranslucent  = self.isTranslucent ?? true;
    
    searchBar.tintColor    = self.tintColor;
    searchBar.barTintColor = self.barTintColor;
    
    if #available(iOS 13.0, *) {
      searchBar.searchTextField.textColor = self.textColor;
      
    } else if let searchBarTextField = searchBarTextField {
      searchBarTextField.textColor = self.textColor;
    };
    
    searchBar.returnKeyType = self.returnKeyType ?? .search;
    
    if #available(iOS 13.0, *) {
      // A: Use iOS 13+ API to change the search text field's bg color
      searchBar.searchTextField.backgroundColor =
        self.searchTextFieldBackgroundColor;
      
    } else if let searchBarTextField = searchBarTextField {
      // B: Manually change the search text field's bg color
      
      // save default color before overriding
      if Self.defaultSearchBarTextFieldBackgroundColor == nil {
        Self.defaultSearchBarTextFieldBackgroundColor = searchBarTextField.backgroundColor;
      };
      
      if let color = self.searchTextFieldBackgroundColor {
        // B1: override bg color
        searchBarTextField.backgroundColor = color;
        
      } else {
        // B2: config did not specify bg color (and search's bg color has been
        //     changed/overridden), so revert to default value
        searchBarTextField.backgroundColor =
          Self.defaultSearchBarTextFieldBackgroundColor;
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
       let searchIcon = searchBarTextField.leftView as? UIImageView {
      
      // save default color before overriding
      if Self.defaultLeftIconTintColor == nil {
        Self.defaultLeftIconTintColor = searchIcon.tintColor;
      };
      
      if let color = self.leftIconTintColor {
        // A: override current value with config's value
        searchIcon.image = searchIcon.image?.withRenderingMode(.alwaysTemplate);
        searchIcon.tintColor = color;
        
      } else {
        // B: config did not value (and the property has been previously
        //    changed/overridden), so revert to default value
        searchIcon.image = searchIcon.image?.withRenderingMode(.alwaysTemplate);
        searchIcon.tintColor = Self.defaultLeftIconTintColor;
      };
    };
    
    if let searchBarPlaceholderLabel = searchBarPlaceholderLabel {
      
      // save default color before overriding
      if Self.defaultPlaceholderTextColor == nil {
        Self.defaultPlaceholderTextColor = searchBarPlaceholderLabel.textColor;
      };
      
      if let color = self.placeholderTextColor {
        // A: override current value with config's value
        searchBarPlaceholderLabel.textColor = color;
        
      } else {
        // B: config did not value (and the property has been previously
        //    changed/overridden), so revert to default value
        searchBarPlaceholderLabel.textColor = Self.defaultPlaceholderTextColor;
      };
    };
  };
};
