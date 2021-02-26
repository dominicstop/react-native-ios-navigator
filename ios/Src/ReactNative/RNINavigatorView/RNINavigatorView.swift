//
//  RNINavigatorView.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import UIKit;

typealias Completion = () -> Void;


class RNINavigatorView: UIView {
  
  struct NativeIDKeys {
    static let NavRouteItem     = "NavRouteItem";
    static let NavBarBackground = "NavBarBackground";
  };
  
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
  
  /// The react view to show behind the navigation bar
  private var reactNavBarBackground: UIView?;
  
  var navigationVC: UINavigationController!;
  
  // ----------------------------------
  // MARK: Convenient Property Wrappers
  // ----------------------------------
  
  var navigationBar: UINavigationBar {
    self.navigationVC.navigationBar;
  };
  
  var navRouteViewControllers: [RNINavigatorRouteViewController] {
    self.navigationVC.viewControllers.compactMap {
      $0 as? RNINavigatorRouteViewController
    };
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
  
  @objc var navigatorID: NSNumber!;
  
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
  
  @objc var isNavBarTranslucent: Bool = true {
    willSet {
      self.navigationBar.isTranslucent = newValue;
    }
  };
  
  private var _navBarAppearance = RNINavBarAppearance(dict: nil);
  @objc var navBarAppearance: NSDictionary? {
    didSet {
      guard self.navBarAppearance != oldValue else { return };
      
      if let dict = self.navBarAppearance {
        // update nav bar appearance
        self._navBarAppearance.updateValues(dict: dict);
        self._navBarAppearance.updateNavBarAppearance(self.navigationBar);
        
      } else {
        // reset appearance config
        self._navBarAppearance.resetNavBarAppearance(self.navigationBar);
        self._navBarAppearance = RNINavBarAppearance(dict: nil);
      };
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
    if self.window == nil {
      // this view has been "unmounted"...
      self.cleanup();
      
    } else {
      // this view has been "mounted"...
      // add the custom RN navbar bg if any
      self.embedCustomNavBarBackground();
    };
  };
  
  // -------------------
  // MARK:- RN Lifecycle
  // -------------------
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    /// do not show as subview, i.e. remove from view hieaarchy.
    /// note: once removed, `removeReactSubview` will not be called if that
    /// subview/child is removed from `render()` in the js side.
    subview.removeFromSuperview();
    
    switch subview.nativeID {
      case NativeIDKeys.NavRouteItem:
        // This subview is a route item
        guard let routeView = subview as? RNINavigatorRouteView
        else { return };
        
        // pass a ref to this nav view
        routeView.navigatorView = self;
        
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
            "routeKey"   : routeKey,
            "routeIndex" : routeIndex,
            "navigatorID": self.navigatorID!,
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
        
      case NativeIDKeys.NavBarBackground:
        self.reactNavBarBackground = subview;
        
      default: break;
    };
  };
  
  // -----------------------
  // MARK:- Public Functions
  // -----------------------
  
  func getSecondToLastRouteVC() -> RNINavigatorRouteViewController? {
    guard self.routeVCs.count > 1 else { return nil };
    return self.routeVCs[self.routeVCs.count - 2];
  };
};

// ------------------------
// MARK:- Private Functions
// ------------------------

fileprivate extension RNINavigatorView {
  
  /// setup - create nav. and add it as a subview
  func embedNavigationVC(){
    // create nav controller
    let navigationVC = UINavigationController();
    // save a ref to this instance
    self.navigationVC = navigationVC;
    
    // add vc's view as subview
    self.addSubview(navigationVC.view);
    navigationVC.view.frame = self.bounds;
    
    // set with initial value for `navBarPrefersLargeTitles` prop
    if #available(iOS 11.0, *) {
      navigationVC.navigationBar.prefersLargeTitles =
        self.navBarPrefersLargeTitles;
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
  
  /// setup - "mount" custom react navbar bg view
  func embedCustomNavBarBackground(){
    let navBar = self.navigationVC.navigationBar;
    
    guard let customNavBarBG = self.reactNavBarBackground,
          navBar.subviews.count > 0
    else { return };
    
    // Warning: The ff. code relies on the internal view hierarchy of the navbar,
    // so this might change in the future and break.
    let navBarBGLayer = navBar.subviews[0];
    navBarBGLayer.insertSubview(customNavBarBG, at: 0);
    
    // enable autolayout
    customNavBarBG.translatesAutoresizingMaskIntoConstraints = false;
    // stretch vc to fit/fill this view, ignore safe area
    NSLayoutConstraint.activate([
      customNavBarBG.heightAnchor.constraint(equalTo: navBarBGLayer.heightAnchor),
      customNavBarBG.widthAnchor .constraint(equalTo: navBarBGLayer.widthAnchor ),
    ]);
  };
  
  /// remove route from `navRoutes`
  func removeRouteVC(routeVC: RNINavigatorRouteViewController){
    
    #if DEBUG
    let prevCountRouteVCs = self.routeVCs.count;
    #endif

    // remove "popped" route from `navRoutes`
    self.routeVCs.removeAll {
      let isMatch = $0 == routeVC;
        
      if isMatch {
        // unregister views from view registry
        $0.routeView.cleanup();
      };
      
      return isMatch;
    };
    
    #if DEBUG
    let nextCountRouteVCs = self.routeVCs.count;
    print("LOG - NativeView, RNINavigatorView: removeRoute"
      + " - with routeKey: \(routeVC.routeView.routeKey ?? "N/A")"
      + " - with routeIndex: \(routeVC.routeView.routeIndex ?? -1)"
      + " - removing popped route from `routeVCs`"
      + " - prevCountRouteVCs: \(prevCountRouteVCs)"
      + " - nextCountRouteVCs: \(nextCountRouteVCs)"
      + " - routeVCs removed count: \(prevCountRouteVCs - nextCountRouteVCs)"
    );
    #endif
  };
  
  /// remove this view (+ related-views) from the RN view registry
  func cleanup(){
    if let backgroundView = self.reactNavBarBackground {
      RNIUtilities.recursivelyRemoveFromViewRegistry(
        bridge   : self.bridge,
        reactView: backgroundView
      );
    };
    
    // remove this view from registry
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

// ---------------------------
// MARK:- Functions for Module
// ---------------------------

extension RNINavigatorView {
  
  func push(
    _ routeKey: NSString,
    _ options : NSDictionary,
    completion: @escaping Completion
  ) throws {
    
    let isAnimated = options["isAnimated"] as? Bool ?? true;
    
    /// get the `routeView` to be pushed in the nav stack
    guard let routeViewVC = self.routeVCs.last,
          let routeView   = routeViewVC.routeView,
          // make sure this is the correct route to be "pushed"
          routeViewVC.routeView?.routeKey == routeKey
    else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.push",
        message:
            "Unable to push due to mismatch, the last item in `self.routeVCs` "
          + "does not match the `routeKey` to be pushed. "
          + "This could mean that the wrong `RNINavigatorRouteView` was added "
          + "or the `routeKey` is wrong.",
        debug:
            "with args - routeKey: \(routeKey)"
          + " - isAnimated: \(isAnimated)"
          + " - Error: guard check failed"
          + " - last item's routeKey: \(self.routeVCs.last?.routeView?.routeKey ?? "N/A")"
          + " - current routeViews count: \(self.routeVCs.count)"
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: push"
      + " - with params - routeKey: \(routeKey)"
      + " - isAnimated: \(isAnimated)"
      + " - current routeVC count: \(self.routeVCs.count)"
      + " - current nav vc count: \(self.navigationVC.viewControllers.count)"
    );
    #endif
    
    // notify js `RNINavigatorRouteView` that it's about to be pushed
    routeView.notifyOnRoutePush(
      isDone: false,
      isAnimated: isAnimated
    );
    
    self.navigationVC.pushViewController(routeViewVC, animated: isAnimated){
      completion();
      
      // notify js `RNINavigatorRouteView` that it's been pushed
      routeView.notifyOnRoutePush(
        isDone: true,
        isAnimated: isAnimated
      );
    };
  };
  
  func pop(
    _ options: NSDictionary,
    completion: @escaping (_ routeKey: NSString?, _ routeIndex: NSNumber?) -> Void
  ) throws {
    
    let isAnimated = options["isAnimated"] as? Bool ?? true;
    
    guard self.routeVCs.count > 1 else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.pop",
        message: "Unable to `pop` because there are <= 1 active routes.",
        debug  : "with args - isAnimated: \(isAnimated)"
          + " - Error: guard check failed"
          + " - current routeViews count: \(self.routeVCs.count)"
      );
    };
    
    guard let lastNavRouteVC = self.navRouteViewControllers.last,
          
          // get the last routeVC
          let lastRouteVC   = self.routeVCs.last,
          let lastRouteView = lastRouteVC.routeView,
          
          /// get the `lastRouteView`'s `routeKey` and `routeIndex`
          let lastRouteKey   = lastRouteView.routeKey,
          let lastRouteIndex = lastRouteView.routeIndex,
          
          /// make sure that the vc that we will be "popping" is the same as the
          /// last route in `routeVCs`
          lastRouteVC == lastNavRouteVC
    else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.pop",
        message:
            "Unable to pop due to mismatch, the last item in the navigation "
          + "controller does not match the last item in `self.routeVCs` ",
        debug:
            "with args, isAnimated: \(isAnimated)"
          + " - Error: guard check failed"
          + " - last item's routeKey: \(self.routeVCs.last?.routeView?.routeKey ?? "N/A")"
          + " - current routeViews count: \(self.routeVCs.count)"
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: pop"
      + " - with params - isAnimated: \(isAnimated)"
      + " - current routeVC count: \(self.routeVCs.count)"
      + " - current nav vc count: \(self.navigationVC.viewControllers.count)"
    );
    #endif
    
    self.navigationVC.popViewController(animated: isAnimated){
      completion(lastRouteKey, lastRouteIndex);
    };
  };
  
