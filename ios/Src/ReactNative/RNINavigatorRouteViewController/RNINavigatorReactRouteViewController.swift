//
//  RNINavigatorReactRouteViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/5/21.
//

import UIKit;


/// A view controller to hold js/react routes
internal class RNINavigatorReactRouteViewController: RNINavigatorRouteBaseViewController {
  
  // -----------------
  // MARK:- Properties
  // -----------------
  
  /// The content to show in the route
  var routeView: RNINavigatorRouteView! {
    didSet {
      // receive "events" from `RNINavigatorRouteViewDelegate`
      self.routeView!.delegate = self;
    }
  };
  
  /// A ref. to the `ScrollView` subview of the `reactRouteContent`
  var reactScrollView: RCTScrollView?;
  var reactSafeAreaView: RCTSafeAreaView?;
  
  // used for the custom transitions
  var interactionController: LeftEdgeInteractionController?;
  
  var transitionTypePush = RNINavTransitionConfig(type: .DefaultPush) {
    willSet {
      // don't set the delegate when using the default push/pop transition
      // to not disable the interactive swipe gesture.
      if newValue.transitionType == .DefaultPush,
         self.transitionTypePop.transitionType == .DefaultPop {
        
        self.navigationController?.delegate = nil;
        
      } else {
        self.navigationController?.delegate = self;
      };
    }
  };
  
  var transitionTypePop = RNINavTransitionConfig(type: .DefaultPop) {
    willSet {
      // don't set the delegate when using the default push/pop transition
      // to not disable the interactive swipe gesture.
      // TODO: This can be fixed by re-impl. the default pop transition.
      if newValue.transitionType == .DefaultPop,
         self.transitionTypePush.transitionType == .DefaultPush {
        
        self.interactionController = nil;
        self.navigationController?.delegate = nil;
        
      } else {
        self.interactionController =
          LeftEdgeInteractionController(viewController: self);
        
        self.navigationController?.delegate = self;
      };
    }
  };
  
  // -----------------------------------
  // MARK:- Convenient Property Wrappers
  // -----------------------------------
  
  override var routeID: Int {
    self.routeView.routeID.intValue;
  };
  
  override var routeKey: String {
    self.routeView.routeKey as String;
  };
  
  override var routeIndex: Int {
    self.routeView.routeIndex.intValue;
  };
  
  // --------------------------------
  // MARK:- View Controller Lifecycle
  // --------------------------------
  
  override func loadView() {
    super.loadView();
    
    let reactRouteContent = self.routeView!.reactRouteContent!;
    self.view = reactRouteContent;
    
    // is content a scrollview
    if let contentView     = reactRouteContent.subviews.first,
       let reactScrollView = contentView as? RCTScrollView {
  
      self.reactScrollView = reactScrollView;
      
    } else if let contentView     = reactRouteContent.subviews.first,
              let reactSafeAreaView = contentView as? RCTSafeAreaView {
      
      self.reactSafeAreaView = reactSafeAreaView;
    };
  };
  
  override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews();
    
