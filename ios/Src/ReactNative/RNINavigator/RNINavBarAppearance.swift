//
//  RNINavBarAppearance.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/30/21.
//

import Foundation

class RNINavBarAppearance {
  
  // ---------------------
  // MARK:- Embedded Types
  // ---------------------
  
  /// Defines whether or not to use the legacy or appearance API
  enum AppearanceMode: String {
    case legacy;
    case appearance;
  };
  
  /// Defines which base config to use for `UINavigationBarAppearance`
  enum BaseConfigType: String {
    case defaultBackground;
    case opaqueBackground;
    case transparentBackground;
  };
  
  /// Holds the "raw" values for making a `UINavigationBarAppearance` item.
  class NavBarAppearanceConfig {
    
    var baseConfig: BaseConfigType;
    
    // MARK: Configuring the Title
    var titleTextStyle: RCTTextAttributes?;
    var largeTitleTextAttributes: RCTTextAttributes?;
    var titlePositionAdjustment: UIOffset?;
    
    // MARK: `BarAppearance`-related
    var backgroundEffect: UIBlurEffect?;
    var backgroundColor: UIColor?;
    var shadowColor: UIColor?;
    
    // MARK: Computed Properties
    @available(iOS 13.0, *)
    var appearance: UINavigationBarAppearance {
      let appearance = UINavigationBarAppearance();
      
      switch self.baseConfig {
        case .defaultBackground:
          appearance.configureWithDefaultBackground();
          
        case .opaqueBackground:
          appearance.configureWithOpaqueBackground();
          
        case .transparentBackground:
          appearance.configureWithTransparentBackground();
      };
      
      // Section: Title Config
      // ---------------------
      
      if let textStyle = self.titleTextStyle {
        appearance.titleTextAttributes = textStyle.effectiveTextAttributes();
      };
      
      if let textStyle = self.largeTitleTextAttributes {
        appearance.largeTitleTextAttributes = textStyle.effectiveTextAttributes();
      };
      
      if let offset = self.titlePositionAdjustment {
        appearance.titlePositionAdjustment = offset;
      };
      
      // Section: `BarAppearance`-related
      // --------------------------------
      
      if let effect = self.backgroundEffect {
        appearance.backgroundEffect = effect;
      };
      
      if let color = self.backgroundColor {
        appearance.backgroundColor = color;
      };
      
      if let color = self.shadowColor {
        appearance.shadowColor = color;
      };
      
      return appearance;
    };
    
    // MARK: Init + Conifg
    // -------------------
    
    init?(dict: NSDictionary){
      guard let baseConfigString = dict["baseConfig"] as? String,
            let baseConfig       = BaseConfigType(rawValue: baseConfigString)
      else { return nil };
      
      self.baseConfig = baseConfig;
      self.updateValues(dict: dict);
    };
    
    func updateValues(dict: NSDictionary){
      
      // Section: Title Config
      // ---------------------
      
      /// set/init: `titleTextStyle`
      if let styleDict = dict["titleTextStyle"] as? NSDictionary {
        self.titleTextStyle = RCTTextAttributes(dict: styleDict);
      };
      
      /// set/init: `largeTitleTextAttributes`
      if let styleDict = dict["largeTitleTextAttributes"] as? NSDictionary {
        self.largeTitleTextAttributes = RCTTextAttributes(dict: styleDict);
      };
      
      /// set/init: `titlePositionAdjustment`
      if let dict = dict["titlePositionAdjustment"] as? NSDictionary {
        self.titlePositionAdjustment = UIOffset(dictionary: dict)
      };
      
      // Section: `BarAppearance`-related
      // --------------------------------
      
      /// set/init: `backgroundEffect`
      if let string = dict["backgroundEffect"] as? String,
         let style  = UIBlurEffect.Style(string: string) {
        
        self.backgroundEffect = UIBlurEffect(style: style);
      };
      
      /// set/init: `backgroundColor`
      if let number = dict["backgroundColor"] as? NSNumber,
         let color  = RCTConvert.uiColor(number) {
        
        self.backgroundColor = color;
      };
      
      /// set/init: `shadowColor`
      if let number = dict["shadowColor"] as? NSNumber,
         let color  = RCTConvert.uiColor(number) {
        
        self.shadowColor = color;
      };
    };
  };
  
  class NavBarAppearanceLegacyConfig {
    
    // MARK: Title Config
    var titleTextStyle: RCTTextAttributes?;
    var largeTitleTextAttributes: RCTTextAttributes?;
    
