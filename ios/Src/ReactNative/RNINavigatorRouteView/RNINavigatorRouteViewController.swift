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
  
  /// Used to send/forward navigation-related events
  weak var delegate: RNINavigatorRouteViewControllerDelegate?;
  
  /// A flag that indicates that the nav. controller responsible for this vc is
  /// about to remove it from the nav. stack. This is used to differentiate if
  /// the "remove command" was user intiated (i.e. invoked via tapping the
  /// "back" button, or a swipe gesture), or if it was invoked programmtically
  /// via the parent nav.
  var isToBeRemoved = false;
  
  /// A ref. to the `ScrollView` subview of the `reactRouteContent`
  var reactScrollView: RCTScrollView?;

  // --------------------------------
  // MARK:- View Controller Lifecycle
  // --------------------------------
  
  override func loadView() {
    super.loadView();
    
    let reactRouteContent = self.routeView!.reactRouteContent!;
    
    // is content a scrollview
    if #available(iOS 11.0, *),
       let contentView     = reactRouteContent.subviews.first,
       let reactScrollView = contentView as? RCTScrollView {
         
      self.view = reactRouteContent;
      self.reactScrollView = reactScrollView;
      
    } else {
      self.view = reactRouteContent;
    };
  };
  
  override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews();
    
    /// update `routeView`'s size
    self.routeView?.notifyForBoundsChange(self.view.bounds);
  };
  
  override func viewDidLayoutSubviews() {
    super.viewWillLayoutSubviews();

    if let reactScrollView = self.reactScrollView {
      // Update scrollview insets
      reactScrollView.refreshContentInset();
    };
  };
  
  override func willMove(toParent parent: UIViewController?){
    super.willMove(toParent: parent);
    
    guard let routeView  = self.routeView,
          let routeKey   = routeView.routeKey,
          let routeIndex = routeView.routeIndex
    else { return };
    
    if parent == nil {
      // this vc 'will' be popped
      #if DEBUG
      print("LOG - VC, RNINavigatorRouteViewController: willMove"
        + " - toParent: nil - VC will be removed"
        + " - for routeKey: \(routeKey)"
        + " - routeIndex: \(routeIndex)"
        + " - isUserInitiated: \(!self.isToBeRemoved)"
      );
      #endif
      
      // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
      let isUserInitiated = !self.isToBeRemoved;
      
      // send event: notify js nav. route view that it's going to be popped.
      self.routeView?.notifyOnNavRouteWillPop(isUserInitiated: isUserInitiated);
      
      // notify parent (i.e. `RNINavigatorView`) that this vc will be "popped".
      self.delegate?.onNavRouteWillPop(
        reactTag       : routeView.reactTag,
        routeKey       : routeKey,
        routeIndex     : routeIndex,
        isUserInitiated: isUserInitiated
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  override func didMove(toParent parent: UIViewController?) {
    super.didMove(toParent: parent);
    
    guard let routeView  = self.routeView,
          let routeKey   = routeView.routeKey,
          let routeIndex = routeView.routeIndex
    else { return };
    
    if parent == nil {
      // this vc 'will' be popped
      #if DEBUG
      print("LOG - VC, RNINavigatorRouteViewController: didMove"
        + " - toParent: nil - VC will be removed"
        + " - for routeKey: \(routeKey)"
        + " - routeIndex: \(routeIndex)"
        + " - isUserInitiated: \(!self.isToBeRemoved)"
      );
      #endif
      
      // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
      let isUserInitiated = !self.isToBeRemoved;
      
      // send event: notify js nav. route view that it's been popped.
      self.routeView?.notifyOnNavRouteDidPop(isUserInitiated: isUserInitiated);
      
      // notify parent (i.e. `RNINavigatorView`) that this vc has been "popped".
      self.delegate?.onNavRouteDidPop(
        reactTag       : routeView.reactTag,
        routeKey       : routeKey,
        routeIndex     : routeIndex,
        isUserInitiated: isUserInitiated
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
};

// -----------------------------------------------
// MARK:- Extension: RNINavigatorRouteViewDelegate
// -----------------------------------------------

/// Receive events from the "route view" that is paired with this vc.
/// This delegate is used to receive "props" from `RNINavigatorRouteView`.
extension RNINavigatorRouteViewController: RNINavigatorRouteViewDelegate {
  
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
  
  // ---------------------------------
  // MARK: Receive Props: Navbar Items
  // ---------------------------------
  
  func didReceiveNavBarButtonTitleView(_ titleView: UIView) {
    self.navigationItem.titleView = titleView;
  };
  
  func didReceiveNavBarButtonBackItem(_ item: UIBarButtonItem?) {
    self.navigationItem.backBarButtonItem = item;
  };
  
  func didReceiveNavBarButtonLeftItems(_ items: [UIBarButtonItem]?) {
    self.navigationItem.leftBarButtonItems = items;
  };
  
  func didReceiveNavBarButtonRightItems(_ items: [UIBarButtonItem]?) {
    self.navigationItem.rightBarButtonItems = items;
  };
  
  // ----------------------------------------------
  // MARK: Receive Props: Navbar Back Button Config
  // ----------------------------------------------
  
  func didReceiveLeftItemsSupplementBackButton(_ bool: Bool) {
    self.navigationItem.leftItemsSupplementBackButton = bool;
  };
  
  func didReceiveBackButtonTitle(_ title: String?) {
    if #available(iOS 11.0, *) {
      self.navigationItem.backButtonTitle = title;
    };
  };
  
  func didReceiveBackButtonDisplayMode(_ displayMode: UINavigationItem.BackButtonDisplayMode){
    if #available(iOS 14.0, *) {
      self.navigationItem.backButtonDisplayMode = displayMode;
    };
  };
  
  func didReceiveHidesBackButton(_ hidesBackButton: Bool){
    self.navigationItem.hidesBackButton = hidesBackButton;
  };
};
