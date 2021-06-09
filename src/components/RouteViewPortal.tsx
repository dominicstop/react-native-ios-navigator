import React from 'react';

import type { NavigatorRouteView, NavigatorRouteViewProps } from '../components/NavigatorRouteView';
import type { RouteComponentsWrapper } from './RouteComponentsWrapper';
import type { RouteOptions } from '../types/RouteOptions';

import { CompareRouteOptions } from '../functions/CompareRouteOptions';
import { CompareUtilities } from '../functions/CompareUtilities';

import { NavRouteViewContext, NavRouteViewContextProps } from '../context/NavRouteViewContext';


type RouteViewPortalProps = Partial<Pick<NavigatorRouteViewProps,
  // mirror props from `NavigatorRouteViewProps`
  | 'renderNavBarLeftItem'
  | 'renderNavBarRightItem'
  | 'renderNavBarTitleItem'
  | 'renderRouteHeader'
>> & {
  // TODO: Impl. `trackValues?: object;`
  routeOptions?: RouteOptions;
};

/** 
 * This component is used to customize the route's navigation bar.
 * This component is used inside a route, and allows you to update the route's `routeOptions`
 * and provide custom elements to show in the navigation bar.
 * 
 * Reminder: You can only use one `RouteViewPortal` per route.
 * 
 * Through the `routeOptions` prop, you can update the route's `routeTitle` and `backButtonTitle`, 
 * configure the navigation bar items (e.g. like setting the right navigation bar item via 
 * `navBarButtonRightItemsConfig`), or providing a custom view to show in the navigation bar (
 * e.g. you can render a custom title via `renderNavBarTitleItem`, etc.)
 * 
 * Note: The reason why this component is called `RouteViewPortal` is because it's transporting
 * the elements (and props) you pass to this component to the parent route navigator. 
 * In other words, the props and elements you pass to this component are being used/rendered 
 * somewhere else in the view hierarchy. 
 * 
 * This is achieved through context, and as such, you can only use this component if it's a child 
 * of a route. So this component actually renders nothing/`null` and does not affect layout.
 * 
 * Because of this, it has some weird quirks. 
 * For example, there are situations where the parent might re-render (e.g. due to `setState`) 
 * but the components inside the render props (e.g. `renderNavBarLeftItem`) won't update 
 * even though a prop directly depends on a value from the parent's state.
 */
export class RouteViewPortal extends React.Component<RouteViewPortalProps> {
  static contextType = NavRouteViewContext;
  
  context: NavRouteViewContextProps;
  routeRef: NavigatorRouteView;

  _routeComponentsWrapperRef?: RouteComponentsWrapper;
  
  constructor(props: RouteViewPortalProps, context: NavRouteViewContextProps){
    super(props);
    const { navigation } = context;

    const routeRef = navigation.getRefToRoute();
    this.routeRef = routeRef;

    routeRef.setRouteViewPortalRef(this);
    routeRef.setRouteOptions(props.routeOptions);

  };

  componentDidMount(){
    this._routeComponentsWrapperRef = this.routeRef.getRouteComponentsWrapper();
  };

  componentDidUpdate(prevProps: RouteViewPortalProps){
    const nextProps = this.props;

    const didRouteOptionsChange = 
      !CompareRouteOptions.compare(prevProps.routeOptions, nextProps.routeOptions);

    this._routeComponentsWrapperRef?.requestUpdate();

    if(didRouteOptionsChange){
      this.routeRef.setRouteOptions(nextProps.routeOptions);

      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.log(
          `LOG/JS - RouteViewPortal, componentDidUpdate`
        + ` - didRouteOptionsChange: ${didRouteOptionsChange? 'true' : 'false'}`
      );
      //#endregion
    };
  };

  render(){
    return null as any;
  };
};