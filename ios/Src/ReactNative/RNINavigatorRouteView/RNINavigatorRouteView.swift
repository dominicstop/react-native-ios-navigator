//
//  RNINavigatorRouteView.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/1/21.
//

import UIKit;


class RNINavigatorRouteView: UIView {
  
  struct NativeIDKeys {
    static let RouteContent    = "RouteContent";
    static let NavBarLeftItem  = "NavBarLeftItem";
    static let NavBarRightItem = "NavBarRightItem";
    static let NavBarTitleItem = "NavBarTitleItem";
  };
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  weak var bridge: RCTBridge!;
  
  /// content to show in the navigator
  var reactRouteContent: UIView?;
  
  // custom navigation bar items...
  var reactNavBarLeftItem : UIView?;
  var reactNavBarRightItem: UIView?;
  var reactNavBarTitleItem: UIView?;
  
  /// ref. to the parent route vc
  weak var routeVC: RNINavigatorRouteViewController?;

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
      
      self.routeVC?.title = routeTitle;
    }
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
    
    guard subview.nativeID == NativeIDKeys.RouteContent else {
      #if DEBUG
      print("LOG - ERROR - NativeView, RNINavigatorRouteView"
        + " - insertReactSubview: Received unknown child!"
      );
      #endif
      return;
    };
    
    self.reactRouteContent = subview;
  };
  
  // ----------------------
  // MARK: Public Functions
  // ----------------------
  
  func registerNativeComponent(nativeID: String, component: UIView){

    
    /*
    // set nav bar right item
    if let rightBarItem = self.routeView.reactNavBarRightItem {
      let barItem = UIBarButtonItem(customView: rightBarItem);
      self.navigationItem.rightBarButtonItem = barItem;
    };
    
    // set nav bar left item
    if let leftBarItem = self.routeView.reactNavBarLeftItem {
      let barItem = UIBarButtonItem(customView: leftBarItem);
      self.navigationItem.leftBarButtonItem = barItem;
    };
    
    // set nav bar title item
    if let titleBarItem = self.routeView.reactNavBarTitleItem {
      
    };
    */
    
    if let navBarItem = component as? RNIRouteNavBarItemView {
      switch nativeID {
        case NativeIDKeys.NavBarRightItem:
          self.reactNavBarRightItem = navBarItem.reactContent;
          
        case NativeIDKeys.NavBarLeftItem:
          self.reactNavBarLeftItem = navBarItem.reactContent;
          
        case NativeIDKeys.NavBarTitleItem:
          self.reactNavBarTitleItem = navBarItem.reactContent;
          
        default: break;
      };
    };
  };
  
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
    self.reactNavBarLeftItem  = nil;
    self.reactNavBarRightItem = nil;
    self.reactNavBarTitleItem = nil;
  };
};
