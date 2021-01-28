import UIKit

/**
 A custom `UIViewController` that implements the base configuration.
 */
class ScrollingNavigationViewController: UIViewController, UIScrollViewDelegate, UINavigationControllerDelegate {

  // MARK: - ScrollView config

  /**
   On appear calls `showNavbar()` by default
   */
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)

    if let navigationController = self.navigationController as? ScrollingNavigationController {
      navigationController.showNavbar(animated: true)
    }
  }

  /**
   On disappear calls `stopFollowingScrollView()` to stop observing the current scroll view, and perform the tear down
   */
  override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)

    if let navigationController = self.navigationController as? ScrollingNavigationController {
      navigationController.stopFollowingScrollView()
    }
  }

  /**
   Calls `showNavbar()` with the `scrollToTop` parameter to `true` when a scroll to top is requested
   */
  func scrollViewShouldScrollToTop(_ scrollView: UIScrollView) -> Bool {
    if let navigationController = self.navigationController as? ScrollingNavigationController {
      navigationController.showNavbar(animated: true, scrollToTop: true)
    }
    return true
  }

}
