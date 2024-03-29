# TODO Archive
Old TODO items are stored/archived here.

<br>

### Version: `0.1.4`

- [x] (Commit: `a643f1f`) Updated dev dependencies.

### Version: `0.1.1`

- [x] (Commit: `33fbc52`) Update bob config — Re-added `commonjs` target.

### Version: `0.1.0`

- [x] (Commit: `74ce764`) Update linter + bob config.
- [x] (Commit: `3085c3d`) Fixed linter warnings/errors.
- [x] (Commit: `e205b10`) **Fix**: Custom navigation bar items not showing up.

### Version: `0.0.8`

- [x] (Commit: `d10e0da`) Update bob config — remove `commonjs` target.

### Version: `0.0.7`

- [x]  **Implement**: `RouteHeaderView` — A component that is meant to be used to create a custom navigation bar without actually replacing it.
	* Via `routeOptions` config, make the navigation bar transparent. Then add the `RouteHeaderView` component into the route.
	* The navigation bar will still exists but now it's transparent, so you can use `RouteHeaderView` to show anything you want behind the navigation bar.
	* Note: This is the easiest workaround I could find to customize the navigation bar, most apps actually do this. For example, the spotify app uses a transparent navigation bar so they can show album art behind it as you scroll.
	* [x] (Commit: `1060169`) **Implement**: Initial implementation for `RouteHeaderView` with `headerMode: 'resize'`
	* [x] (Commit: `d88a3a0`) **Implement**: Support for `RouteHeaderView` with `headerMode: 'fixed'`
	* [x] (Commit: `a02be8e`) **Implement**: Added support for new modes for `HeaderHeight`
		* Updated modes: `statusBar`,`navigationBar`,  `safeArea` (i.e. `statusBar` + `navigationBar`), `none`.
	* [x] (Commit: `ed49d5a`) **Implement**: `RouteHeaderView`    `headerTopPadding` prop
		* Controls the top padding for `RouteHeaderView`, accepts a `HeaderHeight` value.

- [x]  **Implement**: `NavigationConfigOverride` — A config that overrides the current navigation controller properties that gets applied on each route view controller.
	* The config is applied on `viewWillAppear` and removed (i.e. restore the previous config before overriding) on `viewWillDisappear`.  
	* [x] (Commit: `fdd924f`) **Implement**: Updated `RNINavigatorRouteView` to support `navBarAppearanceOverride` using both the legacy + appearance config.
	* [x] (Commit: `5f2ae45`) **Implement**: `navigationBarVisibility` —  Updated `NavigationConfigOverride` + `RNINavigatorRouteView` to support overriding the current navigation bar visibility per each route view controller.

<br>

- [x] (Commit: `ca76cc7`)  **Implement**: Support for applying the "back button related"-config to the current route instead of the next route. 
	* This is already implemented but move the flag the controls this behavior out of the `navBarButtonBackItemConfig` prop (i.e.the  `applyToPrevBackConfig` property) into its own separate prop called `applyBackButtonConfigToCurrentRoute`.

<br>

- [x] **Fix**: Transparent navigation bar steals touch events. View behind the navigation bar do not receive touch events.
	- [x] (Commit: `7027f76`) **Implement**: `RNINavigator` -  `allowTouchEventsToPassThroughNavigationBar`
		* Impl. flag that allows touch events to be received by view behind the navigation bar .
	- [x] (Commit: `1fca031`) **Implement**: `NavigatorRouteView` -  `allowTouchEventsToPassThroughNavigationBar` Prop.
		- Impl. `allowTouchEventsToPassThroughNavigationBar` for `NavigatorRouteView`. 
		- Updated `NavigationConfigOverride` to support `allowTouchEventsToPassThroughNavigationBar`.

<br>

- [x] **Refactor**: Move exported types to `NavigatorTypes` and export in `index.ts`.
	- Move types to each file, i.e. move the important types to its own file, and then export in the index file.
	- [x] (Commit: `cc0dd9a`) **Refactor**: Extract `RouteOptions` from `NavTypes` to its own file.
	- [x] (Commit: `72e38cb`) **Refactor**: Extract `NavigationObject` from `NavTypes` to its own file.