    /// update `routeView`'s size
    self.routeView?.notifyForBoundsChange(self.view.bounds);
  };
  
  override func viewWillAppear(_ animated: Bool) {
    // send event: notify js nav. route is about to appear
    self.routeView?.notifyOnRouteFocus(
      isDone: false,
      isAnimated: animated
    );
    
    if self.shouldResetNavBarBackConfig {
      self.resetRouteNavBarBackConfig();
      self.shouldResetNavBarBackConfig = false;
    };
  };
  
  override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated);
    
    // send event: notify js nav. route has appeared
    self.routeView?.notifyOnRouteFocus(
      isDone: true,
      isAnimated: animated
    );
  };
  
  override func viewWillDisappear(_ animated: Bool) {
    // send event: notify js nav. route is about to disappear
    self.routeView?.notifyOnRouteFocus(
      isDone: false,
      isAnimated: animated
    );
  };
  
  override func viewDidDisappear(_ animated: Bool) {
    // send event: notify js nav. route has disappeared
    self.routeView?.notifyOnRouteFocus(
      isDone: true,
      isAnimated: animated
    );
  };
  
  override func viewDidLayoutSubviews() {
    super.viewWillLayoutSubviews();

    self.reactScrollView?.refreshContentInset();
  };
  
  override func willMove(toParent parent: UIViewController?){
    super.willMove(toParent: parent);
    
    if parent == nil {
      // this vc 'will' be popped
      // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
      let isUserInitiated = !self.isToBeRemoved;
      
      // send event: notify js nav. route view that it's going to be popped.
      self.routeView?.notifyOnRoutePop(
        isDone: false,
        isUserInitiated: isUserInitiated
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  override func didMove(toParent parent: UIViewController?) {
    super.didMove(toParent: parent);
    
    if parent == nil {
      // this vc 'will' be popped
      // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
      let isUserInitiated = !self.isToBeRemoved;
      
      // send event: notify js nav. route view that it's been popped.
      self.routeView?.notifyOnRoutePop(
        isDone: true,
        isUserInitiated: isUserInitiated
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  // ------------------------
  // MARK:- Public  Functions
  // ------------------------
  
  /// Override the base impl. so that values used to reset the back config comes
  /// from the js/react values instead of `prevBackItem`.
  override func resetRouteNavBarBackConfig(){
    guard let routeView = self.routeView else { return };
    
    self.navigationItem.backBarButtonItem = routeView.backBarButtonItem;
    
    if #available(iOS 11.0, *) {
      self.navigationItem.backButtonTitle = routeView.backButtonTitle as String?;
    };
    
    if #available(iOS 14.0, *) {
      self.navigationItem.backButtonDisplayMode = {
        guard let string = routeView.backButtonDisplayMode as String?,
              let displayMode = UINavigationItem.BackButtonDisplayMode(string: string)
        else { return .default };
        
        return displayMode;
      }();
    };
  };
};

// -----------------------------------------------
// MARK:- Extension: RNINavigatorRouteViewDelegate
// -----------------------------------------------

/// Receive events from the "route view" that is paired with this vc.
/// This delegate is used to receive "props" from `RNINavigatorRouteView`.
extension RNINavigatorReactRouteViewController: RNINavigatorRouteViewDelegate {
  
  // --------------------------------------
  // MARK: Receive Props: Transition Config
  // --------------------------------------
  
  func didReceiveTransitionConfigPush(_ config: RNINavTransitionConfig){
    self.transitionTypePush = config;
  };
  
  func didReceiveTransitionConfigPop(_ config: RNINavTransitionConfig){
    self.transitionTypePop = config;
  };
  
  // ----------------------------------
  // MARK: Receive Props: Navbar Config
  // ----------------------------------
  
  func didReceiveRouteTitle(_ title: String) {
    self.navigationItem.title = title;
  };
  
  func didReceivePrompt(_ prompt: String?) {
    self.navigationItem.prompt = prompt;
  };
  
  func didReceiveLargeTitleDisplayMode(_ displayMode: UINavigationItem.LargeTitleDisplayMode) {
    if #available(iOS 11.0, *) {
      self.navigationItem.largeTitleDisplayMode = displayMode;
    };
  };
  
  func didReceiveNavBarAppearanceOverride(
    _ standard  : RNINavBarAppearance.NavBarAppearanceConfig?,
    _ compact   : RNINavBarAppearance.NavBarAppearanceConfig?,
    _ scrollEdge: RNINavBarAppearance.NavBarAppearanceConfig?
  ) {
    guard #available(iOS 13.0, *) else { return };
    let defaultAppearance = UINavigationBar.appearance();
    
    self.navigationItem.standardAppearance = standard?.appearance
      ?? defaultAppearance.standardAppearance;
    
    self.navigationItem.compactAppearance = compact?.appearance
      ?? standard?.appearance
      ?? defaultAppearance.compactAppearance;
    
    self.navigationItem.scrollEdgeAppearance = scrollEdge?.appearance
      ?? standard?.appearance
      ?? defaultAppearance.scrollEdgeAppearance;
    
    // refresh the navbar appearance
    self.navigationController?.navigationBar.setNeedsLayout();
  };
  
  // ---------------------------------
  // MARK: Receive Props: Navbar Items
  // ---------------------------------
  
  func didReceiveNavBarButtonTitleView(_ titleView: UIView?) {
    self.navigationItem.titleView = titleView;
  };
  
  func didReceiveNavBarButtonBackItem(
    _ item: UIBarButtonItem?,
    _ applyToPrevBackConfig: Bool
  ) {
    if applyToPrevBackConfig {
      guard let backItem = self.navigationController?.navigationBar.backItem
      else { return };
      
      self.prevBackItem.backBarButtonItem = backItem.backBarButtonItem;
      backItem.backBarButtonItem = item;
      
    } else {
      self.navigationItem.backBarButtonItem = item;
    };
  };
  
  func didReceiveNavBarButtonLeftItems(_ items: [UIBarButtonItem]?) {
    self.navigationItem.leftBarButtonItems = items;
  };
  
  func didReceiveNavBarButtonRightItems(_ items: [UIBarButtonItem]?) {
    self.navigationItem.rightBarButtonItems = items;
  };
  
  // ----------------------------------------------
  // MARK: Receive Props: NavBar Back Button Config
  // ----------------------------------------------
  
  func didReceiveLeftItemsSupplementBackButton(_ bool: Bool) {
    self.navigationItem.leftItemsSupplementBackButton = bool;
  };
  
  func didReceiveBackButtonTitle(
    _ title: String?,
    _ applyToPrevBackConfig: Bool
  ) {
    guard #available(iOS 11.0, *) else { return };
    
    if applyToPrevBackConfig {
      guard let backItem = self.navigationController?.navigationBar.backItem
      else { return };
      
      self.prevBackItem.backTitle = backItem.title;
      backItem.backButtonTitle = title;
  
    } else {
      self.navigationItem.backButtonTitle = title;
    };
  };
  
  func didReceiveBackButtonDisplayMode(
    _ displayMode: UINavigationItem.BackButtonDisplayMode,
    _ applyToPrevBackConfig: Bool
  ) {
    guard #available(iOS 14.0, *) else { return };
    
    if applyToPrevBackConfig {
      guard let backItem = self.navigationController?.navigationBar.backItem
      else { return };
      
      self.prevBackItem.backButtonDisplayMode = backItem.backButtonDisplayMode;
      backItem.backButtonDisplayMode = displayMode;
      
    } else {
      self.navigationItem.backButtonDisplayMode = displayMode;
    };
  };
  
  func didReceiveHidesBackButton(_ hidesBackButton: Bool){
    self.navigationItem.hidesBackButton = hidesBackButton;
  };
};

// ------------------------------------------------
// MARK:- Extension: UINavigationControllerDelegate
// ------------------------------------------------

extension RNINavigatorReactRouteViewController: UINavigationControllerDelegate {
  func navigationController(
    _           navigationController: UINavigationController,
    animationControllerFor operation: UINavigationController.Operation,
    from fromVC: UIViewController,
    to   toVC  : UIViewController

  ) -> UIViewControllerAnimatedTransitioning? {
    
    switch operation {
      case .push: return self.transitionTypePush.makeAnimator();
        
      case .pop : return self.transitionTypePop.makeAnimator(
        interactionController: self.interactionController
      );
      
      default:  return nil;
    };
  };
  
  func navigationController(
    _ navigationController: UINavigationController,
    interactionControllerFor animationController: UIViewControllerAnimatedTransitioning

  ) -> UIViewControllerInteractiveTransitioning? {
    
    guard let animator = animationController as? CustomAnimator,
          let interactionController = animator.interactionController as? LeftEdgeInteractionController,
          interactionController.inProgress
    else { return nil };
    
    return interactionController;
  };
};
