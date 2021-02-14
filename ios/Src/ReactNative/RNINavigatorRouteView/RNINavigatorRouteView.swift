//
//  RNINavigatorRouteView.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

import UIKit;


class RNINavigatorRouteView: UIView {
  
  // ---------------------
  // MARK:- Embedded Types
  // ---------------------
  
  struct NativeIDKeys {
    static let RouteContent    = "RouteContent";
    static let NavBarLeftItem  = "NavBarLeftItem";
    static let NavBarRightItem = "NavBarRightItem";
    static let NavBarTitleItem = "NavBarTitleItem";
  };
  
  // -----------------
  // MARK:- Properties
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
  weak var routeVC: RNINavigatorRouteViewController? {
    didSet {
      self.setupRouteVC();
    }
  };
  
  // MARK: Custom navigation bar items...
  var reactNavBarLeftItem : RNIWrapperView?;
  var reactNavBarRightItem: RNIWrapperView?;
  var reactNavBarTitleItem: RNIWrapperView?;
  
  private var didTriggerCleanup = false;
  
  var applyToPrevBackConfig = false {
    didSet {
      guard self.applyToPrevBackConfig != oldValue,
            let routeVC = self.navigatorView?.getSecondToLastRouteVC()
      else { return };
      
      // was prev. set to true, and is now false
      if !self.applyToPrevBackConfig && oldValue {
        routeVC.resetRouteNavBarBackConfig();
        
      } else {
        routeVC.shouldResetNavBarBackConfig = self.applyToPrevBackConfig;
      };
    }
  };
  
  // ------------------------------
  // MARK:- RN Exported Event Props
  // ------------------------------
  
  /// Fired when a route is *about to be* "pushed"
  @objc var onRouteWillPush: RCTBubblingEventBlock?;
  /// Fired when a route *has been* "pushed"
  @objc var onRouteDidPush: RCTBubblingEventBlock?;
  
  /// Fired when a route is *about to be* "popped", either due to a "user intiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onRouteWillPop: RCTBubblingEventBlock?;
  /// Fired when a route *has been* "popped", either due to a "user intiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onRouteDidPop: RCTBubblingEventBlock?;
  
  /** Fired when the route is about to appear */
  @objc var onRouteWillFocus: RCTBubblingEventBlock?;
  /** Fired when the route appears */
  @objc var onRouteDidFocus : RCTBubblingEventBlock?;
  
  /** Fired when the route is about to dissapear */
  @objc var onRouteWillBlur: RCTBubblingEventBlock?;
  /** Fired when the route dissapear */
  @objc var onRouteDidBlur : RCTBubblingEventBlock?;
  
  /// Fired when the nav bar's back item is pressed and is a custom nav bar item.
  @objc var onPressNavBarLeftItem : RCTBubblingEventBlock?;
  @objc var onPressNavBarRightItem: RCTBubblingEventBlock?;
  
  // ------------------------
  // MARK:- RN Exported Props
  // ------------------------
  
  /// Note: Some of the exported props can be set to nil, which means that:
  /// * No value has been provided to the prop yet, so we should avoid setting
  ///   the corresponding properties.
  ///
  /// * The properties that the props sets can themselves be set to `nil`, so a
  ///   `nil` value for a prop is valid and should be allowed, so that the opt.
  ///   properties can be set back to a `nil` value.
  ///
  /// * The properties that the props sets needs to provide a default value
  ///   because it can't be set to `nil`.
  ///
  /// * TODO: However there are props where a `nil` is invalid (i.e. a value of
  ///   `nil` must **never** occur), so we need to mark the property as
  ///   "explicitly unwrapped" so that the app crashes because it's a fatal error.
  
  @objc var routeID: NSNumber!;
  
  @objc var routeKey: NSString? {
    didSet {
      guard let routeKey = self.routeKey else { return };
      
      #if DEBUG
      print("LOG - NativeView, RNINavigatorRouteView prop"
        + " - didSet, routeKey: \(routeKey)"
      );
      #endif
    }
  };
  
