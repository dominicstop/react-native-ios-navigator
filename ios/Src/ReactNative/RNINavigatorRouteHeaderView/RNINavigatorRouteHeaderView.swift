//
//  RNINavigatorRouteHeaderView.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 4/14/21.
//

import Foundation


// TODO: Create new class `RNINativeManagedView` to replace `RNIWrapperView` w/
//       `isWrapperView = false`.
internal class RNINavigatorRouteHeaderView: RNIWrapperView {
  
  // ---------------------
  // MARK:- Embedded Types
  // ---------------------
  
  enum HeaderHeight: Equatable {
    case navigationBar;
    case statusBar;
    case navigationBarWithStatusBar;
    case safeArea;
    case none;
    
    case custom(height: CGFloat);
    
    func getHeight(viewController: UIViewController) -> CGFloat {
      switch self {
        case let .custom(height): return height;
          
        case .navigationBar             : return viewController.navBarHeight;
        case .statusBar                 : return viewController.statusBarHeight;
        case .safeArea                  : return viewController.synthesizedSafeAreaInsets.top;
        case .navigationBarWithStatusBar: return viewController.navBarWithStatusBarHeight;
        case .none                      : return 0;
      };
    };
    
    static func fromString(_ string: String) -> HeaderHeight? {
      switch string {
        case "navigationBar"             : return .navigationBar;
        case "statusBar"                 : return .statusBar;
        case "safeArea"                  : return .safeArea;
        case "navigationBarWithStatusBar": return .navigationBarWithStatusBar;
        case "none"                      : return HeaderHeight.none;
        
        default: return nil;
      }
    };
    
    static func fromAnyObject(_ value: Any) -> HeaderHeight? {
      if let string = value as? String,
         let mode   = Self.fromString(string) {
        
        return mode;
        
      } else if let number = value as? NSNumber {
        return .custom(height: CGFloat(truncating: number));
      };
      
      return nil;
    };
  };
  
  struct RouteHeaderConfig {
    
    enum HeaderMode: String {
      case fixed;
      case resize;
    };
    
    let headerMode: HeaderMode;
    let headerHeight: HeaderHeight?;
    
    let headerHeightMin: HeaderHeight?;
    let headerHeightMax: HeaderHeight?;
    
    init(dict: NSDictionary?) {
      self.headerMode = {
        guard let string = dict?["headerMode"] as? String,
              let mode   = HeaderMode(rawValue: string)
        else { return .fixed };
        
        return mode;
      }();
      
      switch self.headerMode {
        case .fixed:
          self.headerHeight = Self.extractHeight(dict, key: "headerHeight");
          
          self.headerHeightMin = nil;
          self.headerHeightMax = nil;
          
        case .resize:
          self.headerHeightMin = Self.extractHeight(dict, key: "headerHeightMin");
          self.headerHeightMax = Self.extractHeight(dict,
            key: "headerHeightMax",
            default: .custom(height: 200)
          );
          
          self.headerHeight = nil;
      };
    };
    
    private static func extractHeight(
      _ dict: NSDictionary?,
      key: String,
      default: HeaderHeight? = nil
    ) -> HeaderHeight? {
      guard let value = dict?[key] else {
        return `default` ?? .safeArea;
      };
      
      return HeaderHeight.fromAnyObject(value)
        ?? `default` ?? .safeArea;
    };
  };
  
  // -----------------
  // MARK:- Properties
  // -----------------
  
  /// Ref. to the parent route view
  weak var routeView: RNINavigatorRouteView?;
  
  /// Ref. to the parent react route vc
  weak var routeViewController: RNINavigatorReactRouteViewController?;
  
  var wrapperView: RNINavigatorReactRouteViewController.RouteContentWrapper? {
    self.routeViewController?.wrapperView
  };
  
  var headerHeightConstraint: NSLayoutConstraint!;
  
  var headerInitialSize: CGSize? {
    guard let routeVC = self.routeViewController,
          let navigationBar = routeVC.navigationController?.navigationBar,
          let height =
            self.headerConfig.headerHeightMax?.getHeight(viewController: routeVC) ??
            self.headerConfig.headerHeight?   .getHeight(viewController: routeVC)
    else { return nil };
    
    return CGSize(
      width: navigationBar.frame.width,
      height: height
    );
  };
  
  private var didTriggerSetup = false;
  private var didSetInitialSize = false;
  
  // ------------------------
  // MARK:- RN Exported Props
  // ------------------------
  
  private var headerConfig = RouteHeaderConfig(dict: nil);
  @objc var config: NSDictionary? {
    willSet {
      guard self.config != newValue else { return };
      
      self.headerConfig = RouteHeaderConfig(dict: newValue);
      #if DEBUG
      print("LOG - RNINavigatorRouteHeaderView: didSet"
        + " - headerMode: \(self.headerConfig.headerMode)"
      );
      #endif
    }
  };
  
  var _headerTopPadding: HeaderHeight = .safeArea;
  @objc var headerTopPadding: NSString? {
    willSet {
      guard self.headerTopPadding != newValue else { return };
      
      self._headerTopPadding = {
        guard let string = newValue as String?,
              let height = HeaderHeight.fromString(string)
        else { return .statusBar };
        
        return height;
      }();
      
      #if DEBUG
      print("LOG - RNINavigatorRouteHeaderView: didSet"
        + " - headerTopPadding: \(self._headerTopPadding)"
        + " - newValue: \(newValue ?? "N/A")"
      );
      #endif
      
      self.refreshHeaderTopPadding();
    }
  };
  
  // ---------------------
  // MARK:- Init/Lifecycle
  // ---------------------
  
  override init(bridge: RCTBridge) {
    super.init(bridge: bridge);
    
    self.isWrapperView = false;
    self.autoSetSizeOnLayout = false;
    self.autoCleanupOnJSUnmount = false;
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  override func reactSetFrame(_ frame: CGRect) {
     guard !self.didSetInitialSize,
           let initialSize = self.headerInitialSize
     else { return };
       
     self.didSetInitialSize = true;
   
     super.reactSetFrame(CGRect(
        origin: .zero,
        size: initialSize
     ));
   };
  
  // -------------------------
  // MARK:- Internal Functions
  // -------------------------
  
  /// TODO: Refactor - use view controller containment/child vc so that we don't
  /// have to call `setup` on the parent vc's `loadView`, or perform layout updates
  /// on the parent vc's `willLayoutSubviews`
  func setup(rootView: UIView) {
    guard !self.didTriggerSetup,
          let routeVC = self.routeViewController,
          let wrapperView = self.wrapperView
    else { return };
    
    self.didTriggerSetup = true;
    
    self.refreshHeaderTopPadding();
    switch self.headerConfig.headerMode {
      case .fixed:
        guard let headerHeightMode = self.headerConfig.headerHeight else { break };
        let headerHeight = headerHeightMode.getHeight(viewController: routeVC);

        self.setWrapperViewInsets(headerHeight: headerHeight);
        
        // insert the header into the route view
        rootView.addSubview(self);
        self.translatesAutoresizingMaskIntoConstraints = false;
        
        NSLayoutConstraint.activate([
          self.heightAnchor  .constraint(equalToConstant: headerHeight   ),
          self.leadingAnchor .constraint(equalTo: rootView.leadingAnchor ),
          self.trailingAnchor.constraint(equalTo: rootView.trailingAnchor),
          self.topAnchor     .constraint(equalTo: rootView.topAnchor     ),
        ]);
        
        let navigationBarFrame = routeVC.navigationController!.navigationBar.frame;
        self.notifyForBoundsChange(
          CGRect(
            origin: .zero,
            size: CGSize(width: navigationBarFrame.width, height: headerHeight)
          )
        );
        
      case .resize:
        guard case let .reactScrollView(reactScrollView) = wrapperView,
              let headerHeightMaxMode = self.headerConfig.headerHeightMax
        else { break };
        
        reactScrollView.addScrollListener(self);
        
        let headerHeightMax = headerHeightMaxMode.getHeight(viewController: routeVC);
        self.setWrapperViewInsets(headerHeight: headerHeightMax);
        
        // insert the header into the route view
        rootView.addSubview(self);
        
        // use auto layout
        self.translatesAutoresizingMaskIntoConstraints = false;
       
        
        self.headerHeightConstraint =
          self.heightAnchor.constraint(equalToConstant: headerHeightMax);
        
        NSLayoutConstraint.activate([
          self.headerHeightConstraint,
          self.leadingAnchor .constraint(equalTo: rootView.leadingAnchor ),
          self.trailingAnchor.constraint(equalTo: rootView.trailingAnchor),
          self.topAnchor     .constraint(equalTo: rootView.topAnchor     ),
        ]);
                
        let navigationBarFrame = routeVC.navigationController!.navigationBar.frame;
        self.notifyForBoundsChange(
          CGRect(
            origin: .zero,
            size: CGSize(width: navigationBarFrame.width, height: headerHeightMax)
          )
        );
    };
  };

  func refreshHeaderTopPadding(){
    guard !self.didTriggerCleanup,
          let routeVC = self.routeViewController
    else { return };
    
    let height = self._headerTopPadding.getHeight(viewController: routeVC);
    
    let localData = RNINavigatorRouteHeaderShadowView.RouteHeaderLocalData();
    localData.insets = UIEdgeInsets(top: height, left: 0, bottom: 0, right: 0);
    
    #if DEBUG
    print("LOG - RNINavigatorRouteHeaderView: refreshHeaderTopPadding"
      + " - headerTopPadding: \(self._headerTopPadding)"
      + " - height: \(height)"
    );
    #endif
    
    self.bridge.uiManager.setLocalData(localData, for: self);
  };
  
  func setWrapperViewInsets(headerHeight: CGFloat){
    guard let routeVC = self.routeViewController else { return };
    
    switch self.wrapperView  {
      case let .reactScrollView(reactScrollView):
        guard let scrollView = reactScrollView.scrollView else { break };
        
        if #available(iOS 11.0, *) {
          reactScrollView.insetsLayoutMarginsFromSafeArea = false;
          scrollView.contentInsetAdjustmentBehavior = .never;
        };
        
        if #available(iOS 13.0, *) {
          scrollView.automaticallyAdjustsScrollIndicatorInsets = false;
        };
        
        reactScrollView.automaticallyAdjustContentInsets = false;
        
        let headerInset = UIEdgeInsets(top: headerHeight, left: 0, bottom: 0, right: 0);
        reactScrollView.contentInset = headerInset;
        
        scrollView.scrollIndicatorInsets = headerInset;
        scrollView.contentOffset = CGPoint(x: 0, y: -headerHeight);
        
      default:
        if #available(iOS 11.0, *) {
          let navBarHeight = routeVC.navBarWithStatusBarHeight;
          let topInset = headerHeight - navBarHeight;
          
          routeVC.additionalSafeAreaInsets =
            UIEdgeInsets(top: topInset, left: 0, bottom: 0, right: 0)
        };
    }
  };
  
  func setInitialLayoutSize(){
    guard let initialSize = self.headerInitialSize else { return };
  
    self.notifyForBoundsChange(CGRect(
      origin: .zero,
      size: initialSize
    ));
  };
  
  func refreshLayoutSize(){
    guard let routeVC = self.routeViewController,
          let navigationBar = routeVC.navigationController?.navigationBar
    else { return };
    
    if !self.didSetInitialSize,
        let height =
          self.headerConfig.headerHeightMax?.getHeight(viewController: routeVC) ??
          self.headerConfig.headerHeight?   .getHeight(viewController: routeVC) {
      
      self.didSetInitialSize = true;
      let navBarWidth = navigationBar.frame.width;
      
      self.notifyForBoundsChange(CGRect(
        origin: .zero,
        size: CGSize(width: navBarWidth, height: height)
      ));
      
      self.layoutSubviews();
      
    } else {
      self.notifyForBoundsChange(CGRect(
        origin: .zero,
        size: CGSize(
          width: navigationBar.frame.width,
          height: self.bounds.height
        )
      ));
    };
  };
};

// ---------------------------
// MARK:- UIScrollViewDelegate
// ---------------------------

extension RNINavigatorRouteHeaderView: UIScrollViewDelegate {
  
  func scrollViewDidScroll(_ scrollView: UIScrollView) {
    guard let routeVC = self.routeViewController,
          let navigationBar = routeVC.navigationController?.navigationBar,
          let headerHeightMin = self.headerConfig.headerHeightMin?.getHeight(viewController: routeVC),
          let headerHeightMax = self.headerConfig.headerHeightMax?.getHeight(viewController: routeVC)
    else { return };
    
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
    
    // adjust header height
    self.headerHeightConstraint?.constant = newHeaderHeight;
    
    // update react layout
    self.notifyForBoundsChange(
      CGRect(origin: .zero, size: newHeaderSize)
    );
  };
};
