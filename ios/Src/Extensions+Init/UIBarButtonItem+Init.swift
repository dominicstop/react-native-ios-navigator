//
//  UIBarButtonItem+Init.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/22/21.
//

import Foundation

extension UIBarButtonItem.SystemItem {
  init?(string: String){
    switch string {
      case "done"         : self = .done;
      case "cancel"       : self = .cancel;
      case "edit"         : self = .edit;
      case "save"         : self = .save;
      case "add"          : self = .add;
      case "flexibleSpace": self = .flexibleSpace;
      case "fixedSpace"   : self = .fixedSpace;
      case "compose"      : self = .compose;
      case "reply"        : self = .reply;
      case "action"       : self = .action;
      case "organize"     : self = .organize;
      case "bookmarks"    : self = .bookmarks;
      case "search"       : self = .search;
      case "refresh"      : self = .refresh;
      case "stop"         : self = .stop;
      case "camera"       : self = .camera;
      case "trash"        : self = .trash;
      case "play"         : self = .play;
      case "pause"        : self = .pause;
      case "rewind"       : self = .rewind;
      case "fastForward"  : self = .fastForward;
      case "undo"         : self = .undo;
      case "redo"         : self = .redo;
        
      case "close":
        if #available(iOS 13.0, *) {
          self = .close;
        } else {
          return nil;
        };
      
      default: return nil;
    }
  };
  
  init?(string: String?){
    guard let string = string else { return nil };
    self.init(string: string);
  };
};

extension UIBarButtonItem.Style {
  init?(string: String){
    switch string {
      case "done" : self = .done;
      case "plain": self = .plain;
        
      default: return nil;
    };
  };
  
  init?(string: String?){
    guard let string = string else { return nil };
    self.init(string: string);
  };
};


