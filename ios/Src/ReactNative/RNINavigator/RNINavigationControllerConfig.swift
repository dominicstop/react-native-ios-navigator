//
//  RNINavigationControllerConfig.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 9/4/21.
//

import Foundation

/// Is an intermediate container to store property values related to configuring
/// a `UINavigationController` instance (i.e. this is used to store/cache values
/// so it can be applied/re-applied later).
///
/// # Purpose
///
/// There are route-level options (i.e. options/config that only apply to
/// that specific route).
///
/// For example:
///
/// * `ROUTE_A` can have its navigation bar hidden, and then `ROUTE_B` can have
///   its navigation bar visible.
///
/// <br>
///
/// * The problem is that the `UINavigationController.isNavigationBarHidden`
///   property can not be set on per view controller basis.
///
///   * This is because its a property of `UINavigationController`, and not
///     `UINavigationItem` (in other words, its "global" i.e. in the sense that
///     it affects all of the navigation controllers).
///
/// <br>
///
/// * As such, we have to play a game of "hot potato" where in properties
///   are restored + overridden whenever a route focuses or blurs.
///
/// <br>
///
/// * This class exists for that purpose; the "config" of the navigation
///   controller is saved so that it can be restored later.
///
/// # Q & A
///
/// * **Q1**: Why not just use the `routeOptions`-related react "props" stored
///   in the `RNINavigatorRouteView` to restore the config?
///
/// <br>
///
/// * **A1**: In order to support "native routes", i.e. if there's a native
///   route, it has to be able to restore the values overridden by a react route.
///
public class RNINavigationControllerConfig {
  
  // MARK: - Properties
  
  /// As of iOS 13, setting a custom background image or shadow image in the
  /// navigation bar does not transition properly.
  ///
  /// As such, this flag indicates whether or not to add a custom fade transition
  /// to the navigation bar.
  ///
  /// Note: Be sure to reset this to `false` whenever a route loses focus.
  ///
  var shouldAddFadeTransitionToNavigationBar = false;
  
  /// store the navigation bar's current legacy appearance config so that it can
  /// be re-applied/restored later.
  var navBarLegacyConfig = RNINavigationControllerLegacyAppearanceConfig();
  
  var statusBarStyle: UIStatusBarStyle?;
  
  var isNavBarHidden: Bool?;
  var allowTouchEventsToPassThroughNavigationBar: Bool?;
  
  // MARK: - Methods
  // --------------
  
  func applyIsNavBarHidden(
    for routeVC: RNINavigatorRouteBaseViewController,
    isAnimated: Bool = true,
    forceApplyConfig: Bool = false
  ){
    guard let isNavBarHidden = self.isNavBarHidden,
          let navigatorView  = routeVC.navigatorViewRef,
          let navController  = navigatorView.navigationVC,
          
          navController.isNavigationBarHidden != isNavBarHidden
    else { return };
    
    let shouldApply = routeVC.isLastViewController && routeVC.isPushed;
    
    if forceApplyConfig || shouldApply {
      /// TODO (017): Bug - when hiding nav bar, scrollview still snaps
      navController.setNavigationBarHidden(isNavBarHidden, animated: isAnimated);
    };
  };
  
  func applyAllowTouchEventsToPassThroughNavigationBar(
    for routeVC: RNINavigatorRouteBaseViewController,
    forceApplyConfig: Bool = false
  ){
    guard let flag = self.allowTouchEventsToPassThroughNavigationBar,
          let navigatorView = routeVC.navigatorViewRef,
          
          navigatorView.allowTouchEventsToPassThroughNavigationBar != flag
    else { return };
    
    let shouldApply = routeVC.isLastViewController && routeVC.isPushed;
    
    if forceApplyConfig || shouldApply {
      /// TODO (017): Bug - when hiding nav bar, scrollview still snaps
      navigatorView.allowTouchEventsToPassThroughNavigationBar = flag;
    };
  };
  
