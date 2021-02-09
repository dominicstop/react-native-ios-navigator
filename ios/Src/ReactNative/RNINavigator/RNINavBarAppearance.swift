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
  /// the preset/base "look" of the navigation bar.
  ///
  /// The current "preset" in the config tells us whether or not we should allow
  /// changes to certain "appearance"-related properties of the navbar (e.g. when
  /// `.noShadow`, oon't allow "shadowColor" to be set, etc).
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
      
      // which appearance properties should be customizable?
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
      
      // Section: NavBar Preset
      // ----------------------
      
      switch self.navBarPreset {
        case .clearBackground:
          appearance.backgroundColor  = .clear;
          appearance.backgroundEffect = nil;
          fallthrough;
          
        case .noShadow:
          appearance.shadowColor = .clear;
          appearance.shadowImage = UIImage();
          
        default: break;
      };
      
      return appearance;
    };
    
    // MARK: Init + Conifg
    // -------------------
    
    init(navBarPreset: NavBarPreset = .none){
      self.baseConfig = .defaultBackground;
      self.navBarPreset = navBarPreset;
    };
    
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
    var titleVerticalPositionAdjustment: CGFloat = 0;
    
    // MARK: Navbar Style
    var barStyle: UIBarStyle?;
    var tintColor: UIColor?;
    var barTintColor: UIColor?;
    
    // MARK: Misc. Images
    var backIndicatorImage: RNIImageItem?;
    var backgroundImage: RNIImageItem?;
    
    // MARK: Init + Conifg
    // -------------------
    
    init(dict: NSDictionary) {
      self.updateValues(dict: dict);
    };
    
    func updateValues(dict: NSDictionary){
      self.navBarPreset = {
        guard let string = dict["navBarPreset"] as? String,
              let navBarPreset = NavBarPreset(rawValue: string)
        else { return .none };
        
        return navBarPreset;
      }();
      
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
      
      /// set/init: `titleVerticalPositionAdjustment`
      self.titleVerticalPositionAdjustment =
        dict["titleVerticalPositionAdjustment"] as? CGFloat ?? 0;
      
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
      
      // Section: Misc. Images
      // ---------------------
      
      self.backIndicatorImage = {
        guard let imageDict = dict["backIndicatorImage"] as? NSDictionary,
              let imageItem = RNIImageItem(dict: imageDict)
        else { return nil };
        
        return imageItem;
      }();
      
      self.backgroundImage = {
        guard let imageDict = dict["backgroundImage"] as? NSDictionary,
              let imageItem = RNIImageItem(dict: imageDict)
        else { return nil };
        
        return imageItem;
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
      
      /// set/init: `titleVerticalPositionAdjustment`
      if self.titleVerticalPositionAdjustment !=
          navBar.titleVerticalPositionAdjustment(for: .default){
        
        navBar.setTitleVerticalPositionAdjustment(
          self.titleVerticalPositionAdjustment,
          for: .default
        );
      };
      
      // Section: Navbar Style
      // ---------------------
      
      /// set/init: `barStyle`, the button/item color
      navBar.barStyle = self.barStyle ?? .default;
      
      /// set/init: `tintColor`
      navBar.tintColor = self.tintColor;
      
      /// set/init: `barTintColor`, e.g. the bg color
      if shouldSetBG {
        navBar.barTintColor = self.barTintColor;
      };
      
      // Section: Misc. Images
      // ---------------------
      
      /// set/init: `backIndicatorImage`
      let backImage = self.backIndicatorImage?.image;
      if backImage != navBar.backIndicatorImage {
        navBar.backIndicatorImage               = backImage;
        navBar.backIndicatorTransitionMaskImage = backImage;
      };
      
      /// set/init: `backgroundImage`
      let bgImage = self.backgroundImage?.image;
      if bgImage != navBar.backgroundImage(for: .default) {
        navBar.setBackgroundImage(bgImage, for: .any, barMetrics: .default);
      };
      
      // Section: NavBar Preset
      // ----------------------
      
      switch self.navBarPreset {
        case .clearBackground:
          navBar.setBackgroundImage(UIImage(), for: .default);
          fallthrough;
          
        case .noShadow:
          navBar.shadowImage = UIImage();
          
        default: break;
      };
    };
  };
  
  // --------------------------
  // MARK:- RNINavBarAppearance
  // --------------------------
  
  // Tells us which API to use to change the navbar appearance.
  var mode: AppearanceMode? {
    willSet {
      // mode has changed, trigger navbar reset
      self.shouldResetNavBar = (self.mode != newValue);
    }
  };
  
  var navBarPreset: NavBarPreset = .none {
    willSet {
      // preset has changed, trigger navbar reset
      self.shouldResetNavBar = (self.navBarPreset != newValue);
    }
  };
  
  // determines whether to reset the navbar first before applying the config
  private var shouldResetNavBar = false;
  
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

    self.navBarPreset = {
      guard let string = dict["navBarPreset"] as? String,
            let navBarPreset = NavBarPreset(rawValue: string)
      else { return .none };
      
      return navBarPreset;
    }();
    
    switch mode {
      case .appearance:
        self.appearanceConfigStandard = {
          guard let configDict = dict["standardAppearance"] as? NSDictionary
          else { return nil };
          
          let appearance = NavBarAppearanceConfig(dict: configDict);
          appearance?.navBarPreset = self.navBarPreset;
          
          return appearance;
        }();
        
        self.appearanceConfigCompact = {
          guard let configDict = dict["compactAppearance"] as? NSDictionary
          else { return nil };
          
          let appearance = NavBarAppearanceConfig(dict: configDict);
          appearance?.navBarPreset = self.navBarPreset;
          
          return appearance;
        }();
        
        self.appearanceConfigScrollEdge = {
          guard let configDict = dict["scrollEdgeAppearance"] as? NSDictionary
          else { return nil };
          
          let appearance = NavBarAppearanceConfig(dict: configDict);
          appearance?.navBarPreset = self.navBarPreset;
          
          return appearance;
        }();
        
      case .legacy:
        self.appearanceLegacy = NavBarAppearanceLegacyConfig(dict: dict);
    };
  };
  
  func updateNavBarAppearance(_ navBar: UINavigationBar?){
    guard let navBar = navBar else { return };
    
    guard let mode = mode else {
      // no config set, put prev. had a config, so reset navbar style
      self.shouldResetNavBar = self.mode != nil;
      return;
    };
    
    if self.shouldResetNavBar {
      self.resetNavBarAppearance(navBar);
    };
    
    switch mode {
      case .appearance:
        guard #available(iOS 13.0, *) else { return };
        
        let standardConfig = self.appearanceConfigStandard
          // no standard config provided, create a "default" config
          ?? NavBarAppearanceConfig(navBarPreset: self.navBarPreset);
        
        // create standard appearance object from config
        navBar.standardAppearance = standardConfig.appearance;
        
        // create compact appearance object from config
        navBar.compactAppearance =
          (self.appearanceConfigCompact ?? standardConfig).appearance;
        
        // create "scroll edge" appearance object from config
        navBar.scrollEdgeAppearance =
          (self.appearanceConfigScrollEdge ?? standardConfig).appearance;
        
        // refresh the navbar appearance
        navBar.setNeedsLayout();

      case .legacy:
        self.appearanceLegacy?.updateNavBarAppearance(navBar);
    };
  };
  
  func resetNavBarAppearance(_ navBar: UINavigationBar?){
    guard let navBar = navBar else { return };
    self.shouldResetNavBar = false;
    
    let defaultAppearance = UINavigationBar.appearance();
    
    // reset navbar appearance
    if #available(iOS 13.0, *) {
      navBar.standardAppearance   = defaultAppearance.standardAppearance;
      navBar.compactAppearance    = defaultAppearance.compactAppearance;
      navBar.scrollEdgeAppearance = defaultAppearance.scrollEdgeAppearance;
    };
    
    // reset legacy appearance
    navBar.barStyle     = defaultAppearance.barStyle;
    navBar.tintColor    = defaultAppearance.tintColor;
    navBar.shadowImage  = defaultAppearance.shadowImage;
    navBar.barTintColor = defaultAppearance.barTintColor;
    
    navBar.titleTextAttributes = defaultAppearance.titleTextAttributes;
    navBar.backIndicatorImage  = defaultAppearance.backIndicatorImage;
    
    navBar.backIndicatorTransitionMaskImage =
      defaultAppearance.backIndicatorTransitionMaskImage;
    
    navBar.setTitleVerticalPositionAdjustment(
      defaultAppearance.titleVerticalPositionAdjustment(for: .default),
      for: .default
    );
    
    navBar.setBackgroundImage(
      defaultAppearance.backgroundImage(for: .default),
      for: .default
    );
    
    if #available(iOS 11.0, *) {
      navBar.largeTitleTextAttributes = defaultAppearance.largeTitleTextAttributes;
    };
  };
};
