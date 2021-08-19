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
  
  let transitionOptions: Dictionary<String, Any>?;
  
  init?(dictionary: NSDictionary) {
    guard let typeString = dictionary["type"] as? String,
          let type = TransitionTypes(rawValue: typeString)
    else { return nil };
    
    self.transitionType = type;
    
    if let number = dictionary["duration"] as? NSNumber,
       let duration = number as? TimeInterval {
      
      self.duration = duration;
    };
    
    self.transitionOptions = dictionary as? Dictionary<String, Any>;
  };
  
  init(type: TransitionTypes){
    self.transitionType = type;
    self.transitionOptions = nil;
  };

  func makeAnimator(
    interactionController: UIPercentDrivenInteractiveTransition? = nil
  ) -> CustomAnimator? {
    
    switch self.transitionType {
      case .DefaultPush: fallthrough;
      case .DefaultPop : return nil;
      
      case .FadePush: fallthrough;
      case .FadePop : return FadeAnimator (
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .SlideLeftPush: fallthrough;
      case .SlideLeftPop : return SlideLeftAnimator(
        duration: self.duration,
        interactionController: interactionController
      );

      case .SlideUpPush: fallthrough;
      case .SlideUpPop : return SlideUpAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .GlideUpPush: fallthrough;
      case .GlideUpPop : return GlideUpAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .ZoomFadePush: fallthrough;
      case .ZoomFadePop : return ZoomFadeAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .FlipHorizontalPush: fallthrough;
      case .FlipHorizontalPop : return FlipHorizontalAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .FlipVerticalPush: fallthrough;
      case .FlipVerticalPop : return FlipVerticalAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
    };
  };
};
