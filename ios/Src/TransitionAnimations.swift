//
//  TransitionAnimations.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/28/21.
//

import UIKit;

// TODO: Add `isPresenting` so that push and pop can be combined together

internal class CustomAnimator: NSObject, UIViewControllerAnimatedTransitioning {

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

internal class LeftEdgeInteractionController: UIPercentDrivenInteractiveTransition {
    
  var inProgress = false;

  private var shouldCompleteTransition = false;
  private weak var viewController: UIViewController!;
    
  public init(viewController: UIViewController) {
    super.init();

    self.viewController = viewController;
    self.setupGestureRecognizer();
  };
  
  func setupGestureRecognizer() {
    let swipeBackGesture = UIScreenEdgePanGestureRecognizer(
      target: self,
      action: #selector(self.handleEdgePan(_:))
    );
    
    swipeBackGesture.edges = .left;
    self.viewController.view.addGestureRecognizer(swipeBackGesture);
  };
  
  @objc func handleEdgePan(_ gesture: UIScreenEdgePanGestureRecognizer) {
    let translate = gesture.translation(in: gesture.view!.superview!);
    let percent = translate.x / gesture.view!.bounds.size.width;
      
    switch gesture.state {
      case .began:
        self.inProgress = true;
        
        if let navigationController = self.viewController.navigationController {
          navigationController.popViewController(animated: true);
          return;
        };
        
        self.viewController.dismiss(animated: true, completion: nil);
        
      case .changed:
        self.shouldCompleteTransition = percent > 0.5;
        self.update(percent);
        
      case .cancelled:
        self.inProgress = false;
        self.cancel();
      
      case .ended:
        self.inProgress = false;

        let velocity = gesture.velocity(in: gesture.view);
        if self.shouldCompleteTransition || velocity.x > 0 {
          self.finish();
          
        } else {
          self.cancel();
        };
        
      default: break;
    };
  };
};


internal class FadePushAnimator: CustomAnimator {
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

internal class FadePopAnimator: CustomAnimator {
  
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


internal class SlidePushAnimator: CustomAnimator {
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };
    
    let toView   = toViewController  .view!;
    let fromView = fromViewController.view!;
    
    let toViewFrame = toView.frame;
  
    transitionContext.containerView.addSubview(toView);
    let duration = self.transitionDuration(using: transitionContext);
    
    // `AnimationOptions` -> `KeyframeAnimationOptions`
    let options: UIView.KeyframeAnimationOptions =
      .init(animationOptions: .curveEaseInOut);
    
    // animation - start values
    toView.alpha = 0.5;
    fromView.alpha = 1;
    
    toView.frame = CGRect(
      origin: CGPoint(
        x: toView.frame.width,
        y: toView.frame.origin.y
      ),
      size: CGSize(
        width : toView.frame.width,
        height: toView.frame.height
      )
    );
    
    // animation - end values
    let animationBlock = {
      UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 0.75) {
        toView.alpha = 1;
        fromView.alpha = 0.75;
      };
      
      UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 1) {
        toView.frame = toViewFrame
        fromView.frame = CGRect(
          origin: CGPoint(
            x: -toView.frame.width,
            y: toView.frame.origin.y
          ),
          size: toView.frame.size
        );
      };
    };
    
    UIView.animateKeyframes(withDuration: duration,
      delay: 0,
      options: options,
      animations: animationBlock,
      completion: { _ in
        // reset alpha
        fromView.alpha = 1;
        
        // finish animation
        transitionContext.completeTransition(
          !transitionContext.transitionWasCancelled
        );
      }
    );
  };
};

internal class SlidePopAnimator: CustomAnimator {
  
