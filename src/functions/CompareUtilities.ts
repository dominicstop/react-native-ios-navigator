
import fastDeepEqual from "fast-deep-equal";
import type { NeverUndefined } from "../types/UtilityTypes";


export type ComparisonConfig<T> = {[K in keyof Required<T>]: {
  mode: "shallow" | "shallowObject" | "shallowArray" | "deep" | "ignore";
} | {
  mode: "custom";
  // `compareObject` won't ever pass an `undefined` (i.e. so `T` will never be `undefined`).
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


  static compareObject<T extends {[k: string]: any}>(
    propertyMap: ComparisonConfig<T>,
    oldItem: T, newItem: T,
    /** Skip checking properties with no matching config */
    skipIfNoConfig: boolean = false,
    log: boolean = false
  ): boolean {

    log && console.log('compareObject #1',
      ' - skipIfNoConfig: ', skipIfNoConfig,
      ' - log: ', log,
      ' - oldItem: ', oldItem,
      ' - newItem: ', newItem,
    );

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
      log && console.log('\n\ncompare - comparedKeys: ', comparedKeys);

      let key: keyof T;
      for(key in items){
        const config = propertyMap[key];

        // already prev. compared, skip...
        if(comparedKeys[key] === true) continue;
        comparedKeys[key] = true;

        log && console.log('compareObject #2',
          ' - key: ', key,
          ' - propertyMap[key]: ', config,
          ' - oldItem[key]: ', oldItem[key],
          ' - newItem[key]: ', newItem[key],
        );

        if(config == null){
          // no comparison config found for current property, skipping...
          if (skipIfNoConfig) continue;

          const propertyMapString = JSON.stringify(propertyMap);
          throw new Error(`No config found for key: ${key} - with propertyMap: ${propertyMapString}`);
        };

        // both properties are null/undefined, skip...
        if((oldItem[key] == null) && (newItem[key] == null)){
          log && console.log('a');
          continue;
        };

        // one of the properties are null/undefined, so `oldItem !== newItem`.
        if((oldItem[key] == null) || (newItem[key] == null)){
          log && console.log('b');
          return false
        };

        switch (config.mode) {
          case 'shallow':
            log && console.log('c - shallow');
            if(oldItem[key] !== newItem[key]) return false;
            break;

          case 'custom':
            log && console.log('d - shallow');
            if(!config.customCompare(oldItem[key], newItem[key])) return false;
            break;

          case 'shallowObject':
            log && console.log('e - shallow');
            if(!CompareUtilities.shallowCompareObject(oldItem[key], newItem[key])) return false;
            break;

          case 'shallowArray':
            log && console.log('f - shallow');
            if(!CompareUtilities.shallowCompareArray(oldItem[key], newItem[key])) return false;
            break;

          case 'deep':
            log && console.log('g - shallow');
            if(!fastDeepEqual(oldItem[key], newItem[key])) return false;
            break;

          case 'ignore':
            log && console.log('h - shallow');
            break;
        };
      };

      return true;
    };

    if(!compare(oldItem)) return false;
    if(!compare(newItem)) return false;
    
    // all of the comparisons passes, so `oldItem === newItem`
    log && console.log('i - true');
    return true;
  };
};