
import fastDeepEqual from "fast-deep-equal";
import type { NeverUndefined, Nullish } from "../types/UtilityTypes";


export type ComparisonConfig<T> = {[K in keyof Required<T>]: {
  mode: "shallow" | "shallowObject" | "shallowArray" | "deep" | "ignore";
} | {
  mode: "custom";
  // `compareObject` won't ever pass an `undefined` value
  // (i.e. so `T` will never be `undefined`).
  customCompare: <V extends NeverUndefined<T[K]>>(itemA: V, itemB: V) => boolean;
}};

export class CompareUtilities {

  static shallowCompareArray<T extends Array<any>>(itemA: T, itemB: T){
    if(itemA.length !== itemB.length) return false;
    
    for (let index = 0; index < itemA.length; index++) {
      if(itemA[index] !== itemB[index]) return false;
    };

    return true;
  };

  static shallowCompareObject<T extends object>(itemA: T, itemB: T): boolean {
    let key: keyof T; 
    for (key in itemA) {
      // both properties are null/undefined, skip...
      if((itemA[key] == null) && (itemB[key] == null)) continue;

      // one of the properties are null/undefined, so `itemA !== itemB`.
      if((itemA[key] == null) || (itemB[key] == null)) return false;

      if ((itemA[key] !== itemB[key])) {
        return false;
      };
    };

    return true;
  };

  static unwrapAndShallowCompareObject<T extends object>(
    itemA: Nullish<T>,
    itemB: Nullish<T>
  ): boolean {
    if((itemA == null) && (itemB == null)) return true;
    if((itemA == null) || (itemB == null)) return false;

    return CompareUtilities.shallowCompareObject(itemA, itemB);
  };

  static compareObject<T extends {[k: string]: any}>(
    propertyMap: ComparisonConfig<T>,
    oldItem: T, newItem: T,
    /** Skip checking properties with no matching config */
    skipIfNoConfig: boolean = !__DEV__
  ): boolean {


    // * `object.keys` is o(n) i.e. it'll iterate through all the keys of the objects
    // * so `const keys = [...object.keys(oldItem), ...object.keys(newItem)]` and 
    //   `object.keys(oldItem).length === object.keys(newItem).length` will iterate
    //   over all the properties in `oldItem` and `newItem`.
    // * Idk, `object.keys` might be optimized and not be o(n) in certain js engines...
    // * so to avoid duplicate loops, we're just using a normal for in loop instead and keep
    //   track of all the "visited" keys.
    let comparedKeys: {[k in keyof T]?: true} = {};

    // 1. based on the comparison config, go through each property 
    //    and compare them.
    //
    // 1.1 if a comparison fails then `oldItem !== newItem`.
    // 1.2 if a comparison passes, then compare the next property (and so on).
    //
    // 3. if all the comparison passes, then `oldItem === newItem`
    function compare(items: T){

      let key: keyof T;
      for(key in items){
        const config = propertyMap[key];

        // already prev. compared, skip...
        if(comparedKeys[key] === true) continue;
        comparedKeys[key] = true;

        if(config == null){
          // no comparison config found for current property, skipping...
          if (skipIfNoConfig) continue;

          const propertyMapString = JSON.stringify(propertyMap);
          throw new Error(`No config found for key: ${key} - with propertyMap: ${propertyMapString}`);
        };

        // both properties are null/undefined, skip...
        if((oldItem[key] == null) && (newItem[key] == null)){
          continue;
        };

        // one of the properties are null/undefined, so `oldItem !== newItem`.
        if((oldItem[key] == null) || (newItem[key] == null)){
          return false
        };

        switch (config.mode) {
          case 'shallow':
            if(oldItem[key] !== newItem[key]) return false;
            break;

          case 'custom':
            if(!config.customCompare(oldItem[key], newItem[key])) return false;
            break;

          case 'shallowObject':
            if(!CompareUtilities.shallowCompareObject(oldItem[key], newItem[key])) return false;
            break;

          case 'shallowArray':
            if(!CompareUtilities.shallowCompareArray(oldItem[key], newItem[key])) return false;
            break;

          case 'deep':
            if(!fastDeepEqual(oldItem[key], newItem[key])) return false;
            break;

          case 'ignore':
            break;
        };
      };

      return true;
    };

    if(!compare(oldItem)) return false;
    if(!compare(newItem)) return false;
    
    // all of the comparisons passed, so `oldItem === newItem`
    return true;
  };
};