//
//  RNINavigatorView.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import UIKit;

typealias Completion = () -> Void;

public final class RNINavigatorView: UIView {
  
  // MARK: - Embedded Types
  // ---------------------
  
  enum NativeIDKeys: String {
    case NavRouteItem;
    case NavBarBackground;
  };
  
  // MARK: - Properties - Internal
  // ---------------------------

  /// ref to the shared `RCTBridge` instance
  weak var bridge: RCTBridge!;
  
  weak var delegate: RNINavigatorViewDelegate?;
  
  weak var parentVC: UIViewController?;
  
  /// read by the `UINavigationBar`
  /// if set to `true`, views behind the navigation bar will receive touch events
  var allowTouchEventsToPassThroughNavigationBar = false;
  
  var navigatorConstants: RNINavigatorUIConstants!;
  
  var navigationBarFadeTransition: CATransition?;
  
  // MARK: - Properties - Private
  // --------------------------

  /// The routes added/to be added to the nav. stack.
  /// Note: The key is the `routeID`, also when removing an item, don't forget
  /// to call `cleanup` on the `routeView`
  private(set) public var routeItemsMap:
    Dictionary<Int, RNINavigatorRouteBaseViewController> = [:];
  
  private var didReceiveAllInitialRoutes = false;
  
  private var didTriggerCleanup = false;
  
  /// The react view to show behind the navigation bar
  private var reactNavBarBackground: UIView?;
  
  // TODO
  private var nativeCommandRequestCompletionMap: Dictionary<String, Completion> = [:];
  
  // MARK: - Properties - Public
  // --------------------------
  
  public var navigationVC: UINavigationController!;

  // MARK: - Convenient Property Wrappers
  // ----------------------------------
  
  var navigationBar: UINavigationBar {
    self.navigationVC.navigationBar;
  };
  
  /// current active route view controllers in the navigator
  var activeRoutes: [RNINavigatorRouteBaseViewController] {
    self.navigationVC.viewControllers.compactMap {
      $0 as? RNINavigatorRouteBaseViewController
    };
  };
  
  /// "registered" routes in `routeItemsMap` that aren't in the current navigator
  var inactiveRoutes: [RNINavigatorRouteBaseViewController] {
    self.routeItemsMap.values.filter {
      !self.activeRoutes.contains($0)
    };
  };
  
  /// "registered" routes in `routeItemsMap` sorted by their `routeIndex`
  var routeItems: [RNINavigatorRouteBaseViewController] {
    self.routeItemsMap.values
      .map { $0 }
      .sorted { $0.routeIndex < $1.routeIndex }
  };
  
  var activeRoutesDict: [Dictionary<String, Any>] {
    self.activeRoutes.map {
      let type = $0 is RNINavigatorReactRouteViewController
        ? "reactRoute" : "nativeRoute";
      
      return [
        "routeID"   : $0.routeID,
        "routeKey"  : $0.routeKey,
        "routeIndex": $0.routeIndex,
        "type"      : type
      ];
    };
  };
  
  // MARK: - RN Exported Event Props
  // -----------------------------
  
  /// A `RNINavigatorRouteView` instance was added as a subview.
  @objc var onNavRouteViewAdded: RCTBubblingEventBlock?;
  
  /// Native route was init. via `nativeRoutes` prop
  @objc var onSetNativeRoutes: RCTBubblingEventBlock?;
  
  /// This event is fired to forward commands from native to js/react, i.e send
  /// a command that will be executed from the js/react navigator
  @objc var onNativeCommandRequest: RCTBubblingEventBlock?;
  
  @objc var onCustomCommandFromNative: RCTBubblingEventBlock?;
  
  /// Fired when a route is *about to be* "popped", either due to a "user initiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onNavRouteWillPop: RCTBubblingEventBlock?;
  
  /// Fired when a route *has been* "popped", either due to a "user initiated"
  /// pop (because the "back" button was pressed or it was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  @objc var onNavRouteDidPop: RCTBubblingEventBlock?;
  
  @objc var onNavRouteWillShow: RCTBubblingEventBlock?;
  @objc var onNavRouteDidShow : RCTBubblingEventBlock?;
  
