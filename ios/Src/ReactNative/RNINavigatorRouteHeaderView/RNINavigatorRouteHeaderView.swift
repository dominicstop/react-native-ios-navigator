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
  weak var headerVC: RNINavigatorRouteHeaderViewController?;
  
  var headerHeightConstraint: NSLayoutConstraint!;
  
  var headerInitialSize: CGSize? {
    guard let headerVC = self.headerVC,
          let navigationBar = headerVC.navigationController?.navigationBar,
          let height =
            self.headerConfig.headerHeightMax?.getHeight(viewController: headerVC) ??
            self.headerConfig.headerHeight?   .getHeight(viewController: headerVC)
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
  
  var headerConfig = RouteHeaderConfig(dict: nil);
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
  
    self.notifyForBoundsChange(CGRect(
      origin: frame.origin,
      size: initialSize
    ));
  };
  
  // -------------------------
  // MARK:- Internal Functions
  // -------------------------


  func refreshHeaderTopPadding(){
    guard !self.didTriggerCleanup,
          let headerVC = self.headerVC
    else { return };
    
    let height = self._headerTopPadding.getHeight(viewController: headerVC);
    
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
  
  func refreshLayoutSize(){
    guard let headerVC = self.headerVC,
          let navigationBar = headerVC.navigationController?.navigationBar
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
