//
//  RNINavigatorError.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 9/11/21.
//

import Foundation


internal struct RNINavigatorError: Error, Codable {
  
  enum ErrorCode: String, Codable, CaseIterable {
    case activeRoutesDeSync;
    case libraryError;
    
    case invalidRouteID;
    case invalidRouteKey;
    case invalidRouteIndex;
    case invalidReactTag;
    case invalidArguments;
    
    case routeOutOfBounds;
  };
  
  let code: ErrorCode;
  let domain: String;
  
  let message: String?;
  let debug: String?;
  
  init(
    code: ErrorCode,
    domain: String,
    message: String? = nil,
    debug: String? = nil
  ) {
    
    self.code = code;
    self.domain = domain;
    self.message = message;
    self.debug = debug;
  };
  
  func createJSONString() -> String? {
    let encoder = JSONEncoder();
    
    guard let data = try? encoder.encode(self),
          let jsonString = String(data: data, encoding: .utf8)
    else { return nil };
    
    return jsonString;
  };
};

