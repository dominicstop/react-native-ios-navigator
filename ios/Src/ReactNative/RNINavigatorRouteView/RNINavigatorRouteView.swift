//
//  RNINavigatorRouteView.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

import UIKit;


internal class RNINavigatorRouteView: UIView {
  
  // MARK: - Embedded Types
  // ---------------------
  
  enum NativeIDKeys: String {
    case RouteContent;
    case NavBarLeftItem;
    case NavBarRightItem;
    case NavBarTitleItem;
  };
  
  enum NavBarVisibility: String {
    case visible, hidden, `default`;
  };
  
  // MARK: - Properties
  // -----------------
  
  /// ref to the shared `RCTBridge` instance
  weak var bridge: RCTBridge!;
  weak var delegate: RNINavigatorRouteViewDelegate?;
  
  /// content to show in the navigator
  var reactRouteContent: UIView?;
  var touchHandlerRouteContent: RCTTouchHandler!;
  
  /// ref. to the parent nav. view
  weak var navigatorView: RNINavigatorView?;
  
  /// ref. to the parent route vc
  weak var routeVC: RNINavigatorReactRouteViewController? {
    didSet {
      // The `routeVC` has been assigned to this "route view" for the first time...
      self.setupRouteVC();
    }
  };
  
  // MARK: Custom navigation bar items...
  var reactNavBarLeftItem : RNIWrapperView?;
  var reactNavBarRightItem: RNIWrapperView?;
  var reactNavBarTitleItem: RNIWrapperView?;
  
  var reactRouteHeader: RNINavigatorRouteHeaderView?;
  
  private(set) var didTriggerCleanup = false;
  
  private var didSetInitialHeight = false;
  
  // MARK: - RN Exported Event Props
  // ------------------------------
  
  // MARK: Push/Pop Related Events
  /// Fired when a route is *about to be* "pushed"
  @objc var onRouteWillPush: RCTBubblingEventBlock?;
  
  /// Fired when a route *has been* "pushed"
  @objc var onRouteDidPush: RCTBubblingEventBlock?;
  
  /// Fired when a route is *about to be* "popped", either due to a "user initiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onRouteWillPop: RCTBubblingEventBlock?;
  
  /// Fired when a route *has been* "popped", either due to a "user initiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onRouteDidPop: RCTBubblingEventBlock?;
  
  // MARK: Focus/Blur Related Events
  /** Fired when the route is about to appear */
  @objc var onRouteWillFocus: RCTBubblingEventBlock?;
  
  /** Fired when the route appears */
  @objc var onRouteDidFocus : RCTBubblingEventBlock?;
  
  /** Fired when the route is about to disappear */
  @objc var onRouteWillBlur: RCTBubblingEventBlock?;
  
  /** Fired when the route disappear */
  @objc var onRouteDidBlur : RCTBubblingEventBlock?;
  
  // MARK: NavBarItem Related Events
  @objc var onPressNavBarLeftItem: RCTBubblingEventBlock?;
  @objc var onPressNavBarRightItem: RCTBubblingEventBlock?;
  
  // MARK: Search Related Events
  @objc var onUpdateSearchResults: RCTBubblingEventBlock?;
  
  @objc var onSearchBarCancelButtonClicked: RCTBubblingEventBlock?;
  @objc var onSearchBarSearchButtonClicked: RCTBubblingEventBlock?;
  
  @objc var onWillDismissSearchController: RCTBubblingEventBlock?;
  @objc var onDidDismissSearchController: RCTBubblingEventBlock?;
  
  @objc var onWillPresentSearchController: RCTBubblingEventBlock?;
  @objc var onDidPresentSearchController: RCTBubblingEventBlock?;
  
  // MARK: - RN Exported Props
  // ------------------------
  
  /// Note: Some of the exported props can be set to nil, which means that:
  /// * No value has been provided to the prop yet, so we should avoid setting
  ///   the corresponding properties.
  ///
  /// * The properties that the props sets can themselves be set to `nil`, so a
  ///   `nil` value for a prop is valid.
  ///
  /// * The properties that the props sets needs to provide a default value
  ///   because it can't be set to `nil`.
  ///
  /// * However there are props where a `nil` is invalid (i.e. a value of
  ///   `nil` must **never** occur) so this would crash the RN comp. sends
  ///   over a property with a `null/undefined` js value.
  
  @objc var routeID: NSNumber = -1;
  