  func popToRoot(
    _ options : NSDictionary,
    completion: @escaping Completion
  ) throws {
    
    let isAnimated = options["isAnimated"] as? Bool ?? true;
    
    guard self.routeVCs.count > 1 else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.popToRoot",
        message: "Unable to `popToRoot` because the route count is currently <= 1",
        debug  : "with args - isAnimated: \(isAnimated)"
          + " - Error: guard check failed"
          + " - last item's routeKey: \(self.routeVCs.last?.routeView?.routeKey ?? "N/A")"
          + " - current routeViews count: \(self.routeVCs.count)"
      );
    };
    
    self.navigationVC.popToRootViewController(animated: isAnimated) {
      completion();
    };
  };
  
  func removeRoute(
    routeKey  : String,
    routeIndex: Int   ,
    isAnimated: Bool  ,
    completion: @escaping Completion
  ) throws {
    
    var vc = self.navRouteViewControllers;
    
    guard routeIndex < vc.count else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.removeRoute",
        message: "Unable to `removeRoute` because `routeIndex` > the total active routes"
      );
    };
    
    let routeToRemove = vc[routeIndex];
    
    guard routeKey == routeToRemove.routeView.routeKey as String? else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.removeRoute",
        message:
            "Unable to `removeRoute` due to mismatch, the route that is to be "
          + "removed does not match the given `routeKey`.",
        debug:
            "with args, routeKey: \(routeKey)"
          + " - routeIndex: \(routeIndex)"
          + " - isAnimated: \(isAnimated)"
          + " - Error: guard check failed"
          + " - last item's routeKey: \(self.routeVCs.last?.routeView?.routeKey ?? "N/A")"
          + " - current routeViews count: \(self.routeVCs.count)"
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: removeRoute"
      + " - with args, routeKey: \(routeKey)"
      + " - routeIndex: \(routeIndex)"
      + " - isAnimated: \(isAnimated)"
      + " - current routeVC count: \(self.routeVCs.count)"
      + " - current nav vc count: \(self.navigationVC.viewControllers.count)"
    );
    #endif
    
    vc.remove(at: routeIndex);
    
    self.navigationVC.setViewControllers(vc, animated: isAnimated) {
      completion();
    };
  };
  
  func replaceRoute(
    prevRouteIndex: Int   ,
    prevRouteKey  : String,
    nextRouteKey  : String,
    isAnimated    : Bool  ,
    completion    : @escaping Completion
  ) throws {
    
    var vc = self.navRouteViewControllers;
    
    #if DEBUG
    let debug =
        "with args, prevRouteIndex: \(prevRouteIndex)"
      + " - prevRouteKey: \(prevRouteKey)"
      + " - nextRouteKey: \(nextRouteKey)"
      + " - isAnimated: \(isAnimated)"
      + " - prevRouteKey: \(prevRouteKey)"
      + " - current routeVC count: \(self.routeVCs.count)"
      + " - current nav vc count: \(self.navigationVC.viewControllers.count)"
    #else
    let debug: String? = nil;
    #endif
    
    guard prevRouteIndex < vc.count else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.replaceRoute",
        message:
            "Unable to `replaceRoute` because `prevRouteIndex` is invalid,"
          + " because it's value is > the total active routes (out of bounds).",
        debug: debug
      );
    };
    
    let routeToReplace = vc[prevRouteIndex];
    
    guard self.routeVCs.count > vc.count,
          let replacementRoute = self.routeVCs.popLast()
    else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.replaceRoute",
        message:
            "Unable to `replaceRoute` because the total `routeVCs` < the"
          + " total vc count in the navigator. This could mean that the replacement"
          + " route vc hasn't been received here yet (or it wasn't sent at all)."
          + " TLDR: `replacementRoute` could not be retrieved (out of bounds?).",
        debug: debug
      );
    };
    
    guard routeToReplace.routeView.routeKey as String? == prevRouteKey
    else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.replaceRoute",
        message:
            "Unable to `replaceRoute` due to `routeKey` mismatch, the route to be"
          + " replaced does not match the provided `prevRouteKey`",
        debug: debug
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: replaceRoute - \(debug)");
    #endif
    
    vc[prevRouteIndex] = replacementRoute;
    self.routeVCs = vc;
    
    self.navigationVC.setViewControllers(vc, animated: isAnimated) {
      completion();
    };
  };
  
  func insertRoute(
    nextRouteKey: String,
    atIndex     : Int   ,
    isAnimated  : Bool  ,
    completion  : @escaping Completion
  ) throws {
    
    var vc = self.navRouteViewControllers;
    
    #if DEBUG
    let debug =
        "with args, nextRouteKey: \(nextRouteKey)"
      + " - atIndex: \(atIndex)"
      + " - isAnimated: \(isAnimated)"
      + " - current routeVC count: \(self.routeVCs.count)"
      + " - current nav vc count: \(self.navigationVC.viewControllers.count)"
    #else
    let debug: String? = nil;
    #endif
    
    guard atIndex < vc.count else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.insertRoute",
        message:
            "Unable to `insertRoute` because `atIndex` is invalid,"
          + " because it's value is > the total active routes (out of bounds).",
        debug: debug
      );
    };
    
    guard self.routeVCs.count > vc.count,
          let routeToBeInserted = self.routeVCs.popLast()
    else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.insertRoute",
        message:
            "Unable to `insertRoute` because the total `routeVCs` < the"
          + " total vc count in the navigator. This could mean that the route to"
          + " inserted hasn't been received here yet (or it wasn't sent at all)."
          + " TLDR: `routeToBeInserted` could not be retrieved (out of bounds?).",
        debug: debug
      );
    };
    
    guard routeToBeInserted.routeView.routeKey as String? == nextRouteKey
    else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.insertRoute",
        message:
            "Unable to `insertRoute` due to `routeKey` mismatch, the route to be"
          + " inserted does not match the provided `nextRouteKey`",
        debug: debug
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: insertRoute - \(debug)");
    #endif
    
    vc.insert(routeToBeInserted, at: atIndex);
    self.routeVCs = vc;
    
    self.navigationVC.setViewControllers(vc, animated: isAnimated) {
      completion();
    };
  };
};

