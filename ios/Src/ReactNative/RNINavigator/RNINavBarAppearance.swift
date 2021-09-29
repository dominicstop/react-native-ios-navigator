//
//  RNINavBarAppearance.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/30/21.
//

import Foundation

/// This class is used to hold config for customizing the navigation bar and also
/// handles applying/resetting the nav bar appearance.
internal class RNINavBarAppearance {
  
  // MARK:- Embedded Types
  // ---------------------
  
  /// Defines what parts of navigation bar should be customizable, i.e controls
  /// the preset/base "look" of the navigation bar.
  ///
  /// The current "preset" in the config tells us whether or not we should allow
  /// changes to certain "appearance"-related properties of the navbar (e.g. when
  /// `.noShadow`, don't allow "shadowColor" to be set, etc).
  ///
  enum NavBarPreset: String {
    case none;
    case noShadow;
    case clearBackground;
  };
  
  /// Defines whether or not to use the legacy or appearance API
  enum AppearanceMode: String {
    /// Uses the pre-iOS 13 API's for customizing the navigation bar
    case legacy;
    
    /// Uses the iOS 13+ API's for customizing the nav bar.
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
    
    // MARK: `UIBarAppearance`-related
    var backgroundEffect: UIBlurEffect?;
    var backgroundColor: UIColor?;
    var backgroundImage: RNIImageItem?
    var backgroundImageContentMode: UIView.ContentMode?;
    
    var shadowColor: UIColor?;
    var shadowImage: RNIImageItem?
    
    // MARK: Button Appearance
    var backIndicatorImage: RNIImageItem?;
    
    var buttonAppearance    : RNIBarButtonItemAppearance?;
    var backButtonAppearance: RNIBarButtonItemAppearance?;
    var doneButtonAppearance: RNIBarButtonItemAppearance?;
    
    // MARK: Computed Properties
    @available(iOS 13.0, *)
    var appearance: UINavigationBarAppearance {
      let appearance = UINavigationBarAppearance();
      
      // which appearance properties should be customizable?
      let shouldSetBackground = self.navBarPreset != .clearBackground;
      let shouldSetShadow     = self.navBarPreset != .noShadow && shouldSetBackground;
      
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
      
      if shouldSetBackground {
        appearance.backgroundEffect = self.backgroundEffect;
        appearance.backgroundColor = self.backgroundColor;
        
        if let imageItem = self.backgroundImage {
          appearance.backgroundImage = imageItem.image;
        };
        
        if let mode = self.backgroundImageContentMode {
          appearance.backgroundImageContentMode = mode;
        };
      };
      
      if shouldSetShadow {
        appearance.shadowColor = self.shadowColor;
        
        if let imageItem = self.shadowImage {
          appearance.shadowImage = imageItem.image;
        };
      };
      
      // Section: Button Appearance
      // --------------------------
      
      let backImage = self.backIndicatorImage?.image;
      
      /// **NOTE**: cannot hide indicator via setting this to `UIImage()` or `nil`
      appearance.setBackIndicatorImage(backImage, transitionMaskImage: backImage);
      
      if let buttonAppearance = self.buttonAppearance {
        appearance.buttonAppearance = buttonAppearance.create();
      };
      
      if let buttonAppearance = self.backButtonAppearance {
        appearance.backButtonAppearance = buttonAppearance.create();
      };
      
      if let buttonAppearance = self.doneButtonAppearance {
        appearance.doneButtonAppearance = buttonAppearance.create();
      };
      
      // Section: NavBar Preset
      // ----------------------
      
      switch self.navBarPreset {
        case .clearBackground:
          appearance.backgroundColor  = .clear;
          appearance.backgroundEffect = nil;
          appearance.backgroundImage  = nil;
          fallthrough;
          
        case .noShadow:
          appearance.shadowColor = .clear;
          appearance.shadowImage = UIImage();
          
        default: break;
      };
      
      return appearance;
    };
    
    var hasShadowImage: Bool {
      self.shadowImage != nil
    };
    
    var hasBackgroundImage: Bool {
      self.backgroundImage != nil
    };
    
    // MARK: Init + Config
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
      
      /// set/init: `backgroundImage`
      self.backgroundImage = {
        guard let imageDict = dict["backgroundImage"] as? NSDictionary,
              let imageItem = RNIImageItem(dict: imageDict)
        else { return nil };
        
        return imageItem;
      }();
      
