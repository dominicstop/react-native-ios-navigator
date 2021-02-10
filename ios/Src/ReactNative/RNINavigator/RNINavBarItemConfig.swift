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
    
  // used for type: "TEXT"
  private(set) var title: String?;
  
  // used for type: "SYSTEM_ITEM"
  private(set) var systemItem: UIBarButtonItem.SystemItem?;
  
  // used for type: "IMAGE_ASSET", "IMAGE_SYSTEM", etc.
  private var imageItem: RNIImageItem?;
  
  // used for type: "CUSTOM"
  weak var customView: UIView?;
  
  // shared/general properties for all the types
  private(set) var key: String?;
  private(set) var tintColor: UIColor?;
  private(set) var barButtonItemStyle: UIBarButtonItem.Style = .plain;
  private(set) var width: CGFloat?;
  private(set) var possibleTitles: Set<String>?;
  
  private(set) var backgroundImage:
    [(UIBarMetrics, RNIImageItem, UIControl.State)]?;
  
  // -----------
  // MARK:- Init
  // -----------
  
  /// Init. from a dictionary
  init?(dictionary: NSDictionary){
    guard let type     = dictionary["type"] as? String,
          let itemType = ItemType(rawValue: type)
    else { return nil };
    
    self.type = itemType;
    
    // Section: Gen. Properties
    // ------------------------
    
    self.key = dictionary["key"] as? String;
    
    self.tintColor = {
      guard let string = dictionary["tintColor"] as? String
      else { return nil };
      
      return UIColor(cssColor: string);
    }();
    
    self.barButtonItemStyle = {
      guard let string = dictionary["barButtonItemStyle"] as? String,
            let style = UIBarButtonItem.Style(string: string)
      else { return .plain };
      
      return style;
    }();

    self.width = dictionary["width"] as? CGFloat;
    
    self.possibleTitles = {
      guard let array = dictionary["possibleTitles"] as? [String]
      else { return nil };
      
      return Set(array);
    }();
    
    self.backgroundImage = {
      guard let dict = dictionary["backgroundImage"] as? NSDictionary,
            let keys = dict.allKeys as? [String]
      else { return nil };
      
      /// `{metric: { imageItem, controlState }}`
      return keys.compactMap {
        guard let metric     = UIBarMetrics(string: $0),
              let configDict = dict[$0] as? NSDictionary,
              // get image item from config
              let imageDict  = configDict["imageItem"] as? NSDictionary,
              let imageItem  = RNIImageItem(dict: imageDict),
              // get control state from config
              let controlStateString = configDict["controlState"] as? String,
              let controlState       = UIControl.State(string: controlStateString)
        else { return nil };
        
        return (metric, imageItem, controlState);
      };
    }();
    
    print("DEBUG -* backgroundImage init \(self.backgroundImage)");
    
    // Section: Type "TEXT"
    // --------------------
    
    self.title = dictionary["title"] as? String;
    
    // Section: Type "SYSTEM_ITEM"
    // ---------------------------
    
    self.systemItem = {
      guard let string = dictionary["systemItem"] as? String
      else { return nil };
      
      return UIBarButtonItem.SystemItem(string: string);
    }();
    
    // Section: Image Types
    // --------------------

    self.imageItem = {
      guard let imageType = RNIImageItem.ImageType(rawValue: type)
      else { return nil };
      
      return RNIImageItem(
        type: imageType,
        imageValue: dictionary["imageValue"]
      );
    }();
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
    
    for (metric, imageItem, controlState) in self.backgroundImage ?? [] {
      let bgImage = imageItem.image;
      
      let current = barButtonItem?.backgroundImage(
        for: controlState,
        barMetrics: metric
      );
      
      // did change, else skip...
      guard bgImage != current else { continue };
      
      barButtonItem?.setBackgroundImage(bgImage, for: controlState, barMetrics: metric);
      print("DEBUG -* barButtonItem setBackgroundImage \(metric) \(imageItem) \(controlState)");
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
