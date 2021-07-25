//
//  RNINavigatorReactRouteViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/5/21.
//

import UIKit;


/// A view controller to hold js/react routes
internal class RNINavigatorReactRouteViewController: RNINavigatorRouteBaseViewController {
  
  // ---------------------
  // MARK:- Embedded Types
  // ---------------------
  
  enum RouteContentWrapper {
    case view(view: UIView);
    case reactSafeAreaView(view: RCTSafeAreaView);
    case reactScrollView(view: RCTScrollView);
    
    var description: String {
      switch self {
        case .view:
          return "view";
          
        case .reactSafeAreaView:
          return "reactSafeAreaView";
          
        case .reactScrollView:
          return "reactScrollView";
      };
    };
  };
  
  /// Used to temp. override the current nav. config and restore it when the
  /// route becomes inactive.
  class NavigationConfigOverride {
    
    /// stores/holds values for nav bar's "legacy appearance"-related properties
    struct NavBarAppearanceLegacyConfig {
      
      // MARK: Title Config
      var titleTextAttributes: Dictionary<NSAttributedString.Key, Any>?;
      var largeTitleTextAttributes: Dictionary<NSAttributedString.Key, Any>?;
      var titleVerticalPositionAdjustment: Dictionary<UIBarMetrics, CGFloat> = [:];
      
      // MARK: Navbar Style
      var barStyle: UIBarStyle?;
      var tintColor: UIColor?;
      var barTintColor: UIColor?;
      
      // MARK: Misc. Images
      var backIndicatorImage: UIImage?;
      var backgroundImage: Dictionary<UIBarMetrics, UIImage> = [:];
      var shadowImage: UIImage?;
      
      init(from navBar: UINavigationBar){
        self.titleTextAttributes = navBar.titleTextAttributes;
        
        if #available(iOS 11.0, *) {
          self.largeTitleTextAttributes = navBar.largeTitleTextAttributes
        };
        
        self.barStyle = navBar.barStyle;
        self.tintColor = navBar.tintColor;
        self.barTintColor = navBar.barTintColor;
        
        self.backIndicatorImage = navBar.backIndicatorImage;
        self.shadowImage = navBar.shadowImage;
        
        for metric in UIBarMetrics.allCases {
          self.titleVerticalPositionAdjustment[metric] =
            navBar.titleVerticalPositionAdjustment(for: metric);
          
          self.backgroundImage[metric] = navBar.backgroundImage(for: metric);
        };
      };
      
      func applyConfig(to navBar: UINavigationBar){
        navBar.titleTextAttributes = titleTextAttributes;
        
        if #available(iOS 11.0, *) {
          navBar.largeTitleTextAttributes = self.largeTitleTextAttributes
        };
        
        if let barStyle = self.barStyle {
          navBar.barStyle = barStyle;
        };
        
        navBar.tintColor = self.tintColor;
        navBar.barTintColor = self.barTintColor;
        
        navBar.backIndicatorImage = self.backIndicatorImage;
        navBar.shadowImage = self.shadowImage;
        
