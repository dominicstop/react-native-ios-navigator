//
//  RNINavigatorManager.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/23/21.
//

import Foundation

/// This is singleton class for interacting + configuring the `RNINavigatorView`
public class RNINavigatorManager {
  
  public static let sharedInstance = RNINavigatorManager();
  
  /// The "native" routes to be used in the `NavigatorView`.
  @objc public static var routeRegistry: [String: RNINavigatorRouteBaseViewController.Type] = [:];
  
  /// Contains a map of all the active `RNINavigatorView` instances in the app
  /// (usually there's only 1 navigator for the entire app).
  private var navigatorViewInstances = NSMapTable<NSNumber, RNINavigatorView>.init(
    keyOptions: .copyIn,
    valueOptions: .weakMemory
  );
  
  private var didTriggerSwizzleRootViewController = false;
  private var didTriggerSetRootViewControllerBackground = false;
  
  // ---------------------
  // MARK:- Public Methods
  // ---------------------
  
  public var delegate: RNINavigatorManagerDelegate?;
  
  public func getNavigatorViewInstances() -> Array<RNINavigatorView> {
    guard let enumerator = self.navigatorViewInstances.objectEnumerator()
    else { return [] };
    
    #if DEBUG
    print("LOG - RNINavigatorManager: getNavigatorViewInstances"
      + " - enumerator: \(enumerator.underestimatedCount)"
    );
    #endif
    
    return enumerator.compactMap {
      $0 as? RNINavigatorView;
    };
  };
  
  public func getNavigatorViewInstance(forNavigatorID key: Int) -> RNINavigatorView? {
    return self.navigatorViewInstances.object(forKey: key as NSNumber);
  };
  
  // -----------------------
  // MARK:- Internal Methods
  // -----------------------
  
  internal func registerNavigatorView(
    _ instance: RNINavigatorView,
    forNavigatorID navigatorID: NSNumber
  ){
    self.navigatorViewInstances.setObject(instance, forKey: navigatorID);
    self.delegate?.onNavigatorViewAdded(instance, navigatorID.intValue);
    
    #if DEBUG
    print("LOG - RNINavigatorManager: registerNavigatorView"
      + " - for navigatorID: \(navigatorID)"
      + " - instance count: \(self.navigatorViewInstances.count)"
    );
    #endif
  };
  
  internal func cleanup(){
    for navigatorView in self.getNavigatorViewInstances() {
      navigatorView.cleanup();
    };
  };
  
  internal func swizzleRootViewController(for window: UIWindow){
    guard !self.didTriggerSwizzleRootViewController,
          // don't swizzle if the root view controller is already a `RNIRootViewController`
          !(window.rootViewController is RNIRootViewController)
    else { return };
    
    self.didTriggerSwizzleRootViewController = true;
    
    let baseClass   : AnyClass = UIViewController.self;
    let baseSelector: Selector = #selector(getter: UIViewController.childForStatusBarStyle);
    let baseMethod  : Method?  = class_getInstanceMethod(baseClass, baseSelector);
    
    let replacementClass   : AnyClass = RNIRootViewController.self;
    let replacementSelector: Selector = #selector(getter: RNIRootViewController.childForStatusBarStyle);
    let replacementMethod  : Method?  = class_getInstanceMethod(replacementClass, replacementSelector);
    
    // replace the root view controller's default `childForStatusBarStyle` impl.
    if let originalMethod = baseMethod,
       let swizzledMethod = replacementMethod {
      
      method_exchangeImplementations(originalMethod, swizzledMethod);
    };
    
    #if DEBUG
    print("LOG - RNINavigatorManager: swizzleRootViewController"
      + " - has baseMethod: \(baseMethod != nil)"
      + " - has swizzledMethod: \(replacementMethod != nil)"
    );
    #endif
  };
  
  internal func setRootViewControllerBackground(for window: UIWindow){
    guard !self.didTriggerSetRootViewControllerBackground,
          let rootVC = window.rootViewController
    else { return };
    
    self.didTriggerSetRootViewControllerBackground = true;
    
    if #available(iOS 13.0, *) {
      rootVC.view.backgroundColor = .systemBackground
    };
  };
};

// ----------------------------------
// MARK:- RNINavigatorManagerDelegate
// ----------------------------------

public protocol RNINavigatorManagerDelegate {
  func onNavigatorViewAdded(_ navigatorView: RNINavigatorView, _ navigatorID: Int);
};
