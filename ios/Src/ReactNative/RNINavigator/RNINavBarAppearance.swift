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
  
  /// Defines what parts of navigation bar should be customizable, i.e controls
  /// the preset base "look" of the navigation bar.
  enum NavBarPreset: String {
    case none;
    case noShadow;
    case clearBackground;
  };
  
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
    var navBarPreset: NavBarPreset = .none;
    
    // MARK: Configuring the Title
    var titleTextAttributes: RCTTextAttributes?;
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

      //
      let shouldSetShadow     = self.navBarPreset != .noShadow;
      let shouldSetBackground = self.navBarPreset != .clearBackground;
      
      
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
      
      if let textStyle = self.titleTextAttributes {
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
      
      if shouldSetBackground,
         let effect = self.backgroundEffect {
        
        appearance.backgroundEffect = effect;
      };
      
      if shouldSetBackground,
         let color = self.backgroundColor {
        
        appearance.backgroundColor = color;
      };
      
      if shouldSetShadow,
         let color = self.shadowColor {
        
        appearance.shadowColor = color;
      };
      
      return appearance;
    };
    
    // MARK: Init + Conifg
    // -------------------
    
    init?(dict: NSDictionary){
      self.baseConfig = {
        guard let baseConfigString = dict["baseConfig"] as? String,
              let baseConfig       = BaseConfigType(rawValue: baseConfigString)
        else { return .defaultBackground };
        
        return baseConfig;
      }();
      
      self.updateValues(dict: dict);
    };
    
    func updateValues(dict: NSDictionary){
      
      // Section: Title Config
      // ---------------------
      
      /// set/init: `titleTextAttributes`
      self.titleTextAttributes = {
        guard let styleDict = dict["titleTextAttributes"] as? NSDictionary
        else { return nil };
        
        return RCTTextAttributes(dict: styleDict);
      }();
      
      /// set/init: `largeTitleTextAttributes`
      self.largeTitleTextAttributes = {
        guard let styleDict = dict["largeTitleTextAttributes"] as? NSDictionary
        else { return nil };
        
        return RCTTextAttributes(dict: styleDict);
      }();
      
      /// set/init: `titlePositionAdjustment`
      self.titlePositionAdjustment = {
        guard let offsetDict = dict["titlePositionAdjustment"] as? NSDictionary
        else { return nil };
        
        return UIOffset(dictionary: offsetDict);
      }();
  
      // Section: `BarAppearance`-related
      // --------------------------------
      
      /// set/init: `backgroundEffect`
      self.backgroundEffect = {
        guard let string = dict["backgroundEffect"] as? String,
              let style  = UIBlurEffect.Style(string: string)
        else { return nil };
        
        return UIBlurEffect(style: style);
      }();
      
      /// set/init: `backgroundColor`
      self.backgroundColor = {
        guard let value = dict["backgroundColor"],
              let color = UIColor.parseColor(value: value)
        else { return nil };
        
        return color;
      }();
      
      /// set/init: `shadowColor`
      self.shadowColor = {
        guard let value = dict["shadowColor"],
              let color = UIColor.parseColor(value: value)
        else { return nil };
        
        return color;
      }();
    };
  };
  
  /// Holds the "raw" values for customizing the navigatiob bar via the "legacy"
  /// appearance API's.
  class NavBarAppearanceLegacyConfig {
    
    var navBarPreset: NavBarPreset = .none;
    
    // MARK: Title Config
    var titleTextAttributes: RCTTextAttributes?;
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
      
      /// set/init: `titleTextAttributes`
      self.titleTextAttributes = {
        guard let styleDict = dict["titleTextAttributes"] as? NSDictionary
        else { return nil };
        
        return RCTTextAttributes(dict: styleDict);
      }();
      
      /// set/init: `largeTitleTextAttributes`
      self.largeTitleTextAttributes = {
        guard let styleDict = dict["largeTitleTextAttributes"] as? NSDictionary
        else { return nil };
        
        return RCTTextAttributes(dict: styleDict);
      }();
      
      // Section: Navbar Style
      // ---------------------
      
      /// set/init: `barStyle`
      self.barStyle = {
        guard let string = dict["barStyle"] as? String else { return nil };
        return UIBarStyle(string: string);
      }();
      
      /// set/init: `tintColor`
      self.tintColor = {
        guard let value = dict["tintColor"],
              let color = UIColor.parseColor(value: value)
        else { return nil };
        
        return color;
      }();

      /// set/init: `barTintColor`
      self.barTintColor = {
        guard let value = dict["barTintColor"],
              let color = UIColor.parseColor(value: value)
        else { return nil };
        
        return color;
      }();
    };
    
    func updateNavBarAppearance(_ navBar: UINavigationBar){
      let shouldSetBG = self.navBarPreset != .clearBackground;
      
      // Section: Title Config
      // ---------------------
      
      /// set/init: `titleTextAttributes`
      navBar.titleTextAttributes =
        self.titleTextAttributes?.effectiveTextAttributes();
      
      /// set/init: `largeTitleTextAttributes`
      if #available(iOS 11.0, *) {
        navBar.largeTitleTextAttributes =
          self.largeTitleTextAttributes?.effectiveTextAttributes();
      };
      
      // Section: Navbar Style
      // ---------------------
      
      /// set/init: `barStyle`
      navBar.barStyle = self.barStyle ?? .default;
      
      /// set/init: `tintColor`
      navBar.tintColor = self.tintColor;
      
      /// set/init: `barTintColor`
      if shouldSetBG {
        navBar.barTintColor = self.barTintColor;
      };
    };
  };
  
  // --------------------------
  // MARK:- RNINavBarAppearance
  // --------------------------
  
  static func resetNavBarAppearance(_ navBar: UINavigationBar?){
    guard let navBar = navBar else { return };
    
    // reset navbar appearance
    if #available(iOS 13.0, *) {
      navBar.standardAppearance = UINavigationBar.appearance().standardAppearance;
      navBar.compactAppearance = nil;
      navBar.scrollEdgeAppearance = nil
    };
    
    // reset legacy appearance
    navBar.barStyle = .default;
    navBar.tintColor = nil;
    navBar.barTintColor = nil;
    
    if #available(iOS 11.0, *) {
      navBar.largeTitleTextAttributes = nil
    };
  };
  
  // Tells us which API to use to change the navbar appearance.
  var mode: AppearanceMode?;
  
  // Tells us whether or not we should allow changes to certain "appearance"-related
  // properties of the navigation bar (e.g. "shadowColor", etc).
  var navBarPreset: NavBarPreset = .none {
    willSet {
      // keep `navBarPreset` values in sync between configs (just in case...)
      self.updateNavBarPreset(newValue);
    }
  };
  
  var appearanceLegacy: NavBarAppearanceLegacyConfig?;
  
  var appearanceConfigStandard  : NavBarAppearanceConfig!;
  var appearanceConfigCompact   : NavBarAppearanceConfig?;
  var appearanceConfigScrollEdge: NavBarAppearanceConfig?;
  
  init(dict: NSDictionary?){
    guard let dict = dict else { return };
    self.updateValues(dict: dict);
  };
  
  func updateValues(dict: NSDictionary){
    guard let modeString = dict["mode"] as? String,
          let mode = AppearanceMode(rawValue: modeString)
    else {
      self.mode = nil;
      return;
    };
    
    self.mode = mode;

    if let string = dict["navBarPreset"] as? String,
       let navBarPreset = NavBarPreset(rawValue: string)  {
      
      self.navBarPreset = navBarPreset;
    };
    
    switch mode {
      case .appearance:
        guard let standardDict   = dict["standardAppearance"] as? NSDictionary,
              let standardConfig = NavBarAppearanceConfig(dict: standardDict)
        else { return };
        
        self.appearanceConfigStandard = standardConfig;
        
        self.appearanceConfigCompact = {
          guard let configDict = dict["compactAppearance"] as? NSDictionary
          else { return nil };
          
          return NavBarAppearanceConfig(dict: configDict);
        }();
        
        self.appearanceConfigScrollEdge = {
          guard let configDict = dict["scrollEdgeAppearance"] as? NSDictionary
          else { return nil };
          
          return NavBarAppearanceConfig(dict: configDict);
        }();
        
      case .legacy:
        self.appearanceLegacy = NavBarAppearanceLegacyConfig(dict: dict);
    };
  };
  
  func updateNavBarAppearance(_ navBar: UINavigationBar?){
    guard let navBar = navBar else { return };
    
    guard let mode = mode else {
      // no config set, reset nav bar to default style
      Self.resetNavBarAppearance(navBar);
      // update nav bar appearance based on current `NavBarPreset`
      self.updateNavBarAppearanceFromNavBarPreset(navBar);
      return;
    };
    
    switch mode {
      case .appearance:
        guard #available(iOS 13.0, *),
              let standardConfig = self.appearanceConfigStandard
        else {
          // no config for standard appearance provided...
          // at the very least, update nav bar appearance from `navBarPreset`
          self.updateNavBarAppearanceFromNavBarPreset(navBar);
          return;
        };
        
        // update the appearance config's `navBarPreset`
        self.updateNavBarPreset(self.navBarPreset);
        
        // create standard appearance object from config
        navBar.standardAppearance = standardConfig.appearance;
        
        // create compact appearance object from config
        navBar.compactAppearance =
          self.appearanceConfigCompact?.appearance;
        
        // create "scroll edge" appearance object from config
        navBar.scrollEdgeAppearance =
          self.appearanceConfigScrollEdge?.appearance;
        
        // update appearance based on `navBarPreset` first before refreshing.
        self.updateNavBarAppearanceFromNavBarPreset(navBar);
        
        // refresh the navbar appearance
        navBar.setNeedsLayout();

      case .legacy:
        // update the legacy appearance config's `navBarPreset`
        self.updateNavBarPreset(self.navBarPreset);
        
        self.appearanceLegacy?.updateNavBarAppearance(navBar);
        self.updateNavBarAppearanceFromNavBarPreset(navBar);
    };
  };
  
  func updateNavBarAppearanceFromNavBarPreset(_ navBar: UINavigationBar){
    switch self.navBarPreset {
      case .none: break;
        
      case .noShadow:
        navBar.setShadowHidden(true, newShadowColor: nil);
        
      case .clearBackground:
        navBar.removeBackground();
    };
  };
  
  private func updateNavBarPreset(_ mode: NavBarPreset){
    self.appearanceConfigScrollEdge?.navBarPreset = mode;
    self.appearanceLegacy?.navBarPreset = mode;
    self.appearanceConfigStandard?.navBarPreset = mode;
    self.appearanceConfigCompact?.navBarPreset = mode;
  };
};
