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
  
  /// Used to override the current nav. config and restore it when the route becomes inactive.
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
    /// ben overridden/replaced) so that we can restore it later.
    var navBarLegacyConfig: NavBarAppearanceLegacyConfig?;
    
    var isNavBarHidden: Bool?;
    
    var navController: UINavigationController? {
      self.parentRef?.navigationController
    };
    
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
      
      func setNavigationBarHidden(_ isHidden: Bool){
        if isAnimated {
          navController.setNavigationBarHidden(isHidden , animated: true);
          
        } else {
          navController.isNavigationBarHidden = isHidden;
        };
      };
      
      /// TODO: Bug - when hiding nav bar, scrollview still snaps
      switch mode {
        case .hidden : setNavigationBarHidden(true);
        case .visible: setNavigationBarHidden(false);
          
        default:
          if let isNavBarHidden = self.isNavBarHidden {
            setNavigationBarHidden(isNavBarHidden);
            self.isNavBarHidden = nil;
          };
      };
    };
    
    /// Will read the props from the `routeView`, and will save the current values,
    /// and then temp. override the navigator config.
    func overrideIfNeeded(isAnimated: Bool){
      guard let parentRef     = self.parentRef,
            let routeView     = parentRef.routeView,
            let navController = parentRef.navigationController
      else { return };
      
      let navBarAppearanceConfig = routeView.navBarAppearanceOverrideConfig;
      let shouldOverrideNavBarAppearance = navBarAppearanceConfig.mode != nil;
      
      /// overriding the nav bar appearance...
      if shouldOverrideNavBarAppearance {
        #if DEBUG
        print("LOG - VC, RNINavigatorReactRouteViewController: NavigationConfigOverride"
          + " - saveConfigAndOverride, for navBarAppearanceConfig"
        );
        #endif
        
        // first save the current legacy config (if it has one) so it can be restored later
        self.navBarLegacyConfig =
          NavBarAppearanceLegacyConfig(from: navController.navigationBar);
        
        // then update the navigation bar appearance
        // (uses `navigationItem` if mode is appearance)
        routeView.navBarAppearanceOverrideConfig.updateNavBarAppearance(
          navController.navigationBar,
          navigationItem: parentRef.navigationItem
        );
      };
      
      let navBarVisibilityCurrent = navController.isNavigationBarHidden;
      let navBarVisibilityNext    = routeView.navigationBarVisibilityMode;
      
      /// override isNavigationBarHidden, save current value to restore later
      if navBarVisibilityNext != .default {
        self.isNavBarHidden = navBarVisibilityCurrent;
      };
      
      switch routeView.navigationBarVisibilityMode {
        case .hidden : navController.setNavigationBarHidden(true , animated: isAnimated);
        case .visible: navController.setNavigationBarHidden(false, animated: isAnimated);
        case .default: break;
      };
    };
    
    /// If there were any nav bar config values overridden, then this will restore
    /// them to the prev. values.
    func restoreConfigIfNeeded(){
      guard let navController = self.navController else { return };
      if let navBarLegacyConfig = self.navBarLegacyConfig {
        
        #if DEBUG
        print("LOG - VC, RNINavigatorReactRouteViewController: NavigationConfigOverride"
          + " - restoreConfig, restore navBarAppearanceConfig"
        );
        #endif
        
        navBarLegacyConfig.applyConfig(to: navController.navigationBar);
      };
      
      if let isNavBarHidden = self.isNavBarHidden {
        #if DEBUG
        print("LOG - VC, RNINavigatorReactRouteViewController: NavigationConfigOverride"
          + " - restoreConfig, restore isNavBarHidden: \(isNavBarHidden)"
        );
        #endif
        
        navController.isNavigationBarHidden = isNavBarHidden;
        self.isNavBarHidden = nil;
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
  
  /// Holds the subview for `reactRouteContent`
  var wrapperView: RouteContentWrapper!;
  
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
  
  // --------------------------------
  // MARK:- View Controller Lifecycle
  // --------------------------------
  
  override func loadView() {
    super.loadView();
    
    /// The "root view" is the `routeView`'s `reactRouteContent`.
    /// * The `routeView` is a container that holds all the route-related components
    ///   i.e. it facilitates as a way to receive components from react and acts
    ///   as a temp. parent/container.
    /// * The `reactRouteContent` is a container that holds the route contents. It
    ///    will contain a `wrapperView`. The `wrapperView` is the actual view
    ///    that contains the content that we want to show from the the react route.
    let rootView = self.routeView!.reactRouteContent!;
    self.view = rootView;
        
    self.wrapperView = {
      guard let contentView = rootView.subviews.first
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
    }();
    
    if let headerView = self.routeView.reactRouteHeader {
      headerView.routeViewController = self;
      
      headerView.setup(
        rootView: rootView,
        wrapperView: self.wrapperView
      );
    };
    
    #if DEBUG
    print("LOG - RNINavigatorReactRouteViewController: loadView"
      + " - wrapperView: \(self.wrapperView?.description ?? "N/A")!"
      + " - headerView: \(self.routeView.reactRouteHeader != nil ? "true" : "false")"
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
  };
  
  override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews();
    
    /// update `routeView`'s size
    self.routeView?.notifyForBoundsChange(self.view.bounds);
  };
  
  override func viewWillAppear(_ animated: Bool) {
    // by this point, it's already been set so force unwrap
    let routeView = self.routeView!;
    
    // send event: notify js nav. route is about to appear
    routeView.notifyOnRouteFocus(
      isDone: false,
      isAnimated: animated
    );
    
    // if back config was prev. overridden, then restore...
    if self.shouldResetNavBarBackConfig {
      self.resetRouteNavBarBackConfig();
      self.shouldResetNavBarBackConfig = false;
    };
    
    /// Override the nav. config based on the current `routeView` props
    self.navigationConfigOverride.overrideIfNeeded(isAnimated: animated);
  };
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated);
    
    // send event: notify js nav. route has appeared
    self.routeView?.notifyOnRouteFocus(
      isDone: true,
      isAnimated: animated
    );
  };
  
  override func viewWillDisappear(_ animated: Bool) {
    // send event: notify js nav. route is about to disappear
    self.routeView?.notifyOnRouteFocus(
      isDone: false,
      isAnimated: animated
    );
    
    // restore navigator config if prev. overridden
    self.navigationConfigOverride.restoreConfigIfNeeded();
  };
  
  override func viewDidDisappear(_ animated: Bool) {
    // send event: notify js nav. route has disappeared
    self.routeView?.notifyOnRouteFocus(
      isDone: true,
      isAnimated: animated
    );
  };
  
  override func viewDidLayoutSubviews() {
    super.viewWillLayoutSubviews();
    
    switch self.wrapperView {
      case let .reactScrollView(reactScrollView):
        reactScrollView.refreshContentInset();
        
      default: break;
    };
  };
  
  override func willMove(toParent parent: UIViewController?){
    super.willMove(toParent: parent);
    
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
    super.didMove(toParent: parent);
    
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
  
  // ------------------------
  // MARK:- Public  Functions
  // ------------------------
  
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
};