  @objc var onUIConstantsDidChange: RCTBubblingEventBlock?;
  
  // MARK: - RN Exported Props
  // ------------------------
  
  @objc public private(set) var navigatorID: NSNumber! {
    willSet {
      // save a ref to this instance
      RNINavigatorManager.sharedInstance
        .registerNavigatorView(self, forNavigatorID: newValue);
    }
  };
  
  private var _initialRouteKeys: [String] = [];
  @objc var initialRouteKeys: NSArray! {
    willSet {
      self._initialRouteKeys =
        newValue.compactMap { $0 as? String };
    }
  };
  
  /// Receives from js/react the native routes to add/init or update
  @objc var nativeRoutes: NSDictionary! {
    didSet {
      let didChange  = oldValue != self.nativeRoutes;
      let isNotEmpty = self.nativeRoutes.count > 0;
      
      guard didChange && isNotEmpty else { return };
      self.initializeNativeRoutes();
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
  
  let navBarAppearanceConfig = RNINavBarAppearance(dict: nil);
  @objc var navBarAppearance: NSDictionary? {
    didSet {
      guard !self.didTriggerCleanup,
            self.navBarAppearance != oldValue
      else { return };
      
      if let dict = self.navBarAppearance {
        // update nav bar appearance
        self.navBarAppearanceConfig.updateValues(dict: dict);
        self.navBarAppearanceConfig.updateNavBarAppearance(for: self.navigationBar);
        self.navigationBar.layoutIfNeeded();
        
      } else {
        // reset appearance config
        self.navBarAppearanceConfig.resetValues();
        self.navBarAppearanceConfig.resetNavBarAppearance(for: self.navigationBar);
        self.navigationBar.layoutIfNeeded();
      };
    }
  };
  
  @objc var shouldSwizzleRootViewController: Bool = true;
  
  @objc var disableTransparentNavBarScrollEdgeAppearance: Bool = true;
  
  // MARK: - Init/Lifecycle
  // ---------------------
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
    
    self.navigatorConstants = RNINavigatorUIConstants(navigatorView: self);
    self.setupNavigationController();
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  public override func didMoveToWindow() {
    if self.window == nil {
      // A - this view has been "unmounted"...
      self.cleanup();
      
    } else {
      // B - this view has been "mounted"...
      
      // add the custom RN navBar BG if any
      self.embedCustomNavBarBackground();
      
      // embed nav controller to closest parent vc
      self.setupEmbedNavigationControllerToClosestVC();
    };
  };
  
  // MARK: - RN Lifecycle
  // -------------------
  
  public override func insertReactSubview(_ subview: UIView!, at atIndex: Int) {
    super.insertSubview(subview, at: atIndex);
    
    /// do not show as subview, i.e. remove from view hierarchy.
    /// note: once removed, `removeReactSubview` will not be called if that
    /// subview/child is removed from `render()` in the js side.
    subview.removeFromSuperview();
    
    let nativeID = NativeIDKeys(rawValue: subview.nativeID);
    
    switch nativeID {
      case .NavRouteItem:
        // This subview is a route item
        guard let routeView = subview as? RNINavigatorRouteView
        else { return };
        
        // pass a ref to this nav view
        routeView.navigatorView = self;
        
        let routeVC: RNINavigatorReactRouteViewController = {
          /// create the wrapper vc that holds the `routeView`
          let vc = RNINavigatorReactRouteViewController();
          
          // listen for route navigator-related events
          vc.delegate = self;
          
          // set the "react view" to show in the route vc
          vc.routeView = routeView;
          
          // pass a ref to this navigator view.
          // note: this will trigger the "setup" function so that the
          // `routeView` can prepare `routeVC` for the 1st time...
          routeView.routeVC = vc;
          
          return vc;
        }();
        
        // set the initial size of the view...
        if self.bounds.width  > 0,
           self.bounds.height > 0 {
          
          routeView.setInitialSize(self.bounds);
        };
        
        /// save a ref to `routeView`'s vc instance
        self.routeItemsMap[routeVC.routeID] = routeVC;
        self.setupInitialRoutes();
        
        // send event: notify js navigator that a new route view was added
        self.notifyOnNavRouteViewAdded(vc: routeVC);
        
      case .NavBarBackground:
        self.reactNavBarBackground = subview;
        
      default: break;
    };
  };
  
  // MARK: - Misc Internals
  // ---------------------
  
  /// remove this view (+ related-views) from the RN view registry
  internal func cleanup(){
    guard !self.didTriggerCleanup else { return };
    self.didTriggerCleanup = true;
    
    // remove background view if any
    if let backgroundView = self.reactNavBarBackground {
      RNIUtilities.recursivelyRemoveFromViewRegistry(
        bridge   : self.bridge,
        reactView: backgroundView
      );
    };
    
    // remove nav controller from parent vc if any
    if self.parentVC != nil {
      self.navigationVC.willMove(toParent: nil);
      self.navigationVC.removeFromParent();
    };
    
    // remove routes from view registry
    self.routeItemsMap.values.forEach {
      if let routeVC = $0 as? RNINavigatorReactRouteViewController {
        routeVC.routeView.cleanup();
      };
      
      // remove from registry
      self.routeItemsMap.removeValue(forKey: $0.routeID);
    };
    
    // remove this view from registry
    RNIUtilities.recursivelyRemoveFromViewRegistry(
      bridge   : self.bridge,
      reactView: self
    );
    
    self.navigationVC = nil;
    self.reactNavBarBackground = nil;
  };
  
  internal func getSecondToLastRouteVC() -> RNINavigatorRouteBaseViewController? {
    guard self.routeItemsMap.count > 1 else { return nil };
    let routeItems = self.routeItems;
    
    let lastIndex = routeItems.count - 1;
    return routeItems[lastIndex - 1];
  };
  
  internal func addFadeTransitionToNavigationBar(){
    guard self.navigationBarFadeTransition == nil,
          let navigationBar = self.navigationVC?.navigationBar
    else { return };
    
    let animation = CATransition();
    self.navigationBarFadeTransition = animation;
    
    animation.duration = 0.3;
    animation.timingFunction = CAMediaTimingFunction(name: .linear);
    animation.type = .fade;
    
    navigationBar.layer.add(animation, forKey: "fadeTransition");
  };
  
  internal func removeFadeTransitionFromNavigationBar(){
    guard self.navigationBarFadeTransition != nil,
          let navigationBar = self.navigationVC?.navigationBar
    else { return };
    
    navigationBar.layer.removeAnimation(forKey: "fadeTransition");
    self.navigationBarFadeTransition = nil;
  };
};

// MARK: - Private Functions
// ------------------------

fileprivate extension RNINavigatorView {
  
  /// setup - if finished init., set the initial routes and show the navigation controller
  func setupInitialRoutes(){
    guard !self.didReceiveAllInitialRoutes else { return };
    
    let currentRouteCount = self.routeItemsMap.count;
    let initialRouteCount = self._initialRouteKeys.count;
    
    if currentRouteCount == initialRouteCount {
      self.didReceiveAllInitialRoutes = true;
      
      self.navigationVC.setViewControllers(self.routeItems, animated: false) {
        // unhide navigation controller
        self.navigationVC.view.isHidden = false;
      };
    };
  };
  
  /// setup - create/init. navigation controller
  func setupNavigationController(){
    // create nav controller
    let navigationVC = RNINavigationController();
    // save a ref to this instance
    self.navigationVC = navigationVC;
    
    navigationVC.delegate = self;
    
    // set with initial value for `navBarPrefersLargeTitles` prop
    if #available(iOS 11.0, *) {
      navigationVC.navigationBar.prefersLargeTitles =
        self.navBarPrefersLargeTitles;
    };
    
    // temp. hide at first, init. route items not added yet...
    navigationVC.view.isHidden = true;

    // add vc's view as subview
    self.addSubview(navigationVC.view);
    navigationVC.view.frame = self.frame;
    
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
  
  /// Embed the navigation controller as a child view controller to the closest
  /// parent view controller.
  /// By default it should be the root view controller:
  /// `RCTRootContentView` -> `RCTRootView` -> `UIViewController` (root vc).
  func setupEmbedNavigationControllerToClosestVC(){
    guard let parentVC = RNIUtilities.getParent(responder: self, type: UIViewController.self)
    else { return };
    
    let isParentVCTheRootVC = self.window!.rootViewController == parentVC;
    
    // Needed to support "view controller based status bar style"
    if self.shouldSwizzleRootViewController, isParentVCTheRootVC {
      RNINavigatorManager.sharedInstance.swizzleRootViewController(for: self.window!);
    };
    
    if isParentVCTheRootVC {
      RNINavigatorManager.sharedInstance.setRootViewControllerBackground(for: self.window!);
    };
    
    parentVC.addChild(self.navigationVC);
    self.navigationVC.didMove(toParent: parentVC);
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
  
  func initializeNativeRoutes(){
    // cast js object keys to array of strings
    guard let keys = self.nativeRoutes.allKeys as? [String]
    else { return };
    
    for key in keys {
      guard let routeID   = Int(key),
            let routeData = self.nativeRoutes[key] as? NSDictionary,
            // extract route data
            let routeKey   = routeData["routeKey"  ] as? String,
            let routeIndex = routeData["routeIndex"] as? Int
      else { continue };
      
      guard let nativeRouteVC: RNINavigatorRouteBaseViewController = {
        if let routeVC = self.routeItemsMap[routeID],
           // check if it's a native route
           routeVC as? RNINavigatorReactRouteViewController == nil {
          
          // A - native route for `routeID` already added...
          return routeVC;
          
        } else if let vc = RNINavigatorManager.routeRegistry[routeKey] {
          // B - native route for `routeID` not added yet...
          // create/init native route
          let routeVC = vc.init();

          routeVC.setRouteID(routeID);
          routeVC.setRouteKey(routeKey);
          
          routeVC.delegate = self;
          routeVC.navigator = self;
          
          // add/register native route
          self.routeItemsMap[routeID] = routeVC;
          return routeVC;
        };
        
        // could not get/create native route vc
        // fail silently...
        return nil;
      }() else { continue };
      
      // update route index
      nativeRouteVC.setRouteIndex(routeIndex);
      
      // set/update route props
      if let routeProps = routeData["routeProps"] as? Dictionary<String, Any> {
        nativeRouteVC.routeProps = routeProps;
      };
    };
    
    self.setupInitialRoutes();
    self.onSetNativeRoutes?([
      /// Note: Sometimes the initial native routes will be initialized before the navigator has finished
      /// initializing, as such the `navigatorID` hasn't been set yet...
      "navigatorID": self.navigatorID ?? -1
    ]);
  };
  
  /// send event: notify js that a new route view was added
  func notifyOnNavRouteViewAdded(vc: RNINavigatorRouteBaseViewController){
    let isNativeRoute = (vc as? RNINavigatorReactRouteViewController) == nil;
      
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
    
    self.routeItemsMap.removeValue(forKey: routeVC.routeID);
    
    if let reactRouteVC = routeVC as? RNINavigatorReactRouteViewController {
      reactRouteVC.routeView.cleanup();
    };
  };
  
  func createRouteDataDict(from viewController: UIViewController) -> Dictionary<String, Any> {
    var dict: Dictionary<String, Any> = [:];
    
    dict["type"] =
      viewController is RNINavigatorReactRouteViewController ? "reactRoute"  :
      viewController is RNINavigatorRouteBaseViewController  ? "nativeRoute" : "viewController";
    
    if let route = viewController as? RNINavigatorRouteBaseViewController {
      dict["routeID"   ] = route.routeID;
      dict["routeKey"  ] = route.routeKey;
      dict["routeIndex"] = route.routeIndex;
    };
    
    return dict;
  };
  
  #if DEBUG
  func debug() -> String {
    let routeItems = self.routeItems;
    return(
        "current routeVC count: \(routeItems.count)"
      + " - current nav vc count: \(self.navigationVC?.viewControllers.count ?? 0)"
      + " - last routeID: \(routeItems.last?.routeID ?? -1)"
      + " - last routeKey: \(routeItems.last?.routeKey ?? "N/A")"
      + " - last routeIndex: \(routeItems.last?.routeIndex ?? -1)"
    );
  };
  #endif
};

// MARK: - Functions for Module
// ---------------------------

internal extension RNINavigatorView {
  
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
      throw RNINavigatorError(
        code: .invalidRouteID,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "no corresponding route found for the given 'routeID' value: \(routeID)",
        debug: debug
      );
    };
    
    guard routeItems.last?.routeID == routeID else {
      throw RNINavigatorError(
        code: .activeRoutesDeSync,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "the last 'routeID' value of \(routeItems.last?.routeID ?? -1)"
         + " does not match the given 'routeID' value of \(routeID)",
        debug: debug
      );
    };
    
    self.navigationVC.pushViewController(nextRouteVC, animated: isAnimated){
      completion();
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
      throw RNINavigatorError(
        code: .routeOutOfBounds,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "there are currently <= 1 active routes.",
        debug: debug
      );
    };
    
    guard let lastNavRouteVC = self.activeRoutes.last,
          let lastRouteVC    = routeItems.last,
          /// make sure that the vc that we will be "popping" is the same as the
          /// last route in `routeVCs`
          lastRouteVC == lastNavRouteVC
    else {
      throw RNINavigatorError(
        code: .activeRoutesDeSync,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "the last item in the navigation controller does not match the last item in 'self.routeVCs'",
        debug: debug
      );
    };
    
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
      throw RNINavigatorError(
        code: .routeOutOfBounds,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "the route count is currently <= 1",
        debug: debug
      );
    };
    
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
      throw RNINavigatorError(
        code: .routeOutOfBounds,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "'routeIndex' > the total active routes",
        debug: debug
      );
    };
    
