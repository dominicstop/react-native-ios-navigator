//
//  RNINavigatorRouteHeaderViewController.swift
//  react-native-ios-navigator
//
//  Created by Dominic Go on 5/31/21.
//

import UIKit

class RNINavigatorRouteHeaderViewController: UIViewController {
  
  weak var headerView: RNINavigatorRouteHeaderView?;
  weak var routeVC: RNINavigatorReactRouteViewController?;
  
  var headerHeightConstraint: NSLayoutConstraint!;
  
  var wrapperView: RNINavigatorReactRouteViewController.RouteContentWrapper? {
    self.routeVC?.wrapperView;
  };
  
  override func viewDidLoad() {
    super.viewDidLoad();
    
    guard let headerView = self.headerView,
          let routeVC = self.routeVC
    else { return };
    
    headerView.refreshHeaderTopPadding();
    
    if case let .reactScrollView(reactScrollView) = routeVC.wrapperView {
      reactScrollView.addScrollListener(self);
    };
  };
  
  func setWrapperViewInsets(headerHeight: CGFloat){
    guard let routeVC = self.routeVC else { return };
    
    switch self.wrapperView  {
      case let .reactScrollView(reactScrollView):
        guard let scrollView = reactScrollView.scrollView else { break };
        
        if #available(iOS 11.0, *) {
          reactScrollView.insetsLayoutMarginsFromSafeArea = false;
          scrollView.contentInsetAdjustmentBehavior = .never;
        };
        
        if #available(iOS 13.0, *) {
          scrollView.automaticallyAdjustsScrollIndicatorInsets = false;
        };
        
        reactScrollView.automaticallyAdjustContentInsets = false;
        
        let headerInset = UIEdgeInsets(top: headerHeight, left: 0, bottom: 0, right: 0);
        reactScrollView.contentInset = headerInset;
        
        scrollView.scrollIndicatorInsets = headerInset;
        scrollView.contentOffset = CGPoint(x: 0, y: -headerHeight);
        
      default:
        if #available(iOS 11.0, *) {
          let navBarHeight = routeVC.navBarWithStatusBarHeight;
          let topInset = headerHeight - navBarHeight;
          
          routeVC.additionalSafeAreaInsets =
            UIEdgeInsets(top: topInset, left: 0, bottom: 0, right: 0)
        };
    }
  };
};

// ---------------------------
// MARK:- UIScrollViewDelegate
// ---------------------------

extension RNINavigatorRouteHeaderViewController: UIScrollViewDelegate {
  
  func scrollViewDidScroll(_ scrollView: UIScrollView) {
    guard let headerView      = self.headerView,
          let navigationBar   = self.navigationController?.navigationBar,
          let headerHeightMin = headerView.headerConfig.headerHeightMin,
          let headerHeightMax = headerView.headerConfig.headerHeightMax
    else { return };
    
    let heightMin = headerHeightMin.getHeight(viewController: self);
    let heightMax = headerHeightMax.getHeight(viewController: self);
    
    let scrollY    = scrollView.contentOffset.y;
    let scrollYAdj = scrollY + heightMax;
    
    /// the `scrollY` that triggers the transition from A -> B
    /// e.g. header expanded -> header collapsed
    let offsetBEnd = heightMax - heightMin;
    
    let newHeaderHeight: CGFloat = {
      if scrollYAdj <= 0 {
        /// A: over-scrolling to top, make header bigger
        /// compute next height for header based on the current `scrollY`
        return abs(scrollYAdj) + heightMax;
        
      } else if scrollYAdj <= offsetBEnd {
        /// B: transitioning between header expanded and collapsed
        /// compute next height for header based on the current `scrollY`
        return heightMax - scrollYAdj;
      };
      
      /// C: header is now fully collapsed
      return heightMin;
    }();
    
    let navBarWidth   = navigationBar.frame.width;
    let newHeaderSize = CGSize(width: navBarWidth, height: newHeaderHeight);
    
    // adjust header height
    self.headerHeightConstraint?.constant = newHeaderHeight;
    
    // update react layout
    headerView.notifyForBoundsChange(
      CGRect(origin: .zero, size: newHeaderSize)
    );
  };
};