      self.backgroundImageContentMode = {
        guard let string = dict["backgroundImageContentMode"] as? String,
              let value  = UIView.ContentMode(string: string)
        else { return nil };
        
        return value;
      }();
      
      /// set/init: `shadowColor`
      self.shadowColor = {
        guard let value = dict["shadowColor"],
              let color = UIColor.parseColor(value: value)
        else { return nil };
        
        return color;
      }();
      
      self.shadowImage = {
        guard let imageDict = dict["shadowImage"] as? NSDictionary,
              let imageItem = RNIImageItem(dict: imageDict)
        else { return nil };
        
        return imageItem;
      }();
      
      // Section: Button Appearance
      // --------------------------
      
      self.backIndicatorImage = {
        guard let imageDict = dict["backIndicatorImage"] as? NSDictionary,
              let imageItem = RNIImageItem(dict: imageDict)
        else { return nil };
        
        return imageItem;
      }();
      
      self.buttonAppearance = {
        guard let dictConfig = dict["buttonAppearance"] as? NSDictionary
        else { return nil };
        
        return RNIBarButtonItemAppearance(dict: dictConfig);
      }();
      
      self.backButtonAppearance = {
        guard let dictConfig = dict["backButtonAppearance"] as? NSDictionary
        else { return nil };
        
        return RNIBarButtonItemAppearance(dict: dictConfig);
      }();
      
      self.doneButtonAppearance = {
        guard let dictConfig = dict["doneButtonAppearance"] as? NSDictionary
        else { return nil };
        
        return  RNIBarButtonItemAppearance(dict: dictConfig);
      }();
    };
    
