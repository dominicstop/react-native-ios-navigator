# TODO

## In Progress

* [ ] **Implement**: Impl. setting `showsSearchResultsButton`  for `UISearchBar`.

<br>

## Unsorted

- [ ] Search bar `isTranslucent` not working.

- [ ] **Implement**: Update `RNIImageItem`: Make width/height optional (e.g. rely on `defaultSize`)
- [ ] **Cleanup**: Rewrite  `getSecondToLastRouteVC`
- [ ] Use `TurboModules` + `JSI`.
- [ ] **Implement**: `NavigatorView` — Impl. `modalPresentationCapturesStatusBarAppearance` prop.

<br>

- [ ] Possibly trigger `syncRoutesFromNative` from native when active routes diverged.
- [ ] Impl. On Modal Event

	- AFAIK there isn't way to do this without subclassing `UINavigationController` and overriding `present` method.
	- AFAIK when a modal is presented on a child VC it doesn't trigger the parent VC's `present` method.

- [ ] Refactor: Allow pushing regular `UIViewController` instances
	-  Refactor native active routes to be `(routeData, UIViewController)`.
	- Route data is not stored in the properties.
	- There could also be a dictionary of weak references to `UIViewController`. The dictionary will then contain all the other route data.

<br>

* [ ] **Examples**: Update `NavigatorTest02`
* [ ] Add support for using `RouteHeader` when the navigation bar is hidden.
* [ ] Impl. swift extension  `notEmptyAndAllSatisfy`
* [ ] **Refactor**: Remove TS Enums
* [ ] **Cleanup**: Clean native comments —  remove unnecessary comments
* [ ] Expose `UIViewController` properties as props/route options, e.g.: `preferredStatusBarUpdateAnimation`, `shouldAutorotate`, etc.
* [ ] Add route to example that tests out the search config.

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

