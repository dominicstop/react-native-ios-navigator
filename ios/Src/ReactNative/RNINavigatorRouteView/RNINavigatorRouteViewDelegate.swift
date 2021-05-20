//
//  RNINavigatorRouteViewDelegate.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/26/21.
//

import Foundation


/// This is a delegate for `RNINavigatorRouteView`.
///
/// This delegate allows you to receive props from a `RNINavigatorRouteView`
/// instance when they are set/updated from JS/RN via props.
///
/// Q: When you receive a new value via a prop, why not just set the values
///    directly from `RNINavigatorRouteView`? (e.g. `routeVC.value = newValue`)
///
/// A: The route view is created first, then next is the route view controller.
///    By the time the route vc is created, the route view has already received
///    props from js/react, but is unable to forward it to the route vc.
///
///    So you need to be able to forward the all the initial props at once for
///    the initial setup, while also forwarding the prop values whenever it's
///    set from js/react.
///
///    A method can be created that triggers the sending of all the values all
///    at once via the delegate. This method can then be called once the route
///    vc has been created so that it'll receive the initial prop values for the
///    1st time. Also, the delegate can still be used to individually forward
///    the prop values whenever they're changed from js/react.

internal protocol RNINavigatorRouteViewDelegate: AnyObject {
  
  func didReceiveStatusBarStyle(_ style: UIStatusBarStyle);
  
  // --------------------------------------
  // MARK: Receive Props: Transition Config
  // --------------------------------------
  
  func didReceiveTransitionConfigPush(_ config: RNINavTransitionConfig);
  
  func didReceiveTransitionConfigPop(_ config: RNINavTransitionConfig);
  
  // ----------------------------------
  // MARK: Receive Props: Navbar Config
  // ----------------------------------
  
  func didReceiveRouteTitle(_ title: String);
  
  func didReceivePrompt(_ title: String?);
  
  func didReceiveLargeTitleDisplayMode(_ displayMode: UINavigationItem.LargeTitleDisplayMode);
  
  // ---------------------------------
  // MARK: Receive Props: Navbar Items
  // ---------------------------------
  
  func didReceiveNavBarButtonTitleView(_ titleView: UIView?);
  
  func didReceiveNavBarButtonBackItem(
    _ item: UIBarButtonItem?,
    _ applyToPrevBackConfig: Bool
  );
  
  func didReceiveNavBarButtonLeftItems(_ items: [UIBarButtonItem]?);
  
  func didReceiveNavBarButtonRightItems(_ items: [UIBarButtonItem]?);
  
  // ----------------------------------------------
  // MARK: Receive Props: Navbar Back Button Config
  // ----------------------------------------------
  
  func didReceiveLeftItemsSupplementBackButton(_ bool: Bool);
  
  func didReceiveBackButtonTitle(
    _ title: String?,
    _ applyToPrevBackConfig: Bool
  );
  
  func didReceiveBackButtonDisplayMode(
    _ displayMode: UINavigationItem.BackButtonDisplayMode,
    _ applyToPrevBackConfig: Bool
  );
  
  func didReceiveHidesBackButton(_ hidesBackButton: Bool);
  
  // ----------------------------------------------
  // MARK: Props - NavigationConfigOverride-related
  // ----------------------------------------------
  
  func didReceiveNavBarAppearanceOverride(_ config: RNINavBarAppearance);
  
  func didReceiveNavBarVisibility(_ mode: RNINavigatorRouteView.NavBarVisibility);
  
  func didReceiveAllowTouchEventsToPassThroughNavigationBar(_ flag: Bool);
  
};
