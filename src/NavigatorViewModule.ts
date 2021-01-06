import type React from 'react';
import { NativeModules, findNodeHandle } from 'react-native';


//#region - Type Definitions
type RNINavigatorViewModuleType = {
  push(node: Number, routeKey: String): Promise<void>;
};

type NavigatorViewModulePushParams = {
  routeKey: String
};
//#endregion


// Import native component
export const RNINavigatorViewModule: RNINavigatorViewModuleType =
  NativeModules["RNINavigatorViewModule"];


/** A native module to communicate with a `RNINavigatorView` 
 * native component instance.
 */
export class NavigatorViewModule {
  // Properties
  nativeRef: React.Component;

  /** Pass in a ref to `RNINavigatorView` native comp. */
  setRef(ref: React.Component){
    this.nativeRef = ref;
  };

  async push({routeKey}: NavigatorViewModulePushParams){
    try {
      await RNINavigatorViewModule.push(
        findNodeHandle(this.nativeRef),
        routeKey
      );

    } catch (error) {
      throw new Error(`NavigatorViewModule, push error: ${error}`);
    };
  };
};