  @objc var routeKey: NSString = "N/A";
  
  @objc var routeIndex: NSNumber = -1;
  
  var _statusBarStyle: UIStatusBarStyle = .default;
  @objc var statusBarStyle: NSString? {
    didSet {
      guard self.statusBarStyle != oldValue else { return };
      
      self._statusBarStyle = {
        guard let string = self.statusBarStyle as String?,
              let style  = UIStatusBarStyle(string: string)
        else { return .default };
        
        return style;
      }();
      
      self.delegate?
        .didReceiveStatusBarStyle(self._statusBarStyle);
    }
  };
  
  //  MARK: Props - Transition Config
  /// Props for setting the transition to use when the nav. is pushing/popping
  /// -------------------------------------------------------------------------
  
  private var _transitionConfigPush: RNINavTransitionConfig?;
  @objc var transitionConfigPush: NSDictionary? {
    didSet {
      guard self.transitionConfigPush != oldValue else { return };
      
      let config: RNINavTransitionConfig = {
        guard let dict = self.transitionConfigPush,
              let config = RNINavTransitionConfig(dictionary: dict)
        else { return .init(type: .Default) };
        
        return config;
      }();
      
      self._transitionConfigPush = config;
      self.delegate?.didReceiveTransitionConfigPush(config);
    }
  };
  
  private var _transitionConfigPop: RNINavTransitionConfig?;
  @objc var transitionConfigPop: NSDictionary? {
    didSet {
      guard self.transitionConfigPop != oldValue else { return };
      
      let config: RNINavTransitionConfig = {
        guard let dict = self.transitionConfigPop,
              let config = RNINavTransitionConfig(dictionary: dict)
        else { return .init(type: .Default) };
        
        return config;
      }();
      
      self._transitionConfigPop = config;
      self.delegate?.didReceiveTransitionConfigPop(config);
    }
  };
  
  //  MARK: Props - Navbar Config
  /// * General/Misc. NavBar-related props for config. the VC's `navigationItem`
  ///   properties that are NavBar-related.
  /// -------------------------------------------------------------------------
  
  @objc var routeTitle: NSString? {
    didSet {
      guard let routeTitle = self.routeTitle as String?
      else { return };
      
      delegate?.didReceiveRouteTitle(routeTitle as String);
    }
  };
  
  @objc var prompt: NSString? {
    didSet {
      guard self.prompt != oldValue else { return };
      self.delegate?.didReceivePrompt(self.prompt as String?);
    }
  };
  
  private var _largeTitleDisplayMode: UINavigationItem.LargeTitleDisplayMode = .automatic;
  @objc var largeTitleDisplayMode: NSString? {
    didSet {
      guard self.largeTitleDisplayMode != oldValue else { return };
      
      let displayMode: UINavigationItem.LargeTitleDisplayMode = {
        guard let string = self.largeTitleDisplayMode as String?,
              let mode = UINavigationItem.LargeTitleDisplayMode(string: string)
        else { return .automatic };

        return mode;
      }();
      
      self._largeTitleDisplayMode = displayMode;
      self.delegate?.didReceiveLargeTitleDisplayMode(displayMode);
    }
  };
  
  var _searchBarConfig: RNISearchControllerConfig?;
  @objc var searchBarConfig: NSDictionary? {
    didSet {
      guard let dict = self.searchBarConfig else {
        self.delegate?.didReceiveSearchBarConfig(nil);
        return;
      };
      
      let config = RNISearchControllerConfig(from: dict);
      self._searchBarConfig = config;
      
      self.delegate?.didReceiveSearchBarConfig(config);
    }
  };
  
  //  MARK: Props - Navbar Item Config
  /// * Specific props for config. the VC's `navigationItem` properties that are
  ///   related to setting the various "nav bar button item(s)" properties.
  /// -------------------------------------------------------------------------
  
  private var _navBarButtonBackItemConfig: RNINavBarItemConfig?;
  @objc var navBarButtonBackItemConfig: NSDictionary? {
    didSet {
      guard self.navBarButtonBackItemConfig != oldValue else { return };
      
      let configItem: RNINavBarItemConfig? = {
        guard let dict = self.navBarButtonBackItemConfig else { return nil };
        return RNINavBarItemConfig(dictionary: dict);
      }();
      
      self._navBarButtonBackItemConfig = configItem;
      delegate?.didReceiveNavBarButtonBackItem(
        self.backBarButtonItem,
        self.applyBackButtonConfigToCurrentRoute
      );
    }
  };
  
