import type React from 'react';
import { NativeModules, NativeEventEmitter, EventSubscriptionVendor, findNodeHandle } from 'react-native';

//#region - Type Definitions
/** Corresponds to the RNINavigatorViewModule.Events */
export enum RNINavigatorViewModuleEvents {
  onNavRouteViewAdded = "onNavRouteViewAdded"
};

interface IRNINavigatorViewModule extends EventSubscriptionVendor {
  setNode(node: Number): Promise<void>;
  push(node: Number, routeKey: String): Promise<void>;
};

type NavigatorViewModulePushParams = {
  routeKey: String
};
//#endregion


// Import native component
export const RNINavigatorViewModule: IRNINavigatorViewModule =
  NativeModules["RNINavigatorViewModule"];


/** A native module to communicate with a `RNINavigatorView` 
 * native component instance.
 */
export class NavigatorViewModule {
  //#region - Properties
  node?: Number;
  nativeRef?: React.Component;
  nativeEvents?: NativeEventEmitter;
  isModuleNodeSet: boolean = false;
  //#endregion

  /** Pass in a ref to `RNINavigatorView` native comp. */
  async setRef(ref: React.Component){
    this.nativeRef = ref;

    try {
      // get the node that corresponds to `ref`
      this.node = findNodeHandle(this.nativeRef);

      // set the node that the module "manages"
      await RNINavigatorViewModule.setNode(this.node);

      // instantiate the event emitter
      this.nativeEvents = new NativeEventEmitter(RNINavigatorViewModule)

      // update flag
      this.isModuleNodeSet = true;

    } catch (error) {
      // update flag
      this.isModuleNodeSet = false;
      // throw error
      throw new Error(`NavigatorViewModule, setRef error: ${error}`);
    };
  };

  async push({routeKey}: NavigatorViewModulePushParams){
    try {
      await RNINavigatorViewModule.push(this.node, routeKey);

    } catch (error) {
      throw new Error(`NavigatorViewModule, push error: ${error}`);
    };
  };
  //#endregion
};
