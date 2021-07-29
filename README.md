# react-native-ios-navigator

A native wrapper component around `UINavigationController` for react-native.

## 🚧⚠️ **Library WIP** ⚠️🚧

Currently in development... 😅 (See [TODO.md](https://github.com/dominicstop/react-native-ios-navigator/blob/master/docs/TODO.md) for current progress).

---

<br><br>

## A. Introduction

Before you use this library, please consider looking at `react-navigation` and `react-native-navigation` first. They offer more features, are battle-tested, well maintained, and most importantly: cross-platform.

<br>

### A.1. Features 



<br>

### A.2. Motivation 

Lorum ipsum

------

<br><br>

## B. Installation

```sh
# install via npm...
npm install react-native-ios-navigator

# or install via yarn.
yarn add react-native-ios-navigator

# then run pod install (uses auto-linking)
cd ios && pod install
```



------

<br><br>

## C. Basic Usage

```jsx
import { SafeAreaView, TouchableOpacity, Text } from 'react-native-ios-navigator';
import { NavigatorView } from 'react-native-ios-navigator';

// Route to show in the navigator
function ExampleRoute(props){
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => {
        props.navigation.push({
          routeKey: 'routeA'
        });
      }}>
        <Text> Push: 'RouteA' </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export function App() {
  return(
    <NavigatorView
      initialRoutes={[{routeKey: 'routeA'}]}
      routes={{
        routeA: {
          routeOptionsDefault: {
            routeTitle: 'Route A',
          },
          renderRoute: () => (
            <ExampleRoute/>
          ),
        }
      }}
    />
  );
};

```

------

<br><br>

## D. Documentation

💡 **Tip**: Most of the time, when a type or component is mentioned, you can click it to jump to that item in the README (or its declaration in the source code).

<br>

### D.1. Components

#### D.1.1. `NavigatorView` Component

This component is a wrapper around [`UINavigationController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller), and as such, it also facilitates navigation in a stack-like manner where in routes are "pushed" and "popped" in and out of the navigation stack. 

Only one route can be shown at a given time. However it is possible to have multiple `NavigatorView` instances at the same (and each instance will have their own separate navigation stack, allowing you to show multiple routes at the same time). But do note that the 1st instance will always be treated as the "root" navigation controller (and subsequently, the root navigation controller will become responsible for handling things like setting the color of the status bar, etc).

Internally, each `NavigatorView` component corresponds to an `UINavigationController` instance. The route components (i.e. the component returned from a route config's `renderRoute` in the `NavigatorView.routes` prop) are then wrapped inside a view controller. In other words, each active route in the navigation stack has a corresponding view controller. Those view controllers are then managed by the `UINavigationController` instance.

Each route can have a corresponding `RouteOptions` object. This object is used internally to configure various aspects of the `UINavigationController`, `UINavigationBar`, `UINavigationItem`, `UIViewController`, etc.

<br>

##### `NavigatorView` Component: Props

###### `NavigatorView` General Props

| Prop Name and Type                                           | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤 **Required**: `routes`<br><br>⚛️ [`NavRoutesConfigMap`](PLACE_HOLDER_LINK) | Configures what routes can be used inside the navigator.<br><br>This prop accepts a `NavRoutesConfigMap` object. This object is a map of `NavRouteConfigItem` objects, where the key of each property is the `routeKey` .<br><br>These objects are used to create and configure the routes. Those "route config" objects include things like: **A**, what component to show when the route becomes active (`NavRouteConfigItem.renderRoute`), **B**. the initial `routeProps` that the route will receive (`NavRouteConfigItem.initialRouteProps`), and **C**. other misc, options that'll determine the look of the navigation bar, the route's transitions, etc. (`NavRouteConfigItem.routeOptionsDefault`). <br><br>📝 **Note**: The `routeKey` in the route config object must be unique for each route item.<br><br>There are actually two types of routes, the first one is a "<u>JS route</u>" (i.e. a route defined in react/js-side), and the second one is a "<u>native route</u>" (i.e. a route defined in the native-side). In other words, it's possible to use routes that are created using standard react components, or routes that were created using native code (i.e. `UIViewController` + storyboards, auto layout, etc).<br><br>📌 For more details check out the [`NavRouteConfigItem`](PLACE_HOLDER_LINK) type, and the [guides](PLACE_HOLDER_LINK) section. |
| 🔤 [**Required**: `initialRoutes`<br><br>⚛️ `Array<NavRouteItem>`](PLACE_HOLDER_LINK) | Used by the navigator to determine which initial routes to show when the navigator first mounts.<br><br>This prop accepts an array of `NavRouteItem` objects. The `routeKey` values in the objects must match with a route configured in the `routes` prop. <br><br>This prop basically represents the navigation stack during the first mount; with the first item being the root route, and the last item being the topmost active route.<br><br>For example, if you pass `[[{routeKey: 'A'}, {routeKey: 'B'}]]` as the initial routes, then route "A" will become the root route, and route "B" will become the topmost route. Thus, on the first mount  route "B" will first be shown, and then pressing the back button will then pop route "B", and then show route "A"). <br><br>💡 **Tip**: This behavior of being able to set the initial routes is useful for state-restoration (or for when you want to show a different initial route based on some condition). |
| 🔤 `style`<br/><br>⚛️ `ViewStyle`                              | The style applied to the the `NavigatorView` component itself.<br><br>📝 **Note**: The layout size of the `NavigatorView` will also determine the layout size of the routes, so if the size of the navigator is 100 x 100, then the routes will also be 100 x 100. |
| 🔤 `routeContainerStyle`<br><br>⚛️ `ViewStyle`                 | The default style that is applied to all the routes. Whatever component you return from `renderRoutes` will be wrapped inside a "route container" view. This prop allows you to set the style of the "route container" view.<br><br>📝 **Note**: This prop can be overridden/replaced on a per route basis either via `RouteOptions.routeContainerStyle` in the `NavigatorView.routes` prop, or via the `RouteViewPortal.routeOptions` prop.<br><br>💡 **Tip**: You can use this prop to provide a default background color for all the routes. |
| 🔤 `navBarPrefersLargeTitles`<br/><br>⚛️ `boolean`             | Specifies whether or not to use the large title style for the navigation bar title. Defaults to `true` on iOS 11 and above.<br><br>Maps to the [`UINavigationBar.prefersLargeTitle`](https://developer.apple.com/documentation/uikit/uinavigationbar/2908999-preferslargetitles) property,<br><br>📝 **Note**: This prop can be overridden on a per route basis either via `largeTitleDisplayMode` in the `NavigatorView.routes` prop, or via the `RouteViewPortal.routeOptions` prop.<br/> |
| 🔤  `navBarAppearance`<br/><br>⚛️ [`NavBarAppearanceCombinedConfig`](PLACE_HOLDER_LINK) | This prop allows for the customization of the [`UINavigationBar`](https://developer.apple.com/documentation/uikit/uinavigationbar). The navigation bar can be customized via two modes, namely "legacy" (iOS 12 and below), and "appearance" (iOS 13 and above).<br><br>The "legacy" mode, as the name would suggest, uses ["legacy customizations"](https://developer.apple.com/documentation/uikit/uinavigationbar/legacy_customizations) , where in the navigation bar is customized using the old API via directly manipulating the navigation bar object's properties.<br><br>The "appearance" mode on the other hand, uses `UINavigationBarAppearance` to apply customizations for each of the "navigation bar" styles, namely `standardAppearance` (normal height), `compactAppearance` (compact-height, e.g. iPhones in landscape, etc.), and  `scrollEdgeAppearance` (whenever there's a `UIScrollView`-like component).<br><br>📝 **Note**: There is one big caveat though, once "appearance" mode is used, "legacy" mode no longer works (it's some sort of bug in `UIKit`). In other words, switching between the two modes is not supported, only stick to one. When targeting iOS 12 and below, use "legacy", otherwise use "appearance".<br><br>💡 **Tip**: Check the [guides](PLACE_HOLDER_LINK) section for examples on how to customize the navigation bar, or browse the [`NavBarAppearanceCombinedConfig`](PLACE_HOLDER_LINK) object for the full list of properties.<br/><br/>💡 **Tip**: The navigation bar can also be customized on a per-route basis via the `RouteOptions.navBarAppearanceOverride`. You can set this property either via `routeOptionsDefault` in a route's config in the `NavigatorView.routes` prop, or via the [`RouteViewPortal`](PLACE_HOLDER_LINK) component using the `RouteViewPortal.routeOptions` prop. |
| 🔤 `isNavBarTranslucent`<br/><br>⚛️ `boolean`                  | Determines whether or not the the navigation bar is translucent. Maps to [`UINavigationBar.isTranslucent`](https://developer.apple.com/documentation/uikit/uinavigationbar/1624928-istranslucent). |
| `isInteractivePopGestureEnabled`<br/><br>⚛️ `boolean`         | Enables or disables the `interactivePopGestureRecognizer`. In other words, this prop sets whether swiping on the left edge of the screen will pop the current route. Defaults to `true`. |
| 🔤 `shouldSwizzleRootViewController`<br/><br>⚛️ `boolean`      | Determines whether or not the root view controller's default implementation is changed at run-time (i.e. "swizzled") to enable certain features (e.g. like enabling "view controller based status bar" via delegating `childForStatusBarStyle` to a child view controller, etc). The "injected" implementation is lifted from [`RNIRootViewController`](PLACE_HOLDER_LINK). <br><br>Defaults to `true`, however this will only take effect for the first `NavigatorView` component, and also only if the parent view controller is the same instance as the one in `window.rootViewController`.<br><br>For brownfield projects with native code (or for projects with an existing navigation solution), set this to `false` to disable this behavior. |

<br>

###### `NavigatorView` Render Props

| Prop Name and Type                                           | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤 `renderNavBarLeftItem`<br><br>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | Sets a default left item for the navigation bar for all the routes. If `leftItemsSupplementBackButton` in `routeOptions` or ( `defaultRouteOptions`) is set to `true` (which it is by default), then it will replace the back button (i.e. the back button will not be shown).<br><br>📝 **Note A**: The left navigation bar item can be overridden/replaced on a per route basis via `NavRouteConfigItem.renderNavBarLeftItem` in the `NavigatorView.routes` prop, or via  `RouteViewPortal.renderNavBarLeftItem` prop.<br><br>📝 **Note B**: If this prop is used, it'll implicitly set `navBarButtonLeftItemsConfig` to `{ type: 'CUSTOM' }` for a route's  `routeOptions`. So if the `navBarButtonLeftItemsConfig` is explicitly set to anything other than "custom", then this prop will not do anything. |
| 🔤 `renderNavBarRightItem`<br/><br>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | Sets a default right item for the navigation bar for all the routes.<br/><br/>📝 **Note A**: The right navigation bar item can be overridden/replaced on a per route basis via `NavRouteConfigItem.renderNavBarRightItem` in the `NavigatorView.routes` prop, or via  `RouteViewPortal.renderNavBarRightItem` prop.<br/><br/>📝 **Note B**: If this prop is used, it'll implicitly set `navBarButtonRightItemsConfig` to `{ type: 'CUSTOM' }` for a route's  `routeOptions`. So if the `navBarButtonRightItemsConfig` is explicitly set to anything other than "custom", then this prop will not do anything. |
| 🔤 `renderNavBarTitleItem`<br/><br>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | Sets a default title item for the navigation bar for all the routes.<br/><br/>📝 **Note**: The title navigation bar item can be overridden/replaced on a per route basis via `NavRouteConfigItem.renderNavBarTitleItem` in the `NavigatorView.routes` prop, or via  `RouteViewPortal.renderNavBarTitleItem` prop.<br/><br/>💡 **Tip**: You can access the route's `routeTitle` via the `navigation` object (i.e. `navigation.routeOptions.routeTitle`). |

<br>

###### `NavigatorView` Event Props

| Prop Name and Type                                           | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤 `onNavRouteWillPop`<br/><br/>⚛️ [`OnNavRoutePopEvent`](PLACE_HOLDER_LINK)<br><br>📌 [`OnNavRoutePopEventObject`](src/types/RNINavigatorViewEvents.ts) | Event that is triggered when a route is about to be "popped" from the navigation stack (i.e. the pop transition has started). |
| 🔤 `onNavRouteDidPop`<br/><br/>⚛️ [`OnNavRoutePopEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnNavRoutePopEventObject`](src/types/RNINavigatorViewEvents.ts)` | Event that is triggered when a route has been "popped" from the navigation stack (i.e. the pop transition has already been completed). |
| 🔤 `onCustomCommandFromNative`<br/><br/>⚛️ [`OnCustomCommandFromNativeEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnCustomCommandFromNativeEventObject`](src/types/RNINavigatorViewEvents.ts) | Event that is triggered from the native-side via the `RNINavigatorNativeCommands.sendCustomCommandToJS` delegate method. This event exists to receive custom user-defined commands from a `RNINavigatorView` (i.e. for custom native code integration). |

<br>

##### `NavigatorView` Component: Properties/Methods

###### `NavigatorView` General/Misc. Methods

| Name                                                         | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤 `getActiveRoutes`<br/><br/>⚛️ [`() => Array<NavRouteStackItem>`](PLACE_HOLDER_LINK) | Returns an array of `NavRouteStackItem` objects that represents the current state of the  navigation stack. |
| 🔤 `sendCustomCommandToNative`<br/><br/>⚛️ `(commandKey: string, commandData: object |  null) => Promise<object | null>` | Will trigger  the `RNINavigatorViewDelegate.didReceiveCustomCommandFromJS` delegate method for the current navigator view instance. This method exists to send custom user-defined commands to the `RNINavigatorView`'s delegate (i.e. for custom native code integration).<br><br>📌 Check the [native integration guide](PLACE_HOLDER_LINK) section for more details. |
| 🔤 `getNavigatorConstants`<br/><br/>⚛️ [`() => Promise<NavigatorConstantsObject>`](PLACE_HOLDER_LINK) | Resolves to an object containing values related to UI (e.g. `navBarHeight`, navigator bounds, `safeAreaInsets`, `statusBarHeight`), and the current state of the navigator (e.g. whether a view controller is being presented modally, the `activeRoutes`, the topmost view controller, and the current visible view controller). |

<br>

###### `NavigatorView` Navigation Commands

Listed below are commands that can be called to control the navigator, e.g. like showing or hiding a route, replacing a route in the navigation stack, etc. Unless specified otherwise, the commands listed here are really just invoking [`UINavigationController.setViewControllers`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621861-setviewcontrollers) internally in the native side. 

The navigation commands are asynchronous; they will return a promise that resolves once the command is complete. Due to timing related issues, the `NavigatorView` internally has a command queue, as such, only one command can be executed at a given time. For example if you call `push`, then call `pop` immediately (i.e. not waiting for `push` to complete first before calling `pop`), they will always be executed in that order (i.e. it will always wait for the previous command to complete).<br>

| Name and Type                                                | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤 `push`<br/><br/>⚛️ `(routeItem, options?) => Promise<void>`<br/><br/>📌 [`routeItem: NavRouteItem`](PLACE_HOLDER_LINK)<br>📌 [`options: NavCommandPushOptions`](PLACE_HOLDER_LINK) | Push a new route into the navigation stack. The `routeItem` to be pushed must be a route that is declared in the `NavigatorView.routes` prop. This command maps to the  [`UINavigationController.pushViewController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621887-pushviewcontroller) method.<br><br>The `routeItem` parameter accepts an object; you can define what route to show using the `routeKey` property. You can also pass data to the new route using the `routeProps`  property, or optionally pass new route options via the `routeOptions` property.<br><br>💡 **Tip**: You can set a temporary push transition (e.g. `FadePush`, `SlideLeftPush`, etc), or disable the transition animation entirely via the `options` parameter. |
| 🔤 `pop`<br/><br/>⚛️ `(options?) => Promise<void>`<br/><br/>📌 [`options: NavCommandPopOptions`](PLACE_HOLDER_LINK) | Pop the current active route out of the navigation stack. This command maps to the  [`UINavigationController.popViewController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621886-popviewcontroller) method.<br><br/>💡 **Tip**: You can set a temporary pop transition (e.g. `FadePop`, `SlideLeftPop`, etc.), or disable the transition animations entirely via the `options` parameter. |
| 🔤 `popToRoot`<br/><br/>⚛️ `(options?) => Promise<void>`<br/><br>📌 [`popToRoot: NavCommandPopOptions`](PLACE_HOLDER_LINK) | Pop all the routes except the first route in the navigation stack. This can be used as a quick way to go back to the root route. This command maps to the  [`UINavigationController.popToRootViewController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621855-poptorootviewcontroller) method. |
| 🔤 `removeRoute`<br/><br/>⚛️ `(routeIndex: number, animated?: boolean = false) => Promise<void>` | Removes a specific route from the navigation stack. The argument passed to `routeIndex` determines which route to remove from the navigation stack (e.g. a value of `0` means to move the root route, and so on).<br><br>💡 **Tip**: You can call `getActiveRoutes` to get the current state of the navigation stack.<br><br/>💡 **Tip**: This command is useful for situations where in a given route in the navigation stack becomes "stale", i.e. it no longer makes sense to show that route when navigating backwards. An example could be a user navigating from a "registration" route, to a "registration success" route. If the back button is pressed, it doesn't make sense for the "registration" route to appear again, so you remove it from the navigation stack. |
| 🔤 `removeRoutes`<br/><br/>⚛️ `(routeIndices: number, animated?: boolean = false) => Promise<void>` | Removes  the specified routes from the navigation stack. The argument passed to `routeIndices` determines which routes to remove from the navigation stack, where a value of `0` means to remove the root route, and so on. This is similar to `removeRoute`, but this command lets you remove multiple routes at once.<br/><br/>💡 **Tip**: You can call `getActiveRoutes` to get the current state of the navigation stack.<br/><br/>💡 **Tip**: Similar to `removeRoute`, this command is useful for selectively removing routes that have gone "stale" all at once. |
| 🔤 `replaceRoute`<br/><br/>⚛️ `(prevRouteIndex: number, routeItem: NavRouteItem, animated?: boolean = false) => Promise<void>`<br><br>📌 [`routeItem: NavRouteItem`](PLACE_HOLDER_LINK) | Replaces an active route route in the navigation stack with a new route that matches the  specified `prevRouteIndex` argument. A new route will be created based on the specified `routeItem` provided, and it will then be used as the replacement route. <br/><br/>📝 **Note**: Just like the `push` command, the `routeItem` must be a route that is declared in the `NavigatorView.routes` prop.<br><br>💡 **Tip**: You can call `getActiveRoutes` to get the current state of the navigation stack. |
| 🔤 `insertRoute`<br/><br/>⚛️ `(routeItem: NavRouteItem, atIndex: number, animated?: boolean = false) => Promise<void>`<br><br>📌 [`routeItem: NavRouteItem`](PLACE_HOLDER_LINK) | Similar to the `push` command, this lets you create a new route based on the provided `routeItem`, and then add it to the navigation stack. But instead of only being able to add routes to the top, this command let's you arbitrarily add a route anywhere in the navigation stack based on the provided `atIndex` argument.<br/><br/>📝 **Note**: The `routeItem` to be added must be a route that is declared in the `NavigatorView.routes` prop, and the `atIndex` argument must not exceed the current size of the stack. |
| 🔤 `setRoutes`<br/><br/>⚛️ `(transform: SetRoutesTransformCallback, animated?: boolean = false) => Promise<void>`<br><br>📌 [`transform: SetRoutesTransformCallback`](PLACE_HOLDER_LINK)<br>📌 [`NavRouteStackPartialItem`](PLACE_HOLDER_LINK) | Allows for the manipulation of the current routes in the navigation stack. Amongst all the navigation commands, this is the most flexible (and complex) because it allows you to add, remove, reorder, replace, or completely change the current active routes in navigation stack.<br><br>The `transform` parameter accepts a function callback that, when called, will receive an array of objects that represents the current active routes in the navigation stack. The `transform` callback must then return an array of route objects that will be used to set the new navigation stack (i.e. the new routes that will replace the current active routes).<br><br>Any of the previous active routes that are not returned from the `transform` callback will be removed from the navigation stack, and conversely, any new routes that weren't in the previous active routes will be created, and then added to the navigation stack.<br><br>📝 **Note**: The `transform` callback will receive an array of [`NavRouteStackPartialItem`](PLACE_HOLDER_LINK) objects that represents the current active routes in the navigation stack. This object has an optional property called `routeID`. The number value in the `routeID` property is auto-generated internally, and acts as a unique identifier for a route (as such, existing active routes in the navigation stack will have an associated `routeID`).<br><br>If the `transform` callback returns a `NavRouteStackPartialItem` object that does not have a `routeID`, then it means that it's a new route (i.e. it will create a new route based on that object, and then add it to the navigation stack). Conversely, in order to "preserve" an active route and let it  remain in the navigation stack, then simply return that route's corresponding object from the `NavRouteStackPartialItem` items along with its associated  `routeID` value.  <br/><br/>💡 **Tip**: This command is useful if you need complete control over the navigation stack. Amongst all the other navigation commands, this is the most direct mapping to [`UINavigationController.setViewControllers`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621861-setviewcontrollers). Jump to the [`setRoutes` guides section](PLACE_HOLDER_LINK) for usage examples. |
| 🔤 `setNavigationBarHidden`<br/><br/>⚛️ `(isHidden: boolean, animated: boolean) => Promise<void>` | Programmatically shows or hides the navigation bar. Maps to the [`UINavigationController.setNavigationBarHidden`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621885-setnavigationbarhidden) method.<br/><br/>💡 **Tip**: If you want to immediately hide the navigation bar when a route is pushed (i.e. you don't want the navigation bar to be visible when that route is pushed), you can use the `RouteOptions.navigationBarVisibility` property instead. The `navigationBarVisibility` property can either be set via `routeOptionsDefault` (which can be found in the route's config in the `NavigatorView.routes` prop), or via the [`RouteViewPortal`](PLACE_HOLDER_LINK) component using the `RouteViewPortal.routeOptions` prop.<br/><br/>💡 **Tip**: Like all the other navigation commands, this command is also async. So this command is useful if you want to wait for the navigation bar hide animation to finish first before doing something else. |

<br>

###### `NavigatorView` Convenience Navigation Commands

These are basically "presets" to existing navigation commands i.e. it uses the existing navigation commands available to provide shortcuts to common navigation actions for convenience.<br>

| Name and Type                                                | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤 `replacePreviousRoute`<br/><br/>⚛️ `(routeItem: NavRouteItem, animated?: boolean = false) => Promise<void>`<br><br>📌 [`routeItem: NavRouteItem`](PLACE_HOLDER_LINK) | Replaces the previous route in the navigation stack with a new route. |
| 🔤 `replaceCurrentRoute`<br/><br/>⚛️ `(routeItem: NavRouteItem, animated?: boolean = false) => Promise<void>`<br><br>📌 [`routeItem: NavRouteItem`](PLACE_HOLDER_LINK) | Replaces the current route (i.e. the topmost route) in the navigation stack with a new route. |
| 🔤 `removePreviousRoute`<br/><br/>⚛️ `(animated?: boolean = false) => Promise<void>` | Removes the previous route in the navigation stack.          |
| 🔤 `removeAllPrevRoutes`<br/><br/>⚛️ `(animated?: boolean = false) => Promise<void>` | Removes all of the previous routes in the navigation stack.  |

<br>

#### D.1.2. `RouteViewPortal` Component

The purpose of this component is to allow for the customization of a route after it's been pushed e.g. like dynamically overriding/updating a route's `RouteOptions`, or rendering custom components to show inside the navigation bar, etc. 

📝 **Note**: The reason why this component has the "portal" suffix is because it's "transporting" things like the route options and the render props somewhere else.

This component is meant to be used inside a route (i.e. it must be used inside the `renderRoute` function in the `NavigatorView.routes` prop). This is because internally, this component relies on react context to communicate to the parent `NavigatorRouteView` component. 

For some extra background info, the `NavigatorRouteView` component is responsible for: **A**. rendering the component returned by `renderRoute`, **B**. managing the route's lifecycle, and **C**. communicating with the native views/modules, etc).

As such this component doesn't actually render anything directly, it's merely an intermediate component to pass things along. The components you pass to  the `RouteViewPortal` are actually being rendered in different place in the component tree. Keep this in mind when using things like react context and state (this is a limitation I'm currently trying to fix).

<br>

#####  `RouteViewPortal` Component: Props

| Prop Name and Type                                           | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤  `routeOptions`<br/><br/>⚛️ [`RouteOptions`](PLACE_HOLDER_LINK) | This prop will override the existing route options that were provided either from **A**. its route config (i.e. the `NavRouteConfigItem.routeOptionsDefault`), or **B**. the route options overrride provided via a navigation command (e.g. `navigation.push({..., routeOptions: {...}})`).<br><br>💡 **Tip**: This prop is useful for dynamically changing the current route options based on some condition. For example, you can change the navigation bar title after loading a resource, or temporarily hide the back button while loading, etc. |
| 🔤 `renderNavBarLeftItem`<br/><br/>⚛️ [`(navigation) => ReactElement`](PLACE_HOLDER_LINK) | This prop is used for rendering a custom left item component in the navigation bar. If `leftItemsSupplementBackButton` in `routeOptions`  is set to `true` (which it is by default), then it will replace the back button (i.e. the back button will not be shown).<br><br>📝 **Note**: If this prop is used, it'll implicitly set `navBarButtonLeftItemsConfig` to `{ type: 'CUSTOM' }` for a route's  `routeOptions`. So if the `navBarButtonLeftItemsConfig` is explicitly set to anything other than "custom", then this prop will not do anything. |
| 🔤 `renderNavBarRightItem`<br/><br/>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | This prop is used for rendering a custom right item component in the navigation bar.<br/><br/>📝 **Note**: If this prop is used, it'll implicitly set `navBarButtonRightItemsConfig` to `{ type: 'CUSTOM' }` for a route's  `routeOptions`. So if the `navBarButtonRightItemsConfig` is explicitly set to anything other than "custom", then this prop will not do anything. |
| 🔤 `renderNavBarTitleItem`<br/><br/>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | This prop is used for rendering a custom title item component in the navigation bar.<br><br>💡 **Tip**: You can access the route's `routeTitle` via the `navigation` object (i.e. `navigation.routeOptions.routeTitle`). |
| 🔤 `renderRouteHeader`<br/><br/>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | This prop allows you to render a header at the top of the screen (check out [`NavigatorShowcase01`](PLACE_HOLDER_LINK) and [`NavigatorShowcase02`](PLACE_HOLDER_LINK) for examples).<br><br>This prop accepts a function that must return a [`RouteHeaderView`](PLACE_HOLDER_LINK) as the root element. This component integrates with the route in the native side to enable the header behavior. Check the documentation for [`RouteHeaderView`](PLACE_HOLDER_LINK) for more details. |

<br>

##### `RouteViewPortal` Example

* 📌 **Declaration**: [`RouteViewPortalExample01.tsx`](example/src/routes/RouteViewPortalExample01.tsx)

![RouteViewPortalExample01](docs/assets/RouteViewPortalExample01-00.gif)

```jsx
export function RouteViewPortalExample01(){
  const [index, setIndex] = React.useState(0);

  return (
    <SafeAreaView style={styles.routeContainer}>
      <RouteViewPortal
        routeOptions={{
          // Change the navigation bar title text
          routeTitle: `index: ${index}`,
          // Disable large tile
          largeTitleDisplayMode: 'never',
          // Set the navigation bar tint to red
          navBarAppearanceOverride: {
            mode: 'legacy',
            barTintColor: Colors.RED.A700,
            tintColor: 'white',
          },
          // Set the status bar tint to 'white'
          statusBarStyle: 'lightContent',
        }}
        // Use a custom component for navigation bar title
        renderNavBarTitleItem={({routeOptions}) => (
          <TouchableOpacity 
            style={styles.buttonContainer}
            onPress={() => {
              setIndex(0);
              Alert.alert('Index Reset', `Index was reset to 0.`);
            }}
          >
            <Text style={styles.buttonLabel}>
              {routeOptions.routeTitle ?? 'N/A'}
            </Text>
          </TouchableOpacity>
        )}

        // Use a custom component for navigation bar right item
        renderNavBarRightItem={() => (
          <View style={styles.navBarLeftItemContainer}>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.buttonRightSpace]}
              onPress={() => {
                // Decrement the index when pressed
                setIndex(prevIndex => (prevIndex - 1));
              }}
            >
              <Text style={styles.buttonLabel}>
                {`--`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                // Increment the index when pressed
                setIndex(prevIndex => (prevIndex + 1));
              }}
          	>
              <Text style={styles.buttonLabel}>
                {`++`}
              </Text>
          	</TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.rootContainer}>
        <Text style={styles.textTitle}>
          {`Current Index: ${index}`}
        </Text>
      </View>
    </SafeAreaView>
  );
};
```



<br>

#### D.1.3. `RouteViewEvents` Component

This component allows you to subscribe and listen to the route-related events (e.g. when a route is about to be popped, or when a navigation bar item has been pressed, etc) for the current route.

Similar to the `RouteViewPortal` component, **1)** this component doesn't actually render anything, and **2)** this component is also required to be used inside a route. This is because, like the `RouteViewPortal` component, this component also relies on react context to communicate to the parent `NavigatorRouteView` component and receive the route-related events.

Internally, every route has an associated event emitter (i.e. a  [`NavigatorRouteViewEventEmitter`](PLACE_HOLDER_LINK) instance). The route's event emitter can be accessed via the route's navigation object (e.g.  `NavigationObject.getRefToNavRouteEmitter`). Internally, this component uses the route's event emitter object to subscribe and listen to the route events.

💡 **Tip**: As an alternative, there's also the [`useNavRouteEvents`](PLACE_HOLDER_LINK) hook.

 Here is a list a list of the event props that this component supports. The various route-related events are documented in the [`NavigatorRouteViewEvents`](PLACE_HOLDER_LINK) section.

<br>

* [Push/Pop-related Events](PLACE_HOLDER_LINK)
	* `onRouteWillPush`
	* `onRouteDidPush`
	* `onRouteWillPop`
	* `onRouteDidPop`
* [Focus/Blur-related Events](PLACE_HOLDER_LINK)
	* `onRouteWillFocus`
	* `onRouteDidFocus`
	* `onRouteWillBlur`
	* `onRouteDidBlur`
* [Navigation Bar Item-related Events](PLACE_HOLDER_LINK)
	* `onPressNavBarLeftItem`
	* `onPressNavBarRightItem`
* [Search Bar-Related Events](PLACE_HOLDER_LINK)
	* `onUpdateSearchResults`
	* `onSearchBarCancelButtonClicked`
	* `onSearchBarSearchButtonClicked`

<br>

##### `RouteViewEvents` Component Example

```jsx
import { RouteViewEvents } from 'react-native-ios-navigator';

// Route to show in the navigator
function ExampleRoute(props){
  return (
    <SafeAreaView>
			<RouteViewEvents
        onRouteDidPush={({nativeEvent}) => {
          console.log(`Route ${nativeEvent.routeKey} was pushed...`);
        }}
      />
    </SafeAreaView>
  );
};
```

<br>

#### D.1.4. `RouteHeaderView` Component

A common UI navigation pattern is having a large header at the very top of the screen that acts as the centerpiece for a route. That header will either remain at a fixed size, or expand and collapse during scrolling (check out [`NavigatorShowcase01`](PLACE_HOLDER_LINK) and [`NavigatorShowcase02`](PLACE_HOLDER_LINK) for examples).

The navigation bar cannot be easily customized (this is especially true for its height). As such, this makes things like extending the navigation bar's height to show some custom UI elements underneath the title bar very difficult. It's also undesirable to create a custom built solution because the built-in navigation bar has a lot of built-in behaviors/functionality that will be hard to re-create (transitions, the back button, etc). To workaround this, some apps (e.g. twitter's profile screen, spotify's album/playlist screen, etc.) will just make the navigation bar's background transparent, and then show their custom UI elements underneath it. This component uses that same approach.

When in use, this component is displayed behind the navigation bar, and is anchored to the top of the screen. The header can either have a fixed height, or it can be paired with a scroll view so that the header will expand or collapse as the user scrolls.

<br>

##### D.1.4.1. `RouteViewPortal` Component Props

| Prop Name and Type                                           | Description |
| :----------------------------------------------------------- | ----------- |
| 🔤 **Required**: `config`<br/><br/>⚛️ [`RouteHeaderConfig`](PLACE_HOLDER_LINK) |             |
| 🔤 `headerTopPadding`<br/><br/>⚛️ [`HeaderHeightValue`](PLACE_HOLDER_LINK) |             |
| 🔤 `style`<br/><br/>⚛️  `ViewStyle`                            |             |

<br>

### D.2. Context

#### D.2.1. `NavRouteViewContext`

Lorum Ipsum<br>

| Name and Type                                                | Description |
| :----------------------------------------------------------- | ----------- |
| 🔤 `routeID`<br/><br/>⚛️ [`HeaderHeightValue`](PLACE_HOLDER_LINK) |             |
| 🔤 `abc`<br/><br/>⚛️ `abc`                                     |             |
| 🔤 `abc`<br/><br/>⚛️ `abc`                                     |             |

<br>

#### D.2.2. `NavigatorUIConstantsContext`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

### D.3. Hooks

#### D.3.1.  `useNavRouteEvents`

<br>

### D.4. Objects and Types

This library is written using typescript. As such, all of the objects/types mentioned in the documentation (and all of the types exported by the library) will have a corresponding type declaration. Those type declaration can usually be found in the [`src/types`](src/types) directory. If a particular object is not documented here, please refer to those type declaration files instead.

<br>

#### 📄 `TSEventEmitter.ts`

* 📌 **Declaration**: [`TSEventEmitter.ts`](src/functions/TSEventEmitter.ts)

#####  Object Class: `TSEventEmitter.ts`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### 📄 `NavigatorRouteViewEventEmitter.ts`

* 📌 **Declaration**: [`NavigatorRouteViewEventEmitter,ts`](src/types/NavigatorRouteViewEventEmitter.ts)

#####  Type: `NavigatorRouteViewEventEmitter`

This type represents a route's event emitter that is used to broadcast and listen to route-related events (e.g. route lifecycle, navigation bar-related events, etc). The route event emitter is a  `TSEventEmitter` object instance that is pre-typed with an event map based on the `NavigatorRouteViewEvents` enum.

<br>

#####  Enum: `NavigatorRouteViewEvents

###### `NavigatorRouteViewEvents` Push/Pop-related Events

These events are triggered when the current route is about to be pushed or popped from the navigation stack.<br>

| Enum Key and Event Type                                      | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤 `onRouteWillPush`<br/><br/>⚛️ [`OnRoutePushEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnRoutePushEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when the current route is about to be pushed into the navigation stack (i.e. the push transition has begun). Internally, this event is triggered just before the [`UINavigationController.pushViewController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621887-pushviewcontroller) method is called. |
| 🔤 `onRouteDidPush`<br/><br/>⚛️ [`OnRoutePushEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnRoutePushEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when the current route has been pushed into the navigation stack (i.e. the push transition has ended). This event fires after `onRouteWillPush`. Internally, this event is triggered inside the completion block of the  [`UINavigationController.pushViewController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621887-pushviewcontroller) method. |
| 🔤 `onRouteWillPop`<br/><br/>⚛️ [`OnRoutePopEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnRoutePopEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when a route is about to be popped from the navigation stack (i.e. the pop transition has begun). Internally, this event is triggered by the [`UIViewController.willMove`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621381-willmove) lifecycle method.<br/><br/>💡 **Tip**: The `event.nativeEvent` object has a property called `isUserInitiated`. This property specifies whether the pop transition was initiated by the navigation command (`false`), or if it was initiated by the user (e.g. via the back button or swipe back gesture) (`true`). |
| 🔤 `onRouteDidPop`<br/><br/>⚛️ [`OnRoutePopEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnRoutePopEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when a route has been popped from the navigation stack (i.e. the pop transition has ended). This event fires after `onRouteWillPop`.  Internally, this event is triggered by the [`UIViewController.didMove`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621405-didmove) lifecycle method.<br/><br/>💡 **Tip**: The `event.nativeEvent` object has a property called `isUserInitiated`. This property specifies whether the pop transition was initiated by the navigation command (`false`), or if it was initiated by the user (e.g. via the back button or swipe back gesture) (`true`). |

<br>

###### `NavigatorRouteViewEvents` Focus/Blur-related Events

These events are triggered whenever the current route will receive or lose focus (this usually occurs whenever a route is pushed and popped from the navigation stack).<br>

| Enum Key and Event Type                                      | Description                                                  |
| ------------------------------------------------------------ | :----------------------------------------------------------- |
| 🔤 `onRouteWillFocus`<br/><br/>⚛️ [`OnRouteFocusBlurEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnRouteFocusBlurEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when the current route is about to become in focus (i.e. the pop transition for the topmost route item has begun). Internally, this event is triggered by the  [`UIViewController.viewWillAppear`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621510-viewwillappear) lifecycle method.<br/><br/>📝 **Note**: This event will also fire alongside `onRouteWillPush` (i.e. when the current route is about to become visible for the first time). |
| 🔤 `onRouteDidFocus`<br/><br/>⚛️ [`OnRouteFocusBlurEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnRouteFocusBlurEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when the current route has received focus (i.e. the pop transition for the topmost route item has ended). This event is triggered by the  [`UIViewController.viewDidAppear`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621423-viewdidappear) lifecycle method.<br/><br/>📝 **Note**: This event will also fire alongside `onRouteDidPush` (i.e. when the current route has become visible for the first time). |
| 🔤 `onRouteWillBlur`<br/><br/>⚛️ [`OnRouteFocusBlurEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnRouteFocusBlurEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when the current route is about to lose focus (i.e. a new route is about to be pushed into the navigation stack). This event is triggered by the  [`UIViewController.viewWillDisappear`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621485-viewwilldisappear)  lifecycle method.<br/><br/>📝 **Note**: This event will fire alongside `onRouteWillPop` (i.e. when the current route is about to be popped from the navigation stack). |
| 🔤 `onRouteDidBlur`<br/><br/>⚛️ [`OnRouteFocusBlurEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnRouteFocusBlurEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when the current route has lost focus (i.e. a new route has been pushed into the navigation stack). This event is triggered by the  [`UIViewController.viewDidDisappear`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621477-viewdiddisappear)  lifecycle method.<br/><br/>📝 **Note**: This event will fire alongside `onRouteDidPop` (i.e. when the current route has been popped from the navigation stack). |

<br>

###### `NavigatorRouteViewEvents` Navigation Bar Item-related Events

📝 **Note**: When using custom navigation bar items (e.g. `renderNavBarLeftItem`, etc.), the `onPressNavBar` events will not be triggered. Instead, use a button component  (e.g. `TouchableOpacity`), and then wrap your custom navigation bar item inside it.<br><br>💡 **Tip:** It's possible to have more than one navigation bar item, as such, to differentiate which item is pressed, you can use the properties provided by `event.nativeEvent` object that you'll receive from the `OnPressNavBarItemEvent`. Some of those properties are `nativeEvent.key` (an optional user-defined string), and `nativeEvent.index` (the item's placement in the group).<br>

| Enum Key and Event Type                                      | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤 `onPressNavBarLeftItem`<br/><br/>⚛️ [`OnPressNavBarItemEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnPressNavBarItemEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when a navigation bar left item is pressed. |
| 🔤 `onPressNavBarRightItem`<br/><br/>⚛️ [`OnPressNavBarItemEvent`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnPressNavBarItemEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when a navigation bar right item is pressed. |

<br>

###### `NavigatorRouteViewEvents` Search Bar-Related Events

These events are related to the route's search bar. A route can be configured to have a [`UISearchBar`](https://developer.apple.com/documentation/uikit/uisearchbar) in the navigation bar via the `RouteOptions.searchBarConfig` property.<br>

| Enum Key and Event Type                                      | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤 `onUpdateSearchResults`<br/><br/>⚛️ [`OnUpdateSearchResults`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnUpdateSearchResultsEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered whenever the search bar's text changes. Internally, this event is triggered by the [`UISearchResultsUpdating.updateSearchResults`](https://developer.apple.com/documentation/uikit/uisearchresultsupdating/1618658-updatesearchresults) method.<br/><br/>💡 **Tip**: This event is useful for updating a list of results. The `event.nativeEvent` object will contain the search bar's current text value. Use the search text value to update the list accordingly. |
| 🔤 `onSearchBarCancelButtonClicked`<br/><br/>⚛️ [`OnSearchBarCancelButtonClicked`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnSearchBarCancelButtonClickedEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when the search bar's cancel button is pressed. When the cancel button is pressed, the search bar's text field will be cleared (this will trigger `onUpdateSearchResults`). Internally, this event is triggered by [`UISearchBarDelegate.searchBarCancelButtonClicked`](https://developer.apple.com/documentation/uikit/uisearchbardelegate/1624314-searchbarcancelbuttonclicked) method.<br/><br/>📝 **Note**: The search bar's cancel button will only appear when the search bar is in focus (unless specified otherwise via the `RouteSearchControllerConfig.automaticallyShowsCancelButton` property in the route's search config). |
| 🔤 `onSearchBarSearchButtonClicked`<br/><br/>⚛️ [`onSearchBarSearchButtonClicked`](PLACE_HOLDER_LINK)<br/><br/>📌 [`OnSearchBarSearchButtonClickedEventObject`](src/types/RNINavigatorViewEvents.ts) | An event that is triggered when the search button (i.e the return key) is pressed in the iOS keyboard while the search bar is in focus. Internally, this event is triggered by [`UISearchBarDelegate.searchBarSearchButtonClicked`](https://developer.apple.com/documentation/uikit/uisearchbardelegate/1624294-searchbarsearchbuttonclicked) method.<br/><br/>💡 **Tip**: The keyboard's return key label can modified via the search config (i.e. `  RouteSearchControllerConfig.returnKeyType`). |

<br>

#### 📄 `NavRouteConfigItem.ts`

* 📌 **Declaration**: [`NavRouteConfigItem.ts`](src/types/NavRouteConfigItem.ts)

#####  Object Type: `NavRouteConfigItem`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#####  Object Type: `NavRouteConfigItemNative`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### 📄 `RouteOptions.ts`

* 📌 **Declaration**: [`RouteOptions.ts`](src/types/RouteOptions.ts)

##### Object Type: `RouteOptions`

The properties that are related to each other are grouped together into their own sections.

<br>

##### `RouteOptions`: General Properties

| Name and Type                                                | Description |
| :----------------------------------------------------------- | ----------- |
| 🔤 `statusBarStyle`<br/><br/>⚛️ `abc`                          |             |
| 🔤 `routeContainerStyle`<br/><br/>⚛️ `abc`                     |             |
| 🔤 `automaticallyAddHorizontalSafeAreaInsets`<br/><br/>⚛️ `abc` |             |

<br>

##### `RouteOptions`: Transition Config-Related Properties

| Name and Type                             | Description |
| :---------------------------------------- | ----------- |
| 🔤 `transitionConfigPush`<br/><br/>⚛️ `abc` |             |
| 🔤 `transitionConfigPop`<br/><br/>⚛️ `abc`  |             |

<br>

##### `RouteOptions`: Navigation Bar Config-Related Properties

| Name and Type                              | Description |
| :----------------------------------------- | ----------- |
| 🔤 `routeTitle`<br/><br/>⚛️ `abc`            |             |
| 🔤 `prompt`<br/><br/>⚛️ `abc`                |             |
| 🔤 `largeTitleDisplayMode`<br/><br/>⚛️ `abc` |             |
| 🔤 `searchBarConfig`<br/><br/>⚛️ `abc`       |             |

<br>

##### `RouteOptions`: Navigation Bar Item Config-Related Properties

| Name and Type                                     | Description |
| :------------------------------------------------ | ----------- |
| 🔤 `navBarButtonBackItemConfig`<br/><br/>⚛️ `abc`   |             |
| 🔤 `navBarButtonLeftItemsConfig`<br/><br/>⚛️ `abc`  |             |
| 🔤 `navBarButtonRightItemsConfig`<br/><br/>⚛️ `abc` |             |

<br>

##### `RouteOptions`: Navigation Bar Back Item Config-Related Properties

| Name and Type                                            | Description |
| :------------------------------------------------------- | ----------- |
| 🔤 `backButtonTitle`<br/><br/>⚛️ `abc`                     |             |
| 🔤 `hidesBackButton`<br/><br/>⚛️ `abc`                     |             |
| 🔤 `backButtonDisplayMode`<br/><br/>⚛️ `abc`               |             |
| 🔤 `leftItemsSupplementBackButton`<br/><br/>⚛️ `abc`       |             |
| 🔤 `applyBackButtonConfigToCurrentRoute`<br/><br/>⚛️ `abc` |             |

<br>

##### `RouteOptions`: Override-related Properties

| Name and Type                                                | Description |
| :----------------------------------------------------------- | ----------- |
| 🔤 `navBarAppearanceOverride`<br/><br/>⚛️ `abc`                |             |
| 🔤 `navigationBarVisibility`<br/><br/>⚛️ `abc`                 |             |
| 🔤 `allowTouchEventsToPassThroughNavigationBar`<br/><br/>⚛️ `abc` |             |

<br>

#### 📄 `NavigationObject.ts`

* 📌 **Declaration**: [`NavigationObject.ts`](src/types/NavigationObject.ts)

##### Object Type: `NavigationObject`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### 📄 `NavRouteItem.ts`

* 📌 **Declaration**: [`NavRouteItem.ts`](src/types/NavRouteItem.ts)

##### Object Type: `NavRouteItem`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

##### Object Type: `NavRouteStackItem`

Represents an active  route item in the navigation stack.<br>

| Name and Type            | Description |
| ------------------------ | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

##### Object Type: `NavRouteStackPartialItem`

Used in the `NavigatorView.SetRoutesTransformCallback` function. Represents either an active route in the navigation stack, or a route that is about to be created and added to the navigation stack. <br>

| Name and Type            | Description |
| ------------------------ | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### 📄 `NavBarAppearanceConfig.ts`

* 📌 **Declaration**: [`NavBarAppearanceConfig.ts`](src/types/NavBarAppearanceConfig.ts)

##### Object Type: `NavBarAppearanceCombinedConfig`

The `NavBarAppearanceCombinedConfig` tagged/discriminated union object type is used to customize the appearance of the navigation bar. This object is a union of two objects, namely: `NavBarAppearanceConfig`, and `NavBarAppearanceLegacyConfig` and it's separated via the shared  `mode` property. The former can be used if the  `mode` property is set to `appearance`, and the latter can be used if `mode` is set to `legacy`.

The navigation bar can be customized either via the "legacy" mode (i.e. using the [legacy customizations](https://developer.apple.com/documentation/uikit/uinavigationbar/legacy_customizations)-related API), or via the "appearance" mode (i.e. using the iOS 13+ [`UINavigationBarAppearance`](https://developer.apple.com/documentation/uikit/uinavigationbarappearance) API). <br><br>

📝 **Note** The `legacy` mode only exists for backwards compatibility (e.g. for iOS versions that are below iOS 13). As such if you're not planning on supporting iOS 12 and below, you should probably use `appearance` mode instead.

* There are some things that `legacy` mode can do that `appearance` mode can't (and vice versa). For example, via `legacy` mode, you can set the global tint of all the navigation bar elements via `tintColor`.

| Name and Type                                                | Description                                                  |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| 🔤 **Required**: `mode`<br/><br/>⚛️  `'appearance' | 'legacy'` | Specifies which API to use when customizing the navigation bar.<br><br>If this property is set to `appearance`, then only the `NavBarAppearanceConfig`-related properties can be used. Conversely if this property is set to `legacy`, then only `NavBarAppearanceLegacyConfig`-related properties can be used. |

<br>

**Example Snippet**

```javascript
const navBarAppearanceLegacy = {
	mode: 'appearance',
	// `NavBarAppearanceConfig`-related properties
  // ...
};

const navBarAppearance = {
  mode: 'legacy',
  // `NavBarAppearanceLegacyConfig`-related properties
  // ...
};
```

<br>

##### Object Type: `NavBarAppearanceLegacyConfig`

| Name and Type                                                | Description |
| :----------------------------------------------------------- | ----------- |
| 🔤 `navBarPreset`<br/><br/>⚛️  `NavBarPreset` e.g. `'none' | 'noShadow' | 'clearBackground'`<br><br>✳️ **Default**: `none` |             |
| 🔤 `barStyle`<br/><br/>⚛️  `'default' | 'black'`               |             |
| 🔤 `titleTextAttributes`<br/><br/>⚛️  `TextStyle`              |             |
| 🔤 `largeTitleTextAttributes`<br/><br/>⚛️  `TextStyle`         |             |
| 🔤 `titleVerticalPositionAdjustment`<br/><br/>⚛️ `{ [key in BarMetrics]?: number }`<br><br>📌 [`BarMetrics`](PLACE_HOLDER_LINK) |             |
| 🔤 `tintColor`<br/><br/>⚛️  `string | DynamicColor`            |             |
| 🔤 `barTintColor`<br/><br/>⚛️  `string | DynamicColor`         |             |
| 🔤 `backIndicatorImage`<br/><br/>⚛️  [`ImageItemConfig`](PLACE_HOLDER_LINK) |             |
| 🔤 `backgroundImage`<br/><br/>⚛️  `{ [key in BarMetrics]?: ImageItemConfig }`<br><br>📌 [`BarMetrics`](PLACE_HOLDER_LINK)<br>📌 [`ImageItemConfig`](PLACE_HOLDER_LINK) |             |
| 🔤 `shadowImage`<br/><br/>⚛️  [`ImageItemConfig`](PLACE_HOLDER_LINK) |             |

<br>

##### Object Type: `NavBarAppearanceConfig`

Lorum ipsum<br>

| Name and Type                                                | Description |
| :----------------------------------------------------------- | ----------- |
| 🔤 `navBarPreset`<br/><br/>⚛️  `NavBarPreset` e.g. `'none' | 'noShadow' | 'clearBackground'`<br><br>✳️ **Default**: `none` |             |
| 🔤 `standardAppearance`<br/><br/>⚛️  [`NavBarAppearance`](PLACE_HOLDER_LINK) |             |
| 🔤 `compactAppearance`<br/><br/>⚛️  [`NavBarAppearance`](PLACE_HOLDER_LINK) |             |
| 🔤 `scrollEdgeAppearance`<br/><br/>⚛️  [`NavBarAppearance`](PLACE_HOLDER_LINK) |             |

<br>

##### Object Type: `NavBarAppearance`

Lorum ipsum<br>

| Name and Type                                     | Description |
| ------------------------------------------------- | ----------- |
| 🔤 `baseConfig`<br/><br/>⚛️  `abc`                 |             |
| 🔤 `backgroundEffect`<br/><br/>⚛️  `abc`           |             |
| 🔤 `backgroundColor`<br/><br/>⚛️  `abc`            |             |
| 🔤 `backgroundImage`<br/><br/>⚛️  `abc`            |             |
| 🔤 `backgroundImageContentMode`<br/><br/>⚛️  `abc` |             |
| 🔤 `shadowColor`<br/><br/>⚛️  `abc`                |             |
| 🔤 `titleTextAttributes`<br/><br/>⚛️  `abc`        |             |
| 🔤 `largeTitleTextAttributes`<br/><br/>⚛️  `abc`   |             |
| 🔤 `titlePositionAdjustment`<br/><br/>⚛️  `abc`    |             |
| 🔤 `backIndicatorImage`<br/><br/>⚛️  `abc`         |             |

<br>

#### 📄 `NavBarItemConfig.ts`

* 📌 **Declaration**: [`NavBarItemConfig.ts`](src/types/NavBarItemConfig.ts)

##### Object Type: `NavBarItemConfig`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#####  Object Type: `NavBarBackItemConfig`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#####  Object Type: `NavBarItemConfig`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#####  Object Type: `NavBarItemConfigCustom`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### 📄 `RouteHeaderConfig.ts`

* 📌 **Declaration**: [`RouteHeaderConfig.ts`](src/types/RouteHeaderConfig.ts)

##### Object Type: `RouteHeaderConfig`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### 📄 `RouteSearchControllerConfig`

* 📌 **Declaration**: [`RouteSearchControllerConfig`](src/types/RouteSearchControllerConfig.ts)

##### Object Type: `RouteSearchControllerConfig`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### Object Interface: `RouteContentProps`

* 📌 **Declaration**: [`abc`](src/types/abc)

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### Object Type: `RouteConstantsObject`

* 📌 **Declaration**: [`abc`](src/types/abc)

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### Object Type: `NavigatorConstantsObject`

* 📌 **Declaration**: [`abc`](src/types/abc)

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#####  Object Type:  `NativeRouteData`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### 📄 `ImageItemConfig.ts`

* 📌 **Declaration**: [`ImageItemConfig.ts`](src/types/ImageItemConfig.ts)

##### Object Type: `ImageItemConfig`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#####  Object Type: `ImageResolvedAssetSource`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#####  Object Type: `ImageRectConfig`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#####  Object Type: `ImageGradientConfig`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

####  `abc`

* 📌 **Declaration**: [`abc`](src/types/abc)

##### Object Type: `abc`

Lorum Ipsum<br>

| Name and Type            | Description |
| :----------------------- | ----------- |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |
| 🔤 `abc`<br/><br/>⚛️ `abc` |             |

<br>

#### Undocumented Types

Lorum Ipsum<br>

| Type                                                         | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 📌 **Declaration**: [`RNINavigatorRouteView.ts`](src/types/RNINavigatorRouteView.ts) | This file contains all the route-related events and event objects (e.g. push, pop, blur, focus, search, etc). |
| 📌 **Declaration**: [`RNINavigatorViewEvents.ts`](src/types/RNINavigatorViewEvents.ts) | This file contains all the events and event objects related to the `NavigatorView` component. Most of these events are not exposed because they're meant for internal use only. |
| 📌 **Declaration**: [`MiscTypes.ts`](src/types/MiscTypes.ts)  | This file contains a bunch of types that haven't been categorized yet.<br><br>Contains: `PointPreset`, `Point`, `DynamicColor`, `Offset`, `BlurEffectStyle`, `EdgeInsets`, `Rect`, `ReturnKeyType`, etc. |
| 📌 **Declaration**: [`NavigationCommands.ts`](src/types/NavigationCommands.ts) | This file contains types related to the `NavigationView` component's navigation commands.<br/><br/>Contains: `RouteTransitionPushTypes`, `RouteTransitionPopTypes`, `RouteTransitionPushConfig`, `RouteTransitionPopConfig`, `NavCommandPushOptions`, `NavCommandPopOptions`, etc. |

<br>

### D.6. Native-Related

Native/Swift Integration

------

<br><br>

## E. Getting Started Guide

Lorum ipsum

------

<br><br>

## F. Usage and Examples

Lorum ipsum

------

<br><br>

## G. Showcase, Tests and Demos

### 

------

<br><br>

## H. Meta

Lorum ipsum

------

<br><br>

## I. License

MIT

