//
//  RNIExampleRouteViewController.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/15/21.
//

import UIKit

 
class RNIExampleRouteViewController: RNINavigatorRouteBaseViewController {
  override func loadView() {
    super.loadView();
    
    self.navigationItem.title = "Native Route";
    
    let title = UILabel();
    title.text = "Native Route: \(self.routeKey)";
    title.font = .systemFont(ofSize: 18, weight: .bold);
    
    let subtitle = UILabel();
    subtitle.text = "Route Index: \(self.routeIndex)";
    subtitle.font = .systemFont(ofSize: 16, weight: .regular);
    
    let stack = UIStackView(arrangedSubviews: [title, subtitle]);
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
