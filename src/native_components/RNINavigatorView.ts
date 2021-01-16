import { ViewStyle, requireNativeComponent } from 'react-native';

//#region - `RNINavigatorView` Event Payloads
type onNavRouteViewAddedPayload = { nativeEvent: {
  target    : number,
  routeKey  : string,
  routeIndex: number
}};

type onNavRouteWillPopPayload = { nativeEvent: {
  target         : number,
  routeKey       : string,
  routeIndex     : number,
  isUserInitiated: boolean
}};

type onNavRouteDidPopPayload = { nativeEvent: {
  target         : number,
  routeKey       : string,
  routeIndex     : number,
  isUserInitiated: boolean
}};
//#endregion

/** `RNINavigatorView` native comp. props */
type RNINavigatorViewProps = {
  style: ViewStyle;
  // Native Events
  onNavRouteViewAdded?: (events: onNavRouteViewAddedPayload) => void;
  onNavRouteWillPop  ?: (events: onNavRouteWillPopPayload  ) => void;
  onNavRouteDidPop   ?: (events: onNavRouteDidPopPayload   ) => void;
};

export const RNINavigatorView = 
  requireNativeComponent<RNINavigatorViewProps>('RNINavigatorView');