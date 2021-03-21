//
//  RNINavigatorRouteBaseViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/16/21.
//

import UIKit;

fileprivate var ROUTE_ID_COUNTER = 100000;

open class RNINavigatorRouteBaseViewController: UIViewController {
  
  /// Holds values for configuring back-item related properties
  struct BackItemCache {
    var backBarButtonItem: UIBarButtonItem?;
    var backTitle: String?;
    var backButtonDisplayMode: UINavigationItem.BackButtonDisplayMode?;
  };
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  /// Used to send/forward navigation-related events
  weak var delegate: RNINavigatorRouteViewControllerDelegate?;
  
  private(set) var routeID: Int = {
    // auto inc.
    defer { ROUTE_ID_COUNTER += 1 };
    return ROUTE_ID_COUNTER;
  }();
  
  private var _routeKey: String!;
  var routeKey: String {
    self._routeKey;
  };
  
  private var _routeIndex = -1;
  var routeIndex: Int {
    self._routeIndex;
  };
  
  /// A flag that indicates that the nav. controller responsible for this vc is
  /// about to remove it from the nav. stack. This is used to differentiate if
  /// the "remove command" was user initiated (i.e. invoked via tapping the
  /// "back" button, or a swipe gesture), or if it was invoked programmatically
  /// via the parent nav.
  var isToBeRemoved = false;
  
  /// A flag that indicates whether a route's back item config was temp. modified
  /// and as a result, should be reset.
  internal var shouldResetNavBarBackConfig = false;
  
  /// Stores the prev. back item, used to reset the back item whenever it's
  /// been temporarily modified.
  internal var prevBackItem = BackItemCache();
  
  // ----------
  // MARK: Init
  // ----------
  
  init(){
    super.init(nibName: nil, bundle: nil);
  };
  
  required public init(routeKey: String){
    self._routeKey = routeKey;
    super.init(nibName: nil, bundle: nil);
  };
  
  required public init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder);
  };
  
  // --------------------------------
  // MARK:- View Controller Lifecycle
  // --------------------------------
  
  open override func willMove(toParent parent: UIViewController?){
    super.willMove(toParent: parent);
    
    #if DEBUG
    print("LOG - VC, RNINavigatorRouteBaseViewController: willMove"
      + " - toParent: \(parent == nil ? "N/A" : "VC")"
      + " - for routeKey: \(self.routeKey)"
      + " - routeIndex: \(self.routeIndex)"
      + " - isUserInitiated: \(!self.isToBeRemoved)"
    );
    #endif
    
    if parent == nil {
      // this vc 'will' be popped
      // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
      let isUserInitiated = !self.isToBeRemoved;
      
      // notify parent (i.e. `RNINavigatorView`) that this vc will be "popped".
      self.delegate?.onRouteWillPop(
        sender: self,
        isUserInitiated: isUserInitiated
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  open override func didMove(toParent parent: UIViewController?) {
    super.didMove(toParent: parent);
    
    #if DEBUG
    print("LOG - VC, RNINavigatorRouteBaseViewController: didMove"
      + " - toParent: \(parent == nil ? "N/A" : "VC")"
      + " - for routeKey: \(self.routeKey)"
      + " - routeIndex: \(self.routeIndex)"
      + " - isUserInitiated: \(!self.isToBeRemoved)"
    );
    #endif
    
    if parent == nil {
      // this vc 'will' be popped
      // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
      let isUserInitiated = !self.isToBeRemoved;
      
      // notify parent (i.e. `RNINavigatorView`) that this vc has been "popped".
      self.delegate?.onRouteDidPop(
        sender: self,
        isUserInitiated: isUserInitiated
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  // ---------------
  // MARK: Functions
  // ---------------
  
  /// note: internal lib function
  func setRouteIndex(_ routeIndex: Int){
    self._routeIndex = routeIndex;
  };
  
  /// In cases where a route's `backBarButtonItem` was mutated from js/react (
  /// e.g. via the nav bar back config's `applyToPrevBackConfig` option), this
  /// function gets called to reset the `backBarButtonItem` to it's prev. value
  /// before it was changed.
  ///
  /// Note: this also resets `backButtonTitle` and `backButtonDisplayMode`.
  func resetRouteNavBarBackConfig(){
    if let backBarItem = self.prevBackItem.backBarButtonItem {
      self.navigationItem.backBarButtonItem = backBarItem;
    };
    
    if #available(iOS 11.0, *),
       let backTitle = self.prevBackItem.backTitle {
      
      self.navigationItem.backButtonTitle = backTitle;
    };
    
    if #available(iOS 14.0, *),
       let displayMode = self.prevBackItem.backButtonDisplayMode {
      
      self.navigationItem.backButtonDisplayMode = displayMode;
    };
    
    // reset back to empty
    self.prevBackItem = BackItemCache();
  };
};
