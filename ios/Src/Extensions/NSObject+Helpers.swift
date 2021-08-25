//
//  NSObject+Helpers.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 8/25/21.
//

import Foundation


extension NSObject {
  
  // Retrieves an array of property names found on the current object
  func propertyNames() -> [String] {
    var results: Array<String> = [];
    
    // retrieve the properties via the class_copyPropertyList function
    var count: UInt32 = 0;
    let myClass: AnyClass = self.classForCoder;
    let properties = class_copyPropertyList(myClass, &count);
  
    for i in 0 ..< Int(count) {
      let property = properties![i];
      
      // retrieve the property name by calling property_getName function
      let cname = property_getName(property);
      
      // covert the c string into a Swift string
      let name = String(cString: cname);
      
      results.append(name);
    };
    
    // release objc_property_t structs
    free(properties);
    return results;
  };
};
