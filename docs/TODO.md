# TODO

## Table of Contents

[TOC]

---

<br>

## In Progress

- [ ] **Implement**: `NavigatorRouteView` - `getConstants` function.
	- A module function that can be called for each route to get route-related constants. The function returns a promise that resolves to return the following constants: ``.
	- Should be callable as a ref. from the `NavigatorRouteView` component. Expose function via the navigation object.

<br>

- [ ] **Fix**: Route flickering during push transition.
	* When receiving a react route view from `RNINavigatorView.insertReactView`, set the bounds/frame of the route view to the navigator view's current frame//bounds, then call `notifyForBoundsChange`.

---

<br>

## Implement


- [ ] **Implement**: Create shared package: `react-native-shared-utilities`

	- Move `RNIUtilities` and other utility classes/functions to this package, i.e. extract utility functions to be shared across the other libraries.
	- `Extension+Init` should also be moved to this package, but should be "opt-in" extensions.

		- E.g. for a `UIColor` extension, create: `protocol RNIColor` then provide its implementation:  `extension RNIColor where Self: UIColor`. 
		- Then in the library that's going to use it: `extension UIColor: RNIColor {}` so it's accessible via `UIColor` directly.
		- This way the extension aren't applied automatically/globally, but instead  is applied internally for each module that is using it.
		- Unfortunately, this means having to explicitly adopt each extension one by one. Maybe put them in a single file called `RNIExtensions` so it isn't too cluttered.
	- Create shared protocols/delegates so the libraries can interact with each other (e.g. `react-native-ios-navigator` <-> `react=native-ios-modal`)

		- `RNINavigatorViewSharedDelegate`: Expose functions such as getting the `UINavigationController` instance, presenting a view controller, etc.
		- `RNINavigatorRouteViewSharedDelegate`: Get the corresponding view controller instance associated with the current route view controller, expose function for presenting a view controller.
	- Note: For each library that will depend on this, create a table of which version of `react-native-shared-utilities` it uses. 

		- E.g. `react-native-ios-navigator` 0.1.1 = `react-native-shared-utilities` 2.1. 
		- This could get messy really fast, so every time you make changes to `react-native-shared-utilities`, make sure to update the dependencies as well.
		- When adding functionality to existing protocols, make sure that they're optional.

<br>

- [ ] **Implement**: Support for pushing native routes with `routeOptions`

- [ ] **Implement**: Add prop  `lazyMountRoute`
- [ ] **Implement**: transition: zoom in/out
- [ ] **Implement**: transition: flip

<br>

- [ ] **Implement**: send/receive data from react route -> native route, e.g. via nav. command `sendDataToNativeRoute(routeID)` -> `override func onReceiveDataFromJSReact`
- [ ] **Implement**: send/receive data from native route -> js route, e.g. via event `sendDataToReactRoute()` -> `onReceiveDataFromNative(event)`

<br>

- [ ] **Implement**: navigation controller toolbar: e.g. `navigationItem.toolbarItems`

<br>

- [ ] **Implement**: navigator nativeLabel
- [ ] **Implement**: Maybe: Add example to show `nativeLabel` usage (use nativeID instead?) (maybe)
- [ ] **Implement**:  Expose a way to listen for nav-related events from the navigator via events, e.g. onRouteWillPush etc. (maybe)

<br>

- [ ] **Implement**: Add easing to transition config


- [ ] **Implement**: Update nav route to support lazy mount


- [ ] **Implement**: refactor renderX props to receive component instead of functional comps and use createElement + pass props to speed up because there might be a perf. penalty doing the former? Not sure.

<br>


- [ ] **Implement**: Create custom animation stack push (like card, fromview static zoom out, toView left)
- [ ] **Implement**: RouteView isFocused in state, in vc will appear/disappear check if vc is actually focused or not before sending event

<br>

- [ ] **Implement**:  animate `statusBarStyle` changes when transitioning between different styles.
	- Current implementation doesn't animate the status bar changes because when putting `setNeedsStatusBarAppearanceUpdate()` inside an animation block using `UIView.animate()` it triggers the `ScrollView` offset bug.

- [ ] **Implement**: Status bar animation should animate together with view controller transition + swipe back pop gesture.
	- Implement status bar animation inside `animate(alongsideTransition:completion:)` in `UIViewControllerTransitionCoordinator`.

<br>

- [ ] **Implement**: Adopt `RCTInvalidating` protocol for all the `UIView`/`RCTView` subclasses.

---

<br>

## Refactor/Cleanup


- [ ] **Refactor**: Create navigator utilities file and move helper functions like `isNavBusy`, `compareRouteOptions`, etc.
- [ ] **Refactor**: Export handlers for events so that types can applied more easily to event handler functions.
- [ ] **Refactor**: Add `shouldComponentUpdate` to `NavigatorRouteView` and `NavigatorView` to prevent excessive renders (especially when manipulating `state.activeRoutes` via the navigation commands).
- [ ] **Refactor**: Export types from native components to index.

<br>


- [ ] **Cleanup**: Swift — Replace all usage of `NSString` with `String`
- [ ] **Cleanup**: Swift — In property wrappers, replace all usage of `didSet` with `willSet` 
- [ ] **Cleanup**: Swift — Replace all imports of `Foundation` with `UIKit`  
- [ ] **Cleanup**: Types — Add JSDoc comments to types that shadow UIKit types.

<br>

- [ ] **Cleanup**: Example — Cleanup `NavigatorTest01`
	- [ ] **Refactor**: Create shared/reusable components
	- [ ] **Refactor**: Use proper types, e.g. remove al `@ts-ignore`, add proper type annotations etc.
	- [ ] **Cleanup**: Create utilities to cleanup code, e.g. `getNextItemFromCyclicArray` + TS generics to infer type, etc. 

<br>

- [ ] **Refactor**: Replace `IF DEBUG` with `IF RNI_NAV_DEBUG`

* Tested by adding `RNI_NAV_DEBUG` to the `Other Swift Flags` build setting for `IosNavigatorExample` but it didn't seem to work.

<br>

- [ ] **Refactor**: Create separate class for native route that inherits from base view controller
- [ ] **Refactor**: Create delegate `NavigatorRouteItem` for computed properties for `routeID`, `routeIndex`, and `routeKey` . 

<br>

- [ ] **Cleanup**: Add JSDoc comments to `RouteOptions`
- [ ] **Cleanup**: Add JSDoc comments to `NavigationObject`
- [ ] **Cleanup**: Replace back tick usage in print/error logs with comma's.

------

<br>

## Bugs

- [ ] **Fix**: Layout not updating when the navigation bar is hidden or shown, possibly due to `SafeAreaView`
	- Possible fix: `setLocalData`, e,g `RCTSafeAreaViewLocalData *localData = [[RCTSafeAreaViewLocalData alloc] initWithInsets:safeAreaInsets];`
	- did not work: `safeAreaInsetsDidChange`, `layoutSubviews

<br>

- [ ] **Fix**: autolayout warnings
- [ ] **Fix** back swipe sometimes not working (`percentDrivenTransitions`)
- [ ] **Fix** ScrollView offset bug resetting/not updating during fast refresh.
	* To be more specific, it seems that the content offset is wrong, but the scroll indicator offsets are still correct?
	* Toggling the navigation bar visibility doesn't trigger this bug even when animated, it behaves correctly. However changing the status bar style inside an animation block triggers the bug. Changing the status bar style without any animation does not trigger the bug.
	* Manually set the scroll view offsets, however this will disable the built-in behaviors for `RCTScrollView` (e.g. the offsets when a keyboard is shown).

<br>

- [ ] **Fix**: `RouteHeaderView` - Values received from props are not updating
	* Component re-renders but the prop doesn't change (tried `forceUpdate()` on the portal component and the `RouteHeaderView` itself ).
	* Guess: It could have something to do with the fact that  `RouteHeaderView` is being rendered somewhere else. Also in `RouteViewPortal` it's being passed as function component, but the prop it's depending on is outside the component.
	* Logging the props in `RouteHeaderView` render shows that the props aren't updating even though the component is updating. The props are frozen to the initial prop value.
	* See `NavigatorTest06`.

---

<br>

## Test/Example

- [ ] **Test**: Push empty react/native routes w/ `routeProps`
	* Test if the `routeProps` are properly being sent over to routes.

<br>

- [ ] **Test**: Demo for navigation bar appearance (i.e. like `NavigatorTest01` but in demo form).
	* Automatically push routes consecutively/one after the other. Each route will have `routeOptions` that will change the appearance of the route's navigation bar

<br>

- [ ] **Example**: Add test for multiple initial routes + test for initial native route

---

<br>

## Completed

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

------

<br>

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

- [x] Move `applyBackConfig` out of `BackItemConfig` into separate prop: `applyBackConfigToCurrentRoute`

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