  @objc var routeIndex: NSNumber? {
    didSet {
      guard let routeIndex = self.routeIndex else { return };
      #if DEBUG
      print("LOG - NativeView, RNINavigatorRouteView prop"
        + " - didSet, routeIndex: \(routeIndex)"
      );
      #endif
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
        else { return .init(type: .DefaultPush) };
        
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
        else { return .init(type: .DefaultPop) };
        
        return config;
      }();
      
      self._transitionConfigPop = config;
      self.delegate?.didReceiveTransitionConfigPop(config);
    }
  };
  
  //  MARK: Props - Navbar Config
  /// * General/Misc. Navbar-related props for config. the VC's `navigationItem`
  ///   properties that are navbar-related.
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
  
  //  MARK: Props - Navbar Item Config
  /// * Specific props for config. the VC's `navigationItem` proerties that are
  ///   related to setting the various "navbar button item(s)" properties.
  /// -------------------------------------------------------------------------
  
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
  
  private var _navBarButtonBackItemConfig: RNINavBarItemConfig?;
  @objc var navBarButtonBackItemConfig: NSDictionary? {
    didSet {
      guard self.navBarButtonBackItemConfig != oldValue else { return };
      
      let configItem: RNINavBarItemConfig? = {
        guard let dict = self.navBarButtonBackItemConfig else { return nil };
        return RNINavBarItemConfig(dictionary: dict);
      }();
      
      // extract `applyToPrevBackConfig` from back item config,
      // note: this property only exist for `navBarButtonBackItemConfig`
      let applyToPrevBackConfig: Bool = {
        guard let dict = self.navBarButtonBackItemConfig,
              let flag = dict["applyToPrevBackConfig"] as? Bool
        else { return false };
        
        self.applyToPrevBackConfig = flag;
        return flag;
      }();
      
      self._navBarButtonBackItemConfig = configItem;
      delegate?.didReceiveNavBarButtonBackItem(self.backBarButtonItem, applyToPrevBackConfig);
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
  
  //  MARK: Props - Navbar Back Button Config
  /// * Navbar back button specific props for config. the VC's `navigationItem`
  ///   navbar "back button item" related properties.
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
  
  @objc var backButtonTitle: NSString? {
    didSet {
      guard self.backButtonTitle != oldValue else { return };
      delegate?.didReceiveBackButtonTitle(
        self.backButtonTitle as String?,
        self.applyToPrevBackConfig
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
      delegate?.didReceiveBackButtonDisplayMode(
        displayMode,
        self.applyToPrevBackConfig
      );
    }
  };
  
  @objc var hidesBackButton: Bool = false {
    didSet {
      guard self.hidesBackButton != oldValue else { return };
      delegate?.didReceiveHidesBackButton(self.hidesBackButton);
    }
  };
  
  //  MARK: Props - Overriding the NavBar Appearance

  private var _navBarAppearanceOverride: (
    standard  : RNINavBarAppearance.NavBarAppearanceConfig?,
    compact   : RNINavBarAppearance.NavBarAppearanceConfig?,
    scrollEdge: RNINavBarAppearance.NavBarAppearanceConfig?
  )?;
  
  @objc var navBarAppearanceOverride: NSDictionary? {
    didSet {
      guard self.navBarAppearanceOverride != oldValue else { return };
      
      func extractConfig(key: String) -> RNINavBarAppearance.NavBarAppearanceConfig? {
        guard let dict       = self.navBarAppearanceOverride,
              let configDict = dict[key] as? NSDictionary
        else { return nil };
        
        return RNINavBarAppearance.NavBarAppearanceConfig(dict: configDict);
      };

      self._navBarAppearanceOverride = (
        standard  : extractConfig(key: "standardAppearance"  ),
        compact   : extractConfig(key: "compactAppearance"   ),
        scrollEdge: extractConfig(key: "scrollEdgeAppearance")
      );
      
      self.delegate?.didReceiveNavBarAppearanceOverride(
        self._navBarAppearanceOverride?.standard,
        self._navBarAppearanceOverride?.compact ,
        self._navBarAppearanceOverride?.scrollEdge
      );
    }
  };
  
  // ---------------------
  // MARK:- Init/Lifecycle
  // ---------------------
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
    self.touchHandlerRouteContent = RCTTouchHandler(bridge: bridge);
  };
  
  #if DEBUG
  deinit {
    print("LOG - deinit - NativeView, RNINavigatorRouteView"
      + " - for routeKey: \(self.routeKey ?? "N/A")"
      + " - routeIndex: \(self.routeIndex ?? -1)"
    );
  };
  #endif
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  // -------------------
  // MARK:- RN Lifecycle
  // -------------------
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    guard let nativeID = subview.nativeID else {
      #if DEBUG
      print("LOG - ERROR - NativeView, RNINavigatorRouteView"
        + " - insertReactSubview: Received unknown child!"
      );
      #endif
      return;
    };
    
    if nativeID != NativeIDKeys.RouteContent {
      // do not show as subview, i.e. remove from view hieaarchy
      subview.removeFromSuperview();
    };
    
    // TODO: use `RNIWrapperView` for `RouteContent` so we can clean this up
    let wrapperView = subview as? RNIWrapperView;
    wrapperView?.delegate = self;
    wrapperView?.autoSetSizeOnLayout = false;
    
    /// receive child comps. from `RNINavigatorRouteView`.
    /// note: the child comp. can be identified based on their `nativeID`
    switch nativeID {
      case NativeIDKeys.RouteContent:
        self.reactRouteContent = subview;
        self.touchHandlerRouteContent.attach(to: subview);
        
      case NativeIDKeys.NavBarLeftItem:
        self.reactNavBarLeftItem = wrapperView;
        
      case NativeIDKeys.NavBarRightItem:
        self.reactNavBarRightItem = wrapperView;
        
      case NativeIDKeys.NavBarTitleItem:
        self.reactNavBarTitleItem = wrapperView;
        self.delegate?.didReceiveNavBarButtonTitleView(subview);
        
      default: break;
    };
  };
};

