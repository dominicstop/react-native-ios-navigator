//
//  RNINavigatorView.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import UIKit;

typealias Completion = () -> Void;

protocol RNINavigatorViewEventsDelegate: AnyObject {
  // TODO: Add Functions
};

class RNINavigatorView: UIView {
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  /// ref to the RN view manager singleton's bridge instance
  weak var bridge: RCTBridge!;
  /// delegate for sending events to the ` RNINavigatorViewModule.Manager`
  weak var eventsDelegate: RNINavigatorViewEventsDelegate?;
  
  /// The`activeRoute` items, i.e.the routes added/to be added to the nav. stack.
  /// Note: This has to have strong ref. to the routes so that they will be
  /// retained. Once the routes are "popped", they should be removed from here
  /// so that they will be "released".
  private var routeVCs: [RNINavigatorRouteViewController] = [];
  
  var navigationVC: UINavigationController!;
  
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
  
  // ----------------
  // MARK: Initialize
  // ----------------
  
  init(bridge: RCTBridge) {
    super.init(frame: CGRect());
    
    self.bridge = bridge;
    self.embedNavigationVC();
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  // ------------------
  // MARK: RN Lifecycle
  // ------------------
  
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
    
    /// create the wrapper vc that holds the `routeView`
    let vc = RNINavigatorRouteViewController();
    vc.routeView = routeView;
    // listen for naviagtor-related events
    vc.delegate = self;
    
    /// save a ref to `routeView`'s vc instance
    self.routeVCs.append(vc)
    
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
      self.navigationVC.setViewControllers([vc], animated: false);
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
    let navigationVC = UINavigationController();
    navigationVC.view.frame = self.bounds;
    
    // add vc's view as subview
    self.addSubview(navigationVC.view);
    // save a ref to this instance
    self.navigationVC = navigationVC;
    
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
        // cleanup: manually remove routes from view registry
        RNIUtilities.recursivelyRemoveFromViewRegistry(
          bridge   : self.bridge,
          reactView: $0.routeView!
        );
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
  
  func push(routeKey: NSString, completion: @escaping Completion){
    /// get the `routeView` to be pushed in the nav stack
    guard let routeViewVC = self.routeVCs.last,
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
    
    self.navigationVC.pushViewController(
      routeViewVC, animated: true, completion: completion
    );
  };
};

// -----------------------------------
// MARK: RNINavigatorRouteViewDelegate
// -----------------------------------

/// receive events from route vc's
extension RNINavigatorView: RNINavigatorRouteViewDelegate {
  
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
      /////
            + " - reactSubviews: \(self.reactSubviews()?.count ?? -1)"
            + " - subviews: \(self.subviews.count)"
            + " - subviews's subview: \(self.subviews.first?.subviews.count ?? -1)"
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
