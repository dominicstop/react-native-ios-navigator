//
//  RNIError.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 2/20/21.
//

import Foundation

internal enum RNIError: Error {

  /// An error for react native module/view commands
  case commandFailed(source: String, message: String, debug: String? = nil);
  
  static func constructErrorMessage(_ error: Error) -> String {
    guard let e = error as? RNIError else { return "N/A" };
    
    switch e {
      case .commandFailed(let source, let message, let debug):
        return "\(source) Error: \(message) - with debug: \(debug ?? "N/A")";
    };
  };
};
