//
//  RNINavigatorView.swift
//  IosNavigator
//
//  Created by Dominic Go on 12/31/20.
//

import UIKit;

class RNINavigatorView: UIView {
  
  // ----------------
  // MARK: Properties
  // ----------------
  
  weak var bridge: RCTBridge!;
  
  var navigationVC: UINavigationController!;
  
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
    
    guard let routeView = subview as? RNINavigatorRouteView
    else { return };
    
    // do not show as subview, remove from view hieaarchy
    routeView.removeFromSuperview();
    
    let vc = UIViewController();
    vc.view = subview;
    
    print("RNINavigatorView - insertReactSubview"
      + " - atIndex: \(atIndex)"
      + " - routeView.routeKey: \(routeView.routeKey ?? "N/A")"
      + " - routeView.routeIndex: \(routeView.routeIndex ?? -1   )"
    );
    
    if atIndex == 0 {
      self.navigationVC.setViewControllers([vc], animated: false);
    };
  };
};

// ------------------------
// MARK:- Private Functions
// ------------------------

fileprivate extension RNINavigatorView {
  
  func embedNavigationVC(){
    // create nav controller + save a ref to this instance
    self.navigationVC = {
      let vc = UINavigationController();
      vc.view.frame = self.bounds;
      
      // add vc's view as subview
      self.addSubview(vc.view);
      
      // enable autolayout
      vc.view.translatesAutoresizingMaskIntoConstraints = false;
      // stretch vc to fit/fill this view
      NSLayoutConstraint.activate([
        vc.view.topAnchor     .constraint(equalTo: self.topAnchor     ),
        vc.view.bottomAnchor  .constraint(equalTo: self.bottomAnchor  ),
        vc.view.leadingAnchor .constraint(equalTo: self.leadingAnchor ),
        vc.view.trailingAnchor.constraint(equalTo: self.trailingAnchor)
      ]);
      
      return vc;
    }();
    
    // TODO: Remove the ff:
    /// get the closest vc instance that's responsible for this view...
    /// in most RN apps, this is going to be `RCTRootView` instance.
    if let closestParentVC = self.reactViewController() {
      // add vc as a child to parent vc
      closestParentVC.addChild(self.navigationVC);
      
      // notify vc that it's moved to a parent
      self.navigationVC.didMove(toParent: closestParentVC);
    };
  };
};
