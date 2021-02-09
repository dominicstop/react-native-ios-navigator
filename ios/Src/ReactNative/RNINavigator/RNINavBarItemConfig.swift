//
//  RNINavBarItemConfig.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/22/21.
//

import Foundation


class RNINavBarItemConfig {
  
  // ---------------------
  // MARK:- Embedded Types
  // ---------------------
  
  typealias NavBarItemAction = ((_ config: RNINavBarItemConfig) -> ());
  
  enum ItemType: String {
    case TEXT;
    case SYSTEM_ITEM;
    case CUSTOM;
    
    // Supported `ImageType`'s
    case IMAGE_ASSET;
    case IMAGE_SYSTEM;
    case IMAGE_EMPTY;
  };
  
  // -----------------
  // MARK:- Properties
  // -----------------
    
  // inidcates what "type" of nav bar item to create
  let type: ItemType!;
  
  // invoked when a nav bar item is tapped.
  // note: stored anon. closure, be sure to use weak/unowned self
  private var action: NavBarItemAction?;
    
  // shared/general properties for all the types
  private(set) var key: String?;
  private(set) var tintColor: UIColor?;
  private(set) var barButtonItemStyle: UIBarButtonItem.Style = .plain;
  private(set) var width: CGFloat?;
  private(set) var possibleTitles: Set<String>?

  // used for type: "TEXT"
  private(set) var title: String?;
  
  // used for type: "SYSTEM_ITEM"
  private(set) var systemItem: UIBarButtonItem.SystemItem?;
  
  // used for type: "IMAGE_ASSET", "IMAGE_SYSTEM", etc.
  private var imageItem: RNIImageItem?;
  
  // used for type: "CUSTOM"
  weak var customView: UIView?;
  
  // -----------
  // MARK:- Init
  // -----------
  
  /// Init. from a dictionary
  init?(dictionary: NSDictionary){
    guard let type     = dictionary["type"] as? String,
          let itemType = ItemType(rawValue: type)
    else { return nil };
    
    self.type = itemType;
    
    // set general property: `key`
    if let string = dictionary["key"] as? String {
      self.key = string;
    };
    
    // set general property: `tintColor`
    if let string = dictionary["tintColor"] as? String,
       let color  = UIColor(cssColor: string) {
      
      self.tintColor = color;
    };
    
    // set general property: `barButtonItemStyle`
    if let string = dictionary["barButtonItemStyle"] as? String,
       let style = UIBarButtonItem.Style(string: string) {
      
      self.barButtonItemStyle = style;
    };
    
    // set general property: `width`
    if let width = dictionary["width"] as? CGFloat {
      self.width = width;
    };
    
    // set general property: `possibleTitles`
    if let array = dictionary["possibleTitles"] as? [String] {
      self.possibleTitles = Set(array);
    };
    
    // set properites for type "TEXT"
    if let string = dictionary["title"] as? String {
      self.title = string;
    };
    
    // set properites for type: "SYSTEM_ITEM"
    if let string = dictionary["systemItem"] as? String,
       let systemItem = UIBarButtonItem.SystemItem(string: string) {
      
      self.systemItem = systemItem;
    };
    
    // set properites for type: "IMAGE_ASSET", "IMAGE_SYSTEM", etc.
    if let imageType = RNIImageItem.ImageType(rawValue: type) {
      self.imageItem = RNIImageItem(
        type: imageType,
        imageValue: dictionary["imageValue"]
      );
    };
  };
  
  /// Init. from a custom view
  init(customView: UIView){
    self.type = .CUSTOM;
    self.customView = customView;
  };
  
  /// Init. from an optional custom view
  convenience init?(customView: UIView?){
    guard let view = customView else { return nil };
    self.init(customView: view);
  };
  
  // ----------------
  // MARK:- Functions
  // ----------------
  
  @objc private func onNavBarItemPressed(_ sender: UIBarButtonItem){
    self.action?(self);
  };
    
  func createUIBarButtonItem(action: NavBarItemAction?) -> UIBarButtonItem? {
    self.action = action;
    
    let barButtonItem: UIBarButtonItem? = {
      switch self.type {
        case .TEXT:
          return UIBarButtonItem(
            title: self.title,
            style: self.barButtonItemStyle,
            target: self,
            action: #selector(onNavBarItemPressed(_:))
          );
          
        case .SYSTEM_ITEM:
          return UIBarButtonItem(
            barButtonSystemItem: self.systemItem!,
            target: self,
            action: #selector(onNavBarItemPressed(_:))
          );
      
        case .CUSTOM:
          return UIBarButtonItem(customView: self.customView!);
        
        // `RNIImageItem.ImageType` Items
        // Note: Creation of image handled by `RNIImageItem`
        case .IMAGE_ASSET : fallthrough;
        case .IMAGE_EMPTY : fallthrough;
        case .IMAGE_SYSTEM:
          return UIBarButtonItem(
            image: self.imageItem?.image,
            style: self.barButtonItemStyle,
            target: self,
            action: #selector(onNavBarItemPressed(_:))
          );
          
        default: return nil;
      };
    }();
    
    barButtonItem?.style          = self.barButtonItemStyle;
    barButtonItem?.tintColor      = self.tintColor;
    barButtonItem?.possibleTitles = self.possibleTitles;
    
    if let width = self.width {
      barButtonItem?.width = width;
    };
    
    return barButtonItem;
  };
  
  /// Makes a dict. you can pass as a param to `RCTBubblingEventBlock`
  func makeNavBarItemEventParams() -> [AnyHashable: Any]{
    return [
      "key" : self.key ?? "",
      "type": self.type.rawValue
    ];
  };
};