  private var _navBarButtonLeftItemsConfig: [RNINavBarItemConfig]?;
  @objc var navBarButtonLeftItemsConfig: NSArray? {
    didSet {
      guard self.navBarButtonLeftItemsConfig != oldValue else { return };

      let configItems: [RNINavBarItemConfig]? = {
        guard let arrayAny = self.navBarButtonLeftItemsConfig,
              let array    = arrayAny as? [NSDictionary]
        else { return nil };
        
        return array.compactMap {
          RNINavBarItemConfig(dictionary: $0);
        };
      }();
      
      if let configItem = configItems?.first, configItem.type == .CUSTOM {
        // set custom view for `navBarButtonLeftItemsConfig`
        configItem.customView = self.reactNavBarLeftItem;
      };
      
      self._navBarButtonLeftItemsConfig = configItems;
      delegate?.didReceiveNavBarButtonLeftItems(self.leftBarButtonItems);
    }
  };
  
  private var _navBarButtonRightItemsConfig: [RNINavBarItemConfig]?;
  @objc var navBarButtonRightItemsConfig: NSArray? {
    didSet {
      guard self.navBarButtonRightItemsConfig != oldValue else { return };
  
      let configItems: [RNINavBarItemConfig]? = {
        guard let arrayAny = self.navBarButtonRightItemsConfig,
              let array    = arrayAny as? [NSDictionary]
        else { return nil };
        
        return array.compactMap {
          RNINavBarItemConfig(dictionary: $0);
        };
      }();
      
      if let configItem = configItems?.first, configItem.type == .CUSTOM {
        // set custom view for `navBarButtonRightItemsConfig`
        configItem.customView = self.reactNavBarRightItem;
      };
      
      self._navBarButtonRightItemsConfig = configItems;
      delegate?.didReceiveNavBarButtonRightItems(self.rightBarButtonItems);
    }
  };
  
  //  MARK: Props - NavBar Back Button Config
  /// * NavBar back button specific props for config. the VC's `navigationItem`
  ///   NavBar "back button item" related properties.
  /// -------------------------------------------------------------------------
  
  @objc var leftItemsSupplementBackButton: Bool = true {
    didSet {
      guard self.leftItemsSupplementBackButton != oldValue
      else { return };
      
      delegate?.didReceiveLeftItemsSupplementBackButton(
        self.leftItemsSupplementBackButton
      );
    }
  };
  
  @objc var applyBackButtonConfigToCurrentRoute = false {
    didSet {
      guard self.applyBackButtonConfigToCurrentRoute != oldValue,
            let prevRouteVC = self.navigatorView?.getSecondToLastRouteVC()
      else { return };
      
      if oldValue && !self.applyBackButtonConfigToCurrentRoute {
        // was prev. set to true, and is now false, so reset
        prevRouteVC.resetRouteNavBarBackConfig();
        
      } else if self.applyBackButtonConfigToCurrentRoute {
        // was enabled, so apply current config
        prevRouteVC.shouldResetNavBarBackConfig = true;
        
        self.delegate?.didReceiveNavBarButtonBackItem(
          self.backBarButtonItem,
          self.applyBackButtonConfigToCurrentRoute
        );
        
        self.delegate?.didReceiveBackButtonTitle(
          self.backButtonTitle as String?,
          self.applyBackButtonConfigToCurrentRoute
        );
        
        self.delegate?.didReceiveBackButtonDisplayMode(
          self._backButtonDisplayMode,
          self.applyBackButtonConfigToCurrentRoute
        );
      };
    }
  };
  
  @objc var backButtonTitle: NSString? {
    didSet {
      guard self.backButtonTitle != oldValue else { return };
      delegate?.didReceiveBackButtonTitle(
        self.backButtonTitle as String?,
        self.applyBackButtonConfigToCurrentRoute
      );
    }
  };
  
  private var _backButtonDisplayMode: UINavigationItem.BackButtonDisplayMode = .default;
  @objc var backButtonDisplayMode: NSString? {
    didSet {
      guard self.backButtonDisplayMode != oldValue else { return };
      
      let displayMode: UINavigationItem.BackButtonDisplayMode = {
        guard let string      = self.backButtonDisplayMode as String?,
              let displayMode = UINavigationItem.BackButtonDisplayMode(string: string)
        else { return .default };
        
        return displayMode;
      }();
      
      self._backButtonDisplayMode = displayMode;
      self.delegate?.didReceiveBackButtonDisplayMode(
        displayMode,
        self.applyBackButtonConfigToCurrentRoute
      );
    }
  };
  