* `UISearchController`/`UISearchBar`-Related.
	* [ ] **Implement**: Add support for setting the `UISearchBar.searchTextField`'s text style using `RCTTextAttributes`.
		- `attributedText`, `attributedPlaceholder`.
		- Get the `defaultTextAttributes` and apply it  as the initial values for `attributedText` + `attributedPlaceholder`.
		- It turns out `attributedText` and `attributedPlaceholder` accepts a `NSAttributedString` not a dict. of string attributes. So the `RCTTextAttributes` has to be applied during the text input event.
	* [ ] **Implement**: Add support for changing the Search Icon in a `UISearchBar`.
		- Set via `searchBar.setRightImage` (i.e. the `textfield.rightView`  bookmark icon), and `searchBar.setLeftImage`.
		- [Reference #1](https://betterprogramming.pub/how-to-change-the-search-icon-in-a-uisearchbar-150b775fb6c8), [Reference #2](https://medium.com/flawless-app-stories/customize-uisearchbar-for-different-ios-versions-6ee02f4d4419)
	* [ ] **Implement**: Add support for `showsBookmarkButton` and `searchBarBookmarkButtonClicked` event.
		* Maybe also impl. `showsSearchResultsButton`
	* [ ] **Implement**: Add support for showing a `searchResultsController` + react view
		-  The react view will  be "provided" by the route via the route portal.
	* [ ] **Implement**: Add support for configuring/setting the scope bar/`scopeButtonTitles`.
		* Also, forward search bar event: `selectedScopeButtonIndexDidChange`.
	* [ ] **Implement**: Impl. support for configuring `UISearchTextField`: e.g. add support for search tokens.
		* Impl. setting the `tokenBackgroundColor`, etc,
	* [ ] **Implement:** Expose `UITextInputTraits`-related properies for `UISearchBar` .
		* E.g.  `keyboardType`, `textContentType`, etc.
	* [ ] **Implement**: Add missing impl. for setting the other `UISearchBar` properties, e.g. background images, etc.
	* [ ] **Implement**: Add support for `inputAssistantItem` (iPad only).
	* [ ] **Implement**: Add support for `inputAccessoryView`.

<br>

* `NavBarItemConfig`-Related.
	* [ ] **Implement**: Update `NavBarItemConfig` to support configuring [`UIBarItem`](https://developer.apple.com/documentation/uikit/uibaritem) 
		* (e.g. `isEnabled`, `setTitleTextAttributes`).
	* [ ] **Implement**: Update `NavBarItemConfig` to support iOS 15+ [`UIBarButtonItem`](https://developer.apple.com/documentation/uikit/uibarbuttonitem) properties.
		* e.g. `isSelected`, `changesSelectionAsPrimaryAction`

	* [ ] **Implement**: Update `NavBarItemConfig` to support multiple custom navigation bar items.
	* [ ] **Implement**: Update `NavBarItemConfig` to support menu and submenu actions.

<br>

* Route Transition-Related
	* [ ] **Implement**: Update `CustomAnimator` to accept animation options from JS.
		- Any dict variable initialized from JS object.
		- Each custom animator subclass will read the dict var via a property wrapper (e.g. for `FlipHorizontalAnimator`, the options could be `reverseFlipDirection: Bool` , `scaleFactor`, etc).
		- Allow setting of easing, but provide defaults when no value provided. Each animator subclass can override the default when needed
	* [ ] **Implement**: Allow for user-defined `CustomAnimator` 
		- Impl. custom animator registry dictionary where a key + `CustomAnimator` subclass can be registered.
		- `RNINavTransitionConfig.makeAnimator` will lookup if the animation key corresponds to a custom animator and will use it. 
	* [ ] **Implement**: Add easing to transition config.
	* [ ] **Implement**: Create custom animation stack push (like card).

<br>

* Navigation-Bar Appearance Related:

	* [ ] **Refactor:**  Rewrite navigation bar appearance reset
		- Only reset the appearance properties that have changed.
		- There's a bug in UIKit where if you use the appearance API, its corresponding legacy counterpart will no longer work.

	- [ ] **Implement**: Expose `backIndicatorTransitionMaskImage`.
	- [ ] **Implement**: Add Navigation Bar `mixed` mode (e.g. use legacy and appearance at the same time).
	- [ ] **Implement**: Add `legacyTintColor` for navigation bar appearance mode.
	- [ ] **Implement**: Update legacy `backgroundImage` to support setting [`barPosition`](https://developer.apple.com/documentation/uikit/uinavigationbar/1624968-setbackgroundimage)

<br>

* Image-Config Related:
	* [ ] **Implement**: Add support blur for image config.
	* [ ] **Implement**: Add support image type: `LOCAL_URI`

<br>

- [ ] **Implement**: Add support for `UISplitViewController`.

- [ ] **Implement**: Support for pushing native routes with `routeOptions`.

	- Partial suport implemented in commit `5a50646` (navigator config override).
	- Partial support implemented in commit `558ce57` (status bar style).

<br>

- [ ] **Implement**: Add prop  `lazyMountRoute` 
- [ ] **Implement**: send/receive data from react route -> native route, e.g. via nav. command `sendDataToNativeRoute(routeID)` -> `override func onReceiveDataFromJSReact`
- [ ] **Implement**: send/receive data from native route -> js route, e.g. via event `sendDataToReactRoute()` -> `onReceiveDataFromNative(event)`

<br>

- [ ] **Implement**: navigation controller toolbar: e.g. `navigationItem.toolbarItems`
- [ ] **Implement**: navigator nativeLabel
- [ ] **Implement**: Maybe: Add example to show `nativeLabel` usage (use nativeID instead?) (maybe)
- [ ] **Implement**:  Expose a way to listen for nav-related events from the navigator via events, e.g. onRouteWillPush etc. (maybe).
- [ ] **Implement**: Update nav route to support lazy mount
- [ ] **Implement**: refactor renderX props to receive component instead of functional comps and use createElement + pass props to speed up because there might be a perf. penalty doing the former? Not sure.
- [ ] **Implement**: RouteView isFocused in state, in vc will appear/disappear check if vc is actually focused or not before sending event

<br>

- [ ] **Implement**:  animate `statusBarStyle` changes when transitioning between different styles.
	- Current implementation doesn't animate the status bar changes because when putting `setNeedsStatusBarAppearanceUpdate()` inside an animation block using `UIView.animate()` it triggers the `ScrollView` offset bug.

<br>

- [ ] **Implement**: Add support for setting the root view's background color.
- [ ] **Implement**: Create `RouteHeaderContainer` — a native component that will copy the navigation bar's current height.

	- Basically the navigation bar can have varying heights depending on how big the screen (e.g. the safe area for iPhone 8 vs. iPhone X), the current screen orientation, and the current appearance of the navigation bar (e.g. "standard", "compact" and "scroll edge").
		- For iPhone 8, the navigation bar height when on landscape is 33,

<br>

- [ ] **Implement**: Impl. `RouteRootView` as a potential replacement for the `RoutePortal` component.
	* Instead of a regular view, a `RouteRootView` will be the root component for a route.
	* The `RouteRootView` is a dummy component, it doesn't actually render anything, but like the `RoutePortal` component, it will allow for setting the `RouteOptions` and receiving route-related events.
		* The diff. is that instead of redirecting the `RouteOptions` + route events to the parent `NavigatorRouteView` using the `RoutePortal`, the `RouteRootView` will do it directly in the native side.
		* Though, this complicates things because there are default route options that is declared in the `NavigatorView`'s route config.
		* Idk maybe this isn't a good idea...

<br>

- [ ] **Implement**: `NavigatorView` event: `onRouteFocusWillChange` and `onRouteFocusDidChange`.
	- Event Args: `nativeEvent.prevInFocus`, and `nativeEvent.nextInFocus`.
- [ ] **Implement**: Update route config (i.e. `NavRouteConfigItemJS`) to accept `renderRouteHeader`.

<br>

- [ ] **Implement**: Disable clipping in the navigation bar.
	- When a navigation bar item is bigger than the navigation bar, the navigation bar item is clipped.
	- Setting `navigationBar.clipToBounds` to `false` does nothing (and recursively doing this to its subviews also does nothing).
		- Disabling `clipToBounds` for all the subviews in `navigationController.view` does nothing.
		- Setting `overflow: visible` to the `RNIWrapperView` also does nothing.

---

<br>

## Refactor/Cleanup


- [ ] **Refactor**: Create navigator utilities file and move helper functions like `isNavBusy`, `compareRouteOptions`, etc.
- [ ] **Refactor**: Export handlers for events so that types can applied more easily to event handler functions.
- [ ] **Refactor**: Export types from native components to index.
- [ ] **Refactor**: Update component ref usage


	- Use `React.createRef()` and `ref.current`.

<br>


- [ ] **Cleanup**: Swift — Replace all usage of `NSString` with `String`
- [ ] **Cleanup**: Swift — In property wrappers, replace all usage of `didSet` with `willSet` 
- [ ] **Cleanup**: Swift — Replace all imports of `Foundation` with `UIKit`  
- [ ] **Cleanup**: Types — Add JSDoc comments to types that shadow UIKit types.

<br>

- [ ] **Refactor**: Replace `IF DEBUG` with `IF RNI_NAV_DEBUG`

	- Tested by adding `RNI_NAV_DEBUG` to the `Other Swift Flags` build setting for `IosNavigatorExample` but it didn't seem to work.

<br>

- [ ] **Refactor**: Create separate class for native route that inherits from base view controller
- [ ] **Refactor**: Create delegate `NavigatorRouteItem` for computed properties for `routeID`, `routeIndex`, and `routeKey` . 

<br>

- [ ] **Cleanup**: Add JSDoc comments to `RouteOptions`
- [ ] **Cleanup**: Add JSDoc comments to `NavigationObject`
- [ ] **Cleanup**: Replace back tick usage in print/error logs with comma's.

<br>

------

<br>

## Bugs

- [ ] **Fix**: Layout not updating when the navigation bar is hidden or shown, possibly due to `SafeAreaView`
	- Possible fix: `setLocalData`, e,g `RCTSafeAreaViewLocalData *localData = [[RCTSafeAreaViewLocalData alloc] initWithInsets:safeAreaInsets];`
	- did not work: `safeAreaInsetsDidChange`, `layoutSubviews`.

<br>

- [ ] **Fix**: `RCTScrollView` indicator insets is wrong.
  - For devices with notches, the scroll view insets for the left and right of the screen is wrong. The top and bottom insets are correct (e.g. the scroll indicator insets are insetted from the home indicator and navigation bar).

<br>

- [ ] **Fix**: Some route events are not triggered since the route has already been unmounted.
	- This is dues to the fact that the route is removed from `state.activeRoutes` before the route could receive the event from the native side.
	- Possible culprits: `replaceRoute`, `setRoutes`

<br>

- [ ] **Fix**: navigation bar `backIndicatorImage` and `backIndicatorTransitionMaskImage` not resetting to the original chevron back button icon.
	- Possible `UIKit` bug, according to the debugger, `backIndicatorImage` is already set to `nil`,  and yet the back icon is not being reset to the original back button chevron icons.
	- Persist across different view controllers/routes being pushed.
	- **Note**: The default value for `backIndicatorImage` is `nil` (i.e. `UINavigationBar.appearance()`).

<br>

- [ ] **Fix**: Shadow styles not applying to the text styles for navigation bar title and large title.
	* Shadow is a view property and not a text style.

<br>

* Back-gesture related bugs.

  - [ ] **Fix**: The header custom `backgroundImage` image and `shadowImage` doesn't transition properly, e.g. the `backgroundImage` abruptly disappears, and the `shadowImage` transitions to the wrong height (i.e. the default hair width height, but stretched vertically).
  	* This bug is present in both appearance and appearance legacy mode (so it's a potential bug in UIKit).
  	* Partially fixed in commit `589384c` (i.e. the navigation bar background + shadow now fades in when the transition is cancelled).

---

<br>

## Test/Example

- [ ] **Test**: Push empty react/native routes w/ `routeProps`
	* Test if the `routeProps` are properly being sent over to routes.

<br>

- [ ] **Test**: Demo for navigation bar appearance (i.e. like `NavigatorTest01` but in demo form).
	* Automatically push routes consecutively/one after the other. Each route will have `routeOptions` that will change the appearance of the route's navigation bar

<br>

- [ ] **Test**: Update route props (e.g. via `setRoutes`, etc). 

- [ ] **Example**: Add test for multiple initial routes + test for initial native route.
- [ ] **Test**: Scroll view with headers and footers, snapping, etc.
- [ ] **Example**: Add new showcase for `RouteHeaderView` — An article screen with a large header that snaps into place.
- [ ] **Example**: Add new showcase for `RouteHeaderView` — A header that has complex controls when expanded (e.g. kinda like [this](https://uptech.team/blog/implement-airbnb-like-expandable-menu-on-ios)).
- [ ] **Example**: Update `NavigatorTest02`
- [ ] **Example**: Create "item picker" example.
	- A new route is pushed that will present a list of options. When an item is selected, the selected item should be sent back to the previous route.
	- Send a function via route props to the "sub" route that will call set state on the "main" route. 

---

<br>

## TODO from Code

- [ ] `TODO (001)`: `RNINavigatorRouteView.cleanup` — Crash sometimes occurring when detaching touch handler.
- [ ] `TODO (006)`: `RNINavigatorRouteHeaderView.setup` — Refactor: use view controller containment/child vc.
- [ ] `TODO (007)`: `RNINavigatorRouteView.insertReactSubview` — use `RNIWrapperView` for `RouteContent` so we can clean this up.
- [ ] `TODO (008)`: `RNINavigatorReactRouteViewController.overrideIsNavBarHidden` — Bug: when hiding nav bar, scrollview still snaps.
- [ ] `TODO (010)`: `NavRouteConfigItemExtended` — Moved type to `types/InternalTypes.`
- [ ] `TODO (011)`: `NavigatorView.setRoutes` — Use this command to replace existing native navigation commands.
- [ ] `TODO (012)`: `NavigatorView._handleOnNativeCommandRequest` — Cleanup: Extract to sep. functions.
- [ ] `TODO (013)`: `withRouteViewLifecycle` — Delete file + impl.
- [ ] `TODO (014)`: `NavBarAppearanceBaseConfig` — Rename type to `NavBarAppearanceBaseConfigType` and export
- [ ] `TODO (017)`: `NavigatorView.verifyProps` — Add user-defined type guard

---

<br>

## Completed

### Version: `next`

- [x] (Commit: `91d415d`) **Cleanup**: Replace usage of `RCTBridgeWillReloadNotification` with `invalidate` in the native modules.
- [x] (Commit: `71c0f43`) **Implement**:  Add navigation command:  `getNavigationObjectForRoute`.

<br>

- Implement convenience navigation commands based on `getMatchingRouteStackItem`:
	* [x] (Commit: `c16be87`) **Implement**:  Add convenience navigation command:  `getRouteStackItemForCurrentRoute`.
	* [x] (Commit: `8c1ba88`) **Implement**:  Add convenience navigation command:  `getRouteStackItemForPreviousRoute`.
	* [x] (Commit: `558094a`) **Implement**: Add convenience navigation command: `getNavigationObjectForCurrentRoute`.
	* [x] (Commit: `e4257d0`) **Implement**: Add convenience navigation command: `getNavigationObjectForPreviousRoute`.
	* [x] (Commit: `e4257d0`) **Implement**: Add convenience navigation command: `setRouteOptionsForRoute` .
	* [x] (Commit: `97a0115`) **Implement**: Add convenience navigation command: `getRouteOptionsForRoute`.
	* [x] (Commit: `222c6b4`) **Implement**: Add convenience navigation command: `setRouteOptionsForCurrentRoute` .
	* [x] (Commit: `7a25338`) **Implement**: Add convenience navigation command: `getRouteOptionsForCurrentRoute` .
	* [x] (Commit: `829f16a`) **Implement**: Add convenience navigation command: `setRouteOptionsForPreviousRoute` .
	* [x] (Commit: `c4d0f80`) **Implement**: Add convenience navigation command: `getRouteOptionsForPreviousRoute` .

<br>

- [x] (Commit: `4766bf8`) **Fix**: Fixed `RNISearchControllerConfig` reset logic (e.g. `placeholderTextColor`, `leftIconTintColor`, etc).

* [x] (Commit: `bc03f8b`) **Implement**: Impl. search route module command `getRouteSearchControllerState`. 
	* Returns object that contains: search bar text, `isActive`,  `isSearchResultsButtonSelected`, `showsCancelButton`, etc.
	* Reads the properties and returns the current state of the search bar.

<br>

- [x] (Commit: `c7fe3f9`): **Fix**: Fix route search controller not being created/initialized properly when `RouteOptions.searchBarConfig` is set after the route has already been pushed.

* [x] (Commit: `77ccc0c`) **Implement**: Impl. search route module command `setSearchBarState`.
	* Set all the "search bar"-related properties that cannot be mapped to a prop (e.g. since some properties can be changed from the native side, causing the JS value to be out of sync since the data flows only in one direction).
	* Includes: `UISearchController.isActive`, the current value of the search bar text filed, etc.
	* [x] **Implement**: Add support for programmatically showing/dismissing the search bar.
		* This can implemented via the [`UISearchController.isActive`](https://developer.apple.com/documentation/uikit/uisearchcontroller/1618659-isactive) property.
		* Toggle `UISearchController.isActive` via a route module command. This can potentially be done async with the promise resolving when the transition is finished.
		* Also: this has to be paired with another command that reads the current value.
		* This can be impl. so that it directly maps to a boolean prop, and set the `UISearchController.isActive` in  a property wrapper (i.e. `willSet`/`didSet`).
			* However, the value from JS and native will always eventually diverge since its not being set bi-directionally (e.g. the prop value is `true`, but the search bar can be dismissed by the user so the actual value becomes `false`).
			* Encountered the same problem with `UINavigationBar.isHidden` or with state-controlled text fields.
		* Alternatively, the `isActive` property can also be set via `setSearchBarState` command.

<br>

* [x] (Commit: `5dc9a7e`) **Implement**: Expose remaining `UISearchController` events to react e.g. `willDismissSearchController`, `didDismissSearchController`, `willPresentSearchController`, and `didPresentSearchController`.

* [x] (Commit: `f25a3e8`) **Implement**: Impl. setting `prompt` for `UISearchBar`.
	* Note: Setting the prompt does nothing...

<br>

### Version: `0.4.2`

- [x] (Commit: `e8088ae`) **Refactor**: Update `NavigatorRouteView` to separately store the `routeOptions` provided by  `RouteViewPortal` and the `NavigatorRouteView.setRouteOptions` command.
- [x] (Commit: `2a96717`) **Fix**: Clear `routeOptionsPortal`  when `RouteViewPortal` unmount's.
- [x] (Commit: `e65b575`) **Docs**: Add section to README: `RouteOptions` Precedence/Hierarchy.

<br>

### Version: `0.4.1`

- [x] (Commit: `07c048d`) **Implement**: Update `NavBarItemConfig` to support creating  `fixedSpace` and  `flexibleSpace` bar items.
- [x] (Commit: `3882792`) **Fix**: `navBarAppearance` being set after unmount, causing a "force unwrap"-related crash.
- [x] (Commit: `18af2a3`) **Fix**: Crash due to `navigatorID` being forced unwrap in `RNINavigatorView.setupInitialRoutes`.

<br>

### Version: `0.4.0`

- [x] Checked if the example project still runs on iOS 15
	* Project is now built using Xcode 13.

<br>

- [x] (Commit: `507ded1`) **Implement**: Impl. `NavBarAppearancePresets`.
- [x] (Commit: `497453d`) **Implement**: Impl. `disableTransparentNavBarScrollEdgeAppearance` `NavigatorView` prop.

<br>

- [x] (Commit: `76b7abe`) **Implement**: Impl. Navigation Bar Buttom Item Appearance
	- [x] `TODO (003)`: `RNINavBarAppearance` — Impl. property: `backButtonAppearance`.
	- [x] `TODO (004)`: `RNINavBarAppearance` — Impl. property: `doneButtonAppearance`.
	- [x] `TODO (005)`:  `RNINavBarAppearance` — Impl. property: `UIBarButtonItemAppearance`.
	- [x] `TODO (015)`: `NavBarBackItemConfig` — Type incomplete, missing back-button related properties + Impl.
		- Related to: `TODO (003)`, `TODO (004)`, and `TODO (005)`.

<br>

- [x] (Commit: `7426c01`) **Implement**: Impl. `compactScrollEdgeAppearance` appearance mode.
- [x] (Commit: `ca5beff`) **Cleanup**: Remove debug logs in native code. 
- [x] (Commit: `6fce697`) Impl. `NavBarAppearanceConfig.useStandardAppearanceAsDefault`.
- [x] (Commit:  `b6f1d56`) **Implement**: Update `ImageItemConfig` to support `UIImage.SymbolConfiguration` and options to configure the `UIImage` rendering.
- [x] (Commit:  `4c6a1f9`) **Fix**: Fix `disableTransparentNavBarScrollEdgeAppearance` being applied to routes that implicitly have a `scrollEdgeAppearance` when  `RNINavBarAppearance.useStandardAppearanceAsDefault` is set to `true`.
- [x] (Commit:  `df03b7f`) **Cleanup**: Fix Xcode `MARK:-` comments.
- [x] (Commit: `0ee17f5`) **Fix**: Navigation bar right item transition — the navigation bar right item slides in from the left when the interactive pop transition is cancelled.

<br>

### Version: `0.3.1`

- [x] (Commit: `4bf1c98`) **Fix**: `routeOptions` that is set via `NavigatorView.initialRoutes` not working.
- [x] (Commit: `71cff3c`) **Fix**: Navigation bar legacy appearance-related regressions/bugs
	- After the big refactor related to the navigation override logic (i.e. in commit: `5395fb2` on version `0.3.0`), setting the navigation bar shadow via the legacy appearance no longer works properly.
		- It looks like the height of the shadow image is wrong, it's being set but the height is set to 1 px (might be related to `RNIImageItem`).
	- The navigation bar legacy appearance config also does not properly reset in certain cases. It seems that the prev. configurations are being carried over unless explicitly overwritten.

<br>

### Version: `0.3.0`

- [x] (Commit: `7cdae0d`) **Refactor**: Re-write error handling — Impl. error codes 
	* Specific error codes for when a navigator command fails (e.g. library errors, and user errors).
	* E.g. `ACTIVE_ROUTES_DESYNC`, `INVALID_ROUTE_KEY`, `ROUTE_OUT_OF_BOUNDS`, `MODAL_ACTIVE`,  `UNKNOWN_ERROR`, etc.
	* Will be used to trigger `syncRoutesFromNative` when the error code is `ACTIVE_ROUTES_DESYNC`.
	* Can be used to distinguish user errors and library-specific errors.
	* Create user-friendly error messages for user errors.

<br>

- [x] (Commit: `ad00e43`) **Implement**: Impl. navigation command to close all modals.

<br>

- [x] (Commit: `e2831e3`) **Implement**: Impl. `syncRoutesFromNative`
	- Command to sync the native active routes to the JS active routes.
	- Replacement for `createStateSnapshot` as a form of error recovery when a route command fails.

<br>

- [x] (Commit: `a85b813`) **Refactor**: Consolidate Push/Pop Transition String Types
	- Remove separate push/pop transition types and combined into one (e.g. combined `RouteTransitionPushTypesEnum` and `RouteTransitionPopTypesEnum` into `RouteTransitionTypesEnum`, etc).

<br>

- [x] (Commit: `211bb54`) **Implement**: `NavigatorView`: Impl. `onNavRouteWillShow` and `onNavRouteDidShow`

- [x] (Commit: `f744525`) **Refactor**: `RouteHeaderView`: Refactored To Use `HeaderHeightConfig`

- [x] (Commit: `992ed17`) **Refactor**: Re-Impl. `RouteViewPortal`

	* Move `forceUpdate` logic to route.

	- Also fixes: **Fix**: `RouteHeaderView` - Values received from props are not updating.
		- Component re-renders but the prop doesn't change (tried `forceUpdate()` on the portal component and the `RouteHeaderView` itself ).
		- Guess: It could have something to do with the fact that  `RouteHeaderView` is being rendered somewhere else. Also in `RouteViewPortal` it's being passed as function component, but the prop it's depending on is outside the component.
		- Logging the props in `RouteHeaderView` render shows that the props aren't updating even though the component is updating. The props are frozen to the initial prop value.
		- See `NavigatorTest06`.

<br>

- [x] (Commit: `5eeb270`) **Examples**: Update `NavigatorTest04`
- [x] (Commit: `70c12ec`) **Fix**: Transition pop config via `RouteViewPortal.routeOptions` not being applied when using push + transition config override beforehand.
	- See `NavigatorTest04` while `Use via RouteOptions` is enabled. When popping routes, the chosen transition is not used (it only works for the first item popped).
	- Debug:
		- A) Added breakpoint before a route is pushed, then pushed route. 
			- A.1) Run:  `po self.routeView.navigatorView!.routeItems.compactMap { $0 as? RNINavigatorReactRouteViewController }.map { $0.transitionTypePop.transitionType }` 
			- A.2) Result: `["CrossFade", "CrossFade", "CrossFade", "Default"]`.
			- A.3) Running the command again, but for  `transitionTypePush.transitionType` yields the same output: The last route's transition is set to `Default` . 
		- B) Next, check react devtools and inspect the props/state of the routes.
			- B.1) All of the routes `state.transitionConfigPush` and `state.transitionConfigPop` is set to have a fade transition.
			- B.2) The only difference is that the last route's `props.transitionConfigPopOverride` is set to `undefined`. All the preceding routes have their's set to `null`.
			- B.3) The parent `NavigatorView`'s transition override push/pop config are set to undefined.
		- C) Set breakpoint before a route is popped in the delegate method that handles the transition, then pop a route.
			- C.1) The transition method only gets called when popping the first route, but not the others. Could be a sign that the transition delegate  is not set.
			- C.2) Running `po self.routeView.navigatorView!.delegate }`  yields `nil`. This means there is no delegate set to handle the route transition.
			- C.3) Dumping all of the routes's `interactionController` yields non-nil values/unique instances. This means that there's a push/pop transition.
			- C.4) Dumping all of the route's transition push + pop config yields `['CrossFade', 'CrossFade', ...]`. This means that the routes have received the push/pop config.
			- C.5) Possible fix: Re-apply transition delegate for a route that's about to appear.

