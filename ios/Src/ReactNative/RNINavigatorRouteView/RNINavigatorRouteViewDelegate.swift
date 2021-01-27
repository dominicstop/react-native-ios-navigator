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
protocol RNINavigatorRouteViewDelegate: AnyObject {
  
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
  
  func didReceiveNavBarButtonTitleView(_ titleView: UIView);
  
  func didReceiveNavBarButtonBackItem(_ item: UIBarButtonItem?);
  
  func didReceiveNavBarButtonLeftItems(_ items: [UIBarButtonItem]?);
  
  func didReceiveNavBarButtonRightItems(_ items: [UIBarButtonItem]?);
  
  // ----------------------------------------------
  // MARK: Receive Props: Navbar Back Button Config
  // ----------------------------------------------
  
  func didReceiveLeftItemsSupplementBackButton(_ bool: Bool);
  
  func didReceiveBackButtonTitle(_ title: String?);
  
  func didReceiveBackButtonDisplayMode(_ displayMode: UINavigationItem.BackButtonDisplayMode);
  
  func didReceiveHidesBackButton(_ hidesBackButton: Bool);
};
