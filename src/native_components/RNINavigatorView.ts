import { ViewStyle, TextStyle, TextStyleIOS, requireNativeComponent } from 'react-native';

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

/** `UIBarStyle`: Defines the stylistic appearance of different types of views */
export type BarStyle = 'default' | 'black';

/** `RNINavigatorView` native comp. props */
type RNINavigatorViewProps = {
  style: ViewStyle;
  
  // Navigation Bar: General/Misc. Config
  navBarPrefersLargeTitles: boolean;

  // Navigation Bar: Legacy Customizations
  navBarStyle?: BarStyle;
  navBarTintColor?: number;
  navBarIsTranslucent: boolean;
  navBarTitleTextStyle?: TextStyle & TextStyleIOS;
  navBarLargeTitleTextAttributes?: TextStyle & TextStyleIOS;

  // Native Events
  onNavRouteViewAdded?: (events: onNavRouteViewAddedPayload) => void;
  onNavRouteWillPop  ?: (events: onNavRouteWillPopPayload  ) => void;
  onNavRouteDidPop   ?: (events: onNavRouteDidPopPayload   ) => void;
};

export const RNINavigatorView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorView');