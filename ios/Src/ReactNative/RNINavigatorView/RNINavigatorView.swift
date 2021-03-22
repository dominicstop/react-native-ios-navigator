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
  
  /// The routes added/to be added to the nav. stack.
  /// Note: The key is the `routeID`, also when removing an item, don't forget
  /// to call `cleanup` on the `routeView`
  private var routeItemsMap: Dictionary<Int, RNINavigatorRouteBaseViewController> = [:];
  
  /// The react view to show behind the navigation bar
  private var reactNavBarBackground: UIView?;
  
  var navigationVC: UINavigationController!;
  
  // ----------------------------------
  // MARK: Convenient Property Wrappers
  // ----------------------------------
  
  var navigationBar: UINavigationBar {
    self.navigationVC.navigationBar;
  };
  
  var activeRoutes: [RNINavigatorRouteBaseViewController] {
    self.navigationVC.viewControllers.compactMap {
      $0 as? RNINavigatorRouteViewController
    };
  };
  
  var inactiveRoutes: [RNINavigatorRouteBaseViewController] {
    self.routeItemsMap.values.filter {
      !self.activeRoutes.contains($0)
    };
  };
  
  var routeItems: [RNINavigatorRouteBaseViewController] {
    self.routeItemsMap.values
      .map { $0 }
      .sorted { $0.routeIndex < $1.routeIndex }
  };
  
  // -----------------------------
  // MARK: RN Exported Event Props
  // -----------------------------
  
  /// A `RNINavigatorRouteView` instance was added as a subview.
  @objc var onNavRouteViewAdded: RCTBubblingEventBlock?;
  
  /// Native route was init. via `nativeRoutes` prop
  @objc var onSetNativeRoutes: RCTBubblingEventBlock?;
  
  /// Fired when a route is *about to be* "popped", either due to a "user initiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onNavRouteWillPop: RCTBubblingEventBlock?;
  
  /// Fired when a route *has been* "popped", either due to a "user initiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onNavRouteDidPop: RCTBubblingEventBlock?;
  
  // ------------------------
  // MARK:- RN Exported Props
  // ------------------------
  
  @objc var navigatorID: NSNumber!;
  
  
  @objc var nativeRoutes: NSDictionary! {
    didSet {
      let didChange  = oldValue != self.nativeRoutes;
      let isNotEmpty = self.nativeRoutes.count > 0;
      
      guard didChange && isNotEmpty,
            let data = self.nativeRoutes,
            // js keys are implicitly casted to strings
            let keys = data.allKeys as? [String]
      else { return };
      
      #if DEBUG
      print("LOG - NativeView, RNINavigatorView: nativeRouteData"
        + " - keys: \(keys)"
        + " - data: \(data.debugDescription)"
      );
      #endif
      
      for key in keys {
        guard let routeID   = Int(key),
              let routeData = data[key] as? NSDictionary,
              // extract route data
              let routeKey   = routeData["routeKey"  ] as? String,
              let routeIndex = routeData["routeIndex"] as? Int
        else { continue };
        
        guard let nativeRouteVC: RNINavigatorRouteBaseViewController = {
          if let routeVC = self.routeItemsMap[routeID] {
            // route already added, check if it's a native route
            let isNativeRoute = routeVC as? RNINavigatorRouteViewController == nil;
            // verify that the existing route is in fact a native route
            return isNativeRoute ? routeVC : nil;
            
          } else if let vc = RNINavigatorViewManager.viewControllerRegistry[routeKey] {
            // create/init native route
            let routeVC = vc.init(routeID: routeID, routeKey: routeKey);
            routeVC.delegate = self;
            
            // add native route
            self.routeItemsMap[routeID] = routeVC;
            return routeVC;
            
          } else {
            // could not get/create native route vc
            return nil;
          };
        }() else { continue };
        
        #if DEBUG
        print("LOG - NativeView, RNINavigatorView: nativeRouteData"
          + " - for routeID: \(routeID)"
          + " - set routeKey: \(routeKey)"
          + " - set routeIndex: \(routeIndex)"
        );
        #endif
        
        // update values
        nativeRouteVC.setRouteIndex(routeIndex);
      };
      
      self.onSetNativeRoutes?([
        "navigatorID": self.navigatorID!
      ]);
    }
  };
  
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
      // add the custom RN navBar BG if any
      self.embedCustomNavBarBackground();
    };
  };
  
  // -------------------
  // MARK:- RN Lifecycle
  // -------------------
  
  override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    /// do not show as subview, i.e. remove from view hierarchy.
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
        self.routeItemsMap[routeVC.routeID] = routeVC;
        
        // send event: notify js navigator that a new route view was added
        self.notifyOnNavRouteViewAdded(vc: routeVC);
        
        #if DEBUG
        print("LOG - NativeView, RNINavigatorView: insertReactSubview"
          + " - atIndex: \(atIndex)"
          + " - routeView.routeKey: \(routeView.routeKey)"
          + " - routeView.routeIndex: \(routeView.routeIndex)"
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
  
  // TODO: Remove if not needed?
  func getSecondToLastRouteVC() -> RNINavigatorRouteBaseViewController? {
    guard self.routeItemsMap.count > 1 else { return nil };
    let routeItems = self.routeItems;
    
    let lastIndex = routeItems.count - 1;
    return routeItems[lastIndex - 1];
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
  
  /// setup - "mount" custom react navBar BG view
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
  
  /// send event: notify js that a new route view was added
  func notifyOnNavRouteViewAdded(vc: RNINavigatorRouteBaseViewController){
    let isNativeRoute = (vc as? RNINavigatorRouteViewController) == nil;
      
    self.onNavRouteViewAdded?([
      "routeID"      : vc.routeID,
      "routeKey"     : vc.routeKey,
      "routeIndex"   : vc.routeIndex,
      "navigatorID"  : self.navigatorID!,
      "isNativeRoute": isNativeRoute,
    ]);
  };
  
  /// remove route from `navRoutes`
  func removeRouteVC(routeVC: RNINavigatorRouteBaseViewController){
    guard self.routeItemsMap[routeVC.routeID] != nil else { return };
    
    #if DEBUG
    let prevCountRouteVCs = self.routeItemsMap.count;
    #endif
    
    self.routeItemsMap.removeValue(forKey: routeVC.routeID);
    
    if let reactRouteVC = routeVC as? RNINavigatorRouteViewController {
      reactRouteVC.routeView.cleanup();
    };
    
    #if DEBUG
    let nextCountRouteVCs = self.routeItemsMap.count;
    print("LOG - NativeView, RNINavigatorView: removeRoute"
      + " - with routeKey: \(routeVC.routeKey)"
      + " - with routeIndex: \(routeVC.routeIndex)"
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
    
    // remove routes from view registry
    self.routeItemsMap.values.forEach {
      if let routeVC = $0 as? RNINavigatorRouteViewController {
        routeVC.routeView.cleanup();
      };
    };
    
    // remove this view from registry
    RNIUtilities.recursivelyRemoveFromViewRegistry(
      bridge   : self.bridge,
      reactView: self
    );
  };
  
  #if DEBUG
  func debug() -> String {
    let routeItems = self.routeItems;
    return(
        "current routeVC count: \(routeItems.count)"
      + " - current nav vc count: \(self.navigationVC.viewControllers.count)"
      + " - last routeID: \(routeItems.last?.routeID ?? -1)"
      + " - last routeKey: \(routeItems.last?.routeKey ?? "N/A")"
      + " - last routeIndex: \(routeItems.last?.routeIndex ?? -1)"
    );
  };
  #endif
};

// ---------------------------
// MARK:- Functions for Module
// ---------------------------

extension RNINavigatorView {
  
  func push(
    _ routeID: Int,
    _ options: NSDictionary,
    completion: @escaping Completion
  ) throws {
    
    let routeItems = self.routeItems;
    let isAnimated = options["isAnimated"] as? Bool ?? true;
    
    #if DEBUG
    let debug = "with args - routeID: \(routeID)"
      + " - isAnimated: \(isAnimated)"
      + " - and, \(self.debug())"
    #else
    let debug: String? = nil;
    #endif
    
    /// get the route to be pushed in the nav stack
    guard let nextRouteVC = self.routeItemsMap[routeID] else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.push",
        message:
            "Unable to push due to invalid routeID, no corresponding route found` "
          + "for the given routeID.",
        debug: debug
      );
    };
    
    guard  routeItems.last?.routeID == routeID else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.push",
        message:
            "Unable to push due to mismatch, the last routeID does not match "
          + "the given routeID.",
        debug: debug
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: push"
      + " - pushing with routeKey: \(nextRouteVC.routeKey)"
      + " - \(debug)"
    );
    #endif
    
    let nextRouteView =
      (nextRouteVC as? RNINavigatorRouteViewController)?.routeView;
    
    // notify js `RNINavigatorRouteView` that it's about to be pushed
    nextRouteView?.notifyOnRoutePush(
      isDone: false,
      isAnimated: isAnimated
    );
    
    self.navigationVC.pushViewController(nextRouteVC, animated: isAnimated){
      completion();
      
      // notify js `RNINavigatorRouteView` that it's been pushed
      nextRouteView?.notifyOnRoutePush(
        isDone: true,
        isAnimated: isAnimated
      );
    };
  };
  
  func pop(
    _ options: NSDictionary,
    completion: @escaping (_ routeKey: String, _ routeIndex: Int) -> Void
  ) throws {
    
    let routeItems = self.routeItems;
    let isAnimated = options["isAnimated"] as? Bool ?? true;
    
    #if DEBUG
    let debug = "with args - isAnimated: \(isAnimated) - and, \(self.debug())";
    #else
    let debug: String? = nil;
    #endif
    
    guard routeItems.count > 1 else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.pop",
        message: "Unable to `pop` because there are <= 1 active routes.",
        debug  : debug
      );
    };
    
    guard let lastNavRouteVC = self.activeRoutes.last,
          let lastRouteVC    = routeItems.last,
          /// make sure that the vc that we will be "popping" is the same as the
          /// last route in `routeVCs`
          lastRouteVC == lastNavRouteVC
    else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.pop",
        message:
            "Unable to pop due to mismatch, the last item in the navigation "
          + "controller does not match the last item in `self.routeVCs` ",
        debug: debug
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: pop"
      + " - for routeKey: \(lastRouteVC.routeKey)"
      + " - routeIndex: \(lastRouteVC.routeIndex)"
      + " - current routeVC count: \(debug)"
    );
    #endif
    
    lastRouteVC.isToBeRemoved = true;
    
    self.navigationVC.popViewController(animated: isAnimated){
      completion(
        lastRouteVC.routeKey,
        lastRouteVC.routeIndex
      );
    };
  };
  
  func popToRoot(
    _ options : NSDictionary,
    completion: @escaping Completion
  ) throws {
    
    let routeItems = self.routeItems;
    let isAnimated = options["isAnimated"] as? Bool ?? true;
    
    #if DEBUG
    let debug = "with args, isAnimated: \(isAnimated) - and,\(self.debug())";
    #else
    let debug: String? = nil;
    #endif
    
    guard routeItems.count > 1 else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.popToRoot",
        message: "Unable to `popToRoot` because the route count is currently <= 1",
        debug  : debug
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: popToRoot - \(debug)");
    #endif
    
    for route in routeItems {
      route.isToBeRemoved = true;
    };
    
    self.navigationVC.popToRootViewController(animated: isAnimated) {
      completion();
    };
  };
  
  func removeRoute(
    routeID   : Int ,
    routeIndex: Int ,
    isAnimated: Bool,
    completion: @escaping Completion
  ) throws {
    
    var routeItems = self.routeItems;
    
    #if DEBUG
    let debug =
        "with args - routeID: \(routeID)"
      + " - isAnimated: \(isAnimated)"
      + " - and,\(self.debug())"
    #else
    let debug: String? = nil;
    #endif
    
    guard routeIndex < self.activeRoutes.count else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.removeRoute",
        message: "Unable to `removeRoute` because `routeIndex` > the total active routes"
      );
    };
    
    guard let routeToRemove = self.routeItemsMap[routeID] else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.removeRoute",
        message:
            "Unable to `removeRoute` due to invalid routeID, no corresponding "
          + "route could be found for the given `routeID`.",
        debug: debug
      );
    };
    
    guard routeItems[routeIndex].routeID == routeID else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.removeRoute",
        message:
            "Unable to `removeRoute` due to mismatch, the route for the given "
          + "`routeIndex` does not match the route for the given `routeID`.",
        debug: debug
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: removeRoute - \(debug)");
    #endif
    
    routeItems.remove(at: routeIndex);
    routeToRemove.isToBeRemoved = true;
    
    self.navigationVC.setViewControllers(routeItems, animated: isAnimated) {
      completion();
    };
  };
  
  func removeRoutes(
    itemsToRemove: [(routeID: Int, routeIndex: Int)],
    isAnimated   : Bool,
    completion   : @escaping Completion
  ) throws {
    
    let routeItems = self.routeItems;
    let vc = self.activeRoutes;
    
    #if DEBUG
    let debug =
        "with args - isAnimated: \(isAnimated)"
      + " - and, \(self.debug())"
    #else
    let debug: String? = nil;
    #endif
    
    // check if items to remove are valid
    for item in itemsToRemove {
      guard item.routeIndex < vc.count else {
        throw RNIError.commandFailed(
          source : "RNINavigatorView.removeRoute",
          message: "Unable to `removeRoute` because `routeIndex` > the total active routes"
        );
      };
      
      let routeToRemove = vc[item.routeIndex];
      
      guard item.routeID == routeToRemove.routeID else {
        throw RNIError.commandFailed(
          source : "RNINavigatorView.removeRoute",
          message:
              "Unable to `removeRoute` due to mismatch, the route that is to be "
            + "removed does not match the given `routeID`.",
          debug: debug
        );
      };
    };
    
    // filter out `itemsToRemove` items
    let filteredRoutes = vc.filter { routeVC in
      
      let shouldRemove = itemsToRemove.contains {
        $0.routeID    == routeVC.routeID &&
        $0.routeIndex == routeVC.routeIndex
      };
      
      routeVC.isToBeRemoved = shouldRemove;
      return !shouldRemove;
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: removeRoutes"
      + " - isAnimated: \(isAnimated)"
      + " - current routeVC count: \(routeItems.count)"
      + " - current nav vc count: \(self.navigationVC.viewControllers.count)"
    );
    #endif
    
    self.navigationVC.setViewControllers(filteredRoutes, animated: isAnimated) {
      completion();
    };
  };
  
  func replaceRoute(
    prevRouteIndex: Int,
    prevRouteID   : Int,
    nextRouteID   : Int,
    isAnimated    : Bool,
    completion    : @escaping Completion
  ) throws {
    
    #if DEBUG
    let debug =
        "with args, prevRouteIndex: \(prevRouteIndex)"
      + " - prevRouteID: \(prevRouteID)"
      + " - nextRouteID: \(nextRouteID)"
      + " - isAnimated: \(isAnimated)"
      + " - and, \(self.debug())"
    #else
    let debug: String? = nil;
    #endif
    
    guard prevRouteIndex < self.activeRoutes.count else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.replaceRoute",
        message:
            "Unable to `replaceRoute` because `prevRouteIndex` is invalid,"
          + " because it's value is > the total active routes (out of bounds).",
        debug: debug
      );
    };
    
    guard let routeToReplace = self.routeItemsMap[prevRouteID] else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.replaceRoute",
        message:
            "Unable to `replaceRoute` because no matching route could be found "
          + "for the given prevRouteID",
        debug: debug
      );
    };
    
    guard let replacementRoute = self.routeItemsMap[nextRouteID] else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.replaceRoute",
        message:
            "Unable to `replaceRoute` because no matching route could be found "
          + "for the given nextRouteID",
        debug: debug
      );
    };
    
    guard routeToReplace  .routeIndex == prevRouteIndex,
          replacementRoute.routeIndex == prevRouteIndex
    else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.replaceRoute",
        message:
            "Unable to `replaceRoute` due to mismatch, the given prevRouteIndex "
          + " is invalid because it does not match the routeIndex of the matching "
          + "'replacement' route (i.e. the route for the given nextRouteID), and/or "
          + "the 'to be replaced' route (i.e. the route for the given prevRouteID)",
        debug: debug
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: replaceRoute - \(debug)");
    #endif
    
    
    routeToReplace.isToBeRemoved = true;
    self.routeItemsMap.removeValue(forKey: routeToReplace.routeID);
    
    let nextRoutes = self.routeItems;
    
    self.navigationVC.setViewControllers(nextRoutes, animated: isAnimated) {
      completion();
    };
  };
  
  func insertRoute(
    nextRouteID: Int ,
    atIndex    : Int ,
    isAnimated : Bool,
    completion : @escaping Completion
  ) throws {
    
    #if DEBUG
    let debug =
        "with args, nextRouteKey: \(nextRouteID)"
      + " - atIndex: \(atIndex)"
      + " - isAnimated: \(isAnimated)"
      + " - and, : \(self.debug())"
    #else
    let debug: String? = nil;
    #endif
    
    guard atIndex < self.activeRoutes.count else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.insertRoute",
        message:
            "Unable to `insertRoute` because `atIndex` is invalid,"
          + " because it's value is > the total active routes (out of bounds).",
        debug: debug
      );
    };
    
    guard self.routeItemsMap.count > self.activeRoutes.count else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.insertRoute",
        message:
            "Unable to `insertRoute` because the total `routeItemsMap` < the"
          + " total active routes. This could mean that the route to be inserted"
          + " hasn't been received in the native side yet (or it wasn't sent at all)",
        debug: debug
      );
    };
    
    guard let routeToBeInserted = self.routeItemsMap[nextRouteID] else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.insertRoute",
        message:
            "Unable to `insertRoute` because no route could be found for the"
          + " given route `nextRouteID`",
        debug: debug
      );
    };
    
    guard routeToBeInserted.routeID == nextRouteID else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.insertRoute",
        message:
            "Unable to `insertRoute` due to `nextRouteID` mismatch, the 'route to be"
          + " inserted' does not match the provided `nextRouteKey`",
        debug: debug
      );
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: insertRoute - \(debug)");
    #endif
    
    var nextRoutes = self.activeRoutes;
    nextRoutes.insert(routeToBeInserted, at: atIndex);
    
    self.navigationVC.setViewControllers(nextRoutes, animated: isAnimated) {
      completion();
    };
  };
  
  func setRoutes(
    nextRouteIDs: [Int],
    isAnimated  : Bool,
    completion  : @escaping Completion
  ) throws {
    
    let currentRoutes  = self.activeRoutes;
    let inactiveRoutes = self.inactiveRoutes;
    
    #if DEBUG
    let debug =
        "with args, nextRouteIDs: \(nextRouteIDs.debugDescription)"
      + " - isAnimated: \(isAnimated)"
      + " - and, inactiveRoutes: \(inactiveRoutes.map { $0.routeID }.debugDescription)"
      + " - \(self.debug())"
      
    #else
    let debug: String? = nil;
    #endif
    
    guard nextRouteIDs.count > 0 else {
      throw RNIError.commandFailed(
        source : "RNINavigatorView.insertRoute",
        message: "Unable to `insertRoute` because the given `nextRouteIDs` is empty",
        debug  : debug
      );
    };
    
    let (routesToRemove, routesToAdd): (
      [RNINavigatorRouteBaseViewController],
      [RNINavigatorRouteBaseViewController]
    ) = try {
      var toRemove: [RNINavigatorRouteBaseViewController] = [];
      var toAdd   : [RNINavigatorRouteBaseViewController] = [];
      
      let availableRoutes = currentRoutes + inactiveRoutes;
      
      for routeID in nextRouteIDs {
        guard let routeVC = self.routeItemsMap[routeID] else {
          throw RNIError.commandFailed(
            source : "RNINavigatorView.setRoutes",
            message:
                "Unable to `setRoutes` because no corresponding route could be"
              + " found for routeID: \(routeID)",
            debug: debug
          );
        };
        
        if availableRoutes.contains(where: { $0.routeID == routeID }) {
          toAdd.append(routeVC);
          
        } else {
          toRemove.append(routeVC);
        };
      };
      
      return (toRemove, toAdd);
    }();
    
    for route in routesToRemove {
      route.isToBeRemoved = true;
      self.routeItemsMap.removeValue(forKey: route.routeID);
    };
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView: setRoutes - \(debug)"
      + " - routesToRemove: \(routesToRemove.map { $0.routeID }.debugDescription)"
      + " - routesToAdd: \(routesToAdd.map { $0.routeID }.debugDescription)"
    );
    #endif
    
    self.navigationVC.setViewControllers(routesToAdd, animated: isAnimated) {
      completion();
    };
  };
};

