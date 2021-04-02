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
      
      case .FadePush: return FadePushAnimator(duration: duration);
      case .FadePop : return FadePopAnimator (
        duration: self.duration,
        interactionController: interactionController
      );
      
      // TODO: Rename to "SlideLeftPush"
      case .SlideLeftPush: return SlideLeftPushAnimator(duration: duration);
      case .SlideLeftPop : return SlideLeftPopAnimator(
        duration: self.duration,
        interactionController: interactionController
      );

      case .SlideUpPush: return SlideUpPushAnimator(duration: duration);
      case .SlideUpPop : return SlideUpPopAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .GlideUpPush: return GlideUpPushAnimator(duration: duration);
      case .GlideUpPop : return GlideUpPopAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
    };
  };
};
