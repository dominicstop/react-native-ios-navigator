//
//  TransitionAnimations.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/28/21.
//

import UIKit;

internal class CustomAnimator: NSObject, UIViewControllerAnimatedTransitioning {
  
  let duration: TimeInterval;
  let isPushing: Bool;
  
  var interactionController: UIPercentDrivenInteractiveTransition?;
  
  // Push Transition Animator
  init(duration: TimeInterval = 0.25) {
    self.duration = duration;
    self.isPushing = true;
    
    super.init();
  };
  
  // Pop Transition Animator
  init(duration: TimeInterval = 0.25, interactionController: UIPercentDrivenInteractiveTransition? = nil){
    self.duration = duration;
    self.isPushing = false;
    self.interactionController = interactionController;
    
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

internal class FadeAnimator: CustomAnimator {
  
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };
    
    let duration = self.transitionDuration(using: transitionContext);
    
    let animations: () -> Void = {
      if self.isPushing {
        // fade in `toViewController`
        // start: [A] -> B
        transitionContext.containerView.addSubview(toViewController.view);
        toViewController.view.alpha = 0;
        
        // end
        return {
          toViewController.view.alpha = 1;
        };
        
      } else {
        // fade out `fromViewController`
        // start: A <- [B]
        transitionContext.containerView.insertSubview(
          toViewController.view,
          belowSubview: fromViewController.view
        );
        
        // end
        return {
          fromViewController.view.alpha = 0;
        };
      };
    }();
    
    UIView.animate(withDuration: duration, animations: animations){ _ in
      transitionContext.completeTransition(
        !transitionContext.transitionWasCancelled
      );
    };
  };
};

internal class SlideLeftAnimator: CustomAnimator {
  
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };
    
    let toView   = toViewController  .view!;
    let fromView = fromViewController.view!;
    
    let toViewFrame = toView.frame;
    
    let duration = self.transitionDuration(using: transitionContext);
    
    // `AnimationOptions` -> `KeyframeAnimationOptions`
    let options: UIView.KeyframeAnimationOptions =
      .init(animationOptions: .curveEaseInOut);
    
    let animations: () -> Void = {
      if self.isPushing {
        transitionContext.containerView.addSubview(toView);
        
        // push - transition in `toView`
        // start values: [A] -> B
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
        
        // end of push
        return {
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
        
      } else {
        transitionContext.containerView.insertSubview(toView, belowSubview: toView);
        
        // pop - transition out `fromViewController`
        // start values: A <- [B]
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

        
        // end of pop
        return {
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
      };
    }();
    
    UIView.animateKeyframes(
      withDuration: duration,
      delay: 0,
      options: options,
      animations: animations
    ) { _ in
      // reset alpha
      fromView.alpha = 1;
      
      transitionContext.completeTransition(
        !transitionContext.transitionWasCancelled
      );
    };
  };
};

internal class SlideUpAnimator: CustomAnimator {
  
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };
    
    let toView   = toViewController  .view!;
    let fromView = fromViewController.view!;
    
    let toViewFrame = toView.frame;
    
    let duration = self.transitionDuration(using: transitionContext);
    
    // `AnimationOptions` -> `KeyframeAnimationOptions`
    let options: UIView.KeyframeAnimationOptions =
      .init(animationOptions: .curveEaseInOut);
    
    let animations: () -> Void = {
      if self.isPushing {
        transitionContext.containerView.addSubview(toView);
        
        // push - transition in `toView`
        // start values: [A] -> B
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
        
        // end of push
        return {
          UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 0.75) {
            toView.alpha = 1;
            fromView.alpha = 0.5;
          };
          
          UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 1) {
            toView.frame = toViewFrame;
            fromView.frame = CGRect(
              origin: CGPoint(
                x: fromView.frame.origin.x,
                y: -fromView.frame.height
              ),
              size: CGSize(
                width : fromView.frame.width,
                height: fromView.frame.height
              )
            );
          };
        };
        
      } else {
        transitionContext.containerView.insertSubview(toView, belowSubview: toView);
        
        // pop - transition out `fromViewController`
        // start values: A <- [B]
        toView.alpha = 0.5;
        fromView.alpha = 1;
        
        toView.frame = CGRect(
          origin: CGPoint(
            x: toView.frame.origin.x,
            y: -toView.frame.height
          ),
          size: CGSize(
            width : toView.frame.width,
            height: toView.frame.height
          )
        );

        // end of pop
        return {
          UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 0.5) {
            toView.alpha = 1;
            fromView.alpha = 1;
          };
          
          UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 1) {
            toView.frame = toViewFrame;
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
      };
    }();
    
    UIView.animateKeyframes(
      withDuration: duration,
      delay: 0,
      options: options,
      animations: animations
    ) { _ in
      // reset alpha
      fromView.alpha = 1;
      
      transitionContext.completeTransition(
        !transitionContext.transitionWasCancelled
      );
    };
  };
};