// -----------------------------------------------
// MARK:- Extension: RNINavigatorRouteViewDelegate
// -----------------------------------------------

/// receive events from route vc's
extension RNINavigatorView: RNINavigatorRouteViewControllerDelegate {
  
  func onRouteWillPop(
    sender: RNINavigatorRouteBaseViewController,
    isUserInitiated: Bool
  ){
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView"
      + " - RNINavigatorRouteViewDelegate, onNavRouteWillPop"
      + " - with routeKey: \(sender.routeKey)"
      + " - with routeIndex: \(sender.routeIndex)"
    );
    #endif
    
    // send event: notify js navigator that a route is about to be "popped"
    self.onNavRouteWillPop?([
      "routeKey"       : sender.routeKey,
      "routeIndex"     : sender.routeIndex,
      "isUserInitiated": isUserInitiated,
      "navigatorID"    : self.navigatorID!,
    ]);
  };
  
  func onRouteDidPop(
    sender: RNINavigatorRouteBaseViewController,
    isUserInitiated: Bool
  ){
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView"
      + " - RNINavigatorRouteViewDelegate, onNavRouteDidPop"
      + " - \(self.debug())"
    );
    #endif
    
    self.onNavRouteDidPop?([
      "routeKey"       : sender.routeKey,
      "routeIndex"     : sender.routeIndex,
      "isUserInitiated": isUserInitiated,
      "navigatorID"    : self.navigatorID!,
    ]);
    
    // route popped, remove route from `navRoutes`
    self.removeRouteVC(routeVC: sender);
  };
};