// ------------------------------------
// MARK:- Convenience Property Wrappers
// ------------------------------------

extension RNINavigatorRouteView {
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
    
    return leftConfigItems.compactMap {
      $0.createUIBarButtonItem { [unowned self] config in
        #if DEBUG
        print("LOG - NativeView, RNINavigatorRouteView"
          + " - onPress: `leftBarButtonItem`"
        );
        #endif
        
        var params = config.makeNavBarItemEventParams();
        params["routeID"] = self.routeID!;
        
        self.onPressNavBarLeftItem?(params);
      };
    };
  };
  
  /// Creates a right nav bar button item based on `navBarButtonRightItemsConfig`
  var rightBarButtonItems: [UIBarButtonItem]? {
    guard let rightConfigItems = self._navBarButtonRightItemsConfig
    else { return nil };
    
    return rightConfigItems.compactMap {
      $0.createUIBarButtonItem { [unowned self] config in
        #if DEBUG
        print("LOG - NativeView, RNINavigatorRouteView"
          + " - onPress: `rightBarButtonItem`"
        );
        #endif
        
        var params = config.makeNavBarItemEventParams();
        params["routeID"] = self.routeID!;
        
        self.onPressNavBarRightItem?(params);
      };
    };
  };
};

// ------------------------
// MARK:- Private Functions
// ------------------------

private extension RNINavigatorRouteView {
  
  /// The `routeVC` has been assigned to this "route view" for the first time.
  /// Because the "route view" is created first, by the time the "route vc" is
  /// created (and added as a delegate), it has already missed a few events, so
  /// we need to send the initial values.
  func setupRouteVC(){
    guard let delegate = self.delegate else { return };
    
    // set push transition config
    if let pushConfig = self._transitionConfigPush {
      delegate.didReceiveTransitionConfigPush(pushConfig);
    };
    
    // set pop transition config
    if let popConfig = self._transitionConfigPop {
      delegate.didReceiveTransitionConfigPop(popConfig);
    };
    
    // set the vc's title for the 1st time
    if let routeTitle = self.routeTitle {
      delegate.didReceiveRouteTitle(routeTitle as String);
    };
    
    // set nav bar prompt
    delegate.didReceivePrompt(self.prompt as String?);
    
    // set nav bar large title display mode
    delegate.didReceiveLargeTitleDisplayMode(self._largeTitleDisplayMode);
    
    // set navbar appearance override
    delegate.didReceiveNavBarAppearanceOverride(
      self._navBarAppearanceOverride?.standard,
      self._navBarAppearanceOverride?.compact,
      self._navBarAppearanceOverride?.scrollEdge
    );
    
    // set nav bar back item
    delegate.didReceiveNavBarButtonBackItem(
      self.backBarButtonItem,
      self.applyToPrevBackConfig
    );
    
    // set nav bar left item
    delegate.didReceiveNavBarButtonLeftItems(self.leftBarButtonItems);
    
    // set nav bar right item
    delegate.didReceiveNavBarButtonRightItems(self.rightBarButtonItems);
    
    // set nav bar title item
    if let titleBarItem = self.reactNavBarTitleItem {
      delegate.didReceiveNavBarButtonTitleView(titleBarItem);
    };
    
    // init `navigationItem` property from `leftItemsSupplementBackButton` prop
    delegate.didReceiveLeftItemsSupplementBackButton(
      self.leftItemsSupplementBackButton
    );
    
    // init `navigationItem` property from `backButtonTitle` prop
    delegate.didReceiveBackButtonTitle(
      self.backButtonTitle as String?,
      self.applyToPrevBackConfig
    );
    
    // init `navigationItem` property from `backButtonDisplayMode` prop
    delegate.didReceiveBackButtonDisplayMode(
      self._backButtonDisplayMode,
      self.applyToPrevBackConfig
    );
    
    // init `navigationItem` property from `hidesBackButton` prop
    delegate.didReceiveHidesBackButton(
      self.hidesBackButton
    );
  };
  
