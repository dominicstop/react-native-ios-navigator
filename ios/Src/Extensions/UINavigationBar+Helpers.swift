//
//  UINavigationBar+Helpers.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/5/21.
//

import UIKit

extension UINavigationBar {

  // MARK: `allowTouchEventsToPassThroughNavigationBar`-related
  
  var allowTouchEventsToPassThrough: Bool {
    guard let navigatorView = RNIUtilities.getParent(responder: self, type: RNINavigatorView.self)
    else { return false };
    
    return navigatorView.allowTouchEventsToPassThroughNavigationBar;
  };
  
  var hasBackground: Bool {
    self.backgroundColor != .clear;
  };
  
  /// Passes through all touch events to the views behind it, except when the
  /// touch occurs in a contained UIControl or view with a gesture
  /// recognizer attached
  open override func point(inside point: CGPoint, with event: UIEvent?) -> Bool {

    if !self.allowTouchEventsToPassThrough ||
        self.nestedInteractiveViews(in: self, contain: point) {
      
      return super.point(inside: point, with: event);
    };
    
    return false;
  };
  
  private func nestedInteractiveViews(in view: UIView, contain point: CGPoint) -> Bool {
    if view.isPotentiallyInteractive,
       view.bounds.contains(convert(point, to: view)) {
      
      return true;
    };

    for subview in view.subviews {
      if self.nestedInteractiveViews(in: subview, contain: point) {
        return true;
      };
    };

    return false;
  };
};

private extension UIView {
  var isPotentiallyInteractive: Bool {
    guard self.isUserInteractionEnabled else { return false };
    return (self.isControl || self.doesContainGestureRecognizer);
  };

  var isControl: Bool {
    return self is UIControl;
  };

  var doesContainGestureRecognizer: Bool {
    return !(self.gestureRecognizers?.isEmpty ?? true);
  };
};
