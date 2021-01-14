//
//  UINavigationController+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/8/21.
//

extension UINavigationController {
  
  public func pushViewController(
    _ viewController: UIViewController,
    animated        : Bool,
    completion      : @escaping () -> Void
  ) {

    self.pushViewController(viewController, animated: animated);
    
    // get the transition coordinator
    guard animated, let coordinator = self.transitionCoordinator else {
      // vc not animated
      DispatchQueue.main.async { completion() };
      return;
    };
    
    coordinator.animate(alongsideTransition: nil) { _ in
      // when the transition is finished, call completion
      completion();
    };
  };

  func popViewController(
    animated  : Bool,
    completion: @escaping () -> Void
  ) {

    self.popViewController(animated: animated);
    
    // get the transition coordinator
    guard animated, let coordinator = transitionCoordinator else {
      // vc not animated, call completion
      DispatchQueue.main.async { completion() };
      return;
    };

    coordinator.animate(alongsideTransition: nil) { _ in
      // when the transition is finished, call completion
      completion();
    };
  };
  
  public func setNavigationBarHidden(
    _ hidden  : Bool,
    animated  : Bool,
    completion: @escaping () -> Void
  ) {
    if animated {
      CATransaction.begin();
      CATransaction.setCompletionBlock { completion() };
      
      self.setNavigationBarHidden(hidden, animated: animated);
      CATransaction.commit()
      
    } else {
      self.setNavigationBarHidden(hidden, animated: animated);
      completion();
    };
  };
};