  /// This creates a "base" dictionary that we can pass to "event props"
  func createEventPayload() -> Dictionary<String, Any> {
    var dict: Dictionary<String, Any> = [
      "routeID"   : self.routeID!,
      "routeKey"  : self.routeKey!,
      "routeIndex": self.routeIndex!,
    ];
    
    if let reactTag = self.reactTag {
      dict["reactTag"] = reactTag;
    };

    return dict;
  };
};

// -----------------------
// MARK:- Public Functions
// -----------------------

extension RNINavigatorRouteView {
  
  /// Notify `RouteView`'s bounds had changed and resize
  func notifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge    = self.bridge,
          let reactView = self.reactRouteContent
    else { return };
    
    // update react view's size
    bridge.uiManager.setSize(newBounds.size, for: reactView);
  };
  
  /// notify js `RNINavigatorRouteView` that its about to be/has been pushed
  func notifyOnRoutePush(isDone: Bool, isAnimated: Bool){
    var dict = self.createEventPayload();
    dict["isAnimated"] = isAnimated;
    
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
  
  func notifyOnRouteFocus(isDone: Bool, isAnimated: Bool){
    var dict = self.createEventPayload();
    dict["isAnimated"] = isAnimated;
    
    // send event
    (isDone ? self.onRouteDidFocus : self.onRouteWillFocus)?(dict);
  };
  
  func notifyOnRouteBlur(isDone: Bool, isAnimated: Bool){
    var dict = self.createEventPayload();
    dict["isAnimated"] = isAnimated;
    
    // send event
    (isDone ? self.onRouteDidBlur : self.onRouteWillBlur)?(dict);
  };
    
  /// Once we're done w/ this "route view" (e.g. it has been popped or removed),
  /// then we need to cleanup to prevent this instance from leaking.
  func cleanup(){
    guard !self.didTriggerCleanup else { return };
    self.didTriggerCleanup = true;
    
    // "react views" to be removed
    let viewsToRemove = [
      self.reactRouteContent   ,
      self.reactNavBarLeftItem ,
      self.reactNavBarRightItem,
      self.reactNavBarTitleItem,
      self
    ];
    
    // detatch RCTTouchandler from react view
    if let routeContent = self.reactRouteContent {
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
    self.reactNavBarLeftItem  = nil;
    self.reactNavBarRightItem = nil;
    self.reactNavBarTitleItem = nil;
  };
};

// -----------------------------
// MARK:- RNIWrapperViewDelegate
// -----------------------------

/// Receive `RNIWrapperView` events
extension RNINavigatorRouteView: RNIWrapperViewDelegate {
  func onJSComponentWillUnmount(sender: RNIWrapperView, isManuallyTriggered: Bool) {
    
    switch sender.nativeID {
      case NativeIDKeys.NavBarLeftItem:
        self.reactNavBarLeftItem = nil;
        
      case NativeIDKeys.NavBarRightItem:
        self.reactNavBarRightItem = nil;
        
      case NativeIDKeys.NavBarTitleItem:
        self.reactNavBarTitleItem = nil;
        self.delegate?.didReceiveNavBarButtonTitleView(nil);
        
      default: return;
    };
  };
};