<br>

- [x]  (Commit: `c3dd061`) **Fix**: React routes flashing in when being pushed/transitioning in.
	- For routes with many views, it flickers because it's loading the subviews. Also the button freezes for a few ms when navigating to a route with many views.
		* Removing the await from `setState` in the `push` command doesn't really change much.
		* Calling `loadViewIfNeeded()` causes the safe area insets/scroll view insets for the route to not work.
	- Observing/Counting the total subviews for `NavigatorTest01`:
		* In `RNINavigatorView.insertReactSubviews`, it initially has <u>239</u> subviews.
		* By the time `loadView` and `viewDidLoad` is triggered in `RNINavigatorReactRouteViewController`, it has <u>239</u> total subviews (same as before).
		* After adding a 5 second delay in `viewDidLoad`, it now has <u>246</u> subviews (an additional 7 subviews were loaded).
		* Conclusion: The views have already been loaded, they're just not being (properly) shown yet?
	- Fixed by setting the frame/bounds of the `reactRouteContent` and calling `uiManager.setSize` (e.g. `notifyForBoundsChange`).

<br>

- [x] (Commit: `db219b9`) **Implement**: view controller based status bar 
	- Change the status bar style per view controller and expose it as a prop.
	- Tried replacing the root view controller in `RNINavigatorView` setup, but moving/transplanting the prev. root view controller's view to the new view controller always results in a black screen.
	- Added `RNIRootViewController` —  This is the view controller that should hold the `RCTRootView`. It doesn't really do much aside from delegating the `preferredStatusBarStyle` to last child view controller.
	- Added `RNINavigationController` — A subclass of `UINavigationController`, doesn't really do much aside from delegating the `preferredStatusBarStyle` to the active view controller.
	- Implemented `statusBarStyle` prop for `RNINavigatorView`.
	- Updated `RNINavigatorReactRouteViewController` to support setting the `statusBarStyle`.
	- Implemented support for setting `statusBarStyle` via `routeOptions`.
	- Updated `NavigatorTest01` and `NavigatorTest06` to test out the `statusBarStyle` via `routeOptions`  .

<br>

- [x]  **Fix**: Reloading the causes the following error for any navigation command: ` no corresponding 'RNINavigatorView' instance found for the given node`

	- Full error message: `Possible Unhandled Promise Rejection (id: 0): Error: 'NavigatorView' failed to do: 'push' with error: Error: RNINavigatorViewModule.push Error: Unable to 'push' because no corresponding 'RNINavigatorView' instance found for the given node - with debug: for node: 387 - with params, routeID: 1`.
	- Maybe related to commit: `2888fe5`, could be a regression?
	- Only happens on manual reload (no errors during fast refresh). Probably related to the navigator module?
	- [x] (Commit: `6141ecf`) **Fix**: Reverted  regression, reverted commit: `2888fe5`.
	- [x] (Commit: `6098069`) **Cleanup**: `RCTBridgeWillReloadNotification` Listeners.
	- [x] (Commit: `a754aad`) **Cleanup**:  Use built-in bridge instance instead of `sharedBridge` for the native modules.

<br>

- [x] (Commit: `d974b52`) **Fix**: `navBarAppearanceOverride` not resetting
	* Route sometimes flickering during push transition even after fix (commit: `a6e3186`).
	* When receiving a react route view from `RNINavigatorView.insertReactView`, set the bounds/frame of the route view to the navigator view's current frame//bounds, then call `notifyForBoundsChange`.

<br>

- [x] (Commit: `489a0af`)  **Fix**: `CompareObjects` - Wrong comparison for `ImageItemConfig`.

<br>

- [x] (Commit: `10ca12b`) **Implement**: `NavBarAppearance.shadowImage`
- [x] (Commit: `a481641`) **Implement**: `NavBarAppearance.backgroundImageContentMode`

<br>

