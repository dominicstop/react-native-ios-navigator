import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { CompareEdgeInsets } from '../functions/CompareMisc';
import { CompareUtilities } from '../functions/CompareUtilities';

import type { EdgeInsets } from '../types/MiscTypes';
import type { NavigatorRouteViewProps } from '../components/NavigatorRouteView';

import { NativeIDKeys } from '../constants/LibraryConstants';


type NavigatorRouteContentWrapperProps = Pick<NavigatorRouteViewProps, 
  | 'isInFocus'
> & {
  hasRouteHeader: boolean;
  automaticallyAddHorizontalSafeAreaInsets: boolean | undefined;
  routePropsUpdateIndex: number;
  
  safeAreaInsets: EdgeInsets | undefined;
  routeContainerStyle?: ViewStyle;
};

/**
 * Wraps the react element returned from `props.renderRouteContent()`
 * render prop in `NavigatorRouteView._renderRouteContents`.
 * * The purpose of this component is to stop unnecessary re-renders from
 *   propagating down to the "route content".
 */
export class NavigatorRouteContentWrapper extends React.Component<NavigatorRouteContentWrapperProps> {
  shouldComponentUpdate(nextProps: NavigatorRouteContentWrapperProps){
    const prevProps = this.props;

    // when `routePropsUpdateIndex` increments, then `routeProps` changed
    const didRoutePropsChange = 
      (prevProps.routePropsUpdateIndex !== nextProps.routePropsUpdateIndex);

    // only update when in focus or the route props changed
    const shouldUpdate = (
      didRoutePropsChange || nextProps.isInFocus
    );

    return (shouldUpdate && (
      // compare whether there's a `renderRouteHeader` or not
      (prevProps.hasRouteHeader !== nextProps.hasRouteHeader)
      
      // compare `automaticallyAddHorizontalSafeAreaInsets`
      || (prevProps.automaticallyAddHorizontalSafeAreaInsets !== nextProps.automaticallyAddHorizontalSafeAreaInsets)
      
      // compare `safeAreaInsets`
      || !CompareEdgeInsets.unwrapAndCompare(
        prevProps.safeAreaInsets, 
        nextProps.safeAreaInsets
      )
      || !CompareUtilities.unwrapAndShallowCompareObject(
        prevProps.routeContainerStyle,
        nextProps.routeContainerStyle
      )
    ));
  };
  
  render(){
    const props = this.props;
    const safeAreaInsets = props.safeAreaInsets;

    const routeContainerStyle: ViewStyle = {
      ...(props.automaticallyAddHorizontalSafeAreaInsets && {
        paddingLeft : safeAreaInsets?.left  ?? 0,
        paddingRight: safeAreaInsets?.right ?? 0,
      }),
    };

    return (
      <View
        style={[styles.routeContentContainer, routeContainerStyle, props.routeContainerStyle]}
        nativeID={NativeIDKeys.RouteContent}
      >
        {this.props.children}
      </View>
    );
  };
};

const styles = StyleSheet.create({
  routeContentContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});
