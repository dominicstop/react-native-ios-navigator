//
//  UIBlurEffect+Helpers.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 1/30/21.
//

import Foundation

extension UIBlurEffect.Style {
  private static let StringToStyleMap: [String: UIBlurEffect.Style] = {
    var styles: [String: UIBlurEffect.Style] = [
      "light"     : .light,
      "extraLight": .extraLight,
      "dark"      : .dark,
    ];
    
    if #available(iOS 10.0, *) {
      styles["regular"  ] = .regular;
      styles["prominent"] = .prominent;
    };
    
    if #available(iOS 13.0, *) {
      styles["systemUltraThinMaterial"     ] = .systemUltraThinMaterial;
      styles["systemThinMaterial"          ] = .systemThinMaterial;
      styles["systemMaterial"              ] = .systemMaterial;
      styles["systemThickMaterial"         ] = .systemThickMaterial;
      styles["systemChromeMaterial"        ] = .systemChromeMaterial;
      styles["systemMaterialLight"         ] = .systemMaterialLight;
      styles["systemThinMaterialLight"     ] = .systemThinMaterialLight;
      styles["systemUltraThinMaterialLight"] = .systemUltraThinMaterialLight;
      styles["systemThickMaterialLight"    ] = .systemThickMaterialLight;
      styles["systemChromeMaterialLight"   ] = .systemChromeMaterialLight;
      styles["systemChromeMaterialDark"    ] = .systemChromeMaterialDark;
      styles["systemMaterialDark"          ] = .systemMaterialDark;
      styles["systemThickMaterialDark"     ] = .systemThickMaterialDark;
      styles["systemThinMaterialDark"      ] = .systemThinMaterialDark;
      styles["systemUltraThinMaterialDark" ] = .systemUltraThinMaterialDark;
    };
    
    return styles;
  }();
  
  init?(string: String) {
    guard let style = Self.StringToStyleMap[string] else { return nil };
    self = style;
  };
};