  init(duration: TimeInterval = 0.25, interactionController: UIPercentDrivenInteractiveTransition? = nil){
    super.init(duration: duration);
    self.interactionController = interactionController;
  };
  
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };
    
    let toView   = toViewController  .view!;
    let fromView = fromViewController.view!;
    
    let toViewFrame = toView.frame;
    
    // `AnimationOptions` -> `KeyframeAnimationOptions`
    let options: UIView.KeyframeAnimationOptions =
      .init(animationOptions: .curveEaseInOut);
  
    transitionContext.containerView.insertSubview(toView, belowSubview: toView);
    let duration = self.transitionDuration(using: transitionContext);
    
    // animation - start values
    toView.alpha = 0.8;
    fromView.alpha = 1;
    
    toView.frame = CGRect(
      origin: CGPoint(
        x: -toView.frame.width,
        y: toView.frame.origin.y
      ),
      size: CGSize(
        width : toView.frame.width,
        height: toView.frame.height
      )
    );
    
    // animation - end values
    let animationBlock = {
      UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 0.5) {
        toView.alpha = 1;
        fromView.alpha = 0.8;
      };
      
      UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 1) {
        toView.frame = toViewFrame;
        fromView.frame = CGRect(
          origin: CGPoint(
            x: toView.frame.width,
            y: toView.frame.origin.y
          ),
          size: toView.frame.size
        );
      };
    };
    
    UIView.animateKeyframes(withDuration: duration,
      delay: 0,
      options: options,
      animations: animationBlock,
      completion: { _ in
        // reset alpha
        fromView.alpha = 1;
        
        // finish animation
        transitionContext.completeTransition(
          !transitionContext.transitionWasCancelled
        );
      }
    );
  };
};


internal class SlideUpPushAnimator: CustomAnimator {
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };
    
    let toView   = toViewController  .view!;
    let fromView = fromViewController.view!;
    
    let toViewFrame = toView.frame;
  
    transitionContext.containerView.addSubview(toView);
    let duration = self.transitionDuration(using: transitionContext);
    
    // `AnimationOptions` -> `KeyframeAnimationOptions`
    let options: UIView.KeyframeAnimationOptions =
      .init(animationOptions: .curveEaseInOut);
    
    // animation - start values
    toView.alpha = 1;
    fromView.alpha = 1;
    
    toView.frame = CGRect(
      origin: CGPoint(
        x: toView.frame.origin.x,
        y: toView.frame.height
      ),
      size: CGSize(
        width : toView.frame.width,
        height: toView.frame.height
      )
    );
    
    // animation - end values
    let animationBlock = {
      UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 0.75) {
        toView.alpha = 1;
        fromView.alpha = 0.5;
      };
      
      UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 1) {
        toView.frame = toViewFrame;
      };
    };
    
    UIView.animateKeyframes(withDuration: duration,
      delay: 0,
      options: options,
      animations: animationBlock,
      completion: { _ in
        // reset alpha
        fromView.alpha = 1;
        
        // finish animation
        transitionContext.completeTransition(
          !transitionContext.transitionWasCancelled
        );
      }
    );
  };
};

internal class SlideUpPopAnimator: CustomAnimator {
  
  init(duration: TimeInterval = 0.25, interactionController: UIPercentDrivenInteractiveTransition? = nil){
    super.init(duration: duration);
    self.interactionController = interactionController;
  };
  
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };
    
    let toView   = toViewController  .view!;
    let fromView = fromViewController.view!;
    
    // `AnimationOptions` -> `KeyframeAnimationOptions`
    let options: UIView.KeyframeAnimationOptions =
      .init(animationOptions: .curveEaseInOut);
  
    transitionContext.containerView.insertSubview(toView, belowSubview: fromView);
    let duration = self.transitionDuration(using: transitionContext);
    
    // animation - start values
    toView.alpha = 0.5;
    fromView.alpha = 1;
    
    toView.frame = fromView.frame;
    
    // animation - end values
    let animationBlock = {
      UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 0.5) {
        toView.alpha = 1;
        fromView.alpha = 1;
      };
      
      UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 1) {
        fromView.frame = CGRect(
          origin: CGPoint(
            x: fromView.frame.origin.x,
            y: fromView.frame.height
          ),
          size: CGSize(
            width : fromView.frame.width,
            height: fromView.frame.height
          )
        );
      };
    };
    
    UIView.animateKeyframes(withDuration: duration,
      delay: 0,
      options: options,
      animations: animationBlock,
      completion: { _ in
        // reset alpha
        fromView.alpha = 1;
        
        // finish animation
        transitionContext.completeTransition(
          !transitionContext.transitionWasCancelled
        );
      }
    );
  };
};
