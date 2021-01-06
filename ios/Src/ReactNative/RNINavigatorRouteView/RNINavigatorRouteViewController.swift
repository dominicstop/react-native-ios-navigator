//
//  RNINavigatorRouteViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/5/21.
//

import UIKit;

class RNINavigatorRouteViewController: UIViewController {
  
  /// the  content to show in the popover
  var routeView: RNINavigatorRouteView!;
  
  // -------------------------------
  // MARK: View Controller Lifecycle
  // -------------------------------
  
  override func loadView() {
    super.loadView();
    
    guard let routeView = self.routeView else { return };
    
    self.view.addSubview(routeView);
    
    // enable autolayout
    routeView.translatesAutoresizingMaskIntoConstraints = false;

    NSLayoutConstraint.activate([
      // pin react view to vc's edges to fill/fit the parent view
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
};
