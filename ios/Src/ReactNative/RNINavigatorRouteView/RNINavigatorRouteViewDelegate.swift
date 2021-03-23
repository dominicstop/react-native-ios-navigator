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
/// instance when they are set/updated from JS/RN.
internal protocol RNINavigatorRouteViewDelegate: AnyObject {
  
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
  
  func didReceiveNavBarAppearanceOverride(
    _ standard  : RNINavBarAppearance.NavBarAppearanceConfig?,
    _ compact   : RNINavBarAppearance.NavBarAppearanceConfig?,
    _ scrollEdge: RNINavBarAppearance.NavBarAppearanceConfig?
  );
  
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
};
