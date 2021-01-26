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
    case IMAGE_ASSET;
    case IMAGE_SYSTEM;
    case IMAGE_REQUIRE;
    case CUSTOM;
  };
  
  // -----------------
  // MARK:- Properties
  // -----------------
    
  // inidcates what "type" of nav bar item to create
  let type: ItemType!;
  
  // the anon. func to invoke when a nav bar item is tapped
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
  
  // used for type: "IMAGE_ASSET", "IMAGE_SYSTEM", IMAGE_REQUIRE
  private var _imageValue: Any?;
  
  // used for type: "IMAGE_ASSET"
  var imageAsset: UIImage? {
    if let string = self._imageValue as? String {
      return UIImage(named: string);
      
    } else {
      return nil;
    };
  };
  
  // used for type: "IMAGE_SYSTEM"
  var imageSystem: UIImage? {
    if #available(iOS 13.0, *),
       let string = self._imageValue as? String {
      
      return UIImage(systemName: string);
      
    } else {
      return nil;
    };
  };
  
  // used for type: "IMAGE_REQUIRE"
  var imageRequire: UIImage?;
  var isImageRequireLoaded = false;
  var onImageRequireDidLoad: ((_ image: UIImage) -> ())?;
  
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
    
    // set properites for type: "IMAGE_ASSET", "IMAGE_SYSTEM", "IMAGE_REQUIRE"
    if let imageValue = dictionary["imageValue"] {
      self._imageValue = imageValue;
      
      // load "IMAGE_REQUIRE" image...
      if itemType == .IMAGE_REQUIRE {
        self.loadImageRequire(imageValue);
      };
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
  
  private func loadImageRequire(_ imageValue: Any){
    guard let dict = imageValue as? NSDictionary else { return };
    
    RNIUtilities.loadImage(dict: dict){ error, image in
      print("DEBUG -* Image loaded...");
      
      self.imageRequire = image?.withRenderingMode(.alwaysOriginal);
      self.isImageRequireLoaded = true;
      
      if let image = image {
        self.onImageRequireDidLoad?(image);
        self.onImageRequireDidLoad = nil;
      };
    };
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
          
        case .IMAGE_ASSET:
          return UIBarButtonItem(
            image: self.imageAsset,
            style: self.barButtonItemStyle,
            target: self,
            action: #selector(onNavBarItemPressed(_:))
          );
          
        case .IMAGE_SYSTEM:
          return UIBarButtonItem(
            image: self.imageSystem,
            style: self.barButtonItemStyle,
            target: self,
            action: #selector(onNavBarItemPressed(_:))
          );
          
        case .IMAGE_REQUIRE:
          return UIBarButtonItem(
            image: self.imageRequire,
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

extension RNINavBarItemConfig {
  
  /// may contain "IMAGE_REQUIRE" items
  static func createImageRequireItems(
    configItems: [RNINavBarItemConfig],
    action     : @escaping NavBarItemAction,
    completion : @escaping ([UIBarButtonItem]) -> ()
  ){
 
    var navBarItems: [UIBarButtonItem?] = [];
    
    for configItem in configItems {
      let isImageRequire = configItem.type == .IMAGE_REQUIRE;
      
      if configItem.isImageRequireLoaded || !isImageRequire {
        // item is not "IMAGE_REQUIRE", or the "require image" has already been
        // loaded, so create the nav bar item...
        let navBarItem = configItem.createUIBarButtonItem(action: action);
        // and append to start to preserve order
        navBarItems.insert(navBarItem, at: 0);
        
      } else {
        configItem.onImageRequireDidLoad = { _ in
          // "require image" has been loaded, create the nav bar item...
          let navBarItem = configItem.createUIBarButtonItem(action: action);
          // and append to start to preserve order
          navBarItems.insert(navBarItem, at: 0);
          
          // all the nav bar items have been created...
          if navBarItems.count == configItems.count {
            completion(navBarItems.compactMap {$0});
          };
        };
      };
    };
  };
};