    guard let routeToRemove = self.routeItemsMap[routeID] else {
      throw RNINavigatorError(
        code: .invalidRouteID,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "invalid 'routeID', no corresponding route could be found for the given 'routeID'",
        debug: debug
      );
    };
    
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
        throw RNINavigatorError(
          code: .routeOutOfBounds,
          domain: "\(String(describing: Self.self)).\(#function)",
          message: "'routeIndex' > the total active routes",
          debug: debug
        );
      };
      
      let routeToRemove = vc[item.routeIndex];
      
      guard item.routeID == routeToRemove.routeID else {
        throw RNINavigatorError(
          code: .invalidRouteID,
          domain: "\(String(describing: Self.self)).\(#function)",
          message: "'routeID' mismatch, the route that is to be removed does not match the given 'routeID'",
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
      throw RNINavigatorError(
        code: .routeOutOfBounds,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "the 'prevRouteIndex' is invalid because it's value is > the total active routes (out of bounds).",
        debug: debug
      );
    };
    
    guard let routeToReplace = self.routeItemsMap[prevRouteID] else {
      throw RNINavigatorError(
        code: .invalidRouteID,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "no matching route could be found for the given 'prevRouteID'",
        debug: debug
      );
    };
    
    guard let replacementRoute = self.routeItemsMap[nextRouteID] else {
      throw RNINavigatorError(
        code: .invalidRouteID,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "no matching route could be found for the given 'nextRouteID'",
        debug: debug
      );
    };
    
    guard routeToReplace  .routeIndex == prevRouteIndex,
          replacementRoute.routeIndex == prevRouteIndex
    else {
      throw RNINavigatorError(
        code: .activeRoutesDeSync,
        domain: "\(String(describing: Self.self)).\(#function)",
        message:
            "Unable to `replaceRoute` due to mismatch, the given 'prevRouteIndex'"
          + " is invalid because it does not match the 'routeIndex' of the matching"
          + " 'replacement' route (i.e. the route for the given 'nextRouteID'), and/or"
          + " the 'to be replaced' route (i.e. the route for the given 'prevRouteID')",
        debug: debug
      );
    };
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
      throw RNINavigatorError(
        code: .routeOutOfBounds,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "'atIndex' is invalid because it's value is > the total active routes (out of bounds).",
        debug: debug
      );
    };
    
    guard self.routeItemsMap.count > self.activeRoutes.count else {
      throw RNINavigatorError(
        code: .libraryError,
        domain: "\(String(describing: Self.self)).\(#function)",
        message:
            "the total `routeItemsMap` < the total active routes."
          + " This could mean that the route to be inserted hasn't been received"
          + " in the native side yet (or it wasn't sent at all)",
        debug: debug
      );
    };
    
    guard let routeToBeInserted = self.routeItemsMap[nextRouteID] else {
      throw RNINavigatorError(
        code: .invalidRouteID,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "no route could be found for the given route 'nextRouteID'",
        debug: debug
      );
    };
    
    guard routeToBeInserted.routeID == nextRouteID else {
      throw RNINavigatorError(
        code: .activeRoutesDeSync,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "'nextRouteID' mismatch, the 'route to be inserted' does not match the provided 'nextRouteKey'",
        debug: debug
      );
    };
    
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
      throw RNINavigatorError(
        code: .invalidArguments,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "the given 'nextRouteIDs' is empty.",
        debug: debug
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
          throw RNINavigatorError(
            code: .invalidRouteID,
            domain: "RNINavigatorView.setRoutes",
            message: "no corresponding route could be found for routeID: \(routeID)",
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
    
    self.navigationVC.setViewControllers(routesToAdd, animated: isAnimated) {
      completion();
    };
  };
  
  func didReceiveCustomCommandFromJS(
    _ key: String,
    _ data: Dictionary<String, Any>?,
    // promise blocks -------------------
    resolve: @escaping (Any?   ) -> Void,
    reject : @escaping (String?) -> Void
  ) throws {
    
    guard let delegate = self.delegate else {
      throw RNINavigatorError(
        code: .libraryError,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "Unable to forward command because delegate is nil",
        debug: nil
      );
    };
    
    delegate.didReceiveCustomCommandFromJS(key, data, resolve, reject);
  };
  
  func getConstants(completion: @escaping (NSDictionary) -> Void) throws {
    guard let navigationVC = self.navigationVC else {
      throw RNINavigatorError(
        code: .libraryError,
        domain: "\(String(describing: Self.self)).\(#function)",
        message: "Unable to get the navigation controller, it may not be initialized yet.",
        debug: nil
      );
    };
    
    let safeAreaInsets: NSDictionary = {
      let insets = navigationVC.synthesizedSafeAreaInsets;
      
      return [
        "top"   : insets.top,
        "bottom": insets.bottom,
        "left"  : insets.left,
        "right" : insets.right,
      ];
    }();
    
    let bounds: NSDictionary = {
      let bounds = navigationVC.view.bounds;
      
      return [
        "x"     : bounds.origin.x,
        "y"     : bounds.origin.y,
        "height": bounds.size.height,
        "width" : bounds.size.width,
      ];
    }();
    
    var dict: Dictionary<String, Any> = [
      "navigatorID": self.navigatorID!,
      
      // ui values
      "navBarHeight"   : navigationVC.navigationBar.frame.height,
      "statusBarHeight": navigationVC.statusBarHeight,
      "safeAreaInsets" : safeAreaInsets,
      "bounds"         : bounds,
      
      "isPresentingModal":
        // note: might fail in some edge case
        navigationVC.presentingViewController != nil,
      
      "activeRoutes": self.activeRoutes.map {
        self.createRouteDataDict(from: $0)
      },
    ];
    
    if let topVC = navigationVC.topViewController {
      dict["topViewController"] = self.createRouteDataDict(from: topVC);
    };
    
    if let visibleVC = navigationVC.visibleViewController {
      dict["visibleViewController"] = self.createRouteDataDict(from: visibleVC);
    };
    
    completion(dict as NSDictionary);
  };
};

