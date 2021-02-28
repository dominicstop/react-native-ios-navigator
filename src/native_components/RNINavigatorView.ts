import { ViewStyle, requireNativeComponent } from 'react-native';
import type { NavBarAppearanceCombinedConfig } from 'src/types/NavBarAppearanceConfig';

//#region - `RNINavigatorView` Event Payloads
export type onNavRouteViewAddedPayload = { nativeEvent: {
  target     : number,
  routeKey   : string,
  routeIndex : number,
  navigatorID: number,
}};

export type onNavRouteWillPopPayload = { nativeEvent: {
  target         : number ,
  routeKey       : string ,
  routeIndex     : number ,
  navigatorID    : number ,
  isUserInitiated: boolean,
}};

export type onNavRouteDidPopPayload = { nativeEvent: {
  target         : number ,
  routeKey       : string ,
  routeIndex     : number ,
  navigatorID    : number ,
  isUserInitiated: boolean,
}};
//#endregion

/** `RNINavigatorView` native comp. props */
type RNINavigatorViewProps = {
  style: ViewStyle | Array<ViewStyle>;
  
  // General/Misc. Config
  navigatorID: number;
  isInteractivePopGestureEnabled: boolean;
  
  // Customize the Bar's Appearance
  navBarPrefersLargeTitles: boolean;
  isNavBarTranslucent: boolean;
  navBarAppearance: NavBarAppearanceCombinedConfig;
  
  // Native Events
  onNavRouteViewAdded?: (events: onNavRouteViewAddedPayload) => void;
  onNavRouteWillPop  ?: (events: onNavRouteWillPopPayload  ) => void;
  onNavRouteDidPop   ?: (events: onNavRouteDidPopPayload   ) => void;
};

export const RNINavigatorView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorView');