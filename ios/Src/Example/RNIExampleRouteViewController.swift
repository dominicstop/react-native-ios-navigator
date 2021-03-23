//
//  RNIExampleRouteViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/15/21.
//

import UIKit

 
internal class RNIExampleRouteViewController: RNINavigatorRouteBaseViewController {
  
  override func loadView() {
    super.loadView();
    
    self.navigationItem.title = "Native Route";
    
    let title = UILabel();
    title.text = "Native Route: \(self.routeKey)";
    title.font = .systemFont(ofSize: 18, weight: .bold);
    
    let subtitle1 = UILabel();
    subtitle1.text = "Route Index: \(self.routeIndex)";
    subtitle1.font = .systemFont(ofSize: 16, weight: .regular);
    
    let subtitle2 = UILabel();
    subtitle2.text = "Route Data: \(self.routeProps.debugDescription)";
    subtitle2.font = .systemFont(ofSize: 16, weight: .regular);
    
    let stack = UIStackView(arrangedSubviews: [
      title, subtitle1, subtitle2
    ]);
    
    stack.layer.cornerRadius = 10;
    
    if #available(iOS 11.0, *) {
      stack.isLayoutMarginsRelativeArrangement = true
      stack.directionalLayoutMargins =
        NSDirectionalEdgeInsets(top: 15, leading: 15, bottom: 15, trailing: 15);
    };

    stack.axis = .vertical;
    stack.alignment = .center;
    stack.backgroundColor = .lightGray;
    
    
    self.view.backgroundColor = .white;
    
    self.view.addSubview(stack);
    stack.translatesAutoresizingMaskIntoConstraints = false;
    
    NSLayoutConstraint.activate([
      stack.centerXAnchor.constraint(equalTo: self.view.centerXAnchor),
      stack.centerYAnchor.constraint(equalTo: self.view.centerYAnchor),
    ]);
  };
};
