import { ViewStyle, requireNativeComponent } from 'react-native';
import type { NavBarAppearanceCombinedConfig } from 'src/types/NavBarAppearanceConfig';

//#region - `RNINavigatorView` Event Payloads
export type OnNavRouteViewAddedPayload = { nativeEvent: {
  target       : number;
  routeID      : number;
  routeKey     : string;
  routeIndex   : number;
  isNativeRoute: boolean;
  navigatorID  : number;
}};

export type OnNavRouteWillPopPayload = { nativeEvent: {
  target         : number;
  routeKey       : string;
  routeIndex     : number;
  navigatorID    : number;
  isUserInitiated: boolean;
}};

export type OnNavRouteDidPopPayload = { nativeEvent: {
  target         : number;
  routeKey       : string;
  routeIndex     : number;
  navigatorID    : number;
  isUserInitiated: boolean;
}};

export type OnSetNativeRouteDataPayload = { nativeEvent: {
  target     : number;
  navigatorID: number;
}};

export type OnNativeCommandRequestPayload = { nativeEvent: {
  target: number;
  navigatorID: number;
  commandData: {
    commandKey: 'pushViewController';
    routeID: number;
    routeKey: string;
    isAnimated: boolean;
  } | {
    commandKey: 'push';
    routeKey: string,
    routeProps?: object;
    isAnimated: boolean
  } | {
    commandKey: 'pop';
    isAnimated: boolean;
  };
}};

export type OnCustomCommandFromNativePayload = { nativeEvent: {
  target: number;
  navigatorID: number;
  commandKey: string;
  commandData: object;
}};
//#endregion

export type NativeRouteMap = {
  // key is `routeID`
  [key: string]: {
    routeKey: string;
    routeIndex: number;
    routeProps?: object;
  };
};

/** `RNINavigatorView` native comp. props */
export type RNINavigatorViewProps = {
  style: ViewStyle | Array<ViewStyle>;
  nativeID?: string;
  
  // General/Misc. Config
  navigatorID: number;
  nativeRoutes: NativeRouteMap;
  initialRouteKeys: Array<string>;
  isInteractivePopGestureEnabled: boolean;

  // Customize the Bar's Appearance
  navBarPrefersLargeTitles: boolean;
  isNavBarTranslucent: boolean;
  navBarAppearance: NavBarAppearanceCombinedConfig;
  
  // Native Events
  // TODO: Rename to `event`
  // TODO: Use as handler directly
  onNavRouteViewAdded      ?: (event: OnNavRouteViewAddedPayload      ) => void;
  onNavRouteWillPop        ?: (event: OnNavRouteWillPopPayload        ) => void;
  onNavRouteDidPop         ?: (event: OnNavRouteDidPopPayload         ) => void;
  onSetNativeRoutes        ?: (event: OnSetNativeRouteDataPayload     ) => void;
  onNativeCommandRequest   ?: (event: OnNativeCommandRequestPayload   ) => void;
  onCustomCommandFromNative?: (event: OnCustomCommandFromNativePayload) => void;
};

export const RNINavigatorView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorView');