//
//  RNINavigatorRouteBaseViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/16/21.
//

import UIKit;

/// Offset the `routeID` counter for native routes so it doesn't collide with
/// JS `routeID` counter for JS/React routes.
var ROUTE_ID_COUNTER = 1_000_000_000;

open class RNINavigatorRouteBaseViewController: UIViewController {
  
  /// Holds values for configuring back-item related properties
  struct BackItemCache {
    var backBarButtonItem: UIBarButtonItem?;
    var backTitle: String?;
    var backButtonDisplayMode: UINavigationItem.BackButtonDisplayMode?;
  };
  
  // MARK:- Properties - References
  // ------------------------------
  
  public weak var navigator: RNINavigatorNativeCommands?;
  
  /// Used to send/forward navigation-related events
  internal weak var delegate: RNINavigatorRouteViewControllerDelegate?;
  
  internal var navigatorViewRef: RNINavigatorView? {
    (self.navigator as? RNINavigatorView)
      ?? (self.delegate as? RNINavigatorView)
  };
  
  // MARK: Properties - Route-Related
  // --------------------------------
  
  private var _routeID = -1;
  public var routeID: Int {
    self._routeID;
  };
  
  internal var _routeKey: String!;
  public var routeKey: String {
    self._routeKey;
  };
  
  private var _routeIndex = -1;
  public var routeIndex: Int {
    self._routeIndex;
  };
  
  /// Receive route data when this route was pushed/added from js/react
  public var routeProps: Dictionary<String, Any> = [:];
  
  // MARK: Properties - Public
  // --------------------------
  
  /// A flag that indicates that the nav. controller responsible for this vc is
  /// about to remove it from the nav. stack.
  ///
  /// This is used to differentiate if the removal of the view controller was:
  /// * A. "user initiated" (i.e. invoked via tapping the "back" button, or a swipe
  ///    gesture), or-
  ///
  /// <br>
  ///
  /// * B. it was removed programmatically via a navigation command (e.g. pop view
  ///   controller, etc).
  ///
  /// **Note**: If you are planning to remove this view controller, don't forget
  /// to set this flag to `true`.
  public var isToBeRemoved = false;
  
  /// the status bar style the view controller will transition to when the the
  /// view controller appears.
  ///
  public var statusBarStyleTarget: UIStatusBarStyle = .default;
  
  /// The current status bar style.
  public var statusBarStyleCurrent: UIStatusBarStyle = .default;

  open override var preferredStatusBarStyle: UIStatusBarStyle {
    self.statusBarStyleCurrent;
  };
  
  /// Properties that get temporarily applied to the navigator whenever the
  /// view controller becomes active (e.g. legacy navigation bar appearance,
  /// navigation bar visibility, etc).
  public var navigationConfigOverride = RNINavigationControllerConfig();
  
  // MARK: Properties - Internal
  // ----------------------------
  
  /// A flag that indicates whether a route's back item config was temp. modified
  /// and as a result, should be reset.
  internal var shouldResetNavBarBackConfig = false;
  
  /// Stores the prev. back item, used to reset the back item whenever it's
  /// been temporarily modified.
  internal var prevBackItem = BackItemCache();
  
  // MARK:- View Controller Lifecycle
  // --------------------------------
  
