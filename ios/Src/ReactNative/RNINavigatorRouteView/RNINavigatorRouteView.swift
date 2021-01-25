//
//  RNINavigatorRouteView.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

import UIKit;


protocol RNINavigatorRouteViewDelegate: AnyObject {
  
  func didReceiveRouteTitle(_ title: String);
  
  func didReceivePrompt(_ title: String?);
  
  func didReceiveLargeTitleDisplayMode(_ displayMode: UINavigationItem.LargeTitleDisplayMode);
  
  func didReceiveNavBarButtonTitleView(_ titleView: UIView);
  
  func didReceiveNavBarButtonBackItem(_ item: UIBarButtonItem?);
  
  func didReceiveNavBarButtonLeftItems(_ items: [UIBarButtonItem]?);
  
  func didReceiveNavBarButtonRightItems(_ items: [UIBarButtonItem]?);
  
  func didReceiveLeftItemsSupplementBackButton(_ bool: Bool);
  
  func didReceiveBackButtonTitle(_ title: String?);
  
  func didReceiveBackButtonDisplayMode(_ displayMode: UINavigationItem.BackButtonDisplayMode);
  
  func didReceiveHidesBackButton(_ hidesBackButton: Bool);  
};

class RNINavigatorRouteView: UIView {
  
  struct NativeIDKeys {
    static let RouteContent    = "RouteContent";
    static let NavBarBackItem  = "NavBarBackItem";
    static let NavBarLeftItem  = "NavBarLeftItem";
    static let NavBarRightItem = "NavBarRightItem";
    static let NavBarTitleItem = "NavBarTitleItem";
  };
  
  // -----------------
  // MARK:- Properties
  // -----------------
  
  weak var bridge: RCTBridge!;
  weak var delegate: RNINavigatorRouteViewDelegate?;
  
  /// content to show in the navigator
  var reactRouteContent: UIView?;
  
  /// ref. to the parent route vc
  weak var routeVC: RNINavigatorRouteViewController? {
    didSet {
      self.setupRouteVC();
    }
  };

  
  // MARK: Custom navigation bar items...
  
  // custom right bar item was set, but no config was given, so we
  // implicitly/automatically show the custom bar item...
  
  var reactNavBarBackItem : UIView?;
  var reactNavBarLeftItem : UIView?;
  var reactNavBarRightItem: UIView?;
  var reactNavBarTitleItem: UIView?;
  
  
  // ------------------------------
  // MARK:- RN Exported Event Props
  // ------------------------------
  
  /// Fired when a route is *about to be* "pushed"
  @objc var onNavRouteWillPush: RCTBubblingEventBlock?;
  /// Fired when a route *has been* "pushed"
  @objc var onNavRouteDidPush: RCTBubblingEventBlock?;
  
  /// Fired when a route is *about to be* "popped", either due to a "user intiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onNavRouteWillPop: RCTBubblingEventBlock?;
  /// Fired when a route *has been* "popped", either due to a "user intiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onNavRouteDidPop: RCTBubblingEventBlock?;
  
  /// Fired when the nav bar's back item is pressed and is a custom nav bar item.
  @objc var onPressNavBarBackItem: RCTBubblingEventBlock?;
  @objc var onPressNavBarLeftItem: RCTBubblingEventBlock?;
  @objc var onPressNavBarRightItem: RCTBubblingEventBlock?;
  
  // ------------------------
  // MARK:- RN Exported Props
  // ------------------------
  
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
  
  private var _largeTitleDisplayMode: UINavigationItem.LargeTitleDisplayMode?;
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
      guard self.navBarButtonBackItemConfig != oldValue,
            let dict       = self.navBarButtonBackItemConfig,
            let configItem = RNINavBarItemConfig(dictionary: dict)
      else { return };
      
      if configItem.type == .CUSTOM {
        configItem.customView = self.reactNavBarBackItem;
      };
      
      self._navBarButtonBackItemConfig = configItem;
      delegate?.didReceiveNavBarButtonBackItem(self.backBarButtonItem);
    }
  };
  
  private var _navBarButtonLeftItemsConfig: [RNINavBarItemConfig]?;
  @objc var navBarButtonLeftItemsConfig: NSArray? {
    didSet {
      guard self.navBarButtonLeftItemsConfig != oldValue,
            let arrayAny = self.navBarButtonLeftItemsConfig,
            let array    = arrayAny as? [NSDictionary]
      else { return };
      
      let configItems = array.compactMap {
        RNINavBarItemConfig(dictionary: $0);
      };
      
      if let configItem = configItems.first, configItem.type == .CUSTOM {
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
      guard self.navBarButtonRightItemsConfig != oldValue,
            let arrayAny = self.navBarButtonRightItemsConfig,
            let array    = arrayAny as? [NSDictionary]
      else { return };
      
      let configItems = array.compactMap {
        RNINavBarItemConfig(dictionary: $0);
      };
      
      if let configItem = configItems.first, configItem.type == .CUSTOM {
        // set custom view for `navBarButtonRightItemsConfig`
        configItem.customView = self.reactNavBarRightItem;
      };
      
      self._navBarButtonRightItemsConfig = configItems;
      delegate?.didReceiveNavBarButtonRightItems(self.rightBarButtonItems);
    }
  };
  
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
      delegate?.didReceiveBackButtonTitle(self.backButtonTitle as String?);
    }
  };
  
  private var _backButtonDisplayMode: UINavigationItem.BackButtonDisplayMode?;
  @objc var backButtonDisplayMode: NSString? {
    didSet {
      guard self.backButtonDisplayMode != oldValue,
            let string      = self.backButtonDisplayMode as String?,
            let displayMode = UINavigationItem.BackButtonDisplayMode(string: string)
      else { return };
      
      self._backButtonDisplayMode = displayMode;
      delegate?.didReceiveBackButtonDisplayMode(displayMode);
    }
  };
  
  @objc var hidesBackButton: Bool = false {
    didSet {
      guard self.hidesBackButton != oldValue else { return };
      delegate?.didReceiveHidesBackButton(self.hidesBackButton);
    }
  };
  
  
  // ------------------------------------
  // MARK:- Convenience Property Wrappers
  // ------------------------------------
  
  /// Creates a back nav bar button item based on `navBarButtonBackItemConfig`
  var backBarButtonItem: UIBarButtonItem? {
    guard let backConfigItem = self._navBarButtonBackItemConfig
    else { return nil };
    
    return backConfigItem.createUIBarButtonItem { [unowned self] config in
      #if DEBUG
      print("LOG - NativeView, RNINavigatorRouteView"
        + " - onPress: `backBarButtonItem`"
      );
      #endif
      
      self.onPressNavBarBackItem?(
        config.makeNavBarItemEventParams()
      );
    };
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
        
        self.onPressNavBarLeftItem?(
          config.makeNavBarItemEventParams()
        );
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
        
        self.onPressNavBarRightItem?(
          config.makeNavBarItemEventParams()
        );
      };
    };
  };
  
  // ---------------------
  // MARK:- Init/Lifecycle
  // ---------------------
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
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
    
    /// receive child comps. from `RNINavigatorRouteView`.
    /// note: the child comp. can be identified based on their `nativeID`
    switch nativeID {
      case NativeIDKeys.RouteContent:
        self.reactRouteContent = subview;
        
      case NativeIDKeys.NavBarBackItem:
        self.reactNavBarBackItem = subview;
        delegate?.didReceiveNavBarButtonTitleView(subview);
        
      case NativeIDKeys.NavBarLeftItem:
        self.reactNavBarLeftItem = subview;
        
      case NativeIDKeys.NavBarRightItem:
        self.reactNavBarRightItem = subview;
        
      case NativeIDKeys.NavBarTitleItem:
        self.reactNavBarTitleItem = subview;
        
      default: break;
    };
  };
  
  // -----------------------
  // MARK:- Public Functions
  // -----------------------
  
  func notifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge    = self.bridge,
          let reactView = self.reactRouteContent
    else { return };
    
    // update react view's size
    bridge.uiManager.setSize(newBounds.size, for: reactView);
  };
  
  /// Once we're done w/ this "route view" (e.g. it has been popped or removed),
  /// then we need to cleanup to prevent this instance from leaking.
  func cleanup(){
    let viewsToRemove = [
      self.reactRouteContent   ,
      self.reactNavBarBackItem ,
      self.reactNavBarLeftItem ,
      self.reactNavBarRightItem,
      self.reactNavBarTitleItem,
      self
    ];
    
    for case let view? in viewsToRemove {
      // cleanup: manually remove route from view registry
      RNIUtilities.recursivelyRemoveFromViewRegistry(
        bridge   : self.bridge,
        reactView: view
      );
    };
    
    // remove references to the react views
    self.reactRouteContent    = nil;
    self.reactNavBarBackItem  = nil;
    self.reactNavBarLeftItem  = nil;
    self.reactNavBarRightItem = nil;
    self.reactNavBarTitleItem = nil;
  };
  
  // ------------------------
  // MARK:- Private Functions
  // ------------------------
  
  /// the `routeVC` has been assigned to this "route view" for the first time,
  /// so we need to init. and prepare it.
  /// Because the "route view" is created first, by the time the "route vc" is
  /// created and added as a delegate, it has already missed a few events.
  private func setupRouteVC(){
    
    // set the vc's title for the 1st time
    if let routeTitle = self.routeTitle {
      delegate?.didReceiveRouteTitle(routeTitle as String);
    };
    
    // set nav bar prompt
    delegate?.didReceivePrompt(self.prompt as String?);
    
    // set nav bar large title display mode
    if let titleDisplayMode = self._largeTitleDisplayMode {
      self.delegate?.didReceiveLargeTitleDisplayMode(titleDisplayMode);
    };
    
    // set nav bar back item
    delegate?.didReceiveNavBarButtonBackItem(self.backBarButtonItem);
    
    // set nav bar left item
    delegate?.didReceiveNavBarButtonLeftItems(self.leftBarButtonItems);
    
    // set nav bar right item
    delegate?.didReceiveNavBarButtonRightItems(self.rightBarButtonItems);
    
    // set nav bar title item
    if let titleBarItem = self.reactNavBarTitleItem {
      delegate?.didReceiveNavBarButtonTitleView(titleBarItem);
    };
    
    // init `navigationItem` property from `leftItemsSupplementBackButton` prop
    delegate?.didReceiveLeftItemsSupplementBackButton(
      self.leftItemsSupplementBackButton
    );
    
    // init `navigationItem` property from `backButtonTitle` prop
    delegate?.didReceiveBackButtonTitle(self.backButtonTitle as String?);
    
    // init `navigationItem` property from `backButtonDisplayMode` prop
    if let displayMode = self._backButtonDisplayMode {
      delegate?.didReceiveBackButtonDisplayMode(displayMode);
    };
    
    // init `navigationItem` property from `hidesBackButton` prop
    delegate?.didReceiveHidesBackButton(self.hidesBackButton);
    
  };
};