- [x] **Implement**: `NavigatorRouteView` - `getRouteConstants` function.
	- A module function that can be called for each route to get route-related constants. The function returns a promise that resolves to return an object.
	- Should be callable as a ref. from the `NavigatorRouteView` component. Expose function via the navigation object.
	- [x] (Commit: `3c1e865`) **Implement**: `RNINavigatorRouteViewModule.getRouteConstants`
	- [x] (Commit: `a051e13`) **Implement**: Updated `NavigationObject` - Expose `RNINavigatorRouteViewModule.getRouteConstants`


<br>

- [x] (Commit: `4e12818`) **Implement**: Override `reactSetFrame` for route view to prevent layout updates caused by react.

- [x] **Implement**: `NavigatorView` - `getNavigatorConstants` function.
	- A module function that can be called for the navigator to get constants. The function returns a promise that resolves to return an object.
	- Should be callable as a ref. from the `NavigatorView` component. Expose function via the navigation object.
	- [x] (Commit: `41ce14a`) **Implement**: `RNINavigatorModule.getNavigatorConstants`
	- [x] (Commit: `548b8d3`) **Implement**: Updated `NavigationObject` - Expose `RNINavigatorModule.getNavigatorConstants`

<br>

- [x] (Commit: `548b8d3`) **Fix**: route view blur events not firing.

- [x] (Commit: `5a8fdff`) **Fix** ScrollView offset bug — Scrollview insets resetting/not updating during fast refresh.
	* To be more specific, it seems that the content offset is wrong, but the scroll indicator offsets are still correct?
	* Toggling the navigation bar visibility doesn't trigger this bug even when animated, it behaves correctly. However changing the status bar style inside an animation block triggers the bug. Changing the status bar style without any animation does not trigger the bug.
	* Possible Fix: Manually set the scroll view offsets, however this will disable the built-in behaviors for `RCTScrollView` (e.g. the offsets when a keyboard is shown, etc).
	* Observe the react scrollview property values before and after refresh.

		* `reactSuperview` became nil after fast refresh. 
		* The `reactSuperview` has a size of `(375.0, 667.0)` which matches the size of  `reactRouteContent` (i.e. the root view of the route vc). After some checking, the react superview of the react scrollview is in fact the `reactRouteContent` (which makes sense, but why did it become nil? Was it invalidated?)
		* `scrollview.safeAreaInsets` changed from `top: 0` to `top: 116`, and `contentInset` changed from `116` to `0`, and `scrollview.contentOffset` changes from `116` to `0`. However the `reactScrollview`'s `contentInset` and `safeAreaInsets` remain unchanged.
		* Calling `refreshContentInset`, `updateContentOffsetIfNeeded`, `updateConstraints`, `updateConstraintsIfNeeded`, `refreshContentInset`, `safeAreaInsetsDidChange`, on the react scrollview does nothing.
		* `reactSuperview` is just `superview`, so the superview of `RCTScrollView` became `nil`. It's window property also became nil. Meaning that this specific instance is no longer visible/used after the fast refresh.
		* But there is still a scroll view that's inter-actable after the fast refresh (it even updates properly when you add a new child in the scroll view). This suggests that after the fast refresh, the `RCTScrollView` was replaced by a different instance?
			* Before fast refresh: `0x7fb4c4454220`
			* After fast refresh: `0x7fb4c464c620`
			* The `RCTScrollView` instance was replaced after the fast refresh. So it probably isn't a good idea to directly save a reference of instances of react subviews since they can be replaced...
	* The fix is to not store a direct ref. to the "wrapper view".

<br>

- [x] (Commit: `45690a0`) **Fix**: `allowTouchEventsToPassThroughNavigationBar` not resetting when route exits.

<br>

