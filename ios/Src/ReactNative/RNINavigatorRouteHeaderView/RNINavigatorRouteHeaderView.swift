//
//  RNINavigatorRouteHeaderView.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 4/14/21.
//

import Foundation


internal class RNINavigatorRouteHeaderView: RCTView {
  
  // ---------------------
  // MARK:- Embedded Types
  // ---------------------
  
  enum HeaderHeightPreset: String, Equatable {
    case navigationBar;
    case statusBar;
    case navigationBarWithStatusBar;
    case safeArea;
    case none;
    
    func getHeight(viewController: UIViewController) -> CGFloat {
      switch self {
        case .navigationBar             : return viewController.navBarHeight;
        case .statusBar                 : return viewController.statusBarHeight;
        case .safeArea                  : return viewController.synthesizedSafeAreaInsets.top;
        case .navigationBarWithStatusBar: return viewController.navBarWithStatusBarHeight;
        case .none                      : return 0;
      };
    };
  };
  
  struct HeaderHeightConfig {
    let preset: HeaderHeightPreset;
    let offset: CGFloat;
    
    init(preset: HeaderHeightPreset, offset: CGFloat = 0) {
      self.preset = preset;
      self.offset = offset;
    };
    
    init?(dict: NSDictionary?) {
      guard let presetString = dict?["preset"] as? String,
            let preset = HeaderHeightPreset(rawValue: presetString)
      else { return nil };
      
      self.preset = preset;
      
      self.offset = {
        guard let number = dict?["offset"] as? NSNumber
        else { return 0 };
        
        return CGFloat(truncating: number);
      }();
    };
  };
  
  enum HeaderConfig {
    case fixed(height: HeaderHeightConfig);
    case resize(minHeight: HeaderHeightConfig, maxHeight: HeaderHeightConfig);
    
    static var defaultConfig: Self {
      .fixed(
        height: HeaderHeightConfig(preset: .navigationBarWithStatusBar)
      );
    };
    
    static func fromDict(_ dict: NSDictionary) -> Self? {
      guard let string = dict["headerMode"] as? String
      else { return nil };
      
      switch string {
        case "fixed":
          guard let heightDict   = dict["headerHeight"] as? NSDictionary,
                let heightConfig = HeaderHeightConfig(dict: heightDict)
          else { return nil };
          
          return .fixed(height: heightConfig);
          
        case "resize":
          guard let heightMinDict = dict["headerHeightMin"] as? NSDictionary,
                let heightMaxDict = dict["headerHeightMax"] as? NSDictionary,
                
                let heightMinConfig = HeaderHeightConfig(dict: heightMinDict),
                let heightMaxConfig = HeaderHeightConfig(dict: heightMaxDict)
          else { return nil };
          
          return .resize(
            minHeight: heightMinConfig,
            maxHeight: heightMaxConfig
          );
          
        default: return nil;
      }
    };
    
    var description: String {
      switch self {
        case let .fixed(height: heightConfig): return
                "preset: \(heightConfig.preset.rawValue)"
          + " - offset: \(heightConfig.offset)"
          
        case let .resize(minHeight: minHeightConfig, maxHeight: maxHeightConfig): return
               "minHeight.preset: \(minHeightConfig.preset.rawValue)"
          + " - minHeight.offset: \(minHeightConfig.offset)"
          + " - maxHeight.preset: \(maxHeightConfig.preset.rawValue)"
          + " - maxHeight.offset: \(maxHeightConfig.offset)"
      };
    };
    
    func getCollapsedHeight(viewController vc: UIViewController) -> CGFloat {
      switch self {
        case let .fixed(height: heightConfig):
          let presetHeight =
            heightConfig.preset.getHeight(viewController: vc);
          
          return presetHeight + heightConfig.offset;
          
        case let .resize(minHeight: minHeightConfig, maxHeight: _):
          let presetHeight =
            minHeightConfig.preset.getHeight(viewController: vc);
          
          return presetHeight + minHeightConfig.offset;
      };
    };
    