// -----------------------------------------------
// MARK:- Extension: RNINavigatorRouteViewDelegate
// -----------------------------------------------

/// Receive events from the "route view" that is paired with this vc.
/// This delegate is used to receive "props" from `RNINavigatorRouteView`.
extension RNINavigatorReactRouteViewController: RNINavigatorRouteViewDelegate {

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
  };
  
  func didReceiveLargeTitleDisplayMode(_ displayMode: UINavigationItem.LargeTitleDisplayMode) {
    if #available(iOS 11.0, *) {
      self.navigationItem.largeTitleDisplayMode = displayMode;
    };
  };
  
  func didReceiveNavBarAppearanceOverride(_ config: RNINavBarAppearance) {
    // if using legacy mode, update the nav bar appearance directly, otherwise if
    // using appearance mode, then update the nav bar appearance via the `navigationItem`
    config.updateNavBarAppearance(
      self.navigationController?.navigationBar,
      navigationItem: self.navigationItem
    );
  };
  
  func didReceiveNavBarVisibility(_ mode: RNINavigatorRouteView.NavBarVisibility) {
    self.navigationConfigOverride.overrideIsNavBarHidden(mode);
  };
  
  // ---------------------------------
  // MARK: Receive Props: Navbar Items
  // ---------------------------------
  
  func didReceiveNavBarButtonTitleView(_ titleView: UIView?) {
    self.navigationItem.titleView = titleView;
  };
  
  func didReceiveNavBarButtonBackItem(
    _ item: UIBarButtonItem?,
    _ applyToPrevBackConfig: Bool
  ) {
    #if DEBUG
    print("LOG -* didReceiveNavBarButtonBackItem, dict: \(item.debugDescription)");
    #endif
    
    if applyToPrevBackConfig {
      guard let prevRouteVC = self.routeView.navigatorView?.getSecondToLastRouteVC()
      else { return };
      
      let backItem = prevRouteVC.navigationItem;
      
      #if DEBUG
      print("LOG -* didReceiveNavBarButtonBackItem, applyToPrevBackConfig: true");
      #endif
      
      // save then override
      self.prevBackItem.backBarButtonItem = backItem.backBarButtonItem;
      backItem.backBarButtonItem = item;
      
    } else {
      #if DEBUG
      print("LOG -* didReceiveNavBarButtonBackItem, applyToPrevBackConfig: false");
      #endif
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
    
    if applyToPrevBackConfig {
      guard let prevRouteVC = self.routeView.navigatorView?.getSecondToLastRouteVC()
      else { return };
      
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
    
    if applyToPrevBackConfig {
      guard let prevRouteVC = self.routeView.navigatorView?.getSecondToLastRouteVC()
      else { return };
      
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
