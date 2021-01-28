//
//  RNINavigatorView.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import UIKit;

typealias Completion = () -> Void;


class RNINavigatorView: UIView {
  
  // -----------------
  // MARK:- Properties
  // -----------------
  
  /// ref to the shared `RCTBridge` instance
  weak var bridge: RCTBridge!;
  
  /// The`activeRoute` items, i.e.the routes added/to be added to the nav. stack.
  /// Note: This has to have strong ref. to the routes so that they will be
  /// retained. Once the routes are "popped", they should be removed from here
  /// so that they will be "released".
  private var routeVCs: [RNINavigatorRouteViewController] = [];
  
  var navigationVC: ScrollingNavigationController!;
  
  // ----------------------------------
  // MARK: Convenient Property Wrappers
  // ----------------------------------
  
  var navigationBar: UINavigationBar {
    self.navigationVC.navigationBar;
  };
  
  // -----------------------------
  // MARK: RN Exported Event Props
  // -----------------------------
  
  /// A `RNINavigatorRouteView` instance was added as a subview.
  @objc var onNavRouteViewAdded: RCTBubblingEventBlock?;  
  
  /// Fired when a route is *about to be* "popped", either due to a "user intiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onNavRouteWillPop: RCTBubblingEventBlock?;
  /// Fired when a route *has abeen* "popped", either due to a "user intiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onNavRouteDidPop: RCTBubblingEventBlock?;
  
  // ------------------------
  // MARK:- RN Exported Props
  // ------------------------
  
  @objc var isInteractivePopGestureEnabled: Bool = true {
    willSet {
      self.navigationVC.interactivePopGestureRecognizer?.isEnabled = newValue;
    }
  };
  
  @objc var navBarPrefersLargeTitles: Bool = true {
    willSet {
      if #available(iOS 11.0, *) {
        self.navigationBar.prefersLargeTitles = newValue;
      };
    }
  };
  
  //  MARK: Props - Navigation Bar: Legacy Customizations
  /// * These are props that let's you customize the navigation bar using the
  ///   pre-iOS 13 way.
  /// * TODO: If on iOS 13+, the legacy styles are automatically vended to all
  ///   the `UINavigationBarAppearance` available appearances to the navbar.
  /// * TODO: However, there should be explict props for each appearance, e.g.:
  ///   `standardAppearance`, `compactAppearance`, and `scrollEdgeAppearance`.
  /// -------------------------------------------------------------------------
  
  @objc var navBarStyle: NSString? {
    didSet {
      guard self.navBarStyle != oldValue else { return };
      
      self.navigationBar.barStyle = {
        guard let string = self.navBarStyle as String?,
              let barStyle = UIBarStyle(string: string)
        else { return .default };
        
        return barStyle;
      }();
    }
  };
  
  @objc var navBarIsTranslucent: Bool = true {
    willSet {
      self.navigationBar.isTranslucent = newValue;
    }
  };
  
  @objc var navBarTintColor: NSNumber? {
    didSet {
      guard self.navBarTintColor != oldValue else { return };
     
      self.navigationBar.barTintColor = {
        guard let number  = self.navBarTintColor else { return nil };
        return RCTConvert.uiColor(number);
      }();
    }
  };
  
  private var _navBarTitleTextStyle = RCTTextAttributes();
  @objc var navBarTitleTextStyle: NSDictionary? {
    didSet {
      guard self.navBarTitleTextStyle != oldValue else { return };
      
      self.navigationBar.titleTextAttributes = {
        guard let dict = self.navBarTitleTextStyle, dict.count > 0
        else { return nil };
        
        self._navBarTitleTextStyle.apply(RCTTextAttributes(dict: dict));
        return self._navBarTitleTextStyle.effectiveTextAttributes();
      }();
    }
  };
  
  private var _navBarLargeTitleTextAttributes = RCTTextAttributes();
  @objc var navBarLargeTitleTextAttributes: NSDictionary? {
    didSet {
      guard #available(iOS 11.0, *),
            self.navBarLargeTitleTextAttributes != oldValue
      else { return };
      
      self.navigationBar.largeTitleTextAttributes = {
        guard let dict = self.navBarLargeTitleTextAttributes, dict.count > 0
        else { return nil };
        
        self._navBarLargeTitleTextAttributes.apply(RCTTextAttributes(dict: dict));
        return self._navBarLargeTitleTextAttributes.effectiveTextAttributes();
      }();
    }
  };
  
  // ---------------------
  // MARK:- Init/Lifecycle
  // ---------------------
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
    self.embedNavigationVC();
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  override func didMoveToWindow() {
    // this view has been unmounted...
    if self.window == nil {
      // remove this view from the view registry
      RNIUtilities.recursivelyRemoveFromViewRegistry(
        bridge   : self.bridge,
        reactView: self
      );
      
      // remove routes from view registry
      self.routeVCs.forEach {
        $0.routeView.cleanup();
      };
    };
  };
  
  // -------------------
  // MARK:- RN Lifecycle
  // -------------------
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    /// note: all of the `RNINavigatorView` children is a
    /// `RNINavigatorRouteView` instance.
    guard let routeView = subview as? RNINavigatorRouteView
    else { return };
    
    /// do not show as subview, i.e. remove from view hieaarchy.
    /// note: once removed, `removeReactSubview` will not be called if that
    /// subview/child is removed from `render()` in the js side.
    routeView.removeFromSuperview();
    
    let routeVC: RNINavigatorRouteViewController = {
      /// create the wrapper vc that holds the `routeView`
      let vc = RNINavigatorRouteViewController();
      
      // listen for route navigator-related events
      vc.delegate = self;
      
      // set the "react view" to show in the route vc
      vc.routeView = routeView;
      
      // note: this will trigger the "setup" function so that the
      // `routeView` can prepare `routeVC` for the 1st time...
      routeView.routeVC = vc;
      return vc;
    }();
    
    /// save a ref to `routeView`'s vc instance
    self.routeVCs.append(routeVC);
    
    if let routeKey   = routeView.routeKey,
       let routeIndex = routeView.routeIndex {
      
      // send event: notify js navigator that a new route view was added
      self.onNavRouteViewAdded?([
        "routeKey"  : routeKey,
        "routeIndex": routeIndex
      ]);
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: insertReactSubview"
      + " - atIndex: \(atIndex)"
      + " - routeView.routeKey: \(routeView.routeKey ?? "N/A")"
      + " - routeView.routeIndex: \(routeView.routeIndex ?? -1)"
    );
    #endif
    
    if atIndex == 0 {
      // the first item will become navController's root vc
      self.navigationVC.setViewControllers([routeVC], animated: false);
    };
  };
};