    func getExpandedHeight(viewController vc: UIViewController) -> CGFloat {
      switch self {
        case .fixed:
          return self.getCollapsedHeight(viewController: vc);
          
        case let .resize(minHeight: _, maxHeight: maxHeightConfig):
          let presetHeight =
            maxHeightConfig.preset.getHeight(viewController: vc);
          
          return presetHeight + maxHeightConfig.offset;
      };
    };
  };
  
  // -----------------
  // MARK:- Properties
  // -----------------
  
  var bridge: RCTBridge!;
  
  /// Ref. to the parent route view
  weak var routeView: RNINavigatorRouteView?;
  
  /// Ref. to the parent react route vc
  weak var routeViewController: RNINavigatorReactRouteViewController?;
  
  private var didTriggerSetup = false;
  private var didSetInitialSize = false;
  
  // --------------------------
  // MARK:- Computed Properties
  // --------------------------
  
  var isMounted: Bool {
    self.window != nil && self.superview != nil
  };
  
  var wrapperView: RNINavigatorReactRouteViewController.RouteContentWrapper? {
    self.routeViewController?.wrapperView
  };
  
  var headerInitialSize: CGSize? {
    guard let routeVC = self.routeViewController,
          let navigationBar = routeVC.navigationController?.navigationBar
    else { return nil };
    
    let headerHeight =
      self.headerConfig.getExpandedHeight(viewController: routeVC);
    
    return CGSize(
      width: navigationBar.frame.width,
      height: headerHeight
    );
  };
  
  var navigationController: UINavigationController? {
    self.routeViewController?.routeView?.navigatorView?.navigationVC
  };
  
  // ------------------------
  // MARK:- RN Exported Props
  // ------------------------
  
  private var headerConfig = HeaderConfig.defaultConfig;
  @objc var config: NSDictionary? {
    willSet {
      guard self.config != newValue else { return };
      
      self.headerConfig = {
        guard let dict   = newValue,
              let config = HeaderConfig.fromDict(dict)
        else { return HeaderConfig.defaultConfig };
        
        return config;
      }();
      
      self.refreshHeaderHeight();
      
      #if DEBUG
      print("LOG - RNINavigatorRouteHeaderView: didSet"
        + " - headerMode: \(self.headerConfig.description)"
      );
      #endif
    }
  };
  
  var _headerTopPadding = HeaderHeightConfig(preset: .safeArea);
  @objc var headerTopPadding: NSDictionary? {
    willSet {
      guard self.headerTopPadding != newValue else { return };
      
      self._headerTopPadding = {
        guard let dict   = newValue,
              let config = HeaderHeightConfig(dict: dict)
        else {
          return HeaderHeightConfig(preset: .safeArea)
        };
        
        return config;
      }();
      
      #if DEBUG
      print("LOG - RNINavigatorRouteHeaderView: didSet"
        + " - headerTopPadding: \(self._headerTopPadding)"
        + " - newValue: \(String(describing: newValue))"
      );
      #endif
      
      self.refreshHeaderTopPadding();
    }
  };
  
  // ---------------------
  // MARK:- Init/Lifecycle
  // ---------------------
  
