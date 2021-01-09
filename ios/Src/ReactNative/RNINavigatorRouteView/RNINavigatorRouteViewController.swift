//
//  RNINavigatorRouteViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/5/21.
//

import UIKit;

protocol RNINavigatorRouteViewDelegate: AnyObject {
  
  /// Fired when a route is *about to be* "popped", either due to a "user intiated"
  /// pop (i.e. a route's "back button" was pressed, or was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  func onNavRouteWillPop(
    reactTag  : NSNumber, routeKey       : NSString,
    routeIndex: NSNumber, isUserInitiated: Bool
  );
  
  /// Fired when a route *has been* "popped", either due to a "user intiated"
  /// pop (i.e. a route's "back button" was pressed, or was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  func onNavRouteDidPop(
    reactTag  : NSNumber, routeKey       : NSString,
    routeIndex: NSNumber, isUserInitiated: Bool
  );
};

class RNINavigatorRouteViewController: UIViewController {
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  /// The  content to show in the popover
  weak var routeView: RNINavigatorRouteView?;
  /// Used to send/forward navigation-related events
  weak var delegate: RNINavigatorRouteViewDelegate?;
  
  /// A flag that indicates that the nav. controller responsible for this vc is
  /// about to remove it from the nav. stack. This is used to differentiate if
  /// the "remove command" was user intiated (i.e. invoked via tapping the
  /// "back" button, or a swipe gesture), or if it was invoked programmtically
  /// via the parent nav.
  var isToBeRemoved = false;
  
  // -------------------------------
  // MARK: View Controller Lifecycle
  // -------------------------------
  
  override func loadView() {
    super.loadView();
    
    // unwrap `routeView` and add it as child view
    guard let routeView = self.routeView else { return };
    self.view = routeView;
  };
  
  override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews();
    /// update `routeView`'s size
    self.routeView?.notifyForBoundsChange(self.view.bounds);
  };
  
  override func willMove(toParent parent: UIViewController?){
    super.willMove(toParent: parent);
    
    guard let delegate   = self.delegate,
          let routeView  = self.routeView,
          let routeKey   = routeView.routeKey,
          let routeIndex = routeView.routeIndex
    else { return };
    
    // this vc 'will' be popped
    if parent == nil {
      #if DEBUG
      print("LOG - VC, RNINavigatorRouteViewController: willMove"
        + " - toParent: nil - VC will be removed"
        + " - for routeKey: \(routeKey)"
        + " - routeIndex: \(routeIndex)"
        + " - isUserInitiated: \(!self.isToBeRemoved)"
      );
      #endif
      
      // notify parent (i.e. `RNINavigatorView`) that this vc will be "popped".
      delegate.onNavRouteWillPop(
        reactTag  : routeView.reactTag,
        routeKey  : routeKey  ,
        routeIndex: routeIndex,
        // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
        isUserInitiated: !self.isToBeRemoved
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  override func didMove(toParent parent: UIViewController?) {
    super.didMove(toParent: parent);
    
    guard let delegate   = self.delegate,
          let routeView  = self.routeView,
          let routeKey   = routeView.routeKey,
          let routeIndex = routeView.routeIndex
    else { return };
    
    // this vc 'will' be popped
    if parent == nil {
      #if DEBUG
      print("LOG - VC, RNINavigatorRouteViewController: didMove"
        + " - toParent: nil - VC will be removed"
        + " - for routeKey: \(routeKey)"
        + " - routeIndex: \(routeIndex)"
        + " - isUserInitiated: \(!self.isToBeRemoved)"
      );
      #endif
      
      // notify parent (i.e. `RNINavigatorView`) that this vc has been "popped".
      delegate.onNavRouteDidPop(
        reactTag  : routeView.reactTag,
        routeKey  : routeKey  ,
        routeIndex: routeIndex,
        // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
        isUserInitiated: !self.isToBeRemoved
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  #if DEBUG
  deinit {
    print("LOG - deinit - VC, RNINavigatorRouteViewController"
      + " - for routeKey: \(self.routeView?.routeKey ?? "N/A")"
      + " - routeIndex: \(self.routeView?.routeIndex ?? -1)"
      + " - isUserInitiated: \(!self.isToBeRemoved)"
    );
  };
  #endif
};