// ------------------------
// MARK:- Private Functions
// ------------------------

fileprivate extension RNINavigatorView {
  
  /// setup - create nav. and add it as a subview
  func embedNavigationVC(){
    // create nav controller
    let navigationVC = ScrollingNavigationController();
    // save a ref to this instance
    self.navigationVC = navigationVC;
    
    // add vc's view as subview
    self.addSubview(navigationVC.view);
    navigationVC.view.frame = self.bounds;
    //navigationVC.hidesBarsOnTap = true;
    //navigationVC.hidesBarsOnSwipe = true;
    
    // set with initial value for `navBarPrefersLargeTitles` prop
    if #available(iOS 11.0, *) {
      navigationVC.navigationBar.prefersLargeTitles =
        self.navBarPrefersLargeTitles
    };
    
    // enable autolayout
    navigationVC.view.translatesAutoresizingMaskIntoConstraints = false;
    // stretch vc to fit/fill this view
    NSLayoutConstraint.activate([
      navigationVC.view.topAnchor     .constraint(equalTo: self.topAnchor     ),
      navigationVC.view.bottomAnchor  .constraint(equalTo: self.bottomAnchor  ),
      navigationVC.view.leadingAnchor .constraint(equalTo: self.leadingAnchor ),
      navigationVC.view.trailingAnchor.constraint(equalTo: self.trailingAnchor)
    ]);
  };
  
  /// remove route from `navRoutes`
  func removeRoute(
    reactTag  : NSNumber, routeKey: NSString,
    routeIndex: NSNumber
  ){
    
    #if DEBUG
    let prevCountRouteVCs = self.routeVCs.count;
    #endif

    // remove "popped" route from `navRoutes`
    self.routeVCs.removeAll {
      let isMatch = (
        ($0.routeView?.reactTag   == reactTag  ) &&
        ($0.routeView?.routeKey   == routeKey  ) &&
        ($0.routeView?.routeIndex == routeIndex)
      );
      
      if isMatch {
        // unregister views from view registry
        $0.routeView.cleanup();
      };
      
      return isMatch;
    };
    
    #if DEBUG
    let nextCountRouteVCs = self.routeVCs.count;
    print("LOG - NativeView, RNINavigatorView: removeRoute"
      + " - with routeKey: \(routeKey)"
      + " - with routeIndex: \(routeIndex)"
      + " - removing popped route from `routeVCs`"
      + " - prevCountRouteVCs: \(prevCountRouteVCs)"
      + " - nextCountRouteVCs: \(nextCountRouteVCs)"
      + " - routeVCs removed count: \(prevCountRouteVCs - nextCountRouteVCs)"
    );
    #endif
  };
};