  func applyNavBarAppearance(
    for routeVC: RNINavigatorRouteBaseViewController,
    with config: RNINavBarAppearance?,
    forceApplyLegacyConfig: Bool = false,
    triggerLayoutIfNeeded: Bool = true
  ){
    guard let navigatorView = routeVC.navigatorViewRef,
          let navController = navigatorView.navigationVC
    else { return };
    
    let isInFocus = routeVC.isLastViewController && routeVC.isPushed;
    
    // If `routeVC` is a react route, then get the `navBarAppearanceOverrideConfig`.
    let config: RNINavBarAppearance? = config ?? {
      guard let reactRouteVC = routeVC as? RNINavigatorReactRouteViewController,
            let routeView    = reactRouteVC.routeView
      else { return nil };
      
      return routeView.navBarAppearanceOverrideConfig;
    }();
    
    self.resetAppearanceIfNeeded(for: routeVC, with: config);
    
    switch config?.mode {
      case .none: fallthrough;
        
      case .legacy:
        // use navigator `navBarAppearanceConfig` prop as base
        navigatorView.navBarAppearanceConfig.appearanceLegacy?.applyConfig(
          to: self.navBarLegacyConfig,
          navBar: navController.navigationBar
        );
        
        // then apply override
        config?.appearanceLegacy?.applyConfig(
          to: self.navBarLegacyConfig,
          navBar: navController.navigationBar
        );
        
        if forceApplyLegacyConfig || isInFocus {
          // If route is currently active/focused, immediately apply config
          // to the navigation bar
          self.navBarLegacyConfig.applyConfig(to: navController.navigationBar);
        };
      
      case .appearance:
        // Apply changes via navigationItem + appearance API
        config!.updateNavBarAppearance(
          for: navController.navigationBar,
          navigationItem: routeVC.navigationItem
        );
    };
    
    self.shouldAddFadeTransitionToNavigationBar = (
         navigatorView.navBarAppearanceConfig.hasBackgroundImage
      || navigatorView.navBarAppearanceConfig.hasShadowImage
      
      || config?.hasBackgroundImage ?? false
      || config?.hasShadowImage     ?? false
      
      || self.navBarLegacyConfig.hasBackgroundImage
      || self.navBarLegacyConfig.hasShadowImage
    );
    
    if isInFocus && triggerLayoutIfNeeded {
      navController.navigationBar.layoutIfNeeded();
    };
  };
  
  /// This method is used when a view controller is being transitioned in, e.g. this method is basically  used
  /// as a shortcut to apply all the "override configs" all at once.
  ///
  /// This method will return a tuple of  blocks that when called, will call all the `apply` methods.
  func makeApplyConfigBlocks(
    for routeVC: RNINavigatorRouteBaseViewController,
    isAnimated: Bool
  ) -> (
    applyConfig: () -> Void,
    applyAnimatableConfig: () -> Void
  ){
    return (
      applyConfig: { [weak self] in
        self?.applyAllowTouchEventsToPassThroughNavigationBar(
          for: routeVC,
          forceApplyConfig: true
        );
        
        self?.applyIsNavBarHidden(
          for: routeVC,
          isAnimated: isAnimated,
          forceApplyConfig: true
        );
      },
      applyAnimatableConfig: { [weak self] in
        /// Note: do not trigger layout...
        /// * When a layout is triggered and the transition is cancelled, the navigation bar items gets
        ///   transitioned in.
        /// * In other words, this triggers a bug where the navigation bar right item slides in from the left
        ///   when the interactive pop transition is cancelled.
        self?.applyNavBarAppearance(
          for: routeVC, with: nil,
          forceApplyLegacyConfig: true,
          triggerLayoutIfNeeded: false
        );
      }
    );
  };
  
  func resetAppearanceIfNeeded(
    for routeVC: RNINavigatorRouteBaseViewController,
    with config: RNINavBarAppearance?
  ){
    guard let config = config,
          config.shouldResetNavBar
    else { return };
    
    config.shouldResetNavBar = false;
    
    // reset legacy config
    self.navBarLegacyConfig = .init();
    
    // reset appearance config
    RNINavBarAppearance
      .resetNavBarAppearanceToDefault(for: routeVC.navigationItem);
  };
};


/// Similar to `RNINavigationControllerConfig`, this acts as an intermediate
/// container to store values related to configuring the navigation bar using
/// the "legacy appearance"-related properties (this also has the logic to then
/// apply the stored values to a `UINavigationBar` instance).
///
class RNINavigationControllerLegacyAppearanceConfig {
  
  // MARK: Title Config
  var titleTextAttributes:
    Dictionary<NSAttributedString.Key, Any>?;
  
  var largeTitleTextAttributes:
    Dictionary<NSAttributedString.Key, Any>?;
  
  var titleVerticalPositionAdjustment:
    Dictionary<UIBarMetrics, CGFloat> = [:];
  
  // MARK: Navbar Style
  var barStyle: UIBarStyle = .default;
  var tintColor: UIColor?;
  var barTintColor: UIColor?;
  
