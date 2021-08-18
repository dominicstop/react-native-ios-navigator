//
//  RNITestRouteViewController01.swift
//  IosNavigatorExample
//
//  Created by Dominic Go on 3/15/21.
//

import UIKit
import react_native_ios_navigator

/// Example route that's used via `pushViewController`
class BlankRoute: RNINavigatorRouteBaseViewController {
  override func loadView() {
    super.loadView();
    
    let title = UILabel();
    title.text = "Native Route (UIViewController)";
    title.font = .systemFont(ofSize: 18, weight: .bold);
    
    self.view.addSubview(title);
    self.view.backgroundColor = .white;
    
    title.translatesAutoresizingMaskIntoConstraints = false;
    
    NSLayoutConstraint.activate([
      title.centerXAnchor.constraint(equalTo: self.view.centerXAnchor),
      title.centerYAnchor.constraint(equalTo: self.view.centerYAnchor),
    ]);
  };
};

/// Example route that get's registered in the route registry
class RNITestRouteViewController01: RNINavigatorRouteBaseViewController {
  
  override func loadView() {
    super.loadView();
    
    self.navigationItem.title = "Native Route";
    
    let title1: UILabel = {
      let label = UILabel();
      label.font = .systemFont(ofSize: 24, weight: .bold);
      label.textColor = UIColor(red: 0.19, green: 0.11, blue: 0.57, alpha: 1.00);
      label.text = "UIViewController";
      
      return label;
    }();
    
    let title2: UILabel = {
      let label = UILabel();
      label.font = .systemFont(ofSize: 18, weight: .semibold);
      label.text = "Native Route: \(self.routeKey)";
      
      return label;
    }();
    
    let subtitle1: UILabel = {
      let label = UILabel();
      label.font = .systemFont(ofSize: 16, weight: .regular);
      label.text = "Route Index: \(self.routeIndex)";
      
      return label;
    }();
    
    let subtitle2: UILabel = {
      let label = UILabel();
      label.font = .systemFont(ofSize: 16, weight: .regular);
      label.text = "Route Props: \(self.routeProps.debugDescription)";
      
      return label;
    }();
    
    func buttonMaker() -> UIButton {
      let button = UIButton();
      button.contentEdgeInsets = UIEdgeInsets(top: 5, left: 10, bottom: 5, right: 10);
      
      button.backgroundColor = UIColor(red: 0.38, green: 0.00, blue: 0.92, alpha: 1.00);
      button.tintColor = .white;
      button.layer.cornerRadius = 10;
      
      return button;
    };
    
    let button1: UIButton = {
      let button = buttonMaker();
      
      button.setTitle("Push ViewController", for: .normal);
      button.addTarget(self, action:#selector(self.onPressPushViewController), for: .touchUpInside);
      
      return button;
    }();
    
    let button2: UIButton = {
      let button = buttonMaker();
      
      button.setTitle("Push React Route", for: .normal);
      button.addTarget(self, action:#selector(self.onPressPushReactRoute), for: .touchUpInside);
      
      return button;
    }();
    
    let button3: UIButton = {
      let button = buttonMaker();
      
      button.setTitle("Pop Current Route", for: .normal);
      button.addTarget(self, action:#selector(self.onPressPopCurrentRoute), for: .touchUpInside);
      
      return button;
    }();
    
    let button4: UIButton = {
      let button = buttonMaker();
      
      button.setTitle("Push ViewController #2", for: .normal);
      button.addTarget(self, action:#selector(self.onPressPushViewController2), for: .touchUpInside);
      
      return button;
    }();
    
    let button5: UIButton = {
      let button = buttonMaker();
      
      button.setTitle("sendCustomCommandToJS", for: .normal);
      button.addTarget(self, action:#selector(self.onPressSendCustomCommandToJS), for: .touchUpInside);
      
      return button;
    }();
    
    let stack = UIStackView(arrangedSubviews: [
      // title
      title1, title2, subtitle1, subtitle2,
      // nav commands buttons
      button1, button3, button2, button4, button5
    ]);
    
    if #available(iOS 11.0, *) {
      stack.setCustomSpacing(20, after: subtitle2);
      stack.setCustomSpacing(10, after: button1);
      stack.setCustomSpacing(10, after: button2);
      stack.setCustomSpacing(10, after: button3);
      stack.setCustomSpacing(10, after: button4);
    };

    stack.axis = .vertical;
    stack.alignment = .center;
    stack.backgroundColor = UIColor(red: 0.93, green: 0.91, blue: 0.96, alpha: 1.00);
    stack.layer.cornerRadius = 10;
    
    if #available(iOS 11.0, *) {
      stack.isLayoutMarginsRelativeArrangement = true;
      stack.directionalLayoutMargins = NSDirectionalEdgeInsets(top: 20, leading: 20, bottom: 20, trailing: 20)
    };
    
    self.view.backgroundColor = .white;
    
    self.view.addSubview(stack);
    stack.translatesAutoresizingMaskIntoConstraints = false;
    
    NSLayoutConstraint.activate([
      // make center
      stack.centerXAnchor.constraint(equalTo: self.view.centerXAnchor),
      stack.centerYAnchor.constraint(equalTo: self.view.centerYAnchor),
      // horizontal margin
      stack.widthAnchor .constraint(lessThanOrEqualTo: self.view.widthAnchor, constant: -30)
    ]);
  };

  @objc func onPressPushViewController(){
    let vc = BlankRoute();
    self.navigator?.pushViewController(vc, animated: true);
  };

  @objc func onPressPushReactRoute(){
    let routeToPush = self.routeProps["routeToPush"] as? String
      ?? "NavigatorTest01";
    
    let dict: Dictionary<String, Any> = [
      "nativeRouteProps": "Hello from Native"
    ];
    
    self.navigator?.push(routeKey: routeToPush, routeProps: dict, animated: true);
  };

  @objc func onPressPopCurrentRoute(){
    self.navigator?.pop(animated: true);
  };
  
  @objc func onPressPushViewController2(){
    let vc = RNITestRouteViewController01();
    vc.setRouteKey("TestNativeRoute");
    
    self.navigator?.pushViewController(vc, animated: true);
  };
  
  @objc func onPressSendCustomCommandToJS(){
    self.navigator?.sendCustomCommandToJS(
      key: "test", data: ["message": "hello from native"]
    );
  };
};