    func prepareForUpdate(_ navBar: UINavigationBar){
      let statusBarHeight = UIApplication.shared.statusBarFrame.size.height;
      
      let navBarHeight = navBar.frame.height;
      let navBarWidth  = navBar.frame.width;
      
      // setup background image size
      self.backgroundImage?.defaultSize = CGSize(
        width : navBarWidth,
        height: navBarHeight + statusBarHeight
      );
      
      self.shadowImage?.defaultSize = CGSize(
        width : navBarWidth,
        height: navBarHeight
      );
    };
  };
  
  /// Holds the "raw" values for customizing the navigation bar via the "legacy"
  /// appearance API's.
  class NavBarAppearanceLegacyConfig {
    
    var navBarPreset: NavBarPreset = .none;
    
    // MARK: Title Config
    var titleTextAttributes: RCTTextAttributes?;
    var largeTitleTextAttributes: RCTTextAttributes?;
    var titleVerticalPositionAdjustment: [(UIBarMetrics, CGFloat)]?;
    
    // MARK: Navbar Style
    var barStyle: UIBarStyle?;
    var tintColor: UIColor?;
    var barTintColor: UIColor?;
    
    // MARK: Misc. Images
    var backIndicatorImage: RNIImageItem?;
    var backgroundImage: [(UIBarMetrics, RNIImageItem)]?;
    var shadowImage: RNIImageItem?;
    
    // MARK: Computed Properties
    // -------------------------
    
    var hasShadowImage: Bool {
      self.shadowImage != nil
    };
    
    var hasBackgroundImage: Bool {
      self.backgroundImage != nil
    };
    
    // MARK: Init + Config
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
      
      self.titleTextAttributes = {
        guard let styleDict = dict["titleTextAttributes"] as? NSDictionary
        else { return nil };
        
        return RCTTextAttributes(dict: styleDict);
      }();
      
      self.largeTitleTextAttributes = {
        guard let styleDict = dict["largeTitleTextAttributes"] as? NSDictionary
        else { return nil };
        
        return RCTTextAttributes(dict: styleDict);
      }();
      
      self.titleVerticalPositionAdjustment = {
        guard let dict = dict["titleVerticalPositionAdjustment"] as? NSDictionary,
              let keys = dict.allKeys as? [String]
        else { return nil };
        
        return keys.compactMap {
          guard let metric = UIBarMetrics(string: $0),
                let value  = dict[$0] as? CGFloat
          else { return nil };
          
          return (metric, value);
        };
      }();
      
      // Section: Navbar Style
      // ---------------------
      
      self.barStyle = {
        guard let string = dict["barStyle"] as? String else { return nil };
        return UIBarStyle(string: string);
      }();
      
      self.tintColor = {
        guard let value = dict["tintColor"],
              let color = UIColor.parseColor(value: value)
        else { return nil };
        
        return color;
      }();

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
        guard let dict = dict["backgroundImage"] as? NSDictionary,
              let keys = dict.allKeys as? [String]
        else { return nil };
        
        return keys.compactMap {
          guard let metric    = UIBarMetrics(string: $0),
                let imageDict = dict[$0] as? NSDictionary,
                let imageItem = RNIImageItem(dict: imageDict)
          else { return nil };
          
          return (metric, imageItem);
        };
      }();
      
      self.shadowImage = {
        guard let imageDict = dict["shadowImage"] as? NSDictionary,
              let imageItem = RNIImageItem(dict: imageDict)
        else { return nil };
        
        return imageItem;
      }();
    };
    
    /// Copy over the current config to legacy appearance config
    func applyConfig(
      to config: RNINavigationControllerLegacyAppearanceConfig,
      navBar: UINavigationBar
    ){
      
      /// The ff. are use to set the size of the various images
      let statusBarHeight = UIApplication.shared.statusBarFrame.size.height;
      
      /// Note: Sometimes the nav bar size is 0 (e.g. because it's not on screen
      /// yet), so provide a min. value to use...
      let navBarHeight = max(navBar.frame.height, 50);
      let navBarWidth  = max(navBar.frame.width , 75);
      
      let shouldSetBackground = self.navBarPreset != .clearBackground;
      let shouldSetShadow     = self.navBarPreset != .noShadow && shouldSetBackground;
      
      // reset config to default before writing to it
      config.initializeWithDefaultValues();
      
      // Section: Title Config
      // ---------------------
      
      config.titleTextAttributes =
        self.titleTextAttributes?.effectiveTextAttributes();
      
      if #available(iOS 11.0, *) {
        config.largeTitleTextAttributes =
          self.largeTitleTextAttributes?.effectiveTextAttributes();
      };
      
      for (metric, number) in self.titleVerticalPositionAdjustment ?? [] {
        config.titleVerticalPositionAdjustment[metric] = number;
      };
      
      // Section: Navbar Style
      // ---------------------
      
      if let barStyle = self.barStyle {
        config.barStyle = barStyle;
      };
      
      if let tintColor = self.tintColor {
        config.tintColor = tintColor;
      };
      
      /// set/init: `barTintColor`, e.g. the bg color
      if shouldSetBackground,
         let barTintColor = self.barTintColor {
        
        config.barTintColor = barTintColor;
      };
      
      // Section: Misc. Images
      // ---------------------
      
      config.backIndicatorImage = self.backIndicatorImage?.image;

      for metric in UIBarMetrics.allCases {
        
        if shouldSetBackground {
          // get the matching bg image for the current metric
          let bgImageConfig = self.backgroundImage?.first { metric == $0.0 };
          
          // if no bg image for metric, skip...
          guard let (_, bgImageItem) = bgImageConfig else { continue };
          
          // provide default size for bg image
          bgImageItem.defaultSize = CGSize(
            width : navBarWidth,
            height: navBarHeight + statusBarHeight
          );
          
          // set bg image for metric
          config.backgroundImage[metric] = bgImageItem.image;
          
        } else {
          // no background, make see-through
          config.backgroundImage[metric] = UIImage();
        };
      };
            
      if shouldSetShadow {
        // provide default size for shadow
        self.shadowImage?.defaultSize = CGSize(
          width : navBarWidth,
          height: navBarHeight
        );
        
        config.shadowImage = self.shadowImage?.image;
      };
      
      // Section: NavBar Preset
      // ----------------------
      
      switch self.navBarPreset {
        case .clearBackground: fallthrough;
          
        case .noShadow:
          config.shadowImage = UIImage();
          
        default: break;
      };
    };
    
    func applyConfig(to navBar: UINavigationBar){
      // The logic to apply the config to the navigation bar is impl. in this
      // class, so re-use to make things DRY
      let navBarLegacyConfig = RNINavigationControllerLegacyAppearanceConfig();
      
      // copy over config
      self.applyConfig(to: navBarLegacyConfig, navBar: navBar);
      
      // apply legacy appearance
      navBarLegacyConfig.applyConfig(to: navBar);
    };
  };
  
  // MARK:- RNINavBarAppearance - Class Methods
  // ------------------------------------------
  
  /// Reset navigation bar appearance-related properties
  static func resetNavBarAppearanceToDefault(for navBar: UINavigationBar){
    guard #available(iOS 13.0, *) else { return };
    
    let defaultAppearance = UINavigationBar.appearance();
    
    navBar.standardAppearance   = defaultAppearance.standardAppearance;
    navBar.compactAppearance    = defaultAppearance.compactAppearance;
    navBar.scrollEdgeAppearance = defaultAppearance.scrollEdgeAppearance;
  };
  
  /// Reset `navigationItem` appearance-related properties
  static func resetNavBarAppearanceToDefault(for navItem: UINavigationItem){
    guard #available(iOS 13.0, *) else { return };
    
    let defaultAppearance = UINavigationBar.appearance();
    
    navItem.standardAppearance   = defaultAppearance.standardAppearance;
    navItem.compactAppearance    = defaultAppearance.compactAppearance;
    navItem.scrollEdgeAppearance = defaultAppearance.scrollEdgeAppearance;
  };
  
  /// Reset navigation bar "legacy appearance"-related properties
  static func resetNavBarAppearanceLegacyToDefault(for navBar: UINavigationBar){
    // This is init. w/ the default legacy appearance config, and contains the
    // logic for applying the config to the nav. bar, so re-use (DRY)
    let config = RNINavigationControllerLegacyAppearanceConfig();
    config.applyConfig(to: navBar);
  };
  
  // MARK:- RNINavBarAppearance - Properties
  // ---------------------------------------
  
  /// indicates whether or not the iOS 13+ appearance API was ever used
  var didUseNewAppearance = false;
  
  // Tells us which API to use to change the nav bar appearance.
  var mode: AppearanceMode? {
    willSet {
      // mode has changed, trigger nav bar reset
      self.shouldResetNavBar =
        self.shouldResetNavBar || (self.mode != newValue);
    }
  };
  
  var navBarPreset: NavBarPreset = .none {
    willSet {
      // preset has changed, trigger navbar reset
      self.shouldResetNavBar = (
        self.shouldResetNavBar || (self.navBarPreset != newValue)
      );
    }
  };
  
  // determines whether to reset the nav bar first before applying the config
  var shouldResetNavBar = false;
  
  var appearanceLegacy: NavBarAppearanceLegacyConfig?;
  
  var appearanceConfigStandard   : NavBarAppearanceConfig!;
  var appearanceConfigCompact    : NavBarAppearanceConfig?;
  var appearanceConfigScrollEdge : NavBarAppearanceConfig?;
  var appearanceCompactScrollEdge: NavBarAppearanceConfig?;
  
  // MARK:- RNINavBarAppearance - Computed Properties
  // ------------------------------------------------
  
  var appearanceConfigs: [NavBarAppearanceConfig]? {
    let configs = [
      self.appearanceConfigStandard,
      self.appearanceConfigCompact,
      self.appearanceConfigScrollEdge,
      self.appearanceCompactScrollEdge
    ].compactMap { $0 };
    
    return configs.isEmpty ? nil : configs;
  };
  
  var isCurrentlyUsingNewAppearance: Bool {
    self.appearanceConfigs != nil
  };
  
  var appearanceHasBackgroundImage: Bool {
    self.appearanceConfigs?.allSatisfy { $0.hasBackgroundImage } ?? false
  };
  
  var appearanceHasShadowImage: Bool {
    self.appearanceConfigs?.allSatisfy { $0.hasShadowImage } ?? false
  };
  
  var hasBackgroundImage: Bool {
    self.appearanceLegacy?.hasBackgroundImage ?? false ||
    self.appearanceHasBackgroundImage
  };
  
  var hasShadowImage: Bool {
    self.appearanceLegacy?.hasShadowImage ?? false ||
    self.appearanceHasShadowImage
  };
  
  var hasScrollEdgeAppearanceConfig: Bool {
    self.appearanceConfigScrollEdge  != nil ||
    self.appearanceCompactScrollEdge != nil
  };
  
  // MARK:- RNINavBarAppearance - Methods
  // ------------------------------------
  
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
        
        self.appearanceCompactScrollEdge = {
          guard let configDict = dict["compactScrollEdgeAppearance"] as? NSDictionary
          else { return nil };
          
          let appearance = NavBarAppearanceConfig(dict: configDict);
          appearance?.navBarPreset = self.navBarPreset;
          
          return appearance;
        }();
        
      case .legacy:
        self.appearanceLegacy = NavBarAppearanceLegacyConfig(dict: dict);
    };
  };
  
  /// Clear all the config values
  func resetValues(){
    self.shouldResetNavBar = true;
    
    self.mode = nil;
    self.navBarPreset = .none;
    
    self.appearanceLegacy = nil;
    
    self.appearanceConfigStandard    = nil;
    self.appearanceConfigCompact     = nil;
    self.appearanceConfigScrollEdge  = nil;
    self.appearanceCompactScrollEdge = nil;
  };
  
  /// Update the navigation bar either using the legacy appearance config,
  /// or using the appearance config.
  ///
  /// **Note**: If a `navigationItem` is provided, the appearance config will
  /// be applied to the `navigationItem`, otherwise it'll be applied to the
  /// navigation bar.
  func updateNavBarAppearance(
    for navBar: UINavigationBar?,
    navigationItem: UINavigationItem? = nil
  ){
    guard let navBar = navBar else { return };
    
    // reset the nav bar first before updating
    if self.shouldResetNavBar {
      self.resetNavBarAppearance(for: navBar, navigationItem: navigationItem);
    };
    
    switch self.mode {
      case .appearance:
        guard #available(iOS 13.0, *) else { return };
        self.didUseNewAppearance = true;
        
        self.appearanceConfigs?.forEach { $0.prepareForUpdate(navBar) };

        let standardConfig = self.appearanceConfigStandard
          // no standard config provided, create a "default" config
          ?? NavBarAppearanceConfig(navBarPreset: self.navBarPreset);
        
        if let navigationItem = navigationItem {
          // update the nav bar appearance via the `navigationItem`
          navigationItem.standardAppearance = standardConfig.appearance;
          
          navigationItem.compactAppearance =
            self.appearanceConfigCompact?.appearance;
          
          navigationItem.scrollEdgeAppearance =
            self.appearanceConfigScrollEdge?.appearance;
          
          if #available(iOS 15.0, *) {
            navigationItem.compactScrollEdgeAppearance =
              self.appearanceCompactScrollEdge?.appearance;
          };
          
        } else {
          // update the nav bar appearance directly
          navBar.standardAppearance = standardConfig.appearance;
          
          navBar.compactAppearance =
            self.appearanceConfigCompact?.appearance;
          
          navBar.scrollEdgeAppearance =
            self.appearanceConfigScrollEdge?.appearance;
          
          if #available(iOS 15.0, *) {
            navBar.compactScrollEdgeAppearance =
              self.appearanceCompactScrollEdge?.appearance;
          };
        };
        
        navBar.setNeedsLayout();

      case .legacy:
        self.appearanceLegacy?.applyConfig(to: navBar);
        
      default:
        navBar.setNeedsLayout();
    };
  };
  
  /// Reset navigation bar/`navigationItem` appearance-related properties and
  /// navigation bar "legacy appearance"-related properties.
  ///
  /// **Note A**: You need to call `navigationBar.layoutIfNeeded()` afterwards
  /// so that the reset will immediately take effect.
  ///
  /// **Note B**: This will not reset any of the appearance properties (you need
  /// to call `resetValues` first).
  ///
  func resetNavBarAppearance(
    for navBar: UINavigationBar?,
    navigationItem: UINavigationItem? = nil
  ){
    guard let navBar = navBar else { return };
    
    // since a reset was done, no need to reset on next nav bar update
    self.shouldResetNavBar = false;
    
    // reset nav bar appearance
    // Note: only reset appearance if was prev. set
    if let navItem = navigationItem,
       self.didUseNewAppearance {
      
      Self.resetNavBarAppearanceToDefault(for: navItem);
      
    } else if self.didUseNewAppearance {
      Self.resetNavBarAppearanceToDefault(for: navBar);
    };
    
    // reset legacy appearance
    Self.resetNavBarAppearanceLegacyToDefault(for: navBar);
    
    navBar.setNeedsLayout();
  };
};
