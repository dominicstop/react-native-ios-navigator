//
//  RNINavTransitionConfig.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/28/21.
//

import Foundation

internal class RNINavTransitionConfig {
  
  enum TransitionTypes: String {
    case Default;
    case CrossFade;
    case SlideLeft;
    case SlideUp;
    case GlideUp;
    case ZoomFade;
    case FlipHorizontal;
    case FlipVertical;
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
      case .Default: return nil;
      
      case .CrossFade: return FadeAnimator (
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .SlideLeft: return SlideLeftAnimator(
        duration: self.duration,
        interactionController: interactionController
      );

      case .SlideUp : return SlideUpAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .GlideUp: return GlideUpAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .ZoomFade: return ZoomFadeAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .FlipHorizontal: return FlipHorizontalAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
      
      case .FlipVertical: return FlipVerticalAnimator(
        duration: self.duration,
        interactionController: interactionController
      );
    };
  };
};
