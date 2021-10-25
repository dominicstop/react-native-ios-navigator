

import type { RNINavigatorRouteViewProps } from "../native_components/RNINavigatorRouteView";

// Mirror prop types from `RNINavigatorRouteViewProps`
export type RouteOptions = Pick<RNINavigatorRouteViewProps,
  | 'statusBarStyle'

  // Transition Config
  | 'transitionConfigPush'
  | 'transitionConfigPop'

  // Navbar Config
  | 'routeTitle'
  | 'prompt'
  | 'largeTitleDisplayMode'
  | 'searchBarConfig'

  // Navbar item config
  | 'navBarButtonBackItemConfig'
  | 'navBarButtonLeftItemsConfig'
  | 'navBarButtonRightItemsConfig'

  // Navbar back button item config
  | 'backButtonTitle'
  | 'hidesBackButton'
  | 'backButtonDisplayMode'
  | 'leftItemsSupplementBackButton'
  | 'applyBackButtonConfigToCurrentRoute'
  
  // NavigationConfigOverride-related
  | 'navBarAppearanceOverride'
  | 'navigationBarVisibility'
> & {

  routeContainerStyle?: RNINavigatorRouteViewProps['style'];
  automaticallyAddHorizontalSafeAreaInsets?: boolean;

  allowTouchEventsToPassThroughNavigationBar?: boolean;
};