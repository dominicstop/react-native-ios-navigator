import { ViewStyle, requireNativeComponent, UIManager } from 'react-native';
import type { EdgeInsets } from 'src/types/MiscTypes';
import type { NavBarAppearanceCombinedConfig } from 'src/types/NavBarAppearanceConfig';

//#region - `RNINavigatorView` Event Payloads
type EventBasePayload = {
  target: number;
  navigatorID: number;
};

export type OnNavRouteViewAddedPayload = { 
  nativeEvent: EventBasePayload & {
    routeID      : number;
    routeKey     : string;
    routeIndex   : number;
    isNativeRoute: boolean;
  };
};

export type OnNavRouteWillPopPayload = { 
  nativeEvent: EventBasePayload & {
    routeKey       : string;
    routeIndex     : number;
    isUserInitiated: boolean;
  };
};

export type OnNavRouteDidPopPayload = { 
  nativeEvent: EventBasePayload & {
    routeKey       : string;
    routeIndex     : number;
    isUserInitiated: boolean;
  };
};

export type OnSetNativeRouteDataPayload = {
  nativeEvent: EventBasePayload;
};

export type OnNativeCommandRequestPayload = { 
  nativeEvent: EventBasePayload & {
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
  };
};

export type OnCustomCommandFromNativePayload = { 
  nativeEvent: EventBasePayload & {
    commandKey: string;
    commandData: object;
  };
};

export type OnUIConstantsDidChangePayload = { 
  nativeEvent: EventBasePayload & {
    statusBarHeight: number;
    safeAreaInsets: EdgeInsets;
  };
};
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
  shouldSwizzleRootViewController: boolean;

  // Customize the Bar's Appearance
  navBarPrefersLargeTitles: boolean;
  isNavBarTranslucent: boolean;
  navBarAppearance: NavBarAppearanceCombinedConfig;
  
  // Native Events
  onNavRouteViewAdded?: (event: OnNavRouteViewAddedPayload ) => void;
  onSetNativeRoutes  ?: (event: OnSetNativeRouteDataPayload) => void;

  onNavRouteWillPop?: (event: OnNavRouteWillPopPayload) => void;
  onNavRouteDidPop ?: (event: OnNavRouteDidPopPayload ) => void;

  onNativeCommandRequest   ?: (event: OnNativeCommandRequestPayload   ) => void;
  onCustomCommandFromNative?: (event: OnCustomCommandFromNativePayload) => void;

  onUIConstantsDidChange?: (event: OnUIConstantsDidChangePayload) => void;
};

export type RNINavigatorViewConstantsObject = {
  navigationBarHeight: number;
};

const viewName = "RNINavigatorView";

export const RNINavigatorView = 
  requireNativeComponent<RNINavigatorViewProps>(viewName);

export const RNINavigatorViewConstants = 
  ((UIManager as any)[viewName]).Constants as RNINavigatorViewConstantsObject;