<br>

- [x] (Commit: `e89c00c`) **Examples**: Create `NavigatorShowcase03`
	- Extra height for navigation bar, tab-bar like appearance.

<br>

- [x] (Commit: `9722af7`) **Fix**: Route header height wrong when screen is rotated.
- [x] (Commit: `5395fb2`) **Refactor**: Refactored navigation override-related logic.
- [x] (Commit: `5a50646`) **Refactor**: Move navigation override-related logic from route view controller to base view controller.
- [x] (Commit: `d886d60`) **Implement**: Status bar style  should animate together with the view controller pop transition.
	- Implement status bar animation inside `animate(alongsideTransition:completion:)` in `UIViewControllerTransitionCoordinator`.
	- Status bar style transitions in during push, but not during pop + interactive swipe back pop gesture.
	- Also fixes: `RouteViewPortal.statusBarStyle` not animating in with push transition (tested in `RouteViewPortalExample01`.

<br>

- [x] (Commit: `558ce57` ) `TODO (019)`):  `RNINavigatorReactRouteViewController.statusBarStyle`: Move impl. to the base view controller.
- [x] (Commit: `4c33444`) Fixed status bar style transition not being triggered when the pop gesture is repeatedly cancelled (i.e. the status bar style pop transition only worked on the first try).
- [x] (Commit: `29af00e`):  `NavigationConfigOverride` — Fixed  `navigationBarVisibilityMode` and `allowTouchEventsToPassThroughNavigationBar` not being applied.
- [x] (Commit: `589384c`) Partial fix for navigation bar `backgroundImage` and `shadowImage` not being transitioned during push/pop.