  init(bridge: RCTBridge) {
    super.init(frame: .zero);
    
    self.bridge = bridge;
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  override func reactSetFrame(_ frame: CGRect) {
    guard !self.didSetInitialSize,
          let parentRouteView = RNIUtilities.getParent(
            responder: self,
            type: RNINavigatorRouteView.self
          ),
          let parentRouteVC = parentRouteView.routeVC
    else { return };
    
    self.didSetInitialSize = true;
    
    self.routeView = parentRouteView;
    self.routeViewController = parentRouteVC;
    
    parentRouteView.reactRouteHeader = self;
    
    let initialWidth: CGFloat! =
      parentRouteView.navigatorView!.frame.width;
    
    let initialHeight: CGFloat! =
      self.headerConfig.getExpandedHeight(viewController: parentRouteVC);
    
    let newSize = CGSize(width: initialWidth, height: initialHeight);
    
    // set the initial size of the header view...
    super.reactSetFrame(
      CGRect(origin: frame.origin, size: newSize)
    );
    
    // notify ui manager that the bounds have changed...
    self.notifyForBoundsChange(
      CGRect(origin: .zero, size: newSize)
    );
    
    // and force "update".
    self.layoutSubviews();
    
    #if DEBUG
    print("LOG - NativeView, RNINavigatorRouteHeaderView"
      + " - reactSetFrame"
      + " - args, frame: \(frame.debugDescription)"
      + " - newSize: \(newSize.debugDescription)"
    );
    #endif
  };
  
  // -------------------------
  // MARK:- Internal Functions
  // -------------------------

  func notifyForBoundsChange(_ newBounds: CGRect){
    guard let bridge = self.bridge else { return };
    
    bridge.uiManager.setSize(newBounds.size, for: self);
  };
  
  /// TODO (006): Refactor - use view controller containment/child vc so that we don't
  /// have to call `setup` on the parent vc's `loadView`, or perform layout updates
  /// on the parent vc's `willLayoutSubviews`
  func setup() {
    
    guard let navController = self.navigationController,
          let wrapperView   = self.wrapperView
    else { return };
    
    self.didTriggerSetup = true;
    self.refreshHeaderTopPadding();
    
    /// NOTE:
    /// `setup` is called on `loadView` in the parent route vc, but during that
    /// time the safe area insets haven't been set yet, so we'll use the nav.
    /// controller for `getHeight` so it can get the safe area insets.
    
    switch self.headerConfig {
      case let .fixed(height: heightConfig):
        let presetHeight =
          heightConfig.preset.getHeight(viewController: navController);

        self.setWrapperViewInsets(
          headerHeight: presetHeight + heightConfig.offset,
          updateScrollOffsets: true
        );
        
      case let.resize(minHeight: _, maxHeight: maxHeightConfig):
        guard case let .reactScrollView(reactScrollView) = wrapperView
        else { break };
        
        reactScrollView.addScrollListener(self);
        
        let presetMaxHeight =
          maxHeightConfig.preset.getHeight(viewController: navController);
        
        self.setWrapperViewInsets(
          headerHeight: presetMaxHeight + maxHeightConfig.offset,
          updateScrollOffsets: true
        );
    };
  };

  func refreshHeaderTopPadding(){
    guard let navigatorVC = self.navigationController else { return };
    
    let insets = navigatorVC.synthesizedSafeAreaInsets;
    
    let presetHeight =
      self._headerTopPadding.preset.getHeight(viewController: navigatorVC);
    
    let totalHeight = presetHeight + self._headerTopPadding.offset;
    
    let localData = RNINavigatorRouteHeaderShadowView.RouteHeaderLocalData();
    localData.insets = UIEdgeInsets(
      top   : totalHeight,
      left  : insets.left,
      bottom: 0,
      right : insets.right
    );
    
    #if DEBUG
    print("LOG - RNINavigatorRouteHeaderView: refreshHeaderTopPadding"
      + " - headerTopPadding: \(self._headerTopPadding)"
      + " - height: \(presetHeight)"
      + " - height: \(totalHeight)"
      + " - insets: \(insets)"
    );
    #endif
    
    self.bridge.uiManager.setLocalData(localData, for: self);
  };
  
  func refreshHeaderHeight(){
    guard let routeVC = self.routeViewController,
          self.didSetInitialSize
    else { return };
    
    switch self.headerConfig {
      case let .fixed(height: heightConfig):
        let presetHeight =
          heightConfig.preset.getHeight(viewController: routeVC);

        self.setWrapperViewInsets(
          headerHeight: presetHeight + heightConfig.offset,
          updateScrollOffsets: false
        );
        
      case let .resize(minHeight: _, maxHeight: maxHeightConfig):
        guard case let .reactScrollView(view: reactScrollView) = self.wrapperView
        else { return };
        
        let presetMaxHeight =
          maxHeightConfig.preset.getHeight(viewController: routeVC);
        
        self.setWrapperViewInsets(
          headerHeight: presetMaxHeight + maxHeightConfig.offset,
          updateScrollOffsets: false
        );
        
        self.scrollViewDidScroll(reactScrollView.scrollView);
    };
  };
  
  private func setWrapperViewInsets(
    headerHeight: CGFloat,
    updateScrollOffsets: Bool
  ){
    guard let routeVC = self.routeViewController,
          let navigatorView = routeVC.routeView.navigatorView
    else { return };
    
    let safeAreaInsets = navigatorView.navigationVC.synthesizedSafeAreaInsets;
    
    switch self.wrapperView  {
      case let .reactScrollView(reactScrollView):
        guard let scrollView = reactScrollView.scrollView else { break };
        
        if #available(iOS 11.0, *) {
          reactScrollView.insetsLayoutMarginsFromSafeArea = false;
          scrollView.contentInsetAdjustmentBehavior = .never;
        };
        
        if #available(iOS 13.0, *) {
          scrollView.automaticallyAdjustsScrollIndicatorInsets = true;
        };
        
        reactScrollView.automaticallyAdjustContentInsets = false;
        
        let headerInset = UIEdgeInsets(
          top: headerHeight, left: 0, bottom: safeAreaInsets.bottom, right: 0
        );
        
        reactScrollView.contentInset = headerInset;
        
        scrollView.scrollIndicatorInsets = headerInset;
        
        if(updateScrollOffsets){
          scrollView.contentOffset = CGPoint(x: 0, y: -headerHeight);
        };
        
      default:
        if #available(iOS 11.0, *) {
          let navBarHeight = routeVC.navBarWithStatusBarHeight;
          let topInset = headerHeight - navBarHeight;
          
          routeVC.additionalSafeAreaInsets =
            UIEdgeInsets(top: topInset, left: 0, bottom: 0, right: 0);
        };
    }
  };

  func refreshLayoutSize(){
    guard let routeVC = self.routeViewController,
          let navigationBar = routeVC.navigationController?.navigationBar
    else { return };
    
    self.notifyForBoundsChange(CGRect(
      origin: .zero,
      size: CGSize(
        width: navigationBar.frame.width,
        height: self.bounds.height
      )
    ));
  };
};