// -----------------------------------------------
// MARK:- Extension: RNINavigatorRouteViewDelegate
// -----------------------------------------------

/// receive events from route vc's
extension RNINavigatorView: RNINavigatorRouteViewControllerDelegate {
  
  func onRouteWillPop(sender: RNINavigatorRouteView, isUserInitiated: Bool){
    guard let routeKey   = sender.routeKey,
          let routeIndex = sender.routeIndex
    else { return };
    
    
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
      "navigatorID"    : self.navigatorID!,
    ]);
  };
  
  func onRouteDidPop(sender: RNINavigatorRouteView, isUserInitiated: Bool){
    guard let routeKey   = sender.routeKey,
          let routeIndex = sender.routeIndex
    else { return };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView"
      + " - RNINavigatorRouteViewDelegate, onNavRouteDidPop"
      + " - with routeKey: \(routeKey)"
      + " - with routeIndex: \(routeIndex)"
    );
    #endif
    
    self.onNavRouteDidPop?([
      "routeKey"       : routeKey,
      "routeIndex"     : routeIndex,
      "isUserInitiated": isUserInitiated,
      "navigatorID"    : self.navigatorID!,
    ]);
    
    // route popped, remove route from `navRoutes`
    self.removeRouteVC(routeVC: sender.routeVC!);
  };
};
