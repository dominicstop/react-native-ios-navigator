//
//  RNINavigatorUIConstants.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 6/5/21.
//

import Foundation


/// Note: Tried to use KVO to observe `navigationBar.frame` but it wasn't updating
class RNINavigatorUIConstants {
  
  weak var navigatorView: RNINavigatorView!;
  
  var currentSafeAreaInsets: UIEdgeInsets?;
  var currentStatusBarHeight: CGFloat?;
  
  var dictionary: Dictionary<String, AnyHashable> {[
    "navigatorID"    : self.navigatorView.navigatorID,
    "statusBarHeight": self.currentStatusBarHeight,
    "safeAreaInsets" : self.currentSafeAreaInsets?.dictionary
  ]};
  
  init(navigatorView: RNINavigatorView) {
    self.navigatorView = navigatorView;
  };
 
  func refreshConstants(){
    guard let navigatorView = self.navigatorView else { return };
    
    let prevSafeAreaInsets  = self.currentSafeAreaInsets;
    let prevStatusBarHeight = self.currentStatusBarHeight;
    
    let nextSafeAreaInsets  = navigatorView.navigationVC.synthesizedSafeAreaInsets;
    let nextStatusBarHeight = navigatorView.navigationVC.statusBarHeight;
    
    let didChange =
      prevSafeAreaInsets  != nextSafeAreaInsets  ||
      prevStatusBarHeight != nextStatusBarHeight;
    
    self.currentSafeAreaInsets  = nextSafeAreaInsets;
    self.currentStatusBarHeight = nextStatusBarHeight;
    
    if didChange {
      self.navigatorView.onUIConstantsDidChange?(self.dictionary);
      
      #if DEBUG
      print("LOG - RNINavigatorUIConstants: refreshConstants"
        + " - nextSafeAreaInsets: \(nextSafeAreaInsets)"
        + " - nextStatusBarHeight: \(nextStatusBarHeight)"
      );
      #endif
    };
  };
};