// ---------------------------
// MARK:- UIScrollViewDelegate
// ---------------------------

extension RNINavigatorRouteHeaderView: UIScrollViewDelegate {
  
  func scrollViewDidScroll(_ scrollView: UIScrollView) {
    guard let routeVC = self.routeViewController,
          let navigationBar = routeVC.navigationController?.navigationBar,
          case let .resize(
            minHeight: minHeightConfig,
            maxHeight: maxHeightConfig
          ) = self.headerConfig
    else { return };
    
    let presetHeaderHeightMin =
      minHeightConfig.preset.getHeight(viewController: routeVC);
    
    let presetHeaderHeightMax =
      maxHeightConfig.preset.getHeight(viewController: routeVC);
    
    let headerHeightMin = presetHeaderHeightMin + minHeightConfig.offset;
    let headerHeightMax = presetHeaderHeightMax + maxHeightConfig.offset;
    
    let scrollY    = scrollView.contentOffset.y;
    let scrollYAdj = scrollY + headerHeightMax;
    
    /// the `scrollY` that triggers the transition from A -> B
    /// e.g. header expanded -> header collapsed
    let offsetBEnd = headerHeightMax - headerHeightMin;
    
    let newHeaderHeight: CGFloat = {
      if scrollYAdj <= 0 {
        /// A: over-scrolling to top, make header bigger
        /// compute next height for header based on the current `scrollY`
        return abs(scrollYAdj) + headerHeightMax;
        
      } else if scrollYAdj <= offsetBEnd {
        /// B: transitioning between header expanded and collapsed
        /// compute next height for header based on the current `scrollY`
        return headerHeightMax - scrollYAdj;
      };
      
      /// C: header is now fully collapsed
      return headerHeightMin;
    }();
    
    let navBarWidth   = navigationBar.frame.width;
    let newHeaderSize = CGSize(width: navBarWidth, height: newHeaderHeight);

    // update react layout
    self.notifyForBoundsChange(
      CGRect(origin: .zero, size: newHeaderSize)
    );
  };
};
