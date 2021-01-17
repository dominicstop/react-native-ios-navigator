//
//  RNINavigatorRouteViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/5/21.
//

import UIKit;

protocol RNINavigatorRouteViewControllerDelegate: AnyObject {
  
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
  
  /// The content to show in the route
  var routeView: RNINavigatorRouteView!;
  /// Used to send/forward navigation-related events
  weak var delegate: RNINavigatorRouteViewControllerDelegate?;
  
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

    guard let routeView = self.routeView else { return };
    
    if #available(iOS 11.0, *){
      self.view.addSubview(routeView);
      
      routeView.translatesAutoresizingMaskIntoConstraints = false;
      let safeArea = view.safeAreaLayoutGuide;
      
      NSLayoutConstraint.activate([
        // pin content to parent edges w/o the arrow
        routeView.topAnchor     .constraint(equalTo: safeArea.topAnchor     ),
        routeView.bottomAnchor  .constraint(equalTo: safeArea.bottomAnchor  ),
        routeView.leadingAnchor .constraint(equalTo: safeArea.leadingAnchor ),
        routeView.trailingAnchor.constraint(equalTo: safeArea.trailingAnchor),
      ]);
      
    } else {
      self.view = routeView;
    };
  };
  
  override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews();
    
    /// update `routeView`'s size
    self.routeView?.notifyForBoundsChange(self.view.frame);
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
      
      // send event: notify js nav. route view that it's going to be popped.
      self.routeView?.onNavRouteWillPop?([:]);
      
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
      
      // send event: notify js nav. route view that it's been popped.
      self.routeView?.onNavRouteDidPop?([:]);
      
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