// MARK: - Extension: RNINavigatorRouteViewDelegate
// -----------------------------------------------

/// receive events from route vc's
extension RNINavigatorView: RNINavigatorRouteViewControllerDelegate {
  
  func onRouteWillPop(
    sender: RNINavigatorRouteBaseViewController,
    isUserInitiated: Bool
  ){
    // send event: notify js navigator that a route is about to be "popped"
    self.onNavRouteWillPop?([
      "routeID"        : sender.routeID,
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
    
    self.onNavRouteDidPop?([
      "routeID"        : sender.routeID,
      "routeKey"       : sender.routeKey,
      "routeIndex"     : sender.routeIndex,
      "isUserInitiated": isUserInitiated,
      "navigatorID"    : self.navigatorID!,
    ]);
    
    // route popped, remove route from `navRoutes`
    self.removeRouteVC(routeVC: sender);
  };
};

// MARK: - Extension: RNINavigatorNativeCommands
// --------------------------------------------

extension RNINavigatorView: RNINavigatorNativeCommands {
  
  public func pushViewController(
    _ viewController: RNINavigatorRouteBaseViewController,
    animated: Bool = true
  ) {
    
    // create routeID
    viewController.setRouteID();
    
    // create routeKey if none exist
    if viewController._routeKey == nil {
      viewController.setRouteKey();
    };
    
    viewController.delegate  = self;
    viewController.navigator = self;
    
    // add native route
    self.routeItemsMap[viewController.routeID] = viewController;
    
    let commandData: [String: Any] = [
      "commandKey": "pushViewController",
      "routeID"   : viewController.routeID,
      "routeKey"  : viewController.routeKey,
      "isAnimated": animated
    ];
    
    self.onNativeCommandRequest?([
      "navigatorID": self.navigatorID!,
      "commandData": commandData,
    ]);
  };
  
  public func push(
    routeKey: String,
    routeProps: Dictionary<String, Any>? = nil,
    animated: Bool = true
  ) {
    var commandData: [String: Any] = [
      "commandKey": "push",
      "routeKey"  : routeKey,
      "isAnimated": animated
    ];
    
    if let routeProps = routeProps {
      commandData["routeProps"] = routeProps;
    };
    
    self.onNativeCommandRequest?([
      "navigatorID": self.navigatorID!,
      "commandData": commandData,
    ]);
  };
  
  public func pop(animated: Bool = true) {
    let commandData: [String: Any] = [
      "commandKey": "pop",
      "isAnimated": animated
    ];
    
    self.onNativeCommandRequest?([
      "navigatorID": self.navigatorID!,
      "commandData": commandData,
    ]);
  };
  
  public func sendCustomCommandToJS(key: String, data: Dictionary<String, Any>){
    self.onCustomCommandFromNative?([
      "navigatorID": self.navigatorID!,
      "commandKey" : key,
      "commandData": data
    ]);
  };
};

// MARK: - Extension: UINavigationControllerDelegate
// ------------------------------------------------

extension RNINavigatorView: UINavigationControllerDelegate {
  
  /// **Note**:
  /// * "willShow"/"didShow" will not trigger when a view controller is
  ///    being presented
  ///
  /// * Using KVO on `.presentedViewController` also does not work (bc it's
  ///   probably a computed property).
  ///
  /// * Overriding `.present` doesn't work when the child VC is the one who's
  ///   presenting the VC.
  ///
  /// * `viewWillDisappear` isn't triggered when a view controller is presented.
  
  public func navigationController(
    _ navigationController: UINavigationController,
    willShow viewController: UIViewController,
    animated: Bool
  ) {
    // trigger `onUIConstantsDidChange`
    self.navigatorConstants.refreshConstants();
    
    var dict = self.createRouteDataDict(from: viewController);
    dict["navigatorID"] = self.navigatorID!;
    dict["animated"] = animated;
    
    self.onNavRouteWillShow?(dict);
  };
  
  public func navigationController(
    _ navigationController: UINavigationController,
    didShow viewController: UIViewController,
    animated: Bool
  ) {
    var dict = self.createRouteDataDict(from: viewController);
    dict["navigatorID"] = self.navigatorID!;
    dict["animated"] = animated;
    
    self.onNavRouteDidShow?(dict);
  };
};
