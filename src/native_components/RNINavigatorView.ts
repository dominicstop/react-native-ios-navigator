import { ViewStyle, requireNativeComponent } from 'react-native';
import type { NavBarAppearanceCombinedConfig } from 'src/types/NavBarAppearanceConfig';

//#region - `RNINavigatorView` Event Payloads
// TODO: Refactor - capitalize, use `;`
export type onNavRouteViewAddedPayload = { nativeEvent: {
  target       : number,
  routeID      : number,
  routeKey     : string,
  routeIndex   : number,
  isNativeRoute: boolean,
  navigatorID  : number,
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

export type onSetNativeRouteDataPayload = { nativeEvent: {
  target     : number,
  navigatorID: number,
}};
//#endregion

export type NativeRouteDataMap = {
  // key is `routeID`
  [key: string]: {
    routeIndex: number;
  };
};

/** `RNINavigatorView` native comp. props */
export type RNINavigatorViewProps = {
  style: ViewStyle | Array<ViewStyle>;
  
  // General/Misc. Config
  navigatorID: number;
  nativeRouteData: NativeRouteDataMap;
  isInteractivePopGestureEnabled: boolean;

  // Customize the Bar's Appearance
  navBarPrefersLargeTitles: boolean;
  isNavBarTranslucent: boolean;
  navBarAppearance: NavBarAppearanceCombinedConfig;
  
  // Native Events
  // TODO: Rename to `event`
  onNavRouteViewAdded ?: (events: onNavRouteViewAddedPayload ) => void;
  onNavRouteWillPop   ?: (events: onNavRouteWillPopPayload   ) => void;
  onNavRouteDidPop    ?: (events: onNavRouteDidPopPayload    ) => void;
  onSetNativeRouteData?: (events: onSetNativeRouteDataPayload) => void;
};

export const RNINavigatorView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorView');