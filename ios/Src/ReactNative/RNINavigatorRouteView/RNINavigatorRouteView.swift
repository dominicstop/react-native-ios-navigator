//
//  RNINavigatorRouteView.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

import UIKit;


protocol RNINavigatorRouteViewDelegate: AnyObject {
  
  func didReceiveRouteTitle(title: String);
  
  func didReceiveNavBarButtonTitleView(titleView: UIView);
  
  func didReceiveNavBarButtonBackItem(item: UIBarButtonItem?);
  
  func didReceiveNavBarButtonLeftItems(items: [UIBarButtonItem]?);
  
  func didReceiveNavBarButtonRightItems(items: [UIBarButtonItem]?);
  
};

class RNINavigatorRouteView: UIView {
  
  struct NativeIDKeys {
    static let RouteContent    = "RouteContent";
    static let NavBarBackItem  = "NavBarBackItem";
    static let NavBarLeftItem  = "NavBarLeftItem";
    static let NavBarRightItem = "NavBarRightItem";
    static let NavBarTitleItem = "NavBarTitleItem";
  };
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  weak var bridge: RCTBridge!;
  weak var delegate: RNINavigatorRouteViewDelegate?;
  
  /// content to show in the navigator
  var reactRouteContent: UIView?;
  
  // custom navigation bar items...
  var reactNavBarBackItem : UIView?;
  var reactNavBarLeftItem : UIView?;
  var reactNavBarRightItem: UIView?;
  var reactNavBarTitleItem: UIView?;
  
  /// ref. to the parent route vc
  weak var routeVC: RNINavigatorRouteViewController? {
    didSet {
      self.setupRouteVC();
    }
  };

  // -----------------------------
  // MARK: RN Exported Event Props
  // -----------------------------
  
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
  
  @objc var onPressNavBarBackItem: RCTBubblingEventBlock?;
  @objc var onPressNavBarLeftItem: RCTBubblingEventBlock?;
  @objc var onPressNavBarRightItem: RCTBubblingEventBlock?;
  
  // -----------------------
  // MARK: RN Exported Props
  // -----------------------
  
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
      
      delegate?.didReceiveRouteTitle(title: routeTitle as String);
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
      
      delegate?.didReceiveNavBarButtonBackItem(item: self.backBarButtonItem);
      self._navBarButtonBackItemConfig = configItem;
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
      
      delegate?.didReceiveNavBarButtonLeftItems(items: self.leftBarButtonItems);
      self._navBarButtonLeftItemsConfig = configItems;
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
      
      delegate?.didReceiveNavBarButtonRightItems(items: self.rightBarButtonItems);
      self._navBarButtonRightItemsConfig = configItems;
    }
  };
  
  // -----------------------------------
  // MARK: Convenience Property Wrappers
  // -----------------------------------
  
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
  
  // --------------------
  // MARK: Init/Lifecycle
  // --------------------
  
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
  
  // ------------------
  // MARK: RN Lifecycle
  // ------------------
  
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
        delegate?.didReceiveNavBarButtonTitleView(titleView: subview);
        
      case NativeIDKeys.NavBarLeftItem:
        self.reactNavBarLeftItem = subview;
        
      case NativeIDKeys.NavBarRightItem:
        self.reactNavBarRightItem = subview;
        
      case NativeIDKeys.NavBarTitleItem:
        self.reactNavBarTitleItem = subview;
        
      default: break;
    };
  };
  
  // ----------------------
  // MARK: Public Functions
  // ----------------------
  
  func notifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge    = self.bridge,
          let reactView = self.reactRouteContent
    else { return };
    
    // update react view's size
    bridge.uiManager.setSize(newBounds.size, for: reactView);
  };
  
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
  
  // -----------------------
  // MARK: Private Functions
  // -----------------------
  
  /// the `routeVC` has been assigned to this "route view" for the first time,
  /// so we need to init. and prepare it.
  /// Because the "route view" is created first, by the time the "route vc" is
  /// created and added as a delegate, it has already missed a few events.
  private func setupRouteVC(){

    // set the vc's title for the 1st time
    if let routeTitle = self.routeTitle {
      delegate?.didReceiveRouteTitle(title: routeTitle as String);
    };
    
    // set nav bar back item
    delegate?.didReceiveNavBarButtonBackItem(item: self.backBarButtonItem);
    
    // set nav bar left item
    delegate?.didReceiveNavBarButtonLeftItems(items: self.leftBarButtonItems);
    
    // set nav bar right item
    delegate?.didReceiveNavBarButtonRightItems(items: self.rightBarButtonItems);
    
    // set nav bar title item
    if let titleBarItem = self.reactNavBarTitleItem {
      delegate?.didReceiveNavBarButtonTitleView(titleView: titleBarItem);
    };
  };
};
