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

      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.warn(
          `LOG - Fatal Error - RNINavigatorViewModule, setRef`
        + ` - for node: ${this.node}`
        + ` - isModuleNodeSet: ${this.isModuleNodeSet}`
        + ` - error message: ${error}`
        + ` - note: this should never happen ☹️`
      );
      //#endregion

      // throw error w/ message
      throw new Error(`NavigatorViewModule, setRef error: ${error}`);
    };
  };

  async push({routeKey}: NavigatorViewModulePushParams){
    //#region - 🐞 DEBUG 🐛
    LIB_GLOBAL.debugLog && console.log(
        `LOG - RNINavigatorViewModule, push`
      + ` - for node: ${this.node}`
      + ` - isModuleNodeSet: ${this.isModuleNodeSet}`
      + ` - with routeKey: ${routeKey}`
    );
    //#endregion

    try {
      // forward command to nav view: js:module -> n:module -> n:view
      await RNINavigatorViewModule.push(this.node, routeKey);

    } catch (error) {
      //#region - 🐞 DEBUG 🐛
      LIB_GLOBAL.debugLog && console.warn(
          `LOG, - Error - RNINavigatorViewModule, push`
        + ` - note: \`NavigatorViewModule\` failed to push`
        + ` - for node: ${this.node}`
        + ` - isModuleNodeSet: ${this.isModuleNodeSet}`
        + ` - with routeKey: ${routeKey}`
        + ` - error message: \(error)`
      );
      //#endregion

      // throw error with message
      throw new Error(`NavigatorViewModule, push error: ${error}`);
    };
  };
  //#endregion
};