// ---------------------------
// MARK:- Functions for Module
// ---------------------------

extension RNINavigatorView {
  
  func push(_ routeKey: NSString, _ options: NSDictionary, completion: @escaping Completion){
    /// get the `routeView` to be pushed in the nav stack
    guard let routeViewVC = self.routeVCs.last,
          let routeView   = routeViewVC.routeView,
          // make sure this is the correct route to be "popped"
          routeViewVC.routeView?.routeKey == routeKey
    else {
      #if DEBUG
      print("LOG - NativeView, RNINavigatorView: push error"
        + " - with params - routeKey: \(routeKey)"
        + " - Error: guard check failed"
        + " - last item's routeKey: \(self.routeVCs.last?.routeView?.routeKey ?? "N/A")"
        + " - routeViews allObjects count: \(self.routeVCs.count)"
      );
      #endif
      return;
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: push"
      + " - with params - routeKey: \(routeKey)"
    );
    #endif
    
    let isAnimated = options["isAnimated"] as? Bool ?? true;
    
    // notify js `RNINavigatorRouteView` that it's about to be pushed
    routeView.notifyOnNavRouteWillPush(isAnimated: isAnimated);
    
    self.navigationVC.pushViewController(routeViewVC, animated: isAnimated){
      completion();
      
      // notify js `RNINavigatorRouteView` that it's been pushed
      routeView.notifyOnNavRouteDidPush(isAnimated: isAnimated);
    };
  };
  
  func pop(_ options: NSDictionary, completion: @escaping (_ routeKey: NSString, _ routeIndex: NSNumber) -> Void){
    guard self.routeVCs.count > 1,
          /// get the last routes
          let lastNavVC   = self.navigationVC.viewControllers.last as? RNINavigatorRouteViewController,
          let lastRouteVC = self.routeVCs.last,
          /// get the `lastRouteVC`'s `routeKey` and `routeIndex`
          let lastRouteKey   = lastRouteVC.routeView.routeKey,
          let lastRouteIndex = lastRouteVC.routeView.routeIndex,
          /// make sure that the vc that we will be "popping" is the same as the
          /// last route in `routeVCs`
          lastNavVC.routeView.routeKey   == lastRouteKey,
          lastNavVC.routeView.routeIndex == lastRouteIndex
    else {
      #if DEBUG
      print("LOG - NativeView, RNINavigatorView: pop error"
        + " - Error: guard check failed"
        + " - last routeVCs's routeKey: \(self.routeVCs.last?.routeView?.routeKey ?? "N/A")"
        + " - routeViews count: \(self.routeVCs.count)"
      );
      #endif
      return;
    };
    
    let isAnimated = options["isAnimated"] as? Bool ?? true;
    
    self.navigationVC.popViewController(animated: isAnimated){
      completion(lastRouteKey, lastRouteIndex);
    };
  };
};

// -----------------------------------------------
// MARK:- Extension: RNINavigatorRouteViewDelegate
// -----------------------------------------------

/// receive events from route vc's
extension RNINavigatorView: RNINavigatorRouteViewControllerDelegate {
  
  func onNavRouteWillPop(
    reactTag  : NSNumber, routeKey       : NSString,
    routeIndex: NSNumber, isUserInitiated: Bool
  ) {
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView"
      + " - RNINavigatorRouteViewDelegate, onNavRouteWillPop"
      + " - with routeKey: \(routeKey)"
      + " - with routeIndex: \(routeIndex)"
    );
    #endif
    
    // send event: notify js navigator that a route is about to be "popped"
    self.onNavRouteWillPop?([
      "routeKey"       : routeKey,
      "routeIndex"     : routeIndex,
      "isUserInitiated": isUserInitiated,
    ]);
  };
  
  func onNavRouteDidPop(
    reactTag  : NSNumber, routeKey       : NSString,
    routeIndex: NSNumber, isUserInitiated: Bool
  ) {
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView"
      + " - RNINavigatorRouteViewDelegate, onNavRouteDidPop"
      + " - with routeKey: \(routeKey)"
      + " - with routeIndex: \(routeIndex)"
    );
    #endif
    
    // send event: notify js navigator that a route has been "popped"
    self.onNavRouteDidPop?([
      "routeKey"       : routeKey,
      "routeIndex"     : routeIndex,
      "isUserInitiated": isUserInitiated,
    ]);
    
    // remove route from `navRoutes`
    self.removeRoute(
      reactTag  : reactTag,
      routeKey  : routeKey,
      routeIndex: routeIndex
    );
  };
};
