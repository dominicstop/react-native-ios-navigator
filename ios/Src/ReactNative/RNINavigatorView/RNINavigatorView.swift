//
//  RNINavigatorView.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import UIKit;

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
  
  /** the`activeRoute` items: routes to be added/added to the nav stack*/
  private var routeVCs: [RNINavigatorRouteViewController] = [];
  
  var navigationVC: UINavigationController!;
  
  // -----------------------------
  // MARK: RN Exported Event Props
  // -----------------------------
  
  /// A `RNINavigatorRouteView` instances was added as a subview
  @objc var onNavRouteViewAdded: RCTBubblingEventBlock?;
  
  /// Fired when a route's "back button" is pressed
  @objc var onNavRouteBackButttonPressed: RCTBubblingEventBlock?;
    
  /// Fired when a route has been "popped" because the "back" button is pressed
  /// or was swiped back via a gesture.
  @objc var onNavUserInitiatedPop: RCTBubblingEventBlock?;
  /// Fired when a route has been "popped" programmatically
  @objc var onNavRequestedPop: RCTBubblingEventBlock?;
  
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
    
    // do not show as subview, remove from view hieaarchy
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
};

// ---------------------------
// MARK:- Functions for Module
// ---------------------------

extension RNINavigatorView {
  func push(routeKey: NSString){
    /// get the `routeView` to be pushed in the nav stack
    guard let routeViewVC = self.routeVCs.last,
          routeViewVC.routeView.routeKey == routeKey
    else {
      #if DEBUG
      print("LOG - NativeView, RNINavigatorView: push error"
        + " - with params - routeKey: \(routeKey)"
        + " - Error: guard check failed"
        + " - last item's routeKey: \(self.routeVCs.last?.routeView.routeKey ?? "N/A")"
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
    
    // push route to the nav stack
    self.navigationVC.pushViewController(routeViewVC, animated: true);
  };
};

// -----------------------------------
// MARK: RNINavigatorRouteViewDelegate
// -----------------------------------

extension RNINavigatorView: RNINavigatorRouteViewDelegate {
  func onNavUserInitiatedPop(routeKey: NSString, routeIndex: NSNumber) {
    #if DEBUG
    print("LOG - NativeView, RNINavigatorView"
      + " - RNINavigatorRouteViewDelegate, onNavUserInitiatedPop"
      + " - with routeKey: \(routeKey)"
      + " - with routeIndex: \(routeIndex)"
    );
    #endif
    
    // send event: notify js navigator that a route's back button was pressed
    // or was swiped back via a gesture.
    self.onNavRouteBackButttonPressed?([
      "routeKey"  : routeKey,
      "routeIndex": routeIndex
    ]);
  };
};
