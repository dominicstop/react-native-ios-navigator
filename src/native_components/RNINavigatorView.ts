import { ViewStyle, requireNativeComponent, UIManager } from 'react-native';

import type { OnCustomCommandFromNativePayload, OnNativeCommandRequestPayload, OnNavRouteDidPopPayload, OnNavRouteViewAddedPayload, OnNavRouteWillPopPayload, OnSetNativeRouteDataPayload, OnUIConstantsDidChangePayload } from '../types/RNINavigatorViewEvents';
import type { NavBarAppearanceCombinedConfig } from '../types/NavBarAppearanceConfig';


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