  open override func willMove(toParent parent: UIViewController?){
    super.willMove(toParent: parent);
    
    #if DEBUG
    print("LOG - VC, RNINavigatorRouteBaseViewController: willMove"
      + " - toParent: \(parent == nil ? "N/A" : "VC")"
      + " - for routeKey: \(self.routeKey)"
      + " - routeIndex: \(self.routeIndex)"
      + " - isUserInitiated: \(!self.isToBeRemoved)"
    );
    #endif
    
    if parent == nil {
      // this vc 'will' be popped
      // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
      let isUserInitiated = !self.isToBeRemoved;
      
      // notify parent (i.e. `RNINavigatorView`) that this vc will be "popped".
      self.delegate?.onRouteWillPop(
        sender: self,
        isUserInitiated: isUserInitiated
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  open override func didMove(toParent parent: UIViewController?) {
    super.didMove(toParent: parent);
    
    #if DEBUG
    print("LOG - VC, RNINavigatorRouteBaseViewController: didMove"
      + " - toParent: \(parent == nil ? "N/A" : "VC")"
      + " - for routeKey: \(self.routeKey)"
      + " - routeIndex: \(self.routeIndex)"
      + " - isUserInitiated: \(!self.isToBeRemoved)"
    );
    #endif
    
    if parent == nil {
      // this vc 'will' be popped
      // note: if `isToBeRemoved` is false, then "pop"/back is user initiated.
      let isUserInitiated = !self.isToBeRemoved;
      
      // notify parent (i.e. `RNINavigatorView`) that this vc has been "popped".
      self.delegate?.onRouteDidPop(
        sender: self,
        isUserInitiated: isUserInitiated
      );
      
    } else {
      // TODO: View controller was moved, possibly due replacing a route?
    };
  };
  
  open override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated);
    
    self.applyNavigationConfigOverride(animated);
    self.applyStatusBarTargetStyle(animated);
  };
  
  // MARK:- Functions - Public
  // -------------------------
  
  public func setRouteKey(_ routeKey: String){
    self._routeKey = routeKey;
  };
  
  /// Change the status bar style
  public func setStatusBarStyle(_ style: UIStatusBarStyle){
    guard self.statusBarStyleCurrent != style ||
          self.statusBarStyleTarget  != style
    else { return };
    
    if self.isCurrentlyInFocus {
      // immediately update the status bar style
      self.statusBarStyleCurrent = style;
      self.setNeedsStatusBarAppearanceUpdate();
      
      // notify other routes that the status bar style has changed
      self.notifyRoutesForChangeInStatusBarStyle(style);
      
    } else {
      // apply the status bar style in `viewWillAppear` so it transitions in
      self.statusBarStyleTarget = style;
    };
  };
  
  // MARK: Functions - Internal
  // --------------------------
  
  internal func setRouteID(){
    self._routeID = ROUTE_ID_COUNTER;
    ROUTE_ID_COUNTER += 1;
  };
  
  internal func setRouteID(_ routeID: Int){
    self._routeID = routeID;
  };
  
  internal func setRouteKey(){
    self._routeKey = UUID().uuidString;
  };
  
  internal func setRouteIndex(_ routeIndex: Int){
    self._routeIndex = routeIndex;
  };
  
  /// In cases where a route's `backBarButtonItem` was mutated from js/react (
  /// e.g. via the nav bar back config's `applyToPrevBackConfig` option), this
  /// function gets called to reset the `backBarButtonItem` to it's prev. value
  /// before it was changed.
  ///
  /// Note: this also resets `backButtonTitle` and `backButtonDisplayMode`.
  internal func resetRouteNavBarBackConfig(){
    self.shouldResetNavBarBackConfig = false;
    
    if let backBarItem = self.prevBackItem.backBarButtonItem {
      self.navigationItem.backBarButtonItem = backBarItem;
    };
    
    if #available(iOS 11.0, *),
       let backTitle = self.prevBackItem.backTitle {
      
      self.navigationItem.backButtonTitle = backTitle;
    };
    
    if #available(iOS 14.0, *),
       let displayMode = self.prevBackItem.backButtonDisplayMode {
      
      self.navigationItem.backButtonDisplayMode = displayMode;
    };
    
    // reset back to empty
    self.prevBackItem = BackItemCache();
  };
  
  internal func applyNavigationConfigOverride(_ animated: Bool){
    let configOverrideBlocks = self.navigationConfigOverride
      .makeApplyConfigBlocks(for: self, isAnimated: animated);
    
    configOverrideBlocks.applyConfig();
    
    if animated, let coordinator = self.transitionCoordinator {
      coordinator.animate(alongsideTransition: { _ in
        /// Transition in new appearance override
        configOverrideBlocks.applyAnimatableConfig();
        
      }, completion: { context in
        if context.isCancelled,
           let currentVC = self.lastViewController as? RNINavigatorRouteBaseViewController {
          
          /// Transition was cancelled, re-apply navigator override for the
          /// current active view controller
          
          let currentConfigOverrideBlocks = currentVC.navigationConfigOverride
            .makeApplyConfigBlocks(for: self, isAnimated: animated);
          
          currentConfigOverrideBlocks.applyConfig();
          
          if animated {
            UIView.animate(withDuration: 0.3, animations: {
              currentConfigOverrideBlocks.applyAnimatableConfig();
            });
            
          } else {
            currentConfigOverrideBlocks.applyAnimatableConfig();
          };
        };
      });
      
    } else {
      /// No animation - Immediately apply
      configOverrideBlocks.applyAnimatableConfig();
    };
  };
  
  internal func applyStatusBarTargetStyle(_ animated: Bool){
    guard self.statusBarStyleTarget != self.statusBarStyleCurrent
    else { return };

    // set current status bar style to the target style
    self.statusBarStyleCurrent = self.statusBarStyleTarget;
    
    // notify other routes that the status bar style has changed
    // * Note: The vc that is being popped will not receive the new status bar style
    self.notifyRoutesForChangeInStatusBarStyle(self.statusBarStyleTarget);
    
    if animated, let coordinator = self.transitionCoordinator {
      coordinator.animate(alongsideTransition: { [weak self] _ in
        /// transition - animate in status bar style
        self?.setNeedsStatusBarAppearanceUpdate();
        
      }, completion: { [weak self] context in
        if context.isCancelled,
           let currentVC = self?.lastViewController as? RNINavigatorRouteBaseViewController {
          
          // transition cancelled, reset status bar style
          currentVC.notifyRoutesForChangeInStatusBarStyle(
            currentVC.statusBarStyleTarget
          );
          
          currentVC.setNeedsStatusBarAppearanceUpdate();
        };
      });
      
    } else {
      /// No animation/transition, immediately apply
      self.setNeedsStatusBarAppearanceUpdate();
    };
  };
  
  /// Is used so that the "status bar style" pop fade transition works
  internal func notifyRoutesForChangeInStatusBarStyle(_ style: UIStatusBarStyle){
    self.navigatorViewRef?.activeRoutes.forEach {
      $0.statusBarStyleCurrent = style;
    };
  };
};
