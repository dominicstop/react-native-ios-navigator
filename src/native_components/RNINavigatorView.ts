import { ViewStyle, requireNativeComponent } from 'react-native';
import type { NavBarAppearanceCombinedConfig } from 'src/types/NavBarAppearanceConfig';

//#region - `RNINavigatorView` Event Payloads
export type OnNavRouteViewAddedPayload = { nativeEvent: {
  target       : number,
  routeID      : number,
  routeKey     : string,
  routeIndex   : number,
  isNativeRoute: boolean,
  navigatorID  : number,
}};

export type OnNavRouteWillPopPayload = { nativeEvent: {
  target         : number ,
  routeKey       : string ,
  routeIndex     : number ,
  navigatorID    : number ,
  isUserInitiated: boolean,
}};

export type OnNavRouteDidPopPayload = { nativeEvent: {
  target         : number ,
  routeKey       : string ,
  routeIndex     : number ,
  navigatorID    : number ,
  isUserInitiated: boolean,
}};

export type OnSetNativeRouteDataPayload = { nativeEvent: {
  target     : number,
  navigatorID: number,
}};
//#endregion

export type NativeRouteMap = {
  // key is `routeID`
  [key: string]: {
    routeKey: string;
    routeIndex: number;
  };
};

/** `RNINavigatorView` native comp. props */
export type RNINavigatorViewProps = {
  style: ViewStyle | Array<ViewStyle>;
  
  // General/Misc. Config
  navigatorID: number;
  nativeRoutes: NativeRouteMap;
  isInteractivePopGestureEnabled: boolean;

  // Customize the Bar's Appearance
  navBarPrefersLargeTitles: boolean;
  isNavBarTranslucent: boolean;
  navBarAppearance: NavBarAppearanceCombinedConfig;
  
  // Native Events
  // TODO: Rename to `event`
  onNavRouteViewAdded ?: (events: OnNavRouteViewAddedPayload ) => void;
  onNavRouteWillPop   ?: (events: OnNavRouteWillPopPayload   ) => void;
  onNavRouteDidPop    ?: (events: OnNavRouteDidPopPayload    ) => void;
  onSetNativeRoutes?: (events: OnSetNativeRouteDataPayload) => void;
};

export const RNINavigatorView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorView');