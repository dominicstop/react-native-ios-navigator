//
//  RNINavigatorRouteViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/5/21.
//

import UIKit;

protocol RNINavigatorRouteViewDelegate: AnyObject {
  /// A user initiated back/pop "command" was fired (i.e. it signifies that a
  /// route's "back button" was pressed, or was swiped back via a gesture)
  func onNavUserInitiatedPop(routeKey: NSString, routeIndex: NSNumber);
};

class RNINavigatorRouteViewController: UIViewController {
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  /// The  content to show in the popover
  var routeView: RNINavigatorRouteView!;
  /// Used to send/forward navigation-related events
  var delegate: RNINavigatorRouteViewDelegate?;
  
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
    self.view.addSubview(routeView);
    
    // enable autolayout
    routeView.translatesAutoresizingMaskIntoConstraints = false;
    // pin `routeView` to vc's edges to fill/fit the parent view
    NSLayoutConstraint.activate([
      routeView.topAnchor     .constraint(equalTo: self.view.topAnchor     ),
      routeView.bottomAnchor  .constraint(equalTo: self.view.bottomAnchor  ),
      routeView.leadingAnchor .constraint(equalTo: self.view.leadingAnchor ),
      routeView.trailingAnchor.constraint(equalTo: self.view.trailingAnchor),
    ]);
  };
  
  override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews();
    /// update `routeView`'s size
    self.routeView.notifyForBoundsChange(self.view.bounds);
  };
  
  override func willMove(toParent parent: UIViewController?){
    super.willMove(toParent: parent);
    
    // this vc 'will' be popped (i.e. back button pressed/swipe back gesture).
    // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
    if parent == nil && !self.isToBeRemoved {
      guard let delegate   = self.delegate,
            let routeKey   = self.routeView.routeKey,
            let routeIndex = self.routeView.routeIndex
      else { return };
      
      #if DEBUG
      print("LOG - VC, RNINavigatorRouteViewController: willMove"
        + " - toParent: nil - VC will be removed (back button was pressed)"
        + " - for routeKey: \(routeKey)"
        + " - routeIndex: \(routeIndex)"
      );
      #endif
      
      // notify parent (i.e. `RNINavigatorView`)
      delegate.onNavUserInitiatedPop(routeKey: routeKey, routeIndex: routeIndex);
    };
  };
};
