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
      
    } else if #available(iOS 11.0, *) {
      let safeArea = self.view.safeAreaLayoutGuide;
      self.view = reactRouteContent;
      
     //reactRouteContent.translatesAutoresizingMaskIntoConstraints = false;
     //NSLayoutConstraint.activate([
     //  // pin content to parent edges w/o the arrow
     //   reactRouteContent.topAnchor     .constraint(equalTo: safeArea.topAnchor     ),
     //   reactRouteContent.bottomAnchor  .constraint(equalTo: safeArea.bottomAnchor  ),
     //   reactRouteContent.leadingAnchor .constraint(equalTo: safeArea.leadingAnchor ),
     //   reactRouteContent.trailingAnchor.constraint(equalTo: safeArea.trailingAnchor),
     //]);
      
    } else {
      self.view = reactRouteContent;
    };
  };
  
  override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews();
  }
  
  override func viewDidLayoutSubviews() {
    super.viewWillLayoutSubviews();

    if let reactScrollView = self.reactScrollView {
      // Update scrollview insets
      reactScrollView.refreshContentInset();
      
      /// update `routeView`'s size
      self.routeView?.notifyForBoundsChange(self.view.bounds);
      
    } else if #available(iOS 11.0, *),
              let routeView = self.routeView?.reactRouteContent {
      
      let safeArea = self.view.safeAreaLayoutGuide;
      
      print("DEBUG -*")
      
      // update view insets
      //routeView.layoutMargins = self.view.safeAreaInsets;
      //routeView.layoutMarginsDidChange();
      //routeView.reactPaddingInsets = self.view.safeAreaInsets;
      /// update `routeView`'s size
      self.routeView?.notifyForBoundsChange(self.view.bounds);
    };
    
    
  };
  
  override func viewWillAppear(_ animated: Bool) {
    #if DEBUG
    // when RN app reloads
    NotificationCenter.default.addObserver(self,
      selector: #selector(self.onReactRefresh),
      name: NSNotification.Name(rawValue: "RCTBridgeFastRefreshNotification"),
      object: nil
    );
    #endif
  };
  
  override func willMove(toParent parent: UIViewController?){
    super.willMove(toParent: parent);
    
    guard let delegate   = self.delegate,
          let routeView  = self.routeView,
          let routeKey   = routeView.routeKey,
          let routeIndex = routeView.routeIndex
    else { return };
    
    // this vc 'will' be popped
    if parent == nil {
      #if DEBUG
      print("LOG - VC, RNINavigatorRouteViewController: willMove"
        + " - toParent: nil - VC will be removed"
        + " - for routeKey: \(routeKey)"
        + " - routeIndex: \(routeIndex)"
        + " - isUserInitiated: \(!self.isToBeRemoved)"
      );
      #endif
      
      // send event: notify js nav. route view that it's going to be popped.
      self.routeView?.onNavRouteWillPop?([:]);
      
      // notify parent (i.e. `RNINavigatorView`) that this vc will be "popped".
      delegate.onNavRouteWillPop(
        reactTag  : routeView.reactTag,
        routeKey  : routeKey  ,
        routeIndex: routeIndex,
        // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
        isUserInitiated: !self.isToBeRemoved
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  override func didMove(toParent parent: UIViewController?) {
    super.didMove(toParent: parent);
    
    guard let delegate   = self.delegate,
          let routeView  = self.routeView,
          let routeKey   = routeView.routeKey,
          let routeIndex = routeView.routeIndex
    else { return };
    
    // this vc 'will' be popped
    if parent == nil {
      #if DEBUG
      print("LOG - VC, RNINavigatorRouteViewController: didMove"
        + " - toParent: nil - VC will be removed"
        + " - for routeKey: \(routeKey)"
        + " - routeIndex: \(routeIndex)"
        + " - isUserInitiated: \(!self.isToBeRemoved)"
      );
      #endif
      
      // send event: notify js nav. route view that it's been popped.
      self.routeView?.onNavRouteDidPop?([:]);
      
      // notify parent (i.e. `RNINavigatorView`) that this vc has been "popped".
      delegate.onNavRouteDidPop(
        reactTag  : routeView.reactTag,
        routeKey  : routeKey  ,
        routeIndex: routeIndex,
        // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
        isUserInitiated: !self.isToBeRemoved
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  #if DEBUG
  deinit {
    NotificationCenter.default.removeObserver(self,
      name: NSNotification.Name(rawValue: "RCTBridgeWillReloadNotification"),
      object: nil
    );
    
    print("LOG - deinit - VC, RNINavigatorRouteViewController"
      + " - for routeKey: \(self.routeView?.routeKey ?? "N/A")"
      + " - routeIndex: \(self.routeView?.routeIndex ?? -1)"
      + " - isUserInitiated: \(!self.isToBeRemoved)"
    );
  };
  #endif
  
  // ------------------------
  // MARK:- Private Functions
  // ------------------------
  
  @objc private func onReactRefresh(){
    print("onReactRefresh");
    self.updateViewConstraints();
    self.reactScrollView?.setNeedsLayout();
  };
};

// -----------------------------------------------
// MARK:- Extension: RNINavigatorRouteViewDelegate
// -----------------------------------------------

/// Receive events from the "route view" that is paired with this vc.
/// This delegate is used to receive "props" from `RNINavigatorRouteView`.
extension RNINavigatorRouteViewController: RNINavigatorRouteViewDelegate {
  
  // ---------------------------------
  // MARK: Receive Props: navbar items
  // ---------------------------------
  
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
  
  // ---------------------------------------------------
  // MARK: Receive Props: navbar back button item config
  // ---------------------------------------------------
  
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