- [x] (Commit: `5f149e2`) **Fix**: Release version of example project not compiling.
	- The debug build works, but the release build fails with 100+ errors.
	- The console outputs the following warnings:
		- `ld: warning: Could not find or use auto-linked library 'swiftDarwin'`
		- `ld: warning: Could not find or use auto-linked library 'swiftUIKit'`
		- `ld: warning: Could not find or use auto-linked library 'swiftFoundation'`
		- `ld: warning: Could not find or use auto-linked library 'swiftObjectiveC'`
		- `ld: warning: Could not find or use auto-linked library 'swiftCore'`
		- etc.
	- Then followed by `Undefined symbols for architecture arm64` , etc.
	- As the warning suggests, the auto-linking for the swift-related libraries isn't working. Manually linking the swift libraries in the build phase is a bad idea (but it does work).
		- Normally whenever you import a framework (e.g. `import UIKit`), it'll automagically link that framework to the binary so that you don't have to do it yourself.
	- This can usually be fixed by adding an empty swift file and a bridging header, but i've already done that and it's still not working for the release build.
		- Added the bridging header and empty swift file to the compile sources build phase but still nothing.
		- Checked if the "obj-c bridging header" build setting is valid.
		- Checked if the "always embed swift standard library" build setting is set to true.
		- According to the swift forums: "*you shouldn't need to add the toolchain library paths to LIBRARY_SEARCH_PATHS yourself, because Xcode will automatically include those libraries if your minimum deployment target is old enough to need them.*"
		- But as a last ditch attempt, I'm going to add `$(SDKROOT)/usr/lib/swift` as the first item to the library search path build setting so that the compiler "sees" the built-in swift libraries?
		- Example project now compiles but this might not be the correct solution.
	-  Now there's a problem with the "Bundle React Native code and images" build phase. It outputs the ff. error: ``
		- In other words the js bundle isn't being created because `index.js` cannot be found, which makes sense because i'm using typescript so I have a `index.tsx` file instead.
		- Fixed by following [this](https://github.com/facebook/react-native/issues/25522#issuecomment-585711247) github comment.

<br>

- [x] (Commit: `0c19c5e`) **Implement**: Add main queue setup for `RNINavigatorRouteViewModule` and `RNINavigatorViewModule`.
- [x] (Commit: `6564908`) **Fix**: Route header not updating size during rotate.

<br>

- [x] (Commit: `fa04c12`) **Implement**: `NavigatorView` - Impl.  `shouldSwizzleRootViewController` prop.
	- Swizzle the root view controller to replace it's base `childForStatusBarStyle` impl. from `UIViewController` with `RNIRootViewController.childForStatusBarStyle`'.

<br>

- [x] **Cleanup**: Example — Cleanup `NavigatorTest01`
	- [x] (Commit: `0b69024`) **Refactor**: Extracted base UI components to separate files.
	- [x] (Commit: `fcbbd9a`) **Refactor**: Remove all `@ts-ignore`, add proper type annotations, create utilities to cleanup code, (e.g. `getNextItemFromCyclicArray` + TS generics to infer type, etc.), extract section components into separate files, and general cleanup.

<br>

- [x] (Commit: `0bb913a`) **Implement**: Update NavBar Item Events Payload - Add index and base event payload to `leftBarButtonItem` and `rightBarButtonItem` events.
- [x] (Commit: `fdaf81b`) **Implement**: Navigator command error recovery - revert state to snapshot if command failed.
- [x] (Commit: `ead4f18`) **Implement**: `NavigatorRouteView`: Impl. `shouldComponentUpdate`
- [x]  (Commit: `43eb794`) **Implement**: `RNINavigatorViewConstants`.

<br>

- [x] (Commit: `59b5207`) **Fix**: `RNINavigatorRouteView` Layout Bug  — Route view flickering in during the push transition.
- [x] (Commit: `fa90081`) **Implement**: Impl. "UI constants" context provider — Will provide the navigation bar height, safe area values, the status bar height, etc.

---

<br><br>

## Completed (Archive)

- [x] Rename `initialRouteOptions` to `defaultRouteOptions`.  Instead of passing to state directly, `state.routeOptions` will be null and use `??` to assign `defaultRouteOptions`  from navigator route config.

- [x] Set `routeOptions` via portal props

	<br>

- [x] Create nav bar item component --- find a way to update `renderNavBarItem` when prop changes

	* One way is to create a `navbaritemprops` prop in the portal
	* Or maybe via `componentDidUpdate`, then notify navbaritems container comp. to update via ref?

	<br>

- [x] Forward `onPressNavBar` events to emitter.

- [x]  In nav bar items property `didSet`, when guard check fails reset the nav bar element, then notify delegate that it's `nil` to reset.

	<br>

- [x] Impl. `var prompt: String?`

- [x] Impl.  `UINavigationItem.LargeTitleDisplayMode`, and `largeTitleDisplayMode: UINavigationItem.LargeTitleDisplayMode`

- [x] impl. set hides back button in routeview

- [x] Impl. `navigationController?.navigationBar.prefersLargeTitles = true`

- [x] Impl. styling the large title (e.g [Large Title and Search in iOS 11](https://pavelgnatyuk.medium.com/large-title-and-search-in-ios-11-514d5e020cee))

- [x] Impl. support for setting swipe back gesture

- [x] Impl. animated true/false push

- [x] Impl. custom transitions

	<br>

- [x] Fix: transition duration bug crash

- [x] Update compare route object

- [x] Rename `defaultRouteOptions` to `routeOptionsDefault`

- [x] Impl. img cache

- [x] Support for nav bar appearance prop (not legacy)  for `NavigatorView`, e.g. `standardAppearance={...}` etc.

- [x] Bridge view did appear/dissapear

	<br>

- [x] Support for dark mode appearance/dynamic color

```
DynamicColorIOS:  {"dynamic": {"dark": "blue", "light": "red"}}
```

<br>

- [x] Support for custom bav bar background (Beta)

- [x] Test adding a subview to NavBar

	<br>

- [x] Impl. `navBarTransparent` and `navBarEnableShadow` (rename to something else)

- [x] Fix: custom title mount/unmount

- [x] Fix: promise reject when nav. too fast. `this.isPopped` ignore promise reject else throw an error.

- [x] Create navigation object

- [x] Update compare obj

- [x] Create solid image via object

- [x] Fix: nav bar title not resizing

- [x] Update route options to support setting the navigation bar via the legacy API or the appearance API

- [x] Impl. router + nav UUIID, and send to js via event - onNavUUIDSet (to fix bug where events fire for unrelated native comp when nested together) — e.g. `navigatorID` .

	<br>

- [x] Fix: pop override not working

- [x] Impl. other navigation commands: popToRoot

- [x] Impl. other navigation commands: replaceRoute

- [x] Impl. other navigation commands: insertRoute

- [x] Impl. other navigation commands: removeRoute

- [x] Fix: `removeRoute`

- [x] Impl. other navigation commands: removeRoutes

	<br>

- [x] Impl. the ability to push a native view controller

- [x] Impl. convenience nav. commands: `replacePreviousRoute`

- [x] Impl. convenience nav. commands: `removePreviousRoute`

- [x] Impl.  convenience nav. commands: `removeAllPrevRoutes`

	<br>

- [x] improve errors from nav. commands (e.g. append error message)

- [x] Update `popToRoot` to accept pop options (e.g. pop transition override)

- [x] Impl. queue for nav. commands

- [x] Update `replaceRoute` nav. command to accept route object

- [x] Make route view `routeID`, `routeIndex`, and `routeKey` implicitly unwrapped.

- [x] Make route vc `routeView` be  implicitly unwrapped?

	<br>

- [x] Refactor swift props to be explicitly unwrapped if you know that they will always exists

- [x] Update event: `onRouteAdded`: Include `routeKey` and `routeIndex` in promise.

- [x] Update `navStatus`  for nav. commands

- [x] Increase command timeout to 1000 ms
- [x] Rename `RNINavigatorRouteViewController` to `RNINavigatorReactRouteViewController`
- [x] Support for multiple init. routes (useful for state restoration)
- [x] Support pushing/popping from the native side
- [x] Add Test: Push/Pop with animations
- [x] Add Demo: Auto push pop native/js react route
- [x] implement transition: slide up/down

<br>

- [x] Refactor - Create generic func get view for id
- [x] Check if native routes are valid in component did mount (or make sure all native routes are declared in routes prop)

<br>

- [x] Implement delegate for navigator: e.g send data from js navigator -> native navigator delegate
- [x] Impl. navigator event: `onReceiveCustomCommandFromNative` - e.g. native command delegate (sendCustomCommandToJS)
- [x] Rename `sendCustomCommand` to `sendCustomCommandToNative`, and `didReceiveCustomCommand` to `didReceiveCustomCommandFromJS`

<br>

- [x] Change `RenderNavBarItemParams` for `RenderNavBarItem` to accept a navigation object
- [x] Create gradient image from dict/object config.

<br>

- [x] Spread `routeOptions` and `routeProps`
- [x] Example - Transfer native route example to example
- [x] Support for native route as the init. route
- [x] Remove optional properties from Navigation Object
- [x] Implement weak dict for all the navigator instances `navigatorInstances[navigatorID]`
- [x] Move `applyBackConfig` out of `BackItemConfig` into separate prop: `applyBackConfigToCurrentRoute`.

<br>

* [x] (Commit `e59c4dd`) **Implement**: Minimal/Basic Implementation of `UISearchController`.

	- Show a route with a `UISearchController`.
	- Forward `UISearchResultsUpdating` delegate as events.
	- Forward `UISearchBarDelegate` as events:
		- `searchBarSearchButtonClicked`, `searchBarBookmarkButtonClicked`, `searchBarSearchButtonClicked`, 
	- Support for setting the ff. `UISearchController` properties via route props:
		- `UISearchController`: `hidesNavigationBarDuringPresentation`, `automaticallyShowsCancelButton`,  `obscuresBackgroundDuringPresentation`
		- `UISearchBar`: `placeholder`
		- `UISearchBar.searchTextField`: `textColor`.
* [x] (Commit: `87668fc`) **Implement**: Update search config to support setting the `leftIconTintColor`, `placeholderTextColor`, and `searchTextFieldBackgroundColor`.

------

<br>

## Abandoned (Archive)

- [ ] ABANDONED: Navigator: Add JS event: `routeDidMount` and wait for it to fire in `addRoute`
- [ ] ABANDONED: Rename `addRoute` to `addRouteToState`
- [ ] ABANDONED: Extract from `replaceRoute`: `replaceRouteFromState`
- [ ] ABANDONED: Update nav. commands to use `NAV_ABORT` in `NavStatus

<br>

- [ ] Impl `imageRequire` (Too buggy)
- [ ] Create collapsing navigation bar

<br>

- [ ] **Implement**: Adopt `RCTInvalidating` protocol for all the `UIView`/`RCTView` subclasses.
	- Tried reloading and fast refresh but `RCTInvalidating.invalidate` is not being invoked.
	- It seems that `RCTInvalidating` is only meant to be used with view managers and native modules.

<br>

- [ ] Update `OnRoutePop` to receive `isAnimated` parameter.
	- Cannot be impl. because `animated` is only available in `willAppear`/`didAppear` and not in `willMove`/`didMove`.

<br>

- [ ] **Fix**: Starting the back  gesture by slowly swiping left, then immediately swiping right and letting go (i.e. to cancel the back gesture) causes the navigation bar to become transparent with a large title even though the scroll offset isn't at the very top (i.e. the navigation bar flickers, and becomes temporarily see through).
	* This bug can be reproduced using `NavigatorTest01` route.
	* In other words, the large title appears even though it shouldn't (due to the current scroll offset).
	* It's as though the configuration was restored/re-applied when the route was focused again (could be some logic in the VC lifecycle, e.g. `viewWillAppear`, etc).
	* Might be a bug related to the appearance config restoration logic (i.e. likely related the restoration of the navigation bar from the previous route, or the "re-application" of the current route's config when the swipe back gesture is cancelled and becomes in focus again).
		* Still persist even after navigator override config refactor in commit `5395fb2`.
	* Might also be related to `setupScrollView`?
	* As of version `0.4.0` this is no longer reproducible. Might have been fixed in commit `0ee17f5`.

