import React from 'react';

import { NavigationContext } from '../context/NavigationContext';

import { NavigatorRouteViewEvents } from '../types/NavigatorRouteViewEventEmitter';

// TODO (013): Delete this

export function withRouteViewLifecycle(WrappedComponent: any){
  return class extends React.PureComponent {
    static contextType = NavigationContext;

    childRef: any;

    componentDidMount(){
      const { navigation } = this.context;
      const routeViewEmitter = navigation.getRefToNavRouteEmitter();

      for (const eventKey in NavigatorRouteViewEvents) {
        const functionName = `handle-${eventKey}`;
        
        // @ts-ignore
        this[functionName] = (event) => {
          // @ts-ignore
          this.childRef?.onModalShow?.(event);
        };

        // @ts-ignore
        routeViewEmitter.addListener(eventKey, this[functionName]);
      };
    };

    componentWillUnmount(){
      const { navigation } = this.context;
      const routeViewEmitter = navigation.getRefToNavRouteEmitter();

      for (const eventKey in NavigatorRouteViewEvents) {
        const functionName = `handle-${eventKey}`;
        // @ts-ignore
        routeViewEmitter.removeListener(eventKey, this[functionName]);
      };
    };

    _handleChildRef = (node: any) => {
      // @ts-ignore
      const { ref } = this.props;
      
      // store a copy of the child comp ref
      this.childRef = node;
      
      if (typeof ref === 'function') {
        ref(node);
        
      } else if (ref) {
        ref.current = node;
      };
    };

    render(){
      const props = this.props;

      return (
        <WrappedComponent
          {...props}
          ref={this._handleChildRef}
        />
      );
    };
  };
};