//
//  RNINavTransitionConfig.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/28/21.
//

import Foundation

internal class RNINavTransitionConfig {
  
  enum TransitionTypes: String {
    case DefaultPush;
    case DefaultPop;
    
    case FadePush;
    case FadePop;
    
    case SlideLeftPush;
    case SlideLeftPop;
    
    case SlideUpPush;
    case SlideUpPop;
    
    case GlideUpPush;
    case GlideUpPop;
    
    case ZoomFadePush;
    case ZoomFadePop;
    
    case FlipHorizontalPush;
    case FlipHorizontalPop;
    
    case FlipVerticalPush;
    case FlipVerticalPop;
  };
  
  let transitionType: TransitionTypes;
  var duration: TimeInterval = 0.5;
  
  init?(dictionary: NSDictionary) {
    guard let typeString = dictionary["type"] as? String,
          let type = TransitionTypes(rawValue: typeString)
    else { return nil };
    
    self.transitionType = type;
    
    if let number = dictionary["duration"] as? NSNumber,
       let duration = number as? TimeInterval {
      
      self.duration = duration;
    };
  };
  
  init(type: TransitionTypes){
    self.transitionType = type;
  };

  func makeAnimator(
    interactionController: UIPercentDrivenInteractiveTransition? = nil
  ) -> CustomAnimator? {
    
    switch self.transitionType {
      case .DefaultPush: return nil;
      case .DefaultPop : return nil;
      
      case .FadePush: return FadeAnimator(duration: duration);
      case .FadePop : return FadeAnimator (
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .SlideLeftPush: return SlideLeftAnimator(duration: duration);
      case .SlideLeftPop : return SlideLeftAnimator(
        duration: self.duration,
        interactionController: interactionController
      );

      case .SlideUpPush: return SlideUpAnimator(duration: duration);
      case .SlideUpPop : return SlideUpAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .GlideUpPush: return GlideUpAnimator(duration: duration);
      case .GlideUpPop : return GlideUpAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .ZoomFadePush: return ZoomFadeAnimator(duration: duration);
      case .ZoomFadePop : return ZoomFadeAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .FlipHorizontalPush: return FlipHorizontalAnimator(duration: duration);
      case .FlipHorizontalPop : return FlipHorizontalAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .FlipVerticalPush: return FlipVerticalAnimator(duration: duration);
      case .FlipVerticalPop : return FlipVerticalAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
    };
  };
};
