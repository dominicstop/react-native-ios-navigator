import { ViewStyle, TextStyle, TextStyleIOS, requireNativeComponent } from 'react-native';
import type { NavBarAppearanceConfig } from 'src/types/NavBarAppearanceConfig';

//#region - `RNINavigatorView` Event Payloads
export type onNavRouteViewAddedPayload = { nativeEvent: {
  target    : number,
  routeKey  : string,
  routeIndex: number
}};

export type onNavRouteWillPopPayload = { nativeEvent: {
  target         : number,
  routeKey       : string,
  routeIndex     : number,
  isUserInitiated: boolean
}};

export type onNavRouteDidPopPayload = { nativeEvent: {
  target         : number,
  routeKey       : string,
  routeIndex     : number,
  isUserInitiated: boolean
}};
//#endregion

/** `RNINavigatorView` native comp. props */
type RNINavigatorViewProps = {
  style: ViewStyle;
  
  // General/Misc. Config
  navBarPrefersLargeTitles: boolean;
  isInteractivePopGestureEnabled: boolean;
  isNavBarTranslucent: boolean;
  
  // Customize the Bar's Appearance
  navBarAppearance: NavBarAppearanceConfig;
  
  // Native Events
  onNavRouteViewAdded?: (events: onNavRouteViewAddedPayload) => void;
  onNavRouteWillPop  ?: (events: onNavRouteWillPopPayload  ) => void;
  onNavRouteDidPop   ?: (events: onNavRouteDidPopPayload   ) => void;
};

export const RNINavigatorView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorView');