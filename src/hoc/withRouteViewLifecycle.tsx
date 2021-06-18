import React from 'react';

import { NavRouteEvents } from '../components/NavigatorRouteView';
import { NavRouteViewContext } from '../context/NavRouteViewContext';


export function withRouteViewLifecycle(WrappedComponent: any){
  return class extends React.PureComponent {
    static contextType = NavRouteViewContext;

    childRef: any;

    componentDidMount(){
      const { navigation } = this.context;
      const routeViewEmitter = navigation.getRefToNavRouteEmitter();

      for (const eventKey in NavRouteEvents) {
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

      for (const eventKey in NavRouteEvents) {
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