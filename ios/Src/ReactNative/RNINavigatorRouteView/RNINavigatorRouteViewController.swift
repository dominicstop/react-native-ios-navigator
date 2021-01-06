//
//  RNINavigatorRouteViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/5/21.
//

import UIKit;

protocol RNINavigatorRouteViewDelegate: AnyObject {
  func onBackButttonPressed(routeKey: String, routeIndex: Int);
};

class RNINavigatorRouteViewController: UIViewController {
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  /// the  content to show in the popover
  var routeView: RNINavigatorRouteView!;
  /// used to send/forward navigation-related events
  var delegate: RNINavigatorRouteViewDelegate?;
  
  // -------------------------------
  // MARK: View Controller Lifecycle
  // -------------------------------
  
  override func loadView() {
    super.loadView();
    
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
    
    // this VC is 'will' be popped. i.e. the back button was pressed.
    if parent == nil {
      guard let delegate   = self.delegate,
            let routeKey   = self.routeView.routeKey as String?,
            let routeIndex = self.routeView.routeIndex as? Int
      else { return };
      
      #if DEBUG
      print("LOG - VC, RNINavigatorRouteViewController: willMove"
        + " - toParent: nil - VC will be removed (back button was pressed)"
        + " - for routeKey: \(routeKey)"
        + " - routeIndex: \(routeIndex)"
      );
      #endif
      
      delegate.onBackButttonPressed(routeKey: routeKey, routeIndex: routeIndex);
    };
  };
};
