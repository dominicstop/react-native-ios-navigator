import React from 'react';

import type { NavigationObject } from 'src/types/NavigationObject';

import type { NavigatorRouteViewProps } from '../components/NavigatorRouteView';
import type { RouteViewPortal } from '../components/RouteViewPortal';


export type RouteHeaderWrapperProps = Pick<NavigatorRouteViewProps,
  // mirror props from `NavigatorRouteViewProps`
  | 'renderRouteHeader'
> & {
  navigation: NavigationObject;
  getPortalRef: () => RouteViewPortal | undefined;
};

export class RouteHeaderWrapper extends React.Component<RouteHeaderWrapperProps> {
  private _routeViewPortalRef?: RouteViewPortal;

  componentDidMount(){
    const props = this.props;
    this._routeViewPortalRef = props.getPortalRef();
  };

  requestUpdate = () => {
    const props = this.props;
    const portalProps = this._routeViewPortalRef?.props;

    const hasHeader = (
      portalProps?.renderRouteHeader != null ||
      props       .renderRouteHeader != null
    );

    if(hasHeader){
      this.forceUpdate();
    };
  };

  setPortalRef = (portalRef: RouteViewPortal) => {
    this._routeViewPortalRef = portalRef;
  };

  render(){
    const props = this.props;
    const portalProps = this._routeViewPortalRef?.props;

    const routeHeader = (
      portalProps?.renderRouteHeader?.(props.navigation) ??
      props       .renderRouteHeader?.(props.navigation)
    );

    return(
      <React.Fragment>
        {routeHeader}
      </React.Fragment>
    );
  };
};