        for metric in UIBarMetrics.allCases {
          if let adj = self.titleVerticalPositionAdjustment[metric] {
            navBar.setTitleVerticalPositionAdjustment(adj, for: metric);
          };
          
          navBar.setBackgroundImage(self.backgroundImage[metric], for: metric);
        };
      };
    };
    
    weak var parentRef: RNINavigatorReactRouteViewController?;
    
    /// store the navigation bar's current legacy appearance config (before it's
    /// been overridden/replaced) so that we can restore it later.
    var navBarLegacyConfig: NavBarAppearanceLegacyConfig?;
    
    var isNavBarHidden: Bool?;
    var allowTouchEventsToPassThroughNavigationBar: Bool?;
    
    init(parentRef: RNINavigatorReactRouteViewController) {
      self.parentRef = parentRef;
    };
    
    func overrideIsNavBarHidden(
      _ mode: RNINavigatorRouteView.NavBarVisibility,
      isAnimated: Bool = true
    ){
      guard let navController = self.parentRef?.navigationController else { return };
      
      if self.isNavBarHidden == nil {
        self.isNavBarHidden = navController.isNavigationBarHidden;
      };
      
      #if DEBUG
      print("LOG - VC, RNINavigatorReactRouteViewController: NavigationConfigOverride"
        + " - overrideIsNavBarHidden, restore value: \(self.isNavBarHidden?.description ?? "N/A")"
        + " - override value: \(mode.rawValue)"
      );
      #endif
      
      /// TODO: Bug - when hiding nav bar, scrollview still snaps
      switch mode {
        case .hidden : navController.setNavigationBarHidden(true , animated: isAnimated);
        case .visible: navController.setNavigationBarHidden(false, animated: isAnimated);
          
        default:
          // reset to the original value (before overriding)
          if let isNavBarHidden = self.isNavBarHidden {
            navController.setNavigationBarHidden(isNavBarHidden, animated: isAnimated);
            self.isNavBarHidden = nil;
          };
      };
    };
    
    func overrideAllowTouchEventsToPassThroughNavigationBar(_ flag: Bool){
      guard let navigatorView = self.parentRef?.routeView?.navigatorView
      else { return };
      
      if self.allowTouchEventsToPassThroughNavigationBar == nil {
        // save current value to restore later
        self.allowTouchEventsToPassThroughNavigationBar =
          navigatorView.allowTouchEventsToPassThroughNavigationBar;
      };
      
      #if DEBUG
      print("LOG - VC, RNINavigatorReactRouteViewController: NavigationConfigOverride"
        + " - overrideAllowTouchEventsToPassThroughNavigationBar, next value: \((flag))"
        + " - saved value: \(self.allowTouchEventsToPassThroughNavigationBar.debugDescription)"
      );
      #endif
      
      // override current value
      navigatorView.allowTouchEventsToPassThroughNavigationBar = flag;
    };
    
    func overrideLegacyNavBarAppearance(_ config: RNINavBarAppearance){
      guard let parentRef      = self.parentRef,
            let navController  = parentRef.navigationController
      else { return };
      
      if config.mode == .legacy, !config.didUseNewAppearance,
         self.navBarLegacyConfig == nil {
        
        // save the current legacy nav bar customizations if not yet set
        self.navBarLegacyConfig =
          NavBarAppearanceLegacyConfig(from: navController.navigationBar);
        
      } else if config.mode != .legacy,
                self.navBarLegacyConfig != nil {
        
        // legacy config was prev. set, but the appearance mode has changed...
        // so remove prev. saved nav bar legacy config.
        self.navBarLegacyConfig = nil;
      };
      
      #if DEBUG
      print("LOG - VC, RNINavigatorReactRouteViewController: NavigationConfigOverride"
        + " - overrideLegacyNavBarAppearance, mode: \(config.mode.debugDescription)"
        + " - didUseNewAppearance: \(config.didUseNewAppearance)"
        + " - navBarLegacyConfig set: \(self.navBarLegacyConfig == nil)"
      );
      #endif
      
      // if using legacy mode, update the nav bar appearance directly, otherwise if
      // using appearance mode, then update the nav bar appearance via the `navigationItem`
      config.updateNavBarAppearance(
        navController.navigationBar,
        navigationItem: parentRef.navigationItem
      );
    };
    
    /// Will read the props from the `routeView`, and will save the current values,
    /// and then temp. override the navigator config.
    func overrideIfNeeded(isAnimated: Bool){
      guard let parentRef     = self.parentRef,
            let routeView     = parentRef.routeView,
            let navigatorView = routeView.navigatorView
      else { return };
      
      // MARK: Appearance Override
      self.overrideLegacyNavBarAppearance(routeView.navBarAppearanceOverrideConfig);
      
      // MARK: Nav Bar Visibility
      let navBarVisibilityNext = routeView.navigationBarVisibilityMode;
      if navBarVisibilityNext != .default {
        self.overrideIsNavBarHidden(navBarVisibilityNext, isAnimated: isAnimated)
      };
      
      // MARK: Nav Bar Pass Through Touch Events
      self.overrideAllowTouchEventsToPassThroughNavigationBar(
        navigatorView.allowTouchEventsToPassThroughNavigationBar
      );
      
      #if DEBUG
      print("LOG - VC, RNINavigatorReactRouteViewController: NavigationConfigOverride"
        + " - overrideIfNeeded"
        + " - navBarLegacyConfig: \(self.navBarLegacyConfig == nil)"
        + " - isNavBarHidden: \(self.isNavBarHidden.debugDescription)"
        + " - allowTouchEventsToPassThroughNavigationBar: \(self.allowTouchEventsToPassThroughNavigationBar.debugDescription)"
      );
      #endif
    };
    
    /// If there were any nav bar config values overridden, then this will restore
    /// them to the original/prev. values.
    func restoreConfigIfNeeded(){
      guard let parentRef     = self.parentRef,
            let navController = parentRef.navigationController,
            let navigatorView = self.parentRef?.routeView?.navigatorView
      else { return };
      
      if let navBarLegacyConfig = self.navBarLegacyConfig {
        
        navBarLegacyConfig.applyConfig(to: navController.navigationBar);
        self.navBarLegacyConfig = nil;
        
        #if DEBUG
        print("LOG - VC, RNINavigatorReactRouteViewController: NavigationConfigOverride"
          + " - restoreConfig, restore navBarAppearanceConfig"
        );
        #endif
      };
      
      if let isNavBarHidden = self.isNavBarHidden {
        
        navController.isNavigationBarHidden = isNavBarHidden;
        self.isNavBarHidden = nil;
        
        #if DEBUG
        print("LOG - VC, RNINavigatorReactRouteViewController: NavigationConfigOverride"
          + " - restoreConfig, restore isNavBarHidden: \(isNavBarHidden)"
        );
        #endif
      };
      
      if let flag = self.allowTouchEventsToPassThroughNavigationBar {
        
        navigatorView.allowTouchEventsToPassThroughNavigationBar = flag;
        self.allowTouchEventsToPassThroughNavigationBar = nil;
        
        #if DEBUG
        print("LOG - VC, RNINavigatorReactRouteViewController: NavigationConfigOverride"
          + " - restoreConfig, restore allowTouchEventsToPassThroughNavigationBar: \(flag)"
        );
        #endif
      };
    };
  };
  
  // -----------------
  // MARK:- Properties
  // -----------------
  
  /// The content to show in the route
  var routeView: RNINavigatorRouteView! {
    didSet {
      // receive "events" from `RNINavigatorRouteViewDelegate`
      self.routeView!.delegate = self;
    }
  };
  
  // used for the custom transitions
  var interactionController: LeftEdgeInteractionController?;
  
  var transitionTypePush = RNINavTransitionConfig(type: .DefaultPush) {
    willSet {
      // don't set the delegate when using the default push/pop transition
      // to not disable the interactive swipe gesture.
      if newValue.transitionType == .DefaultPush,
         self.transitionTypePop.transitionType == .DefaultPop {
        
        self.navigationController?.delegate = nil;
        
      } else {
        self.navigationController?.delegate = self;
      };
    }
  };
  
  var transitionTypePop = RNINavTransitionConfig(type: .DefaultPop) {
    willSet {
      guard let navigationController = self.navigationController
      else { return };
      
      // don't set the delegate when using the default push/pop transition
      // to not disable the interactive swipe gesture.
      // TODO: This can be fixed by re-impl. the default pop transition.
      if newValue.transitionType == .DefaultPop,
         self.transitionTypePush.transitionType == .DefaultPush {
        
        self.interactionController = nil;
        navigationController.delegate = nil;
        
      } else {
        self.interactionController =
          LeftEdgeInteractionController(viewController: self);
        
        navigationController.delegate = self;
      };
    }
  };
  
  lazy var navigationConfigOverride = NavigationConfigOverride(parentRef: self);
  
  var statusBarStyle: UIStatusBarStyle?;
  override var preferredStatusBarStyle: UIStatusBarStyle {
    return self.statusBarStyle ?? .default;
  };
  
  private weak var searchBarTextField: UITextField?;
  private weak var searchBaPlaceholderLabel: UILabel?;
  
  // -----------------------------------
  // MARK:- Convenient Property Wrappers
  // -----------------------------------
  
  override var routeID: Int {
    self.routeView.routeID.intValue;
  };
  
  override var routeKey: String {
    self.routeView.routeKey as String;
  };
  
  override var routeIndex: Int {
    self.routeView.routeIndex.intValue;
  };
  
  /// Get the first subview for `reactRouteContent`.
  ///
  /// Due to "fast refresh" behavior, a direct ref. to the instance cannot be
  /// stored directly since it can be replaced by a different instance.
  /// That's why we have to "dynamically" access it every time.
  var wrapperView: RouteContentWrapper? {
    guard let contentView = self.view.subviews.first
    else { return nil };
    
    if let reactScrollView = contentView as? RCTScrollView {
      // is content a scrollview
      return .reactScrollView(view: reactScrollView);
      
    } else if let reactSafeAreaView = contentView as? RCTSafeAreaView {
      // is content a safe area view
      return .reactSafeAreaView(view: reactSafeAreaView);
    };
    
    // content is a normal view
    return .view(view: contentView);
  };
  
  // --------------------------------
  // MARK:- View Controller Lifecycle
  // --------------------------------
  
  override func loadView() {
    super.loadView();
    
    /// The "root view" is the `routeView`'s `reactRouteContent`.
    ///
    /// * The `routeView` is a dummy view that holds all the route-related
    ///   components, it doesn't actually draw anything i.e. it is used as a way
    ///   to receive components from react and acts as a temp. parent/container.
    ///
    /// * The `routeView.reactRouteContent` is the view that is to be shown in
    ///   the route, so it should be the view that's assigned to the view controller.
    ///
    /// * The `reactRouteContent` view can have several subviews, but we assume that
    ///   the first subview is the "root container".
    ///
    ///  * This "root container" might be a `RCTScrollView`, a `RCTSafeAreaView`,
    ///    or just another view. It holds the route's main content.
    ///
    ///  * The "root container" can be accessed via the `wrapperView` property
    ///    wrapper.
    ///
    ///  * TODO: Fix the naming/pick better names because it's so confusing.
    ///
    let rootView = self.routeView!.reactRouteContent!;
    rootView.frame = self.view.frame;
    
    // set the root view bg color
    if rootView.backgroundColor == nil {
      if #available(iOS 13.0, *) {
        rootView.backgroundColor = .systemBackground;
        
      } else {
        rootView.backgroundColor = .white;
      };
    };
    
    /// update `routeView`'s size
    self.routeView!.notifyForBoundsChange(self.view.bounds);
    /// set/replace the view controller's view
    self.view = rootView;
    
    if let headerView = self.routeView.reactRouteHeader {
      headerView.setup();
    };
    
    #if DEBUG
    let subviewCount = RNIUtilities.recursivelyGetAllSubviews(for: rootView).count;
    print("LOG - RNINavigatorReactRouteViewController: loadView"
      + " - total subviews: \(subviewCount)"
      + " - wrapperView: \(self.wrapperView?.description ?? "N/A")"
      + " - headerView: \(self.routeView.reactRouteHeader != nil ? "true" : "false")"
      + " - statusBarStyle: \(self.statusBarStyle?.rawValue ?? -1)"
      + " - preferredStatusBarStyle: \(self.preferredStatusBarStyle.rawValue)"
    );
    #endif
  };
  
  override func viewDidLoad() {
    super.viewDidLoad();
    
    /// setup for custom pop transition (if any)
    if self.transitionTypePop.transitionType != .DefaultPop {
      self.navigationController?.delegate = self;
      self.interactionController = LeftEdgeInteractionController(viewController: self);
    };
    
    self.setupSearchController();
    self.setupScrollView();
  };
  
  override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews();
    
    guard let routeView = self.routeView else { return };
    
    /// update `routeView`'s size
    routeView.notifyForBoundsChange(self.view.bounds);
    
    /// update `routeView`'s header size
    routeView.reactRouteHeader?.refreshLayoutSize();
    
    /// trigger `onUIConstantsDidChange`
    routeView.navigatorView!.navigatorConstants.refreshConstants();
  };
  
  override func viewDidLayoutSubviews() {
    super.viewWillLayoutSubviews();
    
    switch self.wrapperView {
      case let .reactScrollView(reactScrollView):
        reactScrollView.refreshContentInset();
        
      default: break;
    };
  };
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated);
    
    // send event: notify js nav. route is about to appear
    self.routeView!.notifyOnRouteFocus(
      isDone: false,
      isAnimated: animated
    );
    
    /// Override the nav. config based on the current `routeView` `routeConfig`-related props
    self.navigationConfigOverride.overrideIfNeeded(isAnimated: animated);
    
    /// Update status bar style
    self.setNeedsStatusBarAppearanceUpdate();
  };
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated);
    
    // send event: notify js nav. route has appeared
    self.routeView?.notifyOnRouteFocus(
      isDone: true,
      isAnimated: animated
    );
    
    // if back config was prev. overridden, then restore...
    if self.shouldResetNavBarBackConfig {
      self.resetRouteNavBarBackConfig();
      self.shouldResetNavBarBackConfig = false;
    };
    
    // update the search bar
    self.refreshSearchController();
  };
  
  override func viewWillDisappear(_ animated: Bool) {
    // send event: notify js nav. route is about to disappear
    self.routeView?.notifyOnRouteBlur(
      isDone: false,
      isAnimated: animated
    );
    
    // restore navigator config if prev. overridden
    self.navigationConfigOverride.restoreConfigIfNeeded();
  };
  
  override func viewDidDisappear(_ animated: Bool) {
    // send event: notify js nav. route has disappeared
    self.routeView?.notifyOnRouteBlur(
      isDone: true,
      isAnimated: animated
    );
  };
  
  override func willMove(toParent parent: UIViewController?){
    /// calls the parent impl. (e.g. `RNINavigatorRouteBaseViewController`)
    super.willMove(toParent: parent);
    
    #if DEBUG
    print(
        "LOG - RNINavigatorReactRouteViewController, willMove"
      + " - toParent, isNil: \(parent == nil)"
      + " - routeID: \(self.routeID)"
      + " - routeKey: \(self.routeKey)"
      + " - routeIndex: \(self.routeIndex)"
    );
    #endif
    
    if parent == nil {
      // this vc 'will' be popped
      // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
      let isUserInitiated = !self.isToBeRemoved;
      
      // send event: notify js nav. route view that it's going to be popped.
      self.routeView?.notifyOnRoutePop(
        isDone: false,
        isUserInitiated: isUserInitiated
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  override func didMove(toParent parent: UIViewController?) {
    /// calls the parent impl. (e.g. `RNINavigatorRouteBaseViewController`)
    super.didMove(toParent: parent);
    
    #if DEBUG
    print(
        "LOG - RNINavigatorReactRouteViewController, didMove"
      + " - toParent, isNil: \(parent == nil)"
      + " - routeView, isNil: \(self.routeView == nil)"
      + " - routeID: \(self.routeID)"
      + " - routeKey: \(self.routeKey)"
      + " - routeIndex: \(self.routeIndex)"
    );
    #endif
    
    if parent == nil {
      // this vc 'will' be popped
      // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
      let isUserInitiated = !self.isToBeRemoved;
      
      // send event: notify js nav. route view that it's been popped.
      self.routeView?.notifyOnRoutePop(
        isDone: true,
        isUserInitiated: isUserInitiated
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  override func viewWillTransition(to size: CGSize, with coordinator: UIViewControllerTransitionCoordinator) {
    super.viewWillTransition(to: size, with: coordinator);
    
    guard let routeView = self.routeView else { return };
    
    coordinator.animate(alongsideTransition: nil){ _ in
      if let navigatorView = routeView.navigatorView {
        navigatorView.navigatorConstants.refreshConstants();
      };
      
      if let routeHeader = self.routeView?.reactRouteHeader {
        // rotation - update the route header's top padding
        routeHeader.refreshHeaderTopPadding();
      };
    };
  };
  
  // --------------------------
  // MARK:- Internal  Functions
  // --------------------------
  
  /// Override the base impl. so that values used to reset the back config comes
  /// from the js/react values instead of `prevBackItem`.
  override func resetRouteNavBarBackConfig(){
    guard let routeView = self.routeView else { return };
    
    self.navigationItem.backBarButtonItem = routeView.backBarButtonItem;
    
    if #available(iOS 11.0, *) {
      self.navigationItem.backButtonTitle = routeView.backButtonTitle as String?;
    };
    
    if #available(iOS 14.0, *) {
      self.navigationItem.backButtonDisplayMode = {
        guard let string = routeView.backButtonDisplayMode as String?,
              let displayMode = UINavigationItem.BackButtonDisplayMode(string: string)
        else { return .default };
        
        return displayMode;
      }();
    };
  };
  
  func setupSearchController(){
    guard #available(iOS 11.0, *),
          let searchConfig = self.routeView?._searchBarConfig
    else { return };
    
    let searchController = UISearchController(searchResultsController: nil);
    searchConfig.updateSearchController(searchController);
    
    searchController.searchResultsUpdater = self;
    searchController.searchBar.delegate = self;
    
    self.navigationItem.searchController = searchController;
    
    /// Temp. set this flag to false to fix search bar transitions
    self.navigationItem.hidesSearchBarWhenScrolling = false;
  };
  
  func refreshSearchController(){
    guard #available(iOS 11.0, *),
          let searchConfig     = self.routeView?._searchBarConfig,
          let searchController = self.navigationItem.searchController
    else { return };
    
    let searchBar = searchController.searchBar;
    
    /// Climb the search bar's view hierarchy to get it's `textField` and
    /// `placeholderLabel`, then cache it for later use.
    ///
    /// * Note: Must be performed in `viewDidAppear` to guarantee that the
    ///   search bar (and it's subviews) already exist.
    
    if self.searchBarTextField == nil {
      self.searchBarTextField = searchBar.textField;
    };
    
    if self.searchBaPlaceholderLabel == nil {
      self.searchBaPlaceholderLabel = searchBar.placeholderLabel;
    };
    
    searchConfig.updateSearchController(searchController,
      searchBarTextField: self.searchBarTextField,
      searchBarPlaceholderLabel: self.searchBaPlaceholderLabel
    );
    
    self.navigationItem.hidesSearchBarWhenScrolling =
      searchConfig.hidesSearchBarWhenScrolling ?? true;
  };
  
  func setupScrollView(){
    guard #available(iOS 13.0, *),
          case let .reactScrollView(view: reactScrollView) = self.wrapperView,
          let scrollView = reactScrollView.scrollView
    else { return };
    
    scrollView.automaticallyAdjustsScrollIndicatorInsets = false;
  };
};

// -----------------------------------------------
// MARK:- Extension: RNINavigatorRouteViewDelegate
// -----------------------------------------------

/// Receive events from the "route view" that is paired with this vc.
/// This delegate is used to receive "props" from `RNINavigatorRouteView`.
extension RNINavigatorReactRouteViewController: RNINavigatorRouteViewDelegate {
  
  func didReceiveStatusBarStyle(_ style: UIStatusBarStyle) {
    self.statusBarStyle = style;
    self.setNeedsStatusBarAppearanceUpdate();
  };
  
  // --------------------------------------
  // MARK: Receive Props: Transition Config
  // --------------------------------------
  
  func didReceiveTransitionConfigPush(_ config: RNINavTransitionConfig){
    self.transitionTypePush = config;
  };
  
  func didReceiveTransitionConfigPop(_ config: RNINavTransitionConfig){
    self.transitionTypePop = config;
  };
  
  // ----------------------------------
  // MARK: Receive Props: Navbar Config
  // ----------------------------------
  
  func didReceiveRouteTitle(_ title: String) {
    self.navigationItem.title = title;
  };
  
  func didReceivePrompt(_ prompt: String?) {
    self.navigationItem.prompt = prompt;
    self.navigationController?.navigationBar.setNeedsLayout();
  };
  
  func didReceiveLargeTitleDisplayMode(_ displayMode: UINavigationItem.LargeTitleDisplayMode) {
    if #available(iOS 11.0, *) {
      self.navigationItem.largeTitleDisplayMode = displayMode;
    };
  };
  
  func didReceiveNavBarAppearanceOverride(_ config: RNINavBarAppearance) {
    self.navigationConfigOverride.overrideLegacyNavBarAppearance(config);
  };
  
  func didReceiveNavBarVisibility(_ mode: RNINavigatorRouteView.NavBarVisibility) {
    self.navigationConfigOverride.overrideIsNavBarHidden(mode);
  };
  
  func didReceiveAllowTouchEventsToPassThroughNavigationBar(_ flag: Bool) {
    self.navigationConfigOverride.overrideAllowTouchEventsToPassThroughNavigationBar(flag);
  };
  
  func didReceiveSearchBarConfig(_ config: RNISearchControllerConfig?){
    guard #available(iOS 11.0, *) else { return };
    
    guard let config = config,
          let searchController = self.navigationItem.searchController
    else {
      self.navigationItem.searchController = nil;
      return;
    };
    
    config.updateSearchController(searchController,
      searchBarTextField: self.searchBarTextField,
      searchBarPlaceholderLabel: self.searchBaPlaceholderLabel
    );
    
    self.navigationItem.hidesSearchBarWhenScrolling =
      config.hidesSearchBarWhenScrolling ?? true;
  };
  
  // ----------------------------------
  // MARK: Receive Props: Nav bar Items
  // ----------------------------------
  
  func didReceiveNavBarButtonTitleView(_ titleView: UIView?) {
    self.navigationItem.titleView = titleView;
  };
  
  func didReceiveNavBarButtonBackItem(
    _ item: UIBarButtonItem?,
    _ applyToPrevBackConfig: Bool
  ) {
    
    if applyToPrevBackConfig,
       let prevRouteVC = self.routeView.navigatorView?.getSecondToLastRouteVC() {

      let backItem = prevRouteVC.navigationItem;
      
      // save then override
      self.prevBackItem.backBarButtonItem = backItem.backBarButtonItem;
      backItem.backBarButtonItem = item;
      
    } else {
      self.navigationItem.backBarButtonItem = item;
    };
  };
  
  func didReceiveNavBarButtonLeftItems(_ items: [UIBarButtonItem]?) {
    self.navigationItem.leftBarButtonItems = items;
  };
  
  func didReceiveNavBarButtonRightItems(_ items: [UIBarButtonItem]?) {
    self.navigationItem.rightBarButtonItems = items;
  };
  
  // ----------------------------------------------
  // MARK: Receive Props: NavBar Back Button Config
  // ----------------------------------------------
  
  func didReceiveLeftItemsSupplementBackButton(_ bool: Bool) {
    self.navigationItem.leftItemsSupplementBackButton = bool;
  };
  
  func didReceiveBackButtonTitle(
    _ title: String?,
    _ applyToPrevBackConfig: Bool
  ) {
    guard #available(iOS 11.0, *) else { return };
    
    if applyToPrevBackConfig,
       let prevRouteVC = self.routeView.navigatorView?.getSecondToLastRouteVC() {
      
      let backItem = prevRouteVC.navigationItem;
      
      // save then override
      self.prevBackItem.backTitle = backItem.backButtonTitle;
      backItem.backButtonTitle = title;
  
    } else {
      self.navigationItem.backButtonTitle = title;
    };
  };
  
  func didReceiveBackButtonDisplayMode(
    _ displayMode: UINavigationItem.BackButtonDisplayMode,
    _ applyToPrevBackConfig: Bool
  ) {
    guard #available(iOS 14.0, *) else { return };
    
    if applyToPrevBackConfig,
       let prevRouteVC = self.routeView.navigatorView?.getSecondToLastRouteVC() {
      
      let backItem = prevRouteVC.navigationItem;
      
      // save then override
      self.prevBackItem.backButtonDisplayMode = backItem.backButtonDisplayMode;
      backItem.backButtonDisplayMode = displayMode;
      
    } else {
      self.navigationItem.backButtonDisplayMode = displayMode;
    };
  };
  
  func didReceiveHidesBackButton(_ hidesBackButton: Bool){
    self.navigationItem.hidesBackButton = hidesBackButton;
  };
};

// ------------------------------------------------
// MARK:- Extension: UINavigationControllerDelegate
// ------------------------------------------------

/// Handle custom view controller transitions
extension RNINavigatorReactRouteViewController:
  UINavigationControllerDelegate, UIViewControllerTransitioningDelegate {
  
  func navigationController(
    _           navigationController: UINavigationController,
    animationControllerFor operation: UINavigationController.Operation,
    from fromVC: UIViewController,
    to   toVC  : UIViewController

  ) -> UIViewControllerAnimatedTransitioning? {
    switch operation {
      case .push: return self.transitionTypePush.makeAnimator();
        
      case .pop : return self.transitionTypePop.makeAnimator(
        interactionController: self.interactionController
      );
      
      default: return nil;
    };
  };
  
  func interactionControllerForDismissal(
    using animator: UIViewControllerAnimatedTransitioning
  ) -> UIViewControllerInteractiveTransitioning? {
    
    guard let animator = animator as? CustomAnimator,
          let interactionController = animator.interactionController as? LeftEdgeInteractionController,
          interactionController.inProgress
    else { return nil };
    
    return interactionController;
  };
};

// -----------------------------------------
// MARK:- Extension: UISearchResultsUpdating
// -----------------------------------------

/// Handle search controller-related events
extension RNINavigatorReactRouteViewController: UISearchResultsUpdating {
  func updateSearchResults(for searchController: UISearchController) {
    #if DEBUG
    print("LOG - RNINavigatorReactRouteViewController, UISearchResultsUpdating: updateSearchResults"
      + " - searchBar.text: \(searchController.searchBar.text ?? "N/A")"
      + " - isActive: \(searchController.isActive)"
    );
    #endif
    
    self.routeView?.notifyOnUpdateSearchResults(
      searchText: searchController.searchBar.text,
      isActive: searchController.isActive
    );
  };
};

// -------------------------------------
// MARK:- Extension: UISearchBarDelegate
// -------------------------------------

/// Handle search bar-related events
extension RNINavigatorReactRouteViewController: UISearchBarDelegate {
  func searchBarCancelButtonClicked(_ searchBar: UISearchBar) {
    #if DEBUG
    print("LOG - RNINavigatorReactRouteViewController, UISearchBarDelegate: searchBarCancelButtonClicked"
      + " - searchBar.text: \(searchBar.text ?? "N/A")"
    );
    #endif
    
    self.routeView?.notifyOnSearchBarCancelButtonClicked();
  };
  
  func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
    #if DEBUG
    print("LOG - RNINavigatorReactRouteViewController, UISearchBarDelegate: searchBarSearchButtonClicked"
      + " - searchBar.text: \(searchBar.text ?? "N/A")"
    );
    #endif
    
    self.routeView?.notifyOnSearchBarSearchButtonClicked(
      searchText: searchBar.text
    );
  };
};
