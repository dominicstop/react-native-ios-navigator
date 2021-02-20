//
//  UINavigationController+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/8/21.
//

extension UINavigationController {
  
  fileprivate func addCompletion(
    _ animated: Bool,
    _ completion: @escaping () -> Void
  ) {
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
  
  func pushViewController(
    _ viewController: UIViewController,
    animated        : Bool,
    completion      : @escaping () -> Void
  ) {

    self.pushViewController(viewController, animated: animated);
    self.addCompletion(animated, completion);
  };

  func popViewController(
    animated  : Bool,
    completion: @escaping () -> Void
  ) {

    self.popViewController(animated: animated);
    self.addCompletion(animated, completion);
  };
  
  func setNavigationBarHidden(
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
  
  func popToRootViewController(
    animated  : Bool,
    completion: @escaping () -> Void
  ){
    self.popToRootViewController(animated: animated);
    self.addCompletion(animated, completion);
  };
  };
};
