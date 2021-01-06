//
//  WeakObjects.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/6/21.
//

final class WeakObject<T: AnyObject> {
  private(set) weak var value: T?;
  
  init(_ value: T) {
    self.value = value;
  };
};

/** Holds an array of weak elements */
@propertyWrapper
struct WeakArray<Element> where Element: AnyObject {
  private var storage = [WeakObject<Element>]();

  var wrappedValue: [Element] {
    get {
      // filter out nil values and return
      return storage.compactMap { $0.value };
    }
    set {
      self.storage = newValue.map { WeakObject($0) }
    }
  }
};