    // MARK: Navbar Style
    var barStyle: UIBarStyle?;
    var tintColor: UIColor?;
    var barTintColor: UIColor?;
    
    
    // MARK: Init + Conifg
    // -------------------
    
    init(dict: NSDictionary) {
      self.updateValues(dict: dict);
    };
    
    func updateValues(dict: NSDictionary){
      
      // Section: Title Config
      // ---------------------
      
      /// set/init: `titleTextStyle`
      if let styleDict = dict["titleTextStyle"] as? NSDictionary {
        self.titleTextStyle = RCTTextAttributes(dict: styleDict);
      };
      
      /// set/init: `largeTitleTextAttributes`
      if let styleDict = dict["largeTitleTextAttributes"] as? NSDictionary {
        self.largeTitleTextAttributes = RCTTextAttributes(dict: styleDict);
      };
      
      // Section: Navbar Style
      // ---------------------
      
      /// set/init: `barStyle`
      if let string = dict["barStyle"] as? String {
        self.barStyle = UIBarStyle(string: string);
      };
      
      /// set/init: `tintColor`
      if let number = dict["tintColor"] as? NSNumber,
         let color  = RCTConvert.uiColor(number) {
        
        self.tintColor = color;
      };
      
      /// set/init: `barTintColor`
      if let number = dict["barTintColor"] as? NSNumber,
         let color  = RCTConvert.uiColor(number) {
        
        self.barTintColor = color;
      };
    };
    
    func updateNavBarAppearance(_ navBar: UINavigationBar){

      // Section: Title Config
      // ---------------------
      
      /// set/init: `titleTextStyle`
      if let style = self.titleTextStyle {
        navBar.titleTextAttributes = style.effectiveTextAttributes();
      };
      
      /// set/init: `largeTitleTextAttributes`
      if #available(iOS 11.0, *),
        let style = self.largeTitleTextAttributes {
        
        navBar.largeTitleTextAttributes = style.effectiveTextAttributes();
      };
      
      // Section: Navbar Style
      // ---------------------
      
      /// set/init: `barStyle`
      if let style = self.barStyle {
        navBar.barStyle = style;
      };
      
      /// set/init: `tintColor`
      if let color = self.tintColor {
        navBar.tintColor = color;
      };
      
      /// set/init: `barTintColor`
      if let color = self.barTintColor {
        navBar.barTintColor = color;
      };
    };
  };
  
  // --------------------------
  // MARK:- RNINavBarAppearance
  // --------------------------
  
  let mode: AppearanceMode;
  
  var appearanceLegacy: NavBarAppearanceLegacyConfig?;
  
  var appearanceConfigStandard  : NavBarAppearanceConfig!;
  var appearanceConfigCompact   : NavBarAppearanceConfig?;
  var appearanceConfigScrollEdge: NavBarAppearanceConfig?;
  
  
  init?(dict: NSDictionary){
    guard let modeString = dict["mode"] as? String,
          let mode       = AppearanceMode(rawValue: modeString)
    else { return nil };
    
    self.mode = mode;
    self.updateValues(dict: dict);
  };
  
  func updateValues(dict: NSDictionary){
    switch mode {
      case .appearance:
        guard let standardDict   = dict["standardAppearance"] as? NSDictionary,
              let standardConfig = NavBarAppearanceConfig(dict: standardDict)
        else { return };
        
        self.appearanceConfigStandard = standardConfig;
        
        if let configDict = dict["compactAppearance"] as? NSDictionary {
          self.appearanceConfigCompact = NavBarAppearanceConfig(dict: configDict);
        };
        
        if let configDict = dict["scrollEdgeAppearance"] as? NSDictionary {
          self.appearanceConfigScrollEdge = NavBarAppearanceConfig(dict: configDict);
        };
        
      case .legacy:
        self.appearanceLegacy = NavBarAppearanceLegacyConfig(dict: dict);
    };
  };
  
  func updateNavBarAppearance(_ navBar: UINavigationBar?){
    guard let navBar = navBar else { return };
    
    switch mode {
      case .appearance:
        guard #available(iOS 13.0, *) else { return };
        
        navBar.standardAppearance =
          self.appearanceConfigStandard.appearance;
        
        navBar.compactAppearance =
          self.appearanceConfigCompact?.appearance ??
          self.appearanceConfigStandard.appearance;
        
        navBar.scrollEdgeAppearance =
          self.appearanceConfigScrollEdge?.appearance ??
          self.appearanceConfigStandard   .appearance;

      case .legacy:
        self.appearanceLegacy?.updateNavBarAppearance(navBar)
    };
  };
};
