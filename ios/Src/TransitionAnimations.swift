//
//  TransitionAnimations.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/28/21.
//

import UIKit;

class CustomAnimator: NSObject, UIViewControllerAnimatedTransitioning {

  let duration: TimeInterval;
  var interactionController: UIPercentDrivenInteractiveTransition?;
  
  init(duration: TimeInterval = 0.25) {
    self.duration = duration;
    super.init();
  };
  
  func transitionDuration(using transitionContext: UIViewControllerContextTransitioning?) -> TimeInterval {
    return self.duration;
  };
  
  func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    fatalError("You have to implement this method for yourself!");
  };
};

class LeftEdgeInteractionController: UIPercentDrivenInteractiveTransition {
    
  var inProgress = false;

  private var shouldCompleteTransition = false;
  private weak var viewController: UIViewController!;
    
  public init(viewController: UIViewController) {
    super.init();

    self.viewController = viewController;
    self.setupGestureRecognizer(in: viewController.view);
  };
  
  private func setupGestureRecognizer(in view: UIView) {
    let edge = UIScreenEdgePanGestureRecognizer(
      target: self,
      action: #selector(self.handleEdgePan(_:))
    );
    
    edge.edges = .left;
    view.addGestureRecognizer(edge);
  };
  
  @objc func handleEdgePan(_ gesture: UIScreenEdgePanGestureRecognizer) {
    let translate = gesture.translation(in: gesture.view);
    let percent = translate.x / gesture.view!.bounds.size.width;
      
    switch gesture.state {
      case .began:
        self.inProgress = true;
        
        if let navigationController = viewController.navigationController {
          navigationController.popViewController(animated: true);
          return;
        };
        
        viewController.dismiss(animated: true, completion: nil);
        
      case .changed:
          self.update(percent);
        
      case .cancelled:
          self.inProgress = false;
          self.cancel();
        
      case .ended:
          self.inProgress = false;

          let velocity = gesture.velocity(in: gesture.view);

          if percent > 0.5 || velocity.x > 0 {
            self.finish();
            
          } else {
            self.cancel();
          };
        
      default: break;
    };
  };
};

class FadePushAnimator: CustomAnimator {
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let toViewController = transitionContext.viewController(forKey: .to)
    else { return };
  
    transitionContext.containerView.addSubview(toViewController.view);
    toViewController.view.alpha = 0;

    let duration = self.transitionDuration(using: transitionContext);
    
    UIView.animate(withDuration: duration,
      animations: {
        toViewController.view.alpha = 1;
      
      }, completion: { _ in
        transitionContext.completeTransition(
          !transitionContext.transitionWasCancelled
        );
      }
    );
  };
};

class FadePopAnimator: CustomAnimator {
  
  init(duration: TimeInterval = 0.25, interactionController: UIPercentDrivenInteractiveTransition? = nil){
    super.init(duration: duration);
    self.interactionController = interactionController;
  };
  
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };

    transitionContext.containerView.insertSubview(
      toViewController.view,
      belowSubview: fromViewController.view
    );

    let duration = self.transitionDuration(using: transitionContext);
    
    UIView.animate(withDuration: duration,
      animations: {
        fromViewController.view.alpha = 0;
        
      }, completion: { _ in
        transitionContext.completeTransition(!transitionContext.transitionWasCancelled)
      }
    );
  };
};
