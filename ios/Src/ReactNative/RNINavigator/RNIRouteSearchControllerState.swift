//
//  RNIRouteSearchControllerState.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 11/3/21.
//

import Foundation

/// Maps to `RouteSearchControllerState.ts`
struct RNIRouteSearchControllerState {
  
  // MARK: - Properties: SearchBarState-Related
  // ------------------------------------------
  
  let text: String?;
  
  let showsBookmarkButton     : Bool?;
  let showsCancelButton       : Bool?;
  let showsSearchResultsButton: Bool?;

  let showsScopeBar: Bool?;
  let selectedScopeButtonIndex: Int?;

  let isSearchResultsButtonSelected: Bool?;

  // MARK: - Properties: SearchControllerState-Related
  // -------------------------------------------------
  
  let isActive: Bool?;
  
  // MARK: - Computed Properties
  // ---------------------------
  
  var dictionary: [String: AnyHashable] {
    var dict: [String: AnyHashable] = [:];
    
    // MARK: Set SearchBarState-Related
    // --------------------------------
    
    if let value = self.text {
      dict["text"] = value;
    };
    
    if let value = self.showsBookmarkButton {
      dict["showsBookmarkButton"] = value;
    };
    
    if let value = self.showsCancelButton {
      dict["showsCancelButton"] = value;
    };
    
    if let value = self.showsSearchResultsButton {
      dict["showsSearchResultsButton"] = value;
    };
    
    if let value = self.showsScopeBar {
      dict["showsScopeBar"] = value;
    };
    
    if let value = self.selectedScopeButtonIndex {
      dict["selectedScopeButtonIndex"] = value;
    };
    
    if let value = self.isSearchResultsButtonSelected {
      dict["isSearchResultsButtonSelected"] = value;
    };
    
    // MARK: Set SearchControllerState-Related
    // ---------------------------------------
    
    if let value = self.isActive {
      dict["isActive"] = value;
    };
    
    return dict;
  };
  
  // MARK: - Init
  // ------------
  
  init(dict: NSDictionary) {
    
    // MARK: Set SearchBarState-Related
    // --------------------------------
    
    self.text = dict["text"] as? String;
    
    self.showsBookmarkButton      = dict["showsBookmarkButton"     ] as? Bool;
    self.showsCancelButton        = dict["showsCancelButton"       ] as? Bool;
    self.showsSearchResultsButton = dict["showsSearchResultsButton"] as? Bool;
    
    self.showsScopeBar = dict["showsScopeBar"] as? Bool;
    
    self.selectedScopeButtonIndex = {
      guard let number = dict["selectedScopeButtonIndex"] as? NSNumber
      else { return nil };
      
      return number.intValue;
    }();
    
    self.isSearchResultsButtonSelected =
      dict["isSearchResultsButtonSelected"] as? Bool;
    
    // MARK: Set SearchControllerState-Related
    // ---------------------------------------
    
    self.isActive = dict["isActive"] as? Bool;
  };
  
  init(searchController: UISearchController){
    let searchBar = searchController.searchBar;
    
    // MARK: Set SearchBarState-Related
    // --------------------------------
    
    self.text = searchBar.text;
    
    self.showsBookmarkButton      = searchBar.showsBookmarkButton;
    self.showsCancelButton        = searchBar.showsCancelButton;
    self.showsSearchResultsButton = searchBar.showsSearchResultsButton;
    
    self.showsScopeBar            = searchBar.showsScopeBar;
    self.selectedScopeButtonIndex = searchBar.selectedScopeButtonIndex;
    
    self.isSearchResultsButtonSelected = searchBar.isSearchResultsButtonSelected;
    
    // MARK: Set SearchControllerState-Related
    // ---------------------------------------
    
    self.isActive = searchController.isActive;
  };
  
  // MARK: - Methods
  // ---------------
  
  func apply(to searchController: UISearchController){
    let searchBar = searchController.searchBar;
    
    // MARK: Set SearchBarState-Related
    // --------------------------------
    
    if let value = self.text {
      searchBar.text = value;
    };
    
    if let value = self.showsBookmarkButton {
      searchBar.showsBookmarkButton = value;
    };
    
    if let value = self.showsCancelButton {
      searchBar.showsCancelButton = value;
    };
    
    if let value = self.showsSearchResultsButton {
      searchBar.showsSearchResultsButton = value;
    };
    
    if let value = self.showsScopeBar {
      searchBar.showsScopeBar = value;
    };
    
    if let value = self.selectedScopeButtonIndex {
      searchBar.selectedScopeButtonIndex = value;
    };
    
    if let value = self.isSearchResultsButtonSelected {
      searchBar.isSearchResultsButtonSelected = value;
    };
    
    // MARK: Set SearchControllerState-Related
    // ---------------------------------------
    
    if let value = self.isActive {
      searchController.isActive = value;
    };
  };
};
