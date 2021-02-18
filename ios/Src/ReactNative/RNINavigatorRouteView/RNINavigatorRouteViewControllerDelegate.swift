//
//  RNINavigatorRouteViewControllerDelegate.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 2/2/21.
//

import Foundation


protocol RNINavigatorRouteViewControllerDelegate: AnyObject {
  
  /// Fired when a route is *about to be* "popped", either due to a "user intiated"
  /// pop (i.e. a route's "back button" was pressed, or was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  func onRouteWillPop(sender: RNINavigatorRouteView, isUserInitiated: Bool);
  
  /// Fired when a route *has been* "popped", either due to a "user intiated"
  /// pop (i.e. a route's "back button" was pressed, or was swiped back via a
  /// gesture), or due to it being "popped" programmatically via the nav.
  func onRouteDidPop(sender: RNINavigatorRouteView, isUserInitiated: Bool);
  
};
