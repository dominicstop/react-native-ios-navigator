//
//  EqualityOperator.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 8/26/21.
//

import Foundation

func ==(lhs: [NSAttributedString.Key: Any], rhs: [NSAttributedString.Key: Any]) -> Bool {
  return NSDictionary(dictionary: lhs).isEqual(to: rhs);
};

func !=(lhs: [NSAttributedString.Key: Any], rhs: [NSAttributedString.Key: Any]) -> Bool {
  return !(lhs == rhs);
};

func ==(lhs: UIImage, rhs: UIImage) -> Bool {
  if lhs === rhs {
    // same ref to the object, equal
    return true;
    
  } else if lhs.size != rhs.size {
    // size diff, not equal
    return false;
  };
  
  /// Compare raw data
  /// According to the UIImage Docs:
  /// * "The isEqual(_:) method is the only reliable way to determine whether
  ///   two images contain the same image data."
  /// * "isEqual(_:) method [...] compares the actual image data..."
  return lhs.isEqual(rhs);
};

/// Erases the `WritableKeyPath` type.
///
/// Example: So now you can have a collection of different `WritableKeyPath` types,
/// e.g. `[WritableKeyPath<Foo, Bar>, [WritableKeyPath<Foo, Baz>, ...]`.
struct ResettableKeyPath<Base> {

  private let _reset: (inout Base, inout Base) -> Void;
  
  init<Value: Equatable>(_ keyPath: WritableKeyPath<Base, Value>) {
    self._reset = {
      if $0[keyPath: keyPath] != $1[keyPath: keyPath] {
        $0[keyPath: keyPath] = $1[keyPath: keyPath];
      };
    };
  };
  
  /// If `current.property` is not equal to `default.property`,
  /// then `current.property = default.property`.
  func reset(current: inout Base, default: inout Base) {
    self._reset(&current, &`default`);
  };
};
