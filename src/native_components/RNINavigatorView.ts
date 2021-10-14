import { requireNativeComponent, UIManager, ViewProps } from 'react-native';

import type { OnCustomCommandFromNativeEvent, OnNativeCommandRequestEvent, OnNavRouteDidShowEvent, OnNavRoutePopEvent, OnNavRouteViewAddedEvent, OnNavRouteWillShowEvent, OnSetNativeRoutesEvent, OnUIConstantsDidChangeEvent } from '../types/RNINavigatorViewEvents';
import type { NavBarAppearanceCombinedConfig } from '../types/NavBarAppearanceConfig';
import type { Nullish } from '../types/UtilityTypes';


export type NativeRouteMap = {
  // key is `routeID`
  [key: string]: {
    routeKey: string;
    routeIndex: number;
    routeProps?: object;
  };
};

/** `RNINavigatorView` native comp. props */
export type RNINavigatorViewProps = ViewProps & {
  // General/Misc. Config
  navigatorID: number;
  nativeRoutes: NativeRouteMap;
  initialRouteKeys: Array<string>;
  isInteractivePopGestureEnabled: boolean;
  shouldSwizzleRootViewController: boolean;
  disableTransparentNavBarScrollEdgeAppearance: boolean;

  // Customize the Bar's Appearance
  navBarPrefersLargeTitles: boolean;
  isNavBarTranslucent: boolean;
  navBarAppearance: Nullish<NavBarAppearanceCombinedConfig>;
  
  // Native Events
  onNavRouteViewAdded?: OnNavRouteViewAddedEvent;
  onSetNativeRoutes  ?: OnSetNativeRoutesEvent;
  
  onNavRouteWillPop?: OnNavRoutePopEvent;
  onNavRouteDidPop ?: OnNavRoutePopEvent;

  onNavRouteWillShow?: OnNavRouteWillShowEvent;
  onNavRouteDidShow ?: OnNavRouteDidShowEvent;

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