<br>

- [x] **Fix**: (Commit: `bde6344`) The custom navigation bar left and right item disappears when the back gesture is started and cancelled.
	* Note: The custom navigation bar title item doesn't disappear, it's only the custom left/right items that disappear. 
	* Can be reproduced using `NavigatorShowcase03`, ``NavigatorTest02`,  `RouteViewPortalExample01`, etc.
	* It seems like the cleanup for the navigation items are being triggered, causing the react views to be removed.

- [x] **Fix**: When using legacy mode, the appearance config flickers in, i.e. when you trigger the back swipe gesture, the appearance changes to the prev. routes config, and when you cancel the back swipe, the appearance config for the current route get's applied immediately.
	* Example: During the back swipe gesture, the header background color properly transitions, but the navigation bar `tintColor` does not (it gets immediately applied, there is no transition).
	* Can be reproduced using `NavigatorTest01`.
	* Note: Things that do not transition properly: `tintColor`, `backgroundImage`, `shadowImage`.
	* Note: was fixed in commit `5395fb2` (`tintColor` now fades in after the swipe gesture is cancelled).

<br>

- [x] (Commit: `0e9a9d1`) **Implement**: Impl. `useNavigation` context hook.
- [x] (Commit: `6c9c66e`) **Refactor**: Rename `NavRouteViewContext` to `NavigationContext`.
- [x] (Commit: `b768803`) **Implement**: Expose `NavigatorView.onUIConstantsDidChange` event.
- [x] (Commit: `33c2f26`) **Implement**: Impl. `useNavigatorUIConstants` context hook.

<br>

### Version: `0.2.1`

* Route Transitions-Related
	* [x] (Commit: `afd4626`) **Implement**: transition: zoom transition
	* [x] (Commit: `9c73911`) **Implement**: transition: flip horizontal
	* [x] (Commit: `6427e80`) **Implement**: transition: flip vertical

<br>

- [x] (Commit: `247f664`) **Refactor** `CustomAnimator`: Cleanup/Simplify 
	- Create overridable method `animateTransition`. Returns a tuple of values that will be used to configure `animateKeyframes`.
	- `animations, completion)`.
	- `completion` will be used to reset the animation values.
	- Use snapshot view for the `toView` (e.g. do not directly modify the `toView`).

<br>

- [x] (Commit: `0720283`) **Fix**: Search bar/navigation bar flicker on first mount.

<br>

### Version: `0.2.0`

- [x] (Commit: `c3d4ac1`) **Refactor**: Types — Update `EventEmitter` to use mapped types i.e. each event will be mapped to an event handler. Then via generics the "event map" will be used to inject the type to the listener parameter depending on the event key.
	* <u>Breaking Change</u> — Removed `useNavBarItemEvents` + `useNavRouteLifeCycle` hooks and consolidate them to a single hook called `useNavRouteEvents`.

<br>

- [x] (Commit: `b7fcf61`) **Refactor**: Enable `strictNullChecks` for library.
- [x] (Commit: `bd6341a`) **Fix**: `RouteViewPortal.renderNavBarTitleItem` not updating when component is mounted/unmounted.
- [x] (Commit: `3da44f3`) **Implement**: Impl. navigation command for `NavigationObject`  to get the current navigation stack. One use case could be for it to be called inside a navbar render item and read the current navigation stack to display the prev. routes's title, etc.
	- Note: `NavigatorView.getActiveRoutes` already exist so maybe just expose that to the navigation object.
	- Maybe also add get prev. route and get current route for convenience.

<br>

- [x] (Commit: `815e56c`) **Examples**: Add tester for the navigation events.
- [x] (Commit: `21322a1`) Types - Refactor `useNavRouteEvents` to use mapped types.

- [x] (Commit: `d69163b`) **Refactor**: Refactor `NavigatorView.routes` prop to accept an object instead of an array.

	- <u>Major Breaking Change</u> — All usage of `NavigatorView` must be refactored.

<br>

- [x] (Commit: `bfbdb29`) **Fix**: When removing a route via `removeRoute`, only `onRouteWillPop` is triggered, i.e. `onRouteDidPop` is never called. (see `NavigatorTest08`).
- [x] (Commit: `7111060`) **Cleanup** — Cleanup `LIB_GLOBAL.debugLog` Usage
	- Move `LIB_GLOBAL` to non-global constant `LIB_ENV` in `LibEnv.ts`.
	- Removed `Globals.ts`.

<br>

- [x] (Commit: `8c5d232`) **Optimization** — Add `shouldComponentUpdate` to `NavigatorRouteView` and `NavigatorView` to prevent excessive renders (especially when manipulating `state.activeRoutes` via the navigation commands).

	* Debug + Investigate

		* A Debug: Check for re-renders for the navigator + routes. E.g. Does re-rendering the navigator, also re-render their respective routes.

			- Setting `NavigatorRouteView.shouldComponentUpdate` to return `false`, still triggers re-render.

			- Making `NavigatorRouteView.setRouteOptions` no-op, still triggers re-render.

			- Making `NavigatorRouteView.setRouteViewPortalRef`  no-op, still triggers re-render.

			- Disabling route sorting in `NavigatorView.getRoutesToRender` still triggers re-render.

				- > Returning false does not prevent child components from re-rendering when their state changes

			- Disabling `this._routeComponentsWrapperRef.forceUpdate()` in `RouteViewPortal.componentDidUpdate` still triggers re-render.

			- Passing a constant to the following `NavigatorRouteView` props in `NavigatorView._renderRoutes` still triggers re-render. 

				- Also tried: `currentActiveRouteIndex`, `routeProps`, `routeOptionsDefault`, `transitionConfigPushOverride`, `transitionConfigPopOverride`

		* B. Debug: Push some routes  (i.e. `NavigatorTest03`) into the stack, then run react profiler. Push another route into the stack. If the other routes re-render, check reason.

			- According to the react-devtools profiler, the reason why `NavigatorRouteView`  re-rendered is because:
				- Context changed
				- Props changed: `renderRouteContent`, `renderNavBarLeftItem`, `renderNavBarRightItem`, `renderNavBarTitleItem`.
			- All `NavigatorRouteView` siblings (i.e. the previous routes in the stack) re-rendered when a route was pushed.
				- `NavigatorView` re-rendered due to state change (e.g. `activeRoutes`) which is expected behavior.
			- In `NavigatorView`, try passing null to the `NavigatorRouteView` props:  `renderNavBarLeftItem`, `renderNavBarRightItem`, `renderNavBarTitleItem`.
				- Pushed 3 routes into the stack, then started profiling. Pushed a route, then stopped profiling.
				- According to the react-devtools profiler, the reason why `NavigatorRouteView` re-rendered is because: **A**. context changed, and **B**. the `renderRouteContent` prop changed. All sibling routes re-rendered for the same reason.
				- The last route sibling's (i,e, the new route pushed into the stack) reason for rendering is: "first time rendered".
					- Which means that the other components aren't getting re-created on each render.

		* C. Debug: Push some routes  (i.e. `RouteA` in `NavigatorTest08`) into the stack, then run react profiler. Push another route into the stack. If the other routes re-render, check reason.

			- The results are similar to "B. Debug", even though the route config is declared as a constant outside the component.

		* D. Attempt: Wrap the routes inside a component then try should component update false.

			- Wrapped the `NavigatorRouteView` inside `NavigatorRouteViewWrapper`.	
				- `NavigatorRouteViewWrapper` re-renders due to `renderRouteContent` prop change.
				- `NavigatorRouteView` re-renders due to `renderRouteContent` + context change. i.e. same as before.
			- Set `NavigatorRouteViewWrapper.shouldComponentUpdate` to return false.
				- The `NavigatorRouteViewWrapper` no longer re-renders, but `NavigatorRouteView` still re-renders due to context change.

		* E. Discard all previous changes. 

		* F. Debug: Push some routes  (i.e.  `NavigatorTest03`) into the stack, then run react profiler. Push another route into the stack. If the other routes re-render, check reason.

			- All sibling `NavigatorRouteView` routes re-rendered due to:
				- Context changed
				- Props changed: `currentActiveRouteIndex`, `renderRouteContent`, `renderNavBarLeftItem`, `renderNavBarRightItem`, `renderNavBarTitleItem`.

		* G. Attempt: In `NavigatorRouteView._renderRouteContents` wrap the `routeContent` (i,e, the route to be rendered returned by `renderRouteContent`) inside a component.

			- Wrapped `routeContent` inside `NavigatorRouteContentWrapper`.
			- Push some routes  (i.e.  `NavigatorTest03`) into the stack, then run react profiler. Push another route into the stack. If the other routes re-render, check reason.
				- `NavigatorRouteContentWrapper` re-rendered because the children changed.
				- However, setting `NavigatorRouteContentWrapper.shouldComponentUpdate` to return false stopped the re-render from propagating.

		* E. Bug Fix: The routes where re-rendering due to a missing in `!` when comparing the props, as such `NavigatorRouteView.shouldComponentUpdate` was always returning true 😂.

	* Created `NavigatorRouteContentWrapper` and `NavigatorRouteContentWrapper` to optimize re-renders.

	* Fixed re-renders caused by context, and other misc. optimizations.

<br>

- [x] (Commit: `4748b4b`) **Fix**: Fixed `renderRouteHeader` not showing up/mounting.

- [x] (Commit: `a3b2a0b`) **Fix**: Navigation push event not triggered if route is added via `insertRoute` (see `NavigatorTest08`).

	* Push events only firing if triggered via the `push` route command.

	- Trigger push events via  `vc.willMove` and `vc.didMove` view controller lifecycle instead of triggering manually from the navigation command.

<br>

- [x] (Commit: `822136c`) **Implement** Update `onRouteFocusEventObject` to include `isFirstFocus`.
	- Updated `onRouteFocusEventObject` to include `isFirstFocus`.
	- Types — Extracted `OnRouteFocusEventObject` and `OnRouteFocusBlurEvent` to their own separate types.
	- Update event handlers + emitters to use `OnRouteFocusEvent`, and `OnRouteBlurEvent`.

<br>

- [x] (Commit: `3da44f3`) **Refactor**: Types — Update function parameters to be readonly.
- [x] (Commit: `ff754f4`) **Refactor**: Types — Enabled Strict Mode.
- [x] (Commit: `b4899a9`) **Refactor**: Move `RouteComponentsWrapper` to `src/wrapper_components`.
- [x] (Commit: `03002b4`) **Cleanup**: Types — Replace `null | undefined` with custom `Nullish<T>` generic.
- [x] (Commit: `4ae272f`) **Implement**: `NavigatorView` prop: Implement `sharedRouteProps`.
- [x] (Commit: `a7029a9`) **Fix**: Nav Bar Items Leaking
	- Related to commit: `bd6341a`, e.g. fix for `RouteViewPortal.renderNavBarTitleItem` not updating when component is mounted/unmounted.
	- Change implementation to use native modules instead of view manager commands.
		- The view manager will throw an error when trying to send a command to a native component that no longer exists.
		- Since the `notifyComponentWillUnmount` is called inside `componentWillUnmount`, RN will  throw an error when the cleanup is triggered from the native side.
		- With the native modules impl., the look up for finding a `node`'s corresponding view is done by the module itself. So  don't forward the command if the view has already been cleaned up from the native side.

<br>

- [x] (Commit: `a84dba3`) **Fix**: Navigation bar visibility not transitioning when the route that is being popped has its navigation bar hidden and the route that will become in focus has its navigation bar visible.
- [x] (Commit: `7b3e8a5`)  **Implement**: Transition `statusBarStyle` alongside push transition. 

<br>

- [x] (Commit: `f69982f`) **Fix**: Route size initially wrong on first mount for `NavigatorView`'s that aren't the same size as the screen (See `NavigatorTest08` + push  `RouteB`).
	- Debugging: Push `routeB`, then track `view.bounds` via breakpoints and  `po`.	
		- **1)** `RNINavigatorView.insertReactSubview` — The route to be pushed is "received" as a subview from the navigator view.
			- navigator bounds: `(0.0, 0.0, 375.0, 333.5)` — navigator has the correct size.
			- `routeView` bounds: `(0.0, 0.0, 0.0, 0.0)` — the route view initially has no size.
		- **1.1)** `RNINavigatorView.insertReactSubview` — `RNINavigatorReactRouteViewController` was initialized/created and the `routeView` has been assigned to it .
			- `routeView` bounds: `(0.0, 0.0, 0.0, 0.0)` — the bounds still haven't been set yet.
		- **1.2)** `RNINavigatorView.insertReactSubview` — `routeView.notifyForBoundsChange` has been triggered, i.e. the bounds have been set to the bounds of the navigator view.
			- `routeView` bounds: `(0.0, 0.0, 375.0, 333.5)` — the route view's size is now correct.
		- **2)** `RNINavigatorRouteView.reactSetFrame` — React lifecycle triggered. React sets the initial size of the route view.
			- `frame` argument: `(0.0, 0.0, 375.0, 333.5)`
			- `navigatorView.frame.size`: `(375.0, 333.5)`
			- `routeView` bounds: `(0.0, 0.0, 375.0, 333.5)` — Unchanged.
		- **2.1)** `RNINavigatorRouteView.reactSetFrame` — `super.reactSetFrame(...)` is triggered.
			- `routeView` bounds: `(0.0, 0.0, 375.0, 333.5)` — Unchanged.
		- **3)** `RNINavigatorView.push`:  The push command has been received from the native side, and `pushViewController` is about to be called.
			- `nextRouteVC.view.bounds`: `(0.0, 0.0, 375.0, 667.0)` — The bounds changed to the wrong size.
				- Something in the route VC lifecycle must have triggered the size change.
					- Size change triggered in `loadView`.
				- `nextRouteVC.isCurrentlyInFocus`: `false`.
				- `nextRouteVC.view.window`: `nil` — makes sense, it hasn't been pushed yet.
				- `(nextRouteVC as! RNINavigatorReactRouteViewController).isPushed` : `false` — again,  `pushViewController` hasn't actually been called yet.

<br>

- [x] (Commit `065d707`) `TODO (002)`: `CustomAnimator` — Add `isPresenting` so that push and pop can be combined together.

---

<br><br>

📝 **Note**: Older TODO items are stored in [TODO Archive](./TODO-Archive.md)