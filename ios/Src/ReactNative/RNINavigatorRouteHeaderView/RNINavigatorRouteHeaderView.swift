//
//  RNINavigatorRouteHeaderView.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 4/14/21.
//

import Foundation

internal class RNINavigatorRouteHeaderView: RNIWrapperView {
  
  struct RouteHeaderConfig {
    enum HeaderHeight {
      case navigationBar;
      case custom(height: CGFloat);
      
      func getHeight(viewController: UIViewController) -> CGFloat {
        switch self {
          case let .custom(height):
            return height;
            
          case .navigationBar:
            return viewController.navBarWithStatusBarHeight;
        };
      };
    };
    
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
      guard let dict = dict,
            let value = dict["headerHeight"]
      else { return `default` ?? .navigationBar };
      
      if let string = value as? String, string == "navigationBar" {
        return .navigationBar;
        
      } else if let number = value as? NSNumber {
        return .custom(height: CGFloat(truncating: number));
      };
      
      return `default` ?? .navigationBar;
    };
  };
  
  /// Ref. to the parent react route vc
  weak var routeViewController: RNINavigatorReactRouteViewController?;
  
  var headerHeightConstraint: NSLayoutConstraint!;
  
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
  
  @objc var applySafeAreaTopPadding = true {
    didSet {
      self.setSafeAreaInsets();
    }
  };
  
  override init(bridge: RCTBridge) {
    super.init(bridge: bridge);
    
    self.autoCleanupOnJSUnmount = true;
    self.autoSetSizeOnLayout = false;
    self.isWrapperView = false;
  };
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented");
  };
  
  // add additional cleanup
  override func cleanup() {
    super.cleanup();
  };
  
  func setup(
    rootView: UIView,
    wrapperView: RNINavigatorReactRouteViewController.RouteContentWrapper
  ){
    guard self.headerConfig.headerMode == .resize,
          let routeVC = self.routeViewController,
          let headerHeightMax = self.headerConfig
            .headerHeightMax?.getHeight(viewController: routeVC)
    else { return };
    
    switch wrapperView {
      case let .reactScrollView(view: reactScrollView):
        reactScrollView.addScrollListener(self);
        guard let scrollView = reactScrollView.scrollView else { break };
        
        
        reactScrollView.automaticallyAdjustContentInsets = false;
        
        if #available(iOS 11.0, *) {
          reactScrollView.insetsLayoutMarginsFromSafeArea = false;
          scrollView.contentInsetAdjustmentBehavior = .never;
        };
        
        if #available(iOS 13.0, *) {
          scrollView.automaticallyAdjustsScrollIndicatorInsets = false;
        };
        
        let headerInset = UIEdgeInsets(top: headerHeightMax, left: 0, bottom: 0, right: 0);
        reactScrollView.contentInset = headerInset;
        
        scrollView.scrollIndicatorInsets = headerInset;
        scrollView.contentOffset = CGPoint(x: 0, y: -headerHeightMax);
        
        // insert the header into the route view
        rootView.addSubview(self);
        
        // use auto layout
        self.translatesAutoresizingMaskIntoConstraints = false;
        scrollView.translatesAutoresizingMaskIntoConstraints = false;
        
        self.headerHeightConstraint =
          self.heightAnchor.constraint(equalToConstant: headerHeightMax);
        
        NSLayoutConstraint.activate([
          // pin
          scrollView.topAnchor     .constraint(equalTo: rootView.topAnchor     ),
          scrollView.bottomAnchor  .constraint(equalTo: rootView.bottomAnchor  ),
          scrollView.leadingAnchor .constraint(equalTo: rootView.leadingAnchor ),
          scrollView.trailingAnchor.constraint(equalTo: rootView.trailingAnchor),
        
          //
          self.headerHeightConstraint,
          self.leadingAnchor .constraint(equalTo: rootView.leadingAnchor ),
          self.trailingAnchor.constraint(equalTo: rootView.trailingAnchor),
          self.topAnchor     .constraint(equalTo: rootView.topAnchor     ),
        ]);
                
        let navigationBarFrame = routeVC.navigationController!.navigationBar.frame;
        self.notifyForBoundsChange(
          CGRect(
            origin: self.frame.origin,
            size: CGSize(width: navigationBarFrame.width, height: headerHeightMax)
          )
        );
        
        self.setSafeAreaInsets();
        
      default: break;
    };
  };


  func setSafeAreaInsets(){
    guard self.window != nil && !self.didTriggerCleanup,
          let routeVC = self.routeViewController
    else { return };
    
    let statusBarHeight = routeVC.statusBarHeight;

    let localData = RNINavigatorRouteHeaderShadowView.RouteHeaderLocalData();
    if self.applySafeAreaTopPadding {
      localData.insets = UIEdgeInsets(top: statusBarHeight, left: 0, bottom: 0, right: 0);
    };
    
    self.bridge.uiManager.setLocalData(localData, for: self);
  };
};

extension RNINavigatorRouteHeaderView: UIScrollViewDelegate {
  func scrollViewDidScroll(_ scrollView: UIScrollView) {
    guard let routeVC = self.routeViewController,
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
    
    let newHeaderSize = CGSize(width: self.frame.width, height: newHeaderHeight);
    
    // adjust header height
    self.headerHeightConstraint?.constant = newHeaderHeight;
    
    // update react layout
    self.notifyForBoundsChange(
      CGRect(origin: .zero, size: newHeaderSize)
    );

    print("LOG - RNINavigatorReactRouteViewController"
      + " - scrollY: \(scrollY)"
      + " - scrollYAdj: \(scrollYAdj)"
    );
  };
};