internal class GlideUpAnimator: CustomAnimator {
  
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };
    
    let toView   = toViewController  .view!;
    let fromView = fromViewController.view!;
    
    let toViewFrame = toView.frame;
    
    let duration = self.transitionDuration(using: transitionContext);
    
    // `AnimationOptions` -> `KeyframeAnimationOptions`
    let options: UIView.KeyframeAnimationOptions =
      .init(animationOptions: .curveEaseInOut);
    
    let animations: () -> Void = {
      if self.isPushing {
        transitionContext.containerView.addSubview(toView);
        
        // push - transition in `toView`
        // start values: [A] -> B
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
        
        
        // end of push
        return {
          UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 0.75) {
            toView.alpha = 1;
            fromView.alpha = 0.5;
          };
          
          UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 1) {
            toView.frame = toViewFrame;
          };
        };
        
      } else {
        transitionContext.containerView.insertSubview(toView, belowSubview: toView);
        
        // pop - transition out `fromViewController`
        // start values: A <- [B]
        toView.alpha = 0.5;
        fromView.alpha = 1;
        
        toView.frame = fromView.frame;
        
        // end of pop
        return {
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
      };
    }();
    
    UIView.animateKeyframes(
      withDuration: duration,
      delay: 0,
      options: options,
      animations: animations
    ) { _ in
      // reset alpha
      fromView.alpha = 1;
      
      transitionContext.completeTransition(
        !transitionContext.transitionWasCancelled
      );
    };
  };
};

internal class ZoomFadeAnimator: CustomAnimator {
  
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };
    
    let toView   = toViewController  .view!;
    let fromView = fromViewController.view!;

    let duration = self.transitionDuration(using: transitionContext);
    let scaleAmount: CGFloat = 0.5;
    
    // `AnimationOptions` -> `KeyframeAnimationOptions`
    let options: UIView.KeyframeAnimationOptions =
      .init(animationOptions: .curveEaseInOut);
    
    let animations: () -> Void = {
      if self.isPushing {
        transitionContext.containerView.addSubview(toView);
        
        // push - transition in `toView`
        // start values: [A] -> B
        toView.alpha = 0;
        fromView.alpha = 1;
        
        fromView.transform = CGAffineTransform(scaleX: 1, y: 1);
        toView.transform = CGAffineTransform(scaleX: 1 - scaleAmount, y: 1 - scaleAmount);
        
        // end of push
        return {
          UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 0.75) {
            fromView.alpha = 0;
            toView.alpha = 1;
          };
          
          UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 1) {
            fromView.transform = CGAffineTransform(scaleX: 1 + scaleAmount, y: 1 + scaleAmount);
            toView.transform = CGAffineTransform(scaleX: 1, y: 1);
          };
        };
        
      } else {
        transitionContext.containerView.insertSubview(toView, belowSubview: toView);
        
        // pop - transition out `fromViewController`
        // start values: A <- [B]
        fromView.alpha = 1;
        toView.alpha = 0;
        
        fromView.transform = CGAffineTransform(scaleX: 1, y: 1);
        toView.transform = CGAffineTransform(scaleX: 1 + scaleAmount, y: 1 + scaleAmount);
        
        // end of pop
        return {
          UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 0.75) {
            fromView.alpha = 0;
            toView.alpha = 1;
          };
          
          UIView.addKeyframe(withRelativeStartTime: 0.0, relativeDuration: 1) {
            fromView.transform = CGAffineTransform(scaleX: 1 - scaleAmount, y: 1 - scaleAmount);
            toView.transform = CGAffineTransform(scaleX: 1, y: 1);
          };
        };
      };
    }();
    
    UIView.animateKeyframes(
      withDuration: duration,
      delay: 0,
      options: options,
      animations: animations
    ) { _ in
      // reset
      fromView.alpha = 1;
      fromView.transform = CGAffineTransform(scaleX: 1, y: 1);
      
      transitionContext.completeTransition(
        !transitionContext.transitionWasCancelled
      );
    };
  };
};

/*
internal class Template: CustomAnimator {
  
  override func animateTransition(using transitionContext: UIViewControllerContextTransitioning) {
    guard let fromViewController = transitionContext.viewController(forKey: .from),
          let toViewController   = transitionContext.viewController(forKey: .to)
    else { return };
    
    let toView   = toViewController  .view!;
    let fromView = fromViewController.view!;
    
    let toViewFrame = toView.frame;
    
    let duration = self.transitionDuration(using: transitionContext);
    
    // `AnimationOptions` -> `KeyframeAnimationOptions`
    let options: UIView.KeyframeAnimationOptions =
      .init(animationOptions: .curveEaseInOut);
    
    let animations: () -> Void = {
      if self.isPushing {
        transitionContext.containerView.addSubview(toView);
        
        // push - transition in `toView`
        // start values: [A] -> B
        
        
        // end of push
        return {

        };
        
      } else {
        transitionContext.containerView.insertSubview(toView, belowSubview: toView);
        
        // pop - transition out `fromViewController`
        // start values: A <- [B]

        
        // end of pop
        return {

        };
      };
    }();
    
    UIView.animateKeyframes(
      withDuration: duration,
      delay: 0,
      options: options,
      animations: animations
    ) { _ in
      transitionContext.completeTransition(
        !transitionContext.transitionWasCancelled
      );
    };
  };
};
*/