  @objc var hidesBackButton: Bool = false {
    didSet {
      guard self.hidesBackButton != oldValue else { return };
      self.delegate?.didReceiveHidesBackButton(self.hidesBackButton);
    }
  };
  
  //  MARK: Props - NavigationConfigOverride-related
  /// ----------------------------------------------
  
  let navBarAppearanceOverrideConfig = RNINavBarAppearance(dict: nil);
  @objc var navBarAppearanceOverride: NSDictionary? {
    didSet {
      guard self.navBarAppearanceOverride != oldValue else { return };
      
      if let dict = self.navBarAppearanceOverride {
        // update nav bar appearance
        self.navBarAppearanceOverrideConfig.updateValues(dict: dict);
        
      } else {
        // reset appearance config
        self.navBarAppearanceOverrideConfig.resetValues();
      };
      
      // notify delegate of update
      self.delegate?.didReceiveNavBarAppearanceOverride(
        self.navBarAppearanceOverrideConfig
      );
    }
  };
  
  var navigationBarVisibilityMode: NavBarVisibility = .default;
  @objc var navigationBarVisibility: NSString? {
    didSet {
      guard oldValue != self.navigationBarVisibility else { return };
      
      let visibility: NavBarVisibility = {
        guard let string     = self.navigationBarVisibility,
              let visibility = NavBarVisibility(rawValue: string as String)
        else { return .default };
        
        return visibility;
      }();
      
      self.navigationBarVisibilityMode = visibility;
      
      // notify delegate of update
      self.delegate?.didReceiveNavBarVisibility(visibility);
    }
  };
  
  @objc var allowTouchEventsToPassThroughNavigationBar = false {
    willSet {
      guard self.allowTouchEventsToPassThroughNavigationBar != newValue,
            let navigatorView = self.navigatorView
      else { return };
      
      navigatorView.allowTouchEventsToPassThroughNavigationBar = newValue;
    }
  };
  
  // MARK: - Init/Lifecycle
  // ---------------------
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
    self.touchHandlerRouteContent = RCTTouchHandler(bridge: bridge);
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  // MARK: - RN Lifecycle
  // -------------------
  
  override func reactSetFrame(_ frame: CGRect) {
    guard !self.didSetInitialHeight else { return };
    
    self.didSetInitialHeight = true;
    
    super.reactSetFrame(frame);
    self.notifyForBoundsChange(frame);
  };
    
  override func reactSuperview() -> UIView! {
    return self.navigatorView;
  };
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    guard let nativeID    = subview.nativeID,
          let nativeIDKey = NativeIDKeys(rawValue: nativeID)
    else {
      #if DEBUG
      print("LOG - ERROR - NativeView, RNINavigatorRouteView"
        + " - insertReactSubview: Received unknown child!"
      );
      #endif
      return;
    };
    
    // TODO: use `RNIWrapperView` for `RouteContent` so we can clean this up
    let wrapperView = subview as? RNIWrapperView;
    wrapperView?.delegate = self;
    wrapperView?.autoSetSizeOnLayout = false;
    wrapperView?.willChangeSuperview = true;
    
    if nativeIDKey != .RouteContent {
      // do not show as subview, i.e. remove from view hierarchy
      subview.removeFromSuperview();
    };
    
    /// receive child comps. from `RNINavigatorRouteView`.
    /// note: the child comp. can be identified based on their `nativeID`
    switch nativeIDKey {
      case .RouteContent:
        self.reactRouteContent = subview;
        self.touchHandlerRouteContent.attach(to: subview);
        
      case .NavBarLeftItem:
        self.reactNavBarLeftItem = wrapperView!;
        
      case .NavBarRightItem:
        self.reactNavBarRightItem = wrapperView!;
        
      case .NavBarTitleItem:
        self.reactNavBarTitleItem = wrapperView!;
        self.delegate?.didReceiveNavBarButtonTitleView(subview);
    };
  };
};

// MARK: - Convenience Property Wrappers
// ------------------------------------

internal extension RNINavigatorRouteView {
  
  var navigatorID: Int? {
    self.navigatorView?.navigatorID?.intValue;
  };
  
  /// Creates a back nav bar button item based on `navBarButtonBackItemConfig`
  var backBarButtonItem: UIBarButtonItem? {
    guard let backConfigItem = self._navBarButtonBackItemConfig
    else { return nil };
    
    return backConfigItem.createUIBarButtonItem(action: nil);
  };
  
  /// Creates a left nav bar button item based on `navBarButtonLeftItemsConfig`
  var leftBarButtonItems: [UIBarButtonItem]? {
    guard let leftConfigItems = self._navBarButtonLeftItemsConfig
    else { return nil };
    
    return leftConfigItems.enumerated().compactMap { (index, item) in
      item.createUIBarButtonItem { [unowned self] in

        var params      = self.createEventPayload();
        let paramsExtra = $0.makeNavBarItemEventParams();
        
        params.merge(paramsExtra) { (current, _) in current };
        params["index"] = index;
        
        self.onPressNavBarLeftItem?(params);
      };
    };
  };
  
  /// Creates a right nav bar button item based on `navBarButtonRightItemsConfig`
  var rightBarButtonItems: [UIBarButtonItem]? {
    guard let rightConfigItems = self._navBarButtonRightItemsConfig
    else { return nil };
    
    return rightConfigItems.enumerated().compactMap { (index, item) in
      item.createUIBarButtonItem { [unowned self] in
        
        var params      = self.createEventPayload();
        let paramsExtra = $0.makeNavBarItemEventParams();
        
        params.merge(paramsExtra) { (current, _) in current };
        params["index"] = index;
        
        self.onPressNavBarRightItem?(params);
      };
    };
  };
};

// MARK: - Private Functions
// ------------------------

private extension RNINavigatorRouteView {
  
  /// This method is called to trigger the "delegate events" for the first time.
  /// Since the "route view" is created first, by the time the "route vc" is
  /// created (and added as a delegate), it has already missed a few events.
  /// So this method triggers the delegate events to send the initial values that
  /// this view received from react/js.
  ///
  func setupRouteVC(){
    guard let delegate = self.delegate else { return };
    
    delegate.didReceiveStatusBarStyle(self._statusBarStyle);
    
    // MARK: Section - Set Transition Config
    // -------------------------------------
    
    if let pushConfig = self._transitionConfigPush {
      delegate.didReceiveTransitionConfigPush(pushConfig);
    };
    
    if let popConfig = self._transitionConfigPop {
      delegate.didReceiveTransitionConfigPop(popConfig);
    };
    
    // MARK: Section - Set Navbar Config
    // ---------------------------------
    
    if let routeTitle = self.routeTitle {
      delegate.didReceiveRouteTitle(routeTitle as String);
    };
    
    delegate.didReceivePrompt(self.prompt as String?);
    
    delegate.didReceiveLargeTitleDisplayMode(self._largeTitleDisplayMode);
    
    delegate.didReceiveNavBarButtonBackItem(
      self.backBarButtonItem,
      self.applyBackButtonConfigToCurrentRoute
    );
    
    // MARK: Section - Set Navbar Item Config
    // --------------------------------------
    
    delegate.didReceiveNavBarButtonLeftItems(self.leftBarButtonItems);
    
    delegate.didReceiveNavBarButtonRightItems(self.rightBarButtonItems);
    
    if let titleBarItem = self.reactNavBarTitleItem {
      delegate.didReceiveNavBarButtonTitleView(titleBarItem);
    };
    
    // MARK: Section - NavBar Back Button Config
    // -----------------------------------------
    
    delegate.didReceiveLeftItemsSupplementBackButton(
      self.leftItemsSupplementBackButton
    );
    
    delegate.didReceiveBackButtonTitle(
      self.backButtonTitle as String?,
      self.applyBackButtonConfigToCurrentRoute
    );
    
    delegate.didReceiveBackButtonDisplayMode(
      self._backButtonDisplayMode,
      self.applyBackButtonConfigToCurrentRoute
    );
    
    delegate.didReceiveHidesBackButton(
      self.hidesBackButton
    );
    
    //  MARK: Section - NavigationConfigOverride-related
    /// ------------------------------------------------
    
    delegate.didReceiveNavBarVisibility(self.navigationBarVisibilityMode);
    
    delegate.didReceiveAllowTouchEventsToPassThroughNavigationBar(
      self.allowTouchEventsToPassThroughNavigationBar
    );
  };
  
