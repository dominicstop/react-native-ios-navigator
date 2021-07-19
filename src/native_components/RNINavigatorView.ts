import { ViewStyle, requireNativeComponent, UIManager } from 'react-native';

import type { OnCustomCommandFromNativeEvent, OnNativeCommandRequestEvent, OnNavRoutePopEvent, OnNavRouteViewAddedEvent, OnSetNativeRoutesEvent, OnUIConstantsDidChangeEvent } from '../types/RNINavigatorViewEvents';
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
  navBarAppearance: NavBarAppearanceCombinedConfig | null | undefined;
  
  // Native Events
  onNavRouteViewAdded?: OnNavRouteViewAddedEvent;
  onSetNativeRoutes  ?: OnSetNativeRoutesEvent;

  onNavRouteWillPop?: OnNavRoutePopEvent;
  onNavRouteDidPop ?: OnNavRoutePopEvent;

  onNativeCommandRequest   ?: OnNativeCommandRequestEvent;
  onCustomCommandFromNative?: OnCustomCommandFromNativeEvent;

  onUIConstantsDidChange?: OnUIConstantsDidChangeEvent;
};

export type RNINavigatorViewConstantsObject = {
  navigationBarHeight: number;
};

const viewName = "RNINavigatorView";

export const RNINavigatorView = 
  requireNativeComponent<RNINavigatorViewProps>(viewName);

export const RNINavigatorViewConstants = 
  ((UIManager as any)[viewName]).Constants as RNINavigatorViewConstantsObject;

