//
//  RNINavBarAppearance.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/30/21.
//

import Foundation

internal class RNINavBarAppearance {
  
  // ---------------------
  // MARK:- Embedded Types
  // ---------------------
  
  /// Defines what parts of navigation bar should be customizable, i.e controls
  /// the preset/base "look" of the navigation bar.
  ///
  /// The current "preset" in the config tells us whether or not we should allow
  /// changes to certain "appearance"-related properties of the navbar (e.g. when
  /// `.noShadow`, don't allow "shadowColor" to be set, etc).
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
    
    var shadowColor: UIColor?;
    // TODO: shadowImage: UIImage?
    
    // MARK: Button Appearance
    var backIndicatorImage: RNIImageItem?;
    // TODO: backButtonAppearance: UIBarButtonItemAppearance
    // TODO: doneButtonAppearance: UIBarButtonItemAppearance
    // TODO: buttonAppearance: UIBarButtonItemAppearance
    
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
        
        appearance.backgroundImage = self.backgroundImage?.image;
      };
      
      if shouldSetShadow {
        appearance.shadowColor = self.shadowColor;
      };
      
      // Section:
      // ---------------------
      
      let backImage = self.backIndicatorImage?.image;
      /// NOTE: cannot hide indicator via setting this to `UIImage()` or `nil`
      appearance.setBackIndicatorImage(backImage, transitionMaskImage: backImage);
    
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
      
      /// set/init: `shadowColor`
      self.shadowColor = {
        guard let value = dict["shadowColor"],
              let color = UIColor.parseColor(value: value)
        else { return nil };
        
        return color;
      }();
      
      // Section:
      // ----------------------
      
      self.backIndicatorImage = {
        guard let imageDict = dict["backIndicatorImage"] as? NSDictionary,
              let imageItem = RNIImageItem(dict: imageDict)
        else { return nil };
        
        return imageItem;
      }();
    };
    
    func prepareForUpdate(_ navBar: UINavigationBar){
      let statusBarHeight = UIApplication.shared.statusBarFrame.size.height;
      
      let navBarHeight = navBar.frame.height;
      let navBarWidth  = navBar.frame.width;
      
      // setup background image size
      self.backgroundImage?.defaultSize = CGSize(
        width: navBarWidth,
        height: navBarHeight + statusBarHeight
      );
    };
  };
  
  /// Holds the "raw" values for customizing the navigatiob bar via the "legacy"
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
    
    func updateNavBarAppearance(_ navBar: UINavigationBar){
      let defaultAppearance = UINavigationBar.appearance();
      
      let shouldSetBG     = self.navBarPreset != .clearBackground;
      let shouldSetShadow = self.navBarPreset != .noShadow && shouldSetBG;
      
      let statusBarHeight = UIApplication.shared.statusBarFrame.size.height;
      
      let navBarHeight = navBar.frame.height;
      let navBarWidth  = navBar.frame.width;
      
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
      for (metric, number) in self.titleVerticalPositionAdjustment ?? [] {
        // did change, else skip...
        guard navBar.titleVerticalPositionAdjustment(for: metric) != number
        else { continue };
        
        navBar.setTitleVerticalPositionAdjustment(number, for: metric);
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
      
      for metric in UIBarMetrics.allCases {
        // allow set bg image, else stop
        guard shouldSetBG else { break };
        
        // get the current bg image for the current metric
        let currentBGImage = navBar.backgroundImage(for: metric);
        
        // get the matching bg image for the current metric
        let bgImageConfig = self.backgroundImage?.first { metric == $0.0 };
        
        if let (_, bgImageItem) = bgImageConfig {
          // set image size
          bgImageItem.defaultSize = CGSize(
            width : navBarWidth,
            height: navBarHeight + statusBarHeight
          );
          
          // get background image
          let newBGImage = bgImageItem.image;
          
          // did change, else skip...
          guard currentBGImage != newBGImage  else { continue };
          navBar.setBackgroundImage(newBGImage, for: .any, barMetrics: metric);
          
        } else {
          // get the default bg image for the current metric
          let defaultBGImage = defaultAppearance.backgroundImage(for: .any, barMetrics: metric);
          
          // did change, else skip...
          guard currentBGImage != defaultBGImage  else { continue };
          
          // reset bg image to default
          navBar.setBackgroundImage(defaultBGImage, for: .any, barMetrics: metric);
        };
      };
            
      if shouldSetShadow {
        navBar.shadowImage = self.shadowImage?.image;
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
  
  /// indicates whether or not the iOS 13+ appearance API was ever used
  var didUseNewAppearance = false;
  
  // Tells us which API to use to change the nav bar appearance.
  var mode: AppearanceMode? {
    willSet {
      // mode has changed, trigger nav bar reset
      self.shouldResetNavBar = (
        self.shouldResetNavBar || (self.mode != newValue)
      );
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
  
  var appearanceConfigStandard  : NavBarAppearanceConfig!;
  var appearanceConfigCompact   : NavBarAppearanceConfig?;
  var appearanceConfigScrollEdge: NavBarAppearanceConfig?;
  
  var isCurrentlyUsingNewAppearance: Bool {
    self.appearanceConfigStandard   != nil ||
    self.appearanceConfigCompact    != nil ||
    self.appearanceConfigScrollEdge != nil
  };
  
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
  
  func resetValues(){
    self.shouldResetNavBar = true;
    
    self.mode = nil;
    self.navBarPreset = .none;
    
    self.appearanceLegacy = nil;
    
    self.appearanceConfigStandard = nil;
    self.appearanceConfigCompact = nil;
    self.appearanceConfigScrollEdge = nil;
  };
  
  func updateNavBarAppearance(
    _ navBar: UINavigationBar?,
    navigationItem: UINavigationItem? = nil
  ){
    // reset the nav bar first before updating
    if self.shouldResetNavBar {
      self.resetNavBarAppearance(navBar);
    };
    
    guard let navBar = navBar,
          let mode = mode
    else { return };
    
    switch mode {
      case .appearance:
        guard #available(iOS 13.0, *) else { return };
        self.didUseNewAppearance = true;
        
        self.appearanceConfigStandard?.prepareForUpdate(navBar);
        self.appearanceConfigCompact?.prepareForUpdate(navBar);
        self.appearanceConfigScrollEdge?.prepareForUpdate(navBar);
        
        let standardConfig = self.appearanceConfigStandard
          // no standard config provided, create a "default" config
          ?? NavBarAppearanceConfig(navBarPreset: self.navBarPreset);
        
        if let navigationItem = navigationItem {
          // update the nav bar appearance via the `navigationItem`
          navigationItem.standardAppearance = standardConfig.appearance;
          
          navigationItem.compactAppearance =
            (self.appearanceConfigCompact ?? standardConfig).appearance;
          
          navigationItem.scrollEdgeAppearance =
            (self.appearanceConfigScrollEdge ?? standardConfig).appearance;
          
        } else {
          // update the nav bar appearance directly
          navBar.standardAppearance = standardConfig.appearance;
          
          navBar.compactAppearance =
            (self.appearanceConfigCompact ?? standardConfig).appearance;
          
          navBar.scrollEdgeAppearance =
            (self.appearanceConfigScrollEdge ?? standardConfig).appearance;
        };
        
        // refresh the navbar appearance
        navBar.setNeedsLayout();

      case .legacy:
        self.appearanceLegacy?.updateNavBarAppearance(navBar);
    };
  };
  
  func resetNavBarAppearance(_ navBar: UINavigationBar?){
    guard let navBar = navBar else { return };
    // since a reset was done, no need to reset on next nav bar update
    self.shouldResetNavBar = false;
    
    let defaultAppearance = UINavigationBar.appearance();
    
    // reset nav bar appearance
    // only reset appearance if was prev. set
    if #available(iOS 13.0, *), self.didUseNewAppearance {
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
    
    for metric in UIBarMetrics.allCases {
      /// reset `titleVerticalPositionAdjustment`
      navBar.setTitleVerticalPositionAdjustment(
        defaultAppearance.titleVerticalPositionAdjustment(for: metric),
        for: metric
      );
      
      /// reset `backgroundImage`
      navBar.setBackgroundImage(
        defaultAppearance.backgroundImage(for: metric),
        for: metric
      );
    };
    
    if #available(iOS 11.0, *) {
      navBar.largeTitleTextAttributes = defaultAppearance.largeTitleTextAttributes;
    };
    
    navBar.setNeedsLayout();
  };
};