  /// This creates a "base" dictionary that we can pass to "event props"
  func createEventPayload() -> Dictionary<String, Any> {
    var dict: Dictionary<String, Any> = [
      "routeID"   : self.routeID,
      "routeKey"  : self.routeKey,
      "routeIndex": self.routeIndex,
    ];
    
    if let reactTag = self.reactTag {
      dict["reactTag"] = reactTag;
    };

    return dict;
  };
};

// MARK: - Functions for Module
// ---------------------------

internal extension RNINavigatorRouteView {
  
  func getConstants(completion: @escaping (NSDictionary) -> Void) throws {
    guard let routeVC = self.routeVC else {
      throw RNINavigatorError(
        code: .libraryError,
        domain: "\(String(describing: Self.self)).\(#function)",
        message:
          "No corresponding 'routeVC' found for the route view."
        + " The route view may not be completely initialized yet."
      );
    };
    
    completion([
      "isCurrentlyInFocus": routeVC.isCurrentlyInFocus,
      
      // ui values
      "navBarHeight"   : routeVC.navBarHeight,
      "statusBarHeight": routeVC.statusBarHeight,
      "safeAreaInsets" : routeVC.view.bounds.dictionary,
      "bounds"         : routeVC.synthesizedSafeAreaInsets.dictionary,
      
      "navBarWithStatusBarHeight": routeVC.navBarWithStatusBarHeight,
    ]);
  };
};

// MARK: - Internal Functions
// --------------------------

internal extension RNINavigatorRouteView {
  
  /// Once we're done w/ this "route view" (e.g. it has been popped or removed),
  /// then we need to cleanup to prevent this instance from leaking.
  func cleanup(){
    guard !self.didTriggerCleanup else { return };
    self.didTriggerCleanup = true;
    
    // "react views" to be removed
    let viewsToRemove = [
      self.reactRouteContent   ,
      self.reactRouteHeader    ,
      self.reactNavBarLeftItem ,
      self.reactNavBarRightItem,
      self.reactNavBarTitleItem,
      self,
    ];
    
    // detach `RCTTouchHandler` from react view
    if let routeContent = self.reactRouteContent {
      /// TODO (001): Some error occurs here when reloading?
      /// * Error: Terminating app due to uncaught exception
      ///   'NSInternalInconsistencyException', reason: 'RCTTouchHandler
      ///   attached to another view.'
      ///   * Assertion failure in -[RCTTouchHandler attachToView:]()
      ///   * [native] Exception thrown while executing UI block: RCTTouchHandler
      ///     already has attached view.
      /// * Also, during fast fast-refresh, the routes become non-responsive
      ///   (but the back button can still be pressed, etc).
      /// * It looks like the original route views must have unmounted (or
      ///   replaced by the "new routes").
      /// * Log - 'RNIWrapperViewManager: resetSharedBridge...'
      /// * Last commands/logs before exception:
      ///   * LOG - NativeView, RNINavigatorView: insertReactSubview
      ///     - atIndex: 0 - routeView.routeKey: Home - routeView.routeIndex: 0
      ///   * LOG - NativeView, RNINavigatorRouteView - insertReactSubview:
      ///     RouteContent! - atIndex: 0
      self.touchHandlerRouteContent.detach(from: routeContent);
    };
    
    // cleanup: manually remove routes from view registry
    for case let view? in viewsToRemove {
      if let wrapperView = view as? RNIWrapperView {
        // trigger wrapper view cleanup
        wrapperView.cleanup();
        
      } else {
        RNIUtilities.recursivelyRemoveFromViewRegistry(
          bridge   : self.bridge,
          reactView: view
        );
      };
    };
    
    // remove references to the react views
    self.reactRouteContent    = nil;
    self.reactRouteHeader     = nil;
    self.reactNavBarLeftItem  = nil;
    self.reactNavBarRightItem = nil;
    self.reactNavBarTitleItem = nil;
  };
  
  func setInitialSize(_ newBounds: CGRect){
    self.didSetInitialHeight = true;
    self.notifyForBoundsChange(newBounds);
  };
  
  /// Notify `RouteView`'s bounds had changed and resize
  func notifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge    = self.bridge,
          let reactView = self.reactRouteContent
    else { return };
    