  // MARK: Misc. Images
  var backIndicatorImage: UIImage?;
  var backgroundImage: Dictionary<UIBarMetrics, UIImage> = [:];
  var shadowImage: UIImage?;
  
  // MARK: - Computed Properties
  // --------------------------
  
  var hasBackgroundImage: Bool {
    self.backgroundImage.values.count > 0;
  };
  
  var hasShadowImage: Bool {
    self.shadowImage != nil;
  };
  
  // MARK: - Functions
  // ----------------
  
  init() {
    /// Use the default navigation bar values as the initial values.
    self.initializeWithDefaultValues();
  };
  
  func initializeWithDefaultValues(){
    let defaultAppearance = UINavigationBar.appearance();
    
    self.titleTextAttributes = defaultAppearance.titleTextAttributes;
    
    if #available(iOS 11.0, *) {
      self.largeTitleTextAttributes = defaultAppearance.largeTitleTextAttributes
    };
    
    for metric in UIBarMetrics.allCases {
      self.titleVerticalPositionAdjustment[metric] =
        defaultAppearance.titleVerticalPositionAdjustment(for: metric);
      
      self.backgroundImage[metric] =
        defaultAppearance.backgroundImage(for: metric);
    };
    
    self.barStyle     = defaultAppearance.barStyle;
    self.tintColor    = defaultAppearance.tintColor;
    self.barTintColor = defaultAppearance.barTintColor;
    
    self.backIndicatorImage = defaultAppearance.backIndicatorImage;
    self.shadowImage        = defaultAppearance.shadowImage;
  };

  func saveValues(from navBar: UINavigationBar) {
    self.titleTextAttributes = navBar.titleTextAttributes;
    
    if #available(iOS 11.0, *) {
      self.largeTitleTextAttributes = navBar.largeTitleTextAttributes
    };
    
    self.barStyle     = navBar.barStyle;
    self.tintColor    = navBar.tintColor;
    self.barTintColor = navBar.barTintColor;
    
    self.shadowImage        = navBar.shadowImage;
    self.backIndicatorImage = navBar.backIndicatorImage;

    for metric in UIBarMetrics.allCases {
      self.titleVerticalPositionAdjustment[metric] =
        navBar.titleVerticalPositionAdjustment(for: metric);
      
      // Note: This can return `nil`, but writing `nil` as the value for a given
      // key erases that key
      self.backgroundImage[metric] = navBar.backgroundImage(for: metric);
    };
  };

  func applyConfig(to navBar: UINavigationBar){

    // Section: Title Config
    // ---------------------

    navBar.titleTextAttributes = titleTextAttributes;

    if #available(iOS 11.0, *) {
      navBar.largeTitleTextAttributes = self.largeTitleTextAttributes
    };

    // Section: Navbar Style
    // ---------------------

    navBar.barStyle = self.barStyle;

    navBar.tintColor = self.tintColor;
    navBar.barTintColor = self.barTintColor;

    for metric in UIBarMetrics.allCases {
      let nextAdj = self.titleVerticalPositionAdjustment[metric];
      let prevAdj = navBar.titleVerticalPositionAdjustment(for: metric);
      
      // if no changes, skip...
      guard nextAdj != prevAdj else { continue };
      
      navBar.setTitleVerticalPositionAdjustment(nextAdj!, for: metric);
    };

    // Section: Misc. Images
    // ---------------------

    let nextBackImage = self.backIndicatorImage;

    // only apply back image if different...
    if !RNIUtilities.compareImages(nextBackImage, navBar.backIndicatorImage) {
      navBar.backIndicatorImage               = nextBackImage;
      navBar.backIndicatorTransitionMaskImage = nextBackImage;
    };
    
    if !RNIUtilities.compareImages(self.shadowImage, navBar.shadowImage) {
      navBar.shadowImage = self.shadowImage;
    };
    
    for metric in UIBarMetrics.allCases {
      let prevBGImage = navBar.backgroundImage(for: metric);
      let nextBGImage = self.backgroundImage[metric];
      
      let didBGImageChange =
        !RNIUtilities.compareImages(prevBGImage, nextBGImage);
      
      // i.e. if prev. set, but now nil
      let didReset = prevBGImage != nil && nextBGImage == nil;
      
      if didBGImageChange || didReset {
        navBar.setBackgroundImage(nextBGImage, for: metric);
      };
    };
    
    navBar.setNeedsLayout();
  };
};
