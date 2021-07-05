# react-native-ios-navigator
A native wrapper component around `UINavigationController` for react-native

## 🚧⚠️ **Library WIP** ⚠️🚧
Currently in development... 😅 (See [TODO.md](https://github.com/dominicstop/react-native-ios-navigator/blob/master/docs/TODO.md) for current progress).



[TOC]



---

<br><br>

## A. Introduction

------

<br><br>

## B. Installation

```sh
# install via npm
npm install react-native-ios-navigator

# install via yarn
yarn add react-native-ios-navigator

# then run pod install (uses auto-linking)
cd ios && pod install
```



------

<br><br>

## C. Basic Usage

```react
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
      routes={[{
        routeKey: 'routeA',
        routeOptionsDefault: {
          routeTitle: 'Route A',
        },
        renderRoute: () => (
          <ExampleRoute/>
        ),
      }]}
    />
  );
};

```

------

<br><br>

## D. Documentation

💡 **Tip**: Most of the time, when a type or component is mentioned, you can click it to jump to that item in the README.

### D.1. Components

#### D.1.1. `NavigatorView` Component

This component is a wrapper around [`UINavigationController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller), and it facilitates navigation in a stack-like manner where routes are "pushed" and "popped" in and out of the navigation stack. Only one route can be shown at a given time, however it is possible to have multiple `NavigatorView` instances at the same (and each instance will have their own separate navigation stack, allowing you to show multiple routes at the same time). But do note that the 1st instance will become the "root" navigation controller (and subsequently will become responsible for things like handling the color of the status bar, etc).<br>

<br>

Internally, the route components (i.e. the component returned from `renderRoute`) are wrapped inside a view controller. Those view controllers are then managed by the `UINavigationController` instance. Each route will have a corresponding `RouteOptions` object that's used internally to configure aspects of the `UINavigationController`, `UINavigationBar`, `UINavigationItem`, `UIViewController`, etc.

##### D.1.1.1. `NavigatorView`: Props

###### `NavigatorView` General Props

| Prop Name and Type                                           | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤 **Required**: `routes`<br><br>⚛️ [`Array<NavRouteConfigItem>`](PLACE_HOLDER_LINK) | Configures which routes can be used inside the navigator. Accepts an array of `NavRouteConfigItem` objects. These objects are used to create and configure the routes. Those "route config" objects include things like what component to show when the route becomes active (`renderRoute`), the initial props that the route will receive (`initialRouteProps`), and other options that'll determine the look of the navigation bar, the route's transitions, etc. (`routeOptionsDefault`). <br><br>📝 **Note**: The `routeKey` in the route config object must be unique for each route item.<br><br>There are actually two types of routes, the first one is a "js route" (a route defined in react/js-side), and the second one is a "native route" (a route defined in the native-side). In other words, it's possible to use routes that are created using standard react components, or routes that were created using native code (i.e. `UIViewController` + storyboards, auto layout, etc).<br><br>📌 For more details check out the [`NavRouteConfigItem`](PLACE_HOLDER_LINK) type, and the [guides](PLACE_HOLDER_LINK) section. |
| 🔤 [**Required**: `initialRoutes`<br><br>⚛️ `Array<NavRouteItem>`](PLACE_HOLDER_LINK) | Used by the navigator to determine which routes to show when the navigator first mounts. Accepts an array of `NavRouteItem` objects. The `routeKey` values in the objects must match with a route configured in the `routes` prop. <br><br>This prop basically represents the navigation stack during the first mount; with the first item being the root route, and the last item being the topmost active route. <br><br>For example, if you pass `[[{routeKey: 'A'}, {routeKey: 'B'}]]` as the initial routes, then route "A" will become the root route, and route "B" will become the topmost route. Thus, on first mount  route "B" will first be shown, and then pressing the back button will then pop route "B" and then show route "A"). <br><br>💡 **Tip**: This behavior of being able to set the initial routes is useful for state-restoration, or for when you want to show a different initial route based on some condition. |
| 🔤 `style`<br/><br>⚛️ `ViewStyle`                              | The style applied to the the `NavigatorView` component itself. The layout size of the `NavigatorView` will also determine the layout size of the routes, so if the size of the navigator is 100 x 100, then the route will also be 100 x 100. |
| 🔤 `routeContainerStyle`<br><br>⚛️ `ViewStyle`                 | The default style that is applied to all the routes. Whatever component you return from `renderRoutes` will be wrapped inside a "route container" view. This prop allows you to set the style of the "route container" view.<br><br>📝 **Note**: This prop can be overridden/replaced on a per route basis either via `RouteOptions.routeContainerStyle` in the `NavigatorView.routes` prop, or via the `RouteViewPortal.routeOptions` prop.<br><br>💡 **Tip**: You can use this prop to provide a default background color for all the routes. |
| 🔤 `navBarPrefersLargeTitles`<br/><br>⚛️ `boolean`             | Specifies whether or not to use the large title style for the navigation bar title. Defaults to `true` on iOS 11 and above.<br><br>Maps to the [`UINavigationBar.prefersLargeTitle`](https://developer.apple.com/documentation/uikit/uinavigationbar/2908999-preferslargetitles) property,<br><br>📝 **Note**: This prop can be overridden on a per route basis either via `largeTitleDisplayMode` in the `NavigatorView.routes` prop, or via the `RouteViewPortal.routeOptions` prop.<br/> |
| 🔤  `navBarAppearance`<br/><br>⚛️ [`NavBarAppearanceCombinedConfig`](PLACE_HOLDER_LINK) | This prop allows for the customization of the [`UINavigationBar`](https://developer.apple.com/documentation/uikit/uinavigationbar). The navigation bar can be customized via two modes, namely "legacy" (iOS 12 and below), and "appearance" (iOS 13 and above).<br><br>The "legacy" mode, as the name would suggest, uses ["legacy customizations"](https://developer.apple.com/documentation/uikit/uinavigationbar/legacy_customizations) , where in the navigation bar is customize using the old API via directly manipulating the navigation bar object's properties.<br><br>The "appearance" mode on the other hand, uses `UINavigationBarAppearance` to apply customizations for each of the "navigation bar" styles, namely `standardAppearance` (normal height), `compactAppearance` (compact-height, e.g. iPhones in landscape, etc.), and  `scrollEdgeAppearance` (whenever there's a `UIScrollView`-like component).<br><br>📝 **Note**: There is one big caveat though, once "appearance" mode is used, "legacy" mode no longer works (it's some sort of bug in `UIKit`). In other words, switching between the two modes is not supported, only stick to one. When targeting iOS 12 and below, use "legacy", otherwise use "appearance".<br><br>💡 **Tip**: Check the [guides](PLACE_HOLDER_LINK) section for examples on how to customize the navigation bar, or look at the [`NavBarAppearanceCombinedConfig`](PLACE_HOLDER_LINK) object for the full list of properties.<br/><br/>💡 **Tip**: The navigation bar can also be customized on a per-route basis via the `RouteOptions.navBarAppearanceOverride`. You can set this property either via `routeOptionsDefault` in a route's config in the `NavigatorView.routes` prop, or via the [`RouteViewPortal`](PLACE_HOLDER_LINK) component using the `RouteViewPortal.routeOptions` prop. |
| 🔤 `isNavBarTranslucent`<br/><br>⚛️ `boolean`                  | Determines whether or not the the navigation bar is translucent. Maps to [`UINavigationBar.isTranslucent`](https://developer.apple.com/documentation/uikit/uinavigationbar/1624928-istranslucent). |
| `isInteractivePopGestureEnabled`<br/><br>⚛️ `boolean`         | Enables or disables the `interactivePopGestureRecognizer`. In other words, this prop sets whether swiping on the left edge of the screen will pop the current route. Defaults to `true`. |
| 🔤 `shouldSwizzleRootViewController`<br/><br>⚛️ `boolean`      | Determines whether or not the root view controller's default implementation is changed at run-time (i.e. "swizzled") to enable certain features (e.g. like enabling "view controller based status bar" via delegating `childForStatusBarStyle` to a child view controller, etc). The "injected" implementation is lifted from [`RNIRootViewController`](PLACE_HOLDER_LINK). <br><br>Defaults to `true`, however this will only take effect for the first `NavigatorView` component, and also only if the parent view controller is the same instance as the one in `window.rootViewController`.<br><br>For brownfield projects with native code (or for projects with an existing navigation solution), set this to `false` to disable this behavior. |

<br>

###### `NavigatorView` Render Props

| Prop Name and Type                                           | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤 `renderNavBarLeftItem`<br><br>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | Sets a default left item for the navigation bar for all the routes. If `leftItemsSupplementBackButton` in `routeOptions` or ( `defaultRouteOptions`) is set to `true` (which it is by default), then it will replace the back button (i.e. the back button will not be shown).<br><br>📝 **Note A**: The left navigation bar item can be overridden/replaced on a per route basis via `NavRouteConfigItem.renderNavBarLeftItem` in the `NavigatorView.routes` prop, or via  `RouteViewPortal.renderNavBarLeftItem` prop.<br><br>📝 **Note B**: If this prop is used, it'll implicitly set `navBarButtonLeftItemsConfig` to `{ type: 'CUSTOM' }` for a route's  `routeOptions`. So if the `navBarButtonLeftItemsConfig` is explicitly set to anything other than "custom", then this prop will not do anything. |
| 🔤 `renderNavBarRightItem`<br/><br>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | Sets a default right item for the navigation bar for all the routes.<br/><br/>📝 **Note A**: The right navigation bar item can be overridden/replaced on a per route basis via `NavRouteConfigItem.renderNavBarRightItem` in the `NavigatorView.routes` prop, or via  `RouteViewPortal.renderNavBarRightItem` prop.<br/><br/>📝 **Note B**: If this prop is used, it'll implicitly set `navBarButtonRightItemsConfig` to `{ type: 'CUSTOM' }` for a route's  `routeOptions`. So if the `navBarButtonRightItemsConfig` is explicitly set to anything other than "custom", then this prop will not do anything. |
| 🔤 `renderNavBarTitleItem`<br/><br>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | Sets a default title item for the navigation bar for all the routes.<br/><br/>📝 **Note**: The title navigation bar item can be overridden/replaced on a per route basis via `NavRouteConfigItem.renderNavBarTitleItem` in the `NavigatorView.routes` prop, or via  `RouteViewPortal.renderNavBarTitleItem` prop.<br/><br/>💡 **Tip**: You can access the route's `routeTitle` via the `navigation` object (i.e. `navigation.routeOptions.routeTitle`). |

<br>

###### `NavigatorView` Event Props

| Prop Name and Type                                           | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤 `onNavRouteWillPop`<br/><br/>⚛️ [`OnNavRoutePopEvent`](PLACE_HOLDER_LINK) | Event that is triggered when a route is about to be "popped" from the navigation stack (i.e. the pop transition has started). |
| 🔤 `onNavRouteDidPop`<br/><br/>⚛️ [`OnNavRoutePopEvent`](PLACE_HOLDER_LINK) | Event that is triggered when a route has been "popped" from the navigation stack (i.e. the pop transition has already been completed). |
| 🔤 `onCustomCommandFromNative`<br/><br/>⚛️ [`OnCustomCommandFromNativeEvent`](PLACE_HOLDER_LINK) | Event that is triggered from the native-side via the `RNINavigatorNativeCommands.sendCustomCommandToJS` delegate method. This event exists to receive custom user-defined commands from a `RNINavigatorView` (i.e. for custom native code integration). |

<br>

##### D.1.1.2. `NavigatorView`: Properties/Methods

###### `NavigatorView` General/Misc. Methods

| Name                                                         | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤 `getActiveRoutes`<br/><br/>⚛️ [`() => Array<NavRouteStackItem>`](PLACE_HOLDER_LINK) | Returns an array of `NavRouteStackItem` objects that represents the current state of the  navigation stack. |
| 🔤 `sendCustomCommandToNative`<br/><br/>⚛️ `(commandKey: string, commandData: object |  null) => Promise<object | null>` | Will trigger  the `RNINavigatorViewDelegate.didReceiveCustomCommandFromJS` delegate method for the current navigator view instance. This method exists to send custom user-defined commands to the `RNINavigatorView`'s delegate (i.e. for custom native code integration).<br><br>📌 Check the [native integration guide](PLACE_HOLDER_LINK) section for more details. |
| 🔤 `getNavigatorConstants`<br/><br/>⚛️ [`() => Promise<NavigatorConstantsObject>`](PLACE_HOLDER_LINK) | Resolves to an object containing values related to UI (e.g. `navBarHeight`, navigator bounds, `safeAreaInsets`, `statusBarHeight`), and the current state of the navigator (e.g. whether a view controller is being presented modally, the `activeRoutes`, the topmost view controller, and the current visible view controller). |

<br>

###### `NavigatorView` Navigation Commands

Commands you can call to control the navigator, e.g. like showing or hiding a route, replacing a route in the navigation stack, etc. Unless specified otherwise, the commands listed here are really just invoking [`setViewControllers`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621861-setviewcontrollers) internally in the native side. <br><br>The navigation commands are asynchronous; they will return a promise that resolves once the command is complete. Due to timing related issues, the `NavigatorView` internally has a command queue, as such, only one command can be executed at a given time. For example if you call `push`, then call `pop` immediately (i.e. not waiting for `push` to complete first before calling `pop`), they will always be executed in that order (i.e. it will always wait for the previous command to complete).

| Name and Type                                                | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤 `push(routeItem, options?) => Promise<void>`<br/><br/>⚛️ [`routeItem: NavRouteItem`](PLACE_HOLDER_LINK)<br>⚛️ [`options: NavCommandPushOptions`](PLACE_HOLDER_LINK) | Push a new route into the navigation stack. The `routeItem` to be pushed must be a route that is declared in the `NavigatorView.routes` prop. This command maps to the  [`UINavigationController.pushViewController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621887-pushviewcontroller) method.<br><br>The `routeItem` parameter accepts an object; you can define what route to show using the `routeKey` property. You can also pass data to the new route using the `routeProps`  property, or optionally pass new route options via the `routeOptions` property.<br><br>💡 **Tip**: You can set a temporary push transition (e.g. `FadePush`, `SlideLeftPush`, etc), or disable the transition animation entirely via the `options` parameter. |
| 🔤 `pop(options?) => Promise<void>`<br/><br/>⚛️ [`options: NavCommandPopOptions`](PLACE_HOLDER_LINK) | Pop the current active route out of the navigation stack. This command maps to the  [`UINavigationController.popViewController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621886-popviewcontroller) method.<br><br/>💡 **Tip**: You can set a temporary pop transition (e.g. `FadePop`, `SlideLeftPop`, etc.), or disable the transition animations entirely via the `options` parameter. |
| 🔤 `popToRoot(options?) => Promise<void>`<br/><br/>⚛️ [`popToRoot: NavCommandPopOptions`](PLACE_HOLDER_LINK) | Pop all routes except the first route in the navigation stack. This can be used as a quick way to go back the root route. This command maps to the  [`UINavigationController.popToRootViewController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621855-poptorootviewcontroller) method. |
| 🔤 `removeRoute`<br/><br/>⚛️ `(routeIndex: number, animated?: boolean = false) => Promise<void>` | Removes a specific route from the navigation stack. The argument passed to `routeIndex` determines which route to remove from the navigation stack, where a value of `0` means to move the root route, and so on.<br><br>💡 **Tip**: You can call `getActiveRoutes` to get the current state of the navigation stack.br><br/>💡 **Tip**: This command is useful for situations where in a given route in the navigation stack becomes "stale", i.e. it no longer makes sense to show that route when navigating backwards. An example could be a user navigating from a "registration" route, to a "registration success" route. If the back button is pressed, it doesn't make sense for the "registration" route to appear again, so you remove it from the navigation stack. |
| 🔤 `removeRoutes`<br/><br/>⚛️ `(routeIndices: number, animated?: boolean = false) => Promise<void>` | Removes  the specified routes from the navigation stack. The argument passed to `routeIndices` determines which routes to remove from the navigation stack, where a value of `0` means to remove the root route, and so on. This is similar to `removeRoute`, but this command lets you remove multiple routes at once.<br/><br/>💡 **Tip**: You can call `getActiveRoutes` to get the current state of the navigation stack.<br/><br/>💡 **Tip**: Similar to `removeRoute`, this command is useful for selectively removing routes that have gone "stale" all at once. |
| 🔤 `replaceRoute(prevRouteIndex: number, routeItem: NavRouteItem, animated?: boolean = false) => Promise<void>`<br/><br/>⚛️ [`routeItem: NavRouteItem`](PLACE_HOLDER_LINK) | Replaces an active route route in the navigation stack with a new route that matches the  specified `prevRouteIndex` argument. A new route will be created based on the specified `routeItem` provided, and it will then be used as the replacement route. <br/><br/>📝 **Note**: The `routeItem` to be pushed must be a route that is declared in the `NavigatorView.routes` prop.<br><br>💡 **Tip**: You can call `getActiveRoutes` to get the current state of the navigation stack. |
| 🔤 `insertRoute(routeItem: NavRouteItem, atIndex: number, animated?: boolean = false) => Promise<void>`<br/><br/>⚛️ [`routeItem: NavRouteItem`](PLACE_HOLDER_LINK) | Similar to the `push` command, this let's you create a new route based on the provided `routeItem`, and then add it to the navigation stack, but instead of only being able to add routes to the top, this command let's you arbitrarily add a route anywhere in the navigation stack based on the provided `atIndex` argument.<br/><br/>📝 **Note**: The `routeItem` to be added must be a route that is declared in the `NavigatorView.routes` prop, and the `atIndex` argument must not exceed the current size of the stack. |
| 🔤 `setRoutes(transform: SetRoutesTransformCallback, animated?: boolean = false) => Promise<void>`<br/><br/>⚛️ [`transform: SetRoutesTransformCallback`](PLACE_HOLDER_LINK) | Allows you to directly set the routes. Amongst all the navigation commands, this is the most flexible (and complicated) because it allows you to add, remove, reorder, replace, or completely change the navigation stack.<br><br>The `transform` parameter accepts a function callback that, when called, will receive an array of objects that represents the current active routes in the navigation stack. The `transform` callback must then return an array of routes that will be used to set the new navigation stack (i.e. the new routes). Any of the previous active routes that are not returned from the `transform` callback will be removed from the navigation stack, and conversely, new routes that weren't in the original active routes will be created, and then added to the navigation stack.<br><br>📝 **Note**: The `transform` callback will receive an array of [`NavRouteStackPartialItem`](PLACE_HOLDER_LINK) objects. This object has an optional property called `routeID` that acts as a unique identifier for a route; as such, existing active routes will have an associated `routeID`. So if the `transform` callback returns a `NavRouteStackPartialItem` without a `routeID`, then it means that it's a new route (so it will then create that route and add it to the navigation stack). Conversely, if you want an active route to remain in the navigation stack, then simply return that route from the `NavRouteStackPartialItem` items along with it's associated `routeID`.  <br/><br/>💡 **Tip**: This command is useful if you need complete control over the navigation stack. Amongst all the other navigation commands, this the most direct mapping to [`UINavigationController.setViewControllers`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621861-setviewcontrollers). Jump to the [guides section](PLACE_HOLDER_LINK) for usage examples. |
| 🔤 `setNavigationBarHidden`<br/><br/>⚛️ `(isHidden: boolean, animated: boolean) => Promise<void>` | Programmatically shows or hides the navigation bar. Maps to the [`UINavigationController.setNavigationBarHidden`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621885-setnavigationbarhidden) method.<br/><br/>💡 **Tip**: If you want to immediately hide the navigation bar when a route is pushed (i.e. for a route, you don't want the navigation bar to be visible), you can use  `RouteOptions.navigationBarVisibility` property, which you can set either via `routeOptionsDefault` in a route's config in the `NavigatorView.routes` prop, or via the [`RouteViewPortal`](PLACE_HOLDER_LINK) component using the `RouteViewPortal.routeOptions` prop.<br/><br/>💡 **Tip**: Like all other navigation commands, this command is async. So this command is useful if you want to wait for the navigation bar hide animation to finish first before doing something else. |

<br>

###### `NavigatorView` Convenience Navigation Commands

These are basically "presets" to existing navigation commands i.e. it uses the existing navigation commands available to provide shortcuts to common navigation actions for convenience.

| Name and Type                                                | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤 `replacePreviousRoute(routeItem: NavRouteItem, animated?: boolean = false) => Promise<void>`<br/><br/>⚛️ [`routeItem: NavRouteItem`](PLACE_HOLDER_LINK) | Replaces the previous route in the navigation stack with a new route. |
| 🔤 `replaceCurrentRoute(routeItem: NavRouteItem, animated?: boolean = false) => Promise<void>`<br/><br/>⚛️ [`routeItem: NavRouteItem`](PLACE_HOLDER_LINK) | Replaces the current route (i.e. the topmost route) in the navigation stack with a new route. |
| 🔤 `removePreviousRoute`<br/><br/>⚛️ `(animated?: boolean = false) => Promise<void>` | Removes the previous route in the navigation stack.          |
| 🔤 `removeAllPrevRoutes`<br/><br/>⚛️ `(animated?: boolean = false) => Promise<void>` | Removes all of the previous routes in the navigation stack.  |

<br>

#### D.1.2. `RouteViewPortal` Component

The purpose of this component is to allow for customization of a route at run-time e.g. like overriding/updating a route's `RouteOptions`, or rendering custom components to show inside the navigation bar, etc. The reason why this component has the "portal" suffix is because it's "transporting" things like the route options and the render props somewhere else.<br><br>This component that is meant to be used inside a route (i.e. it must be used inside the `renderRoute` function in the `NavigatorView.routes` prop). This is because internally, this component relies on react context to communicate to the parent `NavigatorRouteView` component. For some background info, the `NavigatorRouteView` component is responsible for rendering the component returned by `renderRoute`, managing route lifecycle, communicating with the native views and modules, etc). <br><br>As such this component doesn't actually render anything directly, it's merely an intermediate component to pass things along. The components you pass to  the `RouteViewPortal` are actually being rendered in different place in the component tree. Keep this in mind when using things like react context and state (this is a limitation I'm currently trying to fix).<br><br>

##### D.1.2.1. `RouteViewPortal` Component Props

| Prop Name and Type                                           | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤  `routeOptions`<br/><br/>⚛️ [`RouteOptions`](PLACE_HOLDER_LINK) | This prop will override the existing route options provided either from the route config (i.e. the `NavRouteConfigItem.routeOptionsDefault`), or the current route options provided via the navigation command (e.g. `navigation.push({..., routeOptions: {...}})`).<br><br>💡 **Tip**: This prop is useful for dynamically changing the current route options based on some condition. For example, you can change the navigation bar title after loading a resource, or temporarily hide the back button while loading, etc. |
| 🔤 `renderNavBarLeftItem`<br/><br/>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | This prop is used for rendering a custom left item component in the navigation bar. If `leftItemsSupplementBackButton` in `routeOptions`  is set to `true` (which it is by default), then it will replace the back button (i.e. the back button will not be shown).<br><br>📝 **Note**: If this prop is used, it'll implicitly set `navBarButtonLeftItemsConfig` to `{ type: 'CUSTOM' }` for a route's  `routeOptions`. So if the `navBarButtonLeftItemsConfig` is explicitly set to anything other than "custom", then this prop will not do anything. |
| 🔤 `renderNavBarRightItem`<br/><br/>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | This prop is used for rendering a custom right item component in the navigation bar.<br/><br/>📝 **Note**: If this prop is used, it'll implicitly set `navBarButtonRightItemsConfig` to `{ type: 'CUSTOM' }` for a route's  `routeOptions`. So if the `navBarButtonRightItemsConfig` is explicitly set to anything other than "custom", then this prop will not do anything. |
| 🔤 `renderNavBarTitleItem`<br/><br/>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | This prop is used for rendering a custom title item component in the navigation bar.<br><br>💡 **Tip**: You can access the route's `routeTitle` via the `navigation` object (i.e. `navigation.routeOptions.routeTitle`). |
| 🔤 `renderRouteHeader`<br/><br/>⚛️ [`(navigation: NavigationObject) => ReactElement`](PLACE_HOLDER_LINK) | A common UI navigation pattern is having a large header at the very top of the screen that acts as the centerpiece for a route. That header will either remain at a fixed size, or expand and collapse during scrolling (check out [`NavigatorShowcase01`](PLACE_HOLDER_LINK) and [`NavigatorShowcase02`](PLACE_HOLDER_LINK) for examples). This prop allows you to render a header at the top of the screen.<br><br>This prop accepts a function that must return a [`RouteHeaderView`](PLACE_HOLDER_LINK) as the root element. This component integrates with the route in the native side to enable the header behavior. Check the documentation for [`RouteHeaderView`](PLACE_HOLDER_LINK) for more details. |

<br>

#### D.1.3. `RouteViewEvents` Component

This component allows you to subscribe/listen to route-related events (e.g. when a route is about to be popped, or when a navigation bar item has been pressed, etc).<br><br>Similar to the `RouteViewPortal` component, 1) this component doesn't actually render anything, and 2) this component is also required to be used inside a route. This is because, like the `RouteViewPortal` component, this component also relies on react context to communicate to the parent `NavigatorRouteView` component to receive the route-related events.<br><br>Internally, every route has an associated event emitter. That route event emitter can be accessed via the route's navigation object (e.g.   `NavigationObject.getRefToNavRouteEmitter`). You can then use that emitter object to manually attach event handlers, and then listen for events. Internally, this component uses the same mechanism to subscribe and listen to the route events. In other words, this component is simply one of the alternate ways to subscribe to the events emitted by route event emitter.<br><br>

##### D.1.3.1.`RouteViewEvents` Component Props

###### `RouteViewEvents` Push/Pop Event Props

These events are triggered when the current route is about to be pushed or popped from the navigation stack.

| Prop Name and Type                                           | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤 `onRouteWillPush`<br/><br/>⚛️ [`OnRoutePushEvent`](PLACE_HOLDER_LINK) | An event that is triggered when the current route is about to be pushed into the navigation stack (i.e. the push transition has begun). Internally, this event is triggered just before the [`UINavigationController.pushViewController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621887-pushviewcontroller) method is called. |
| 🔤 `onRouteDidPush`<br/><br/>⚛️ [`OnRoutePushEvent`](PLACE_HOLDER_LINK) | An event that is triggered when the current route has been pushed into the navigation stack (i.e. the push transition has ended). This event fires after `onRouteWillPush`. Internally, this event is triggered inside the completion block of the  [`UINavigationController.pushViewController`](https://developer.apple.com/documentation/uikit/uinavigationcontroller/1621887-pushviewcontroller) method. |
| 🔤 `onRouteWillPop`<br/><br/>⚛️ [`OnRoutePopEvent`](PLACE_HOLDER_LINK) | An event that is triggered when a route is about to be popped from the navigation stack (i.e. the pop transition has begun). Internally, this event is triggered by the [`UIViewController.willMove`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621381-willmove) lifecycle method.<br><br>💡 **Tip**: The `event.nativeEvent` object has a property called `isUserInitiated`. This property specifies whether the pop transition was initiated by the navigation command (`false`), or if it was initiated by the user (e.g. via the back button or swipe back gesture) (`true`). |
| 🔤 `onRouteDidPop`<br/><br/>⚛️ [`OnRoutePopEvent`](PLACE_HOLDER_LINK) | An event that is triggered when a route has been popped from the navigation stack (i.e. the pop transition has ended). This event fires after `onRouteWillPop`.  Internally, this event is triggered by the [`UIViewController.didMove`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621405-didmove) lifecycle method.<br/><br/>💡 **Tip**: The `event.nativeEvent` object has a property called `isUserInitiated`. This property specifies whether the pop transition was initiated by the navigation command (`false`), or if it was initiated by the user (e.g. via the back button or swipe back gesture) (`true`). |

<br>

###### `RouteViewEvents` Focus/Blur Event Props

These events are triggered whenever the current route will receive or lose focus (this usually occurs whenever a route is pushed and popped from the navigation stack).

| Prop Name and Type                                           | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤 `onRouteWillFocus`<br/><br/>⚛️ [`OnRouteFocusBlurEvent`](PLACE_HOLDER_LINK) | An event that is triggered when the current route is about to become in focus (i.e. the pop transition for the topmost route item has begun). Internally, this event is triggered by the  [`UIViewController.viewWillAppear`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621510-viewwillappear) lifecycle method.<br><br>📝 **Note**: This event will also fire alongside `onRouteWillPush` (i.e. when the current route is about to become visible for the first time). |
| 🔤 `onRouteDidFocus`<br/><br/>⚛️ [`OnRouteFocusBlurEvent`](PLACE_HOLDER_LINK) | An event that is triggered when the current route has received focus (i.e. the pop transition for the topmost route item has ended). This event is triggered by the  [`UIViewController.viewDidAppear`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621423-viewdidappear) lifecycle method.<br/><br/>📝 **Note**: This event will also fire alongside `onRouteDidPush` (i.e. when the current route has become visible for the first time). |
| 🔤 `onRouteWillBlur`<br/><br/>⚛️ [`OnRouteFocusBlurEvent`](PLACE_HOLDER_LINK) | An event that is triggered when the current route is about to lose focus (i.e. a new route is about to be pushed into the navigation stack). This event is triggered by the  [`UIViewController.viewWillDisappear`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621485-viewwilldisappear)  lifecycle method.<br/><br/>📝 **Note**: This event will fire alongside `onRouteWillPop` (i.e. when the current route is about to be popped from the navigation stack). |
| 🔤 `onRouteDidBlur`<br/><br/>⚛️ [`OnRouteFocusBlurEvent`](PLACE_HOLDER_LINK) | An event that is triggered when the current route has lost focus (i.e. a new route has been pushed into the navigation stack). This event is triggered by the  [`UIViewController.viewDidDisappear`](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621477-viewdiddisappear)  lifecycle method.<br/><br/>📝 **Note**: This event will fire alongside `onRouteDidPop` (i.e. when the current route has been popped from the navigation stack). |

<br>

###### `RouteViewEvents` Navigation Bar Item Event Props

📝 **Note**: When using custom navigation bar items (e.g. `renderNavBarLeftItem`, etc.), the `onPressNavBar` events will not be triggered. Instead, use a button component  (e.g. `TouchableOpacity`), and then put your custom navigation bar item inside it.<br><br>💡 **Tip:** It's possible to have more than one navigation bar item, as such, to differentiate which item is pressed, you can use the properties provided by `event.nativeEvent` object that you'll receive from the `OnPressNavBarItemEvent`. Some of those properties are `nativeEvent.key` (an optional user-defined string), and `nativeEvent.index` (the item's placement in the group).

| Prop Name and Type                                           | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤 `onPressNavBarLeftItem`<br/><br/>⚛️ [`OnPressNavBarItemEvent`](PLACE_HOLDER_LINK) | An event that is triggered when a navigation bar left item is pressed. |
| 🔤 `onPressNavBarRightItem`<br/><br/>⚛️ [`OnPressNavBarItemEvent`](PLACE_HOLDER_LINK) | An event that is triggered when a navigation bar right item is pressed. |

<br>

###### `RouteViewEvents` Search Bar-Related Event Props

These events are related to the route's search bar. A route can be configured to have a [`UISearchBar`](https://developer.apple.com/documentation/uikit/uisearchbar) in the navigation bar via the `RouteOptions.searchBarConfig` property.

| Prop Name and Type                                           | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 🔤 `onUpdateSearchResults`<br/><br/>⚛️ [`OnUpdateSearchResults`](PLACE_HOLDER_LINK) | An event that is triggered whenever the search bar's text changes. Internally, this event is triggered by the [`UISearchResultsUpdating.updateSearchResults`](https://developer.apple.com/documentation/uikit/uisearchresultsupdating/1618658-updatesearchresults) method.<br><br>💡 **Tip**: This event is useful for updating a list of results. The `event.nativeEvent` object will contain the search bar's current text value. Use the search text value to update the list accordingly. |
| 🔤 `onSearchBarCancelButtonClicked`<br/><br/>⚛️ [`OnSearchBarCancelButtonClicked`](PLACE_HOLDER_LINK) | An event that is triggered when the search bar's cancel button is pressed. When the cancel button is pressed, the search bar's text field will be cleared (this will trigger `onUpdateSearchResults`).<br/><br/>📝 **Note**: The search bar's cancel button will only appear when the search bar is in focus (unless specified otherwise via the `RouteSearchControllerConfig.automaticallyShowsCancelButton` property in the route's search config). |
| 🔤 `onSearchBarSearchButtonClicked`<br/><br/>⚛️ [`onSearchBarSearchButtonClicked`](PLACE_HOLDER_LINK) | An event that is triggered when the search button (i.e the return key) is pressed in the iOS keyboard while the search bar is in focus. |

<br>

### D.2. Context

Lorum Ipsum

<br>

### D.3. Hooks

Lorum Ipsum

<br>

### D.4. Objects

Lorum Ipsum

<br>

### D.5. Types

Lorum Ipsum

<br>

#### D.5.1. Event Types

Lorum Ipsum

<br>

#### D.5.2. Function and Callback Types

Lorum Ipsum

<br>

#### D.5.3. Enums and Unions

Lorum Ipsum

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

## G. Tests and Demos

Lorum ipsum

------

<br><br>

## H. Meta

Lorum ipsum

------

<br><br>

## I. License

MIT