    let didChangeSize =
         self.bounds.width  != newBounds.size.width
      || self.bounds.height != newBounds.size.height
      || reactView.bounds.width  != newBounds.size.width
      || reactView.bounds.height != newBounds.size.height;
    
    if didChangeSize {
      // update react view's size
      self.bounds = newBounds;
      bridge.uiManager.setSize(newBounds.size, for: reactView);
    };
  };
  
  // MARK: - Route Lifecycle Events
  // ------------------------------
  
  /// notify js `RNINavigatorRouteView` that its about to be/has been pushed
  func notifyOnRoutePush(isDone: Bool){
    let dict = self.createEventPayload();
    
    // send event
    (isDone ? self.onRouteDidPush : self.onRouteWillPush)?(dict);
  };
  
  /// notify js `RNINavigatorRouteView` that its about to be popped
  func notifyOnRoutePop(isDone: Bool, isUserInitiated: Bool){
    var dict = self.createEventPayload();
    dict["isUserInitiated"] = isUserInitiated;
    
    // send event
    (isDone ? self.onRouteDidPop : self.onRouteWillPop)?(dict);
  };
  
  func notifyOnRouteFocus(isDone: Bool, isAnimated: Bool, isFirstFocus: Bool){
    var dict = self.createEventPayload();
    dict["isAnimated"] = isAnimated;
    dict["isFirstFocus"] = isFirstFocus;
    
    // send event
    (isDone ? self.onRouteDidFocus : self.onRouteWillFocus)?(dict);
  };
  
  func notifyOnRouteBlur(isDone: Bool, isAnimated: Bool){
    var dict = self.createEventPayload();
    dict["isAnimated"] = isAnimated;
    
    // send event
    (isDone ? self.onRouteDidBlur : self.onRouteWillBlur)?(dict);
  };
  
  // MARK: - Search-Related Events
  // -----------------------------
  
  func notifyOnSearchBarCancelButtonClicked(){
    self.onSearchBarCancelButtonClicked?(self.createEventPayload());
  };
  
  func notifyOnSearchBarSearchButtonClicked(searchText: String?){
    var dict = self.createEventPayload();
    
    if let searchText = searchText {
      dict["text"] = searchText;
    };
    
    self.onSearchBarSearchButtonClicked?(dict);
  };
  
  // MARK: - Search Lifecycle-Related Events
  // ---------------------------------------
  
  func notifyOnUpdateSearchResults(searchText: String?, isActive: Bool){
    var dict = self.createEventPayload();
    dict["isActive"] = isActive;
    
    if let searchText = searchText {
      dict["text"] = searchText;
    };
    
    self.onUpdateSearchResults?(dict);
  };
  
  func notifyOnWillDismissSearchController(searchText: String?){
    var dict = self.createEventPayload();
    
    if let searchText = searchText {
      dict["text"] = searchText;
    };
    
    self.onWillDismissSearchController?(dict);
  };
  
  func notifyOnDidDismissSearchController(searchText: String?){
    var dict = self.createEventPayload();
    
    if let searchText = searchText {
      dict["text"] = searchText;
    };
    
    self.onDidDismissSearchController?(dict);
  };
  
  func notifyOnWillPresentSearchController(searchText: String?){
    var dict = self.createEventPayload();
    
    if let searchText = searchText {
      dict["text"] = searchText;
    };
    
    self.onWillPresentSearchController?(dict);
  };
  
  func notifyOnDidPresentSearchController(searchText: String?){
    var dict = self.createEventPayload();
    
    if let searchText = searchText {
      dict["text"] = searchText;
    };
    
    self.onDidPresentSearchController?(dict);
  };
};

// MARK: - RNIWrapperViewDelegate
// -----------------------------

/// Receive `RNIWrapperView` events
extension RNINavigatorRouteView: RNIWrapperViewDelegate {
  func onJSComponentWillUnmount(sender: RNIWrapperView, isManuallyTriggered: Bool) {
    guard let nativeID    = sender.nativeID,
          let nativeIDKey = NativeIDKeys(rawValue: nativeID)
    else { return };
    
    switch nativeIDKey {
      case .NavBarLeftItem:
        self.reactNavBarLeftItem = nil;
        
      case .NavBarRightItem:
        self.reactNavBarRightItem = nil;
        
      case .NavBarTitleItem:
        self.reactNavBarTitleItem = nil;
        self.delegate?.didReceiveNavBarButtonTitleView(nil);
        
      default: return;
    };
  };
};
