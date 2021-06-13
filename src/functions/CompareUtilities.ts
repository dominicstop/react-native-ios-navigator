
export type ComparisonConfig<T> = {[K in keyof Required<T>]: {
  mode: "shallow" | "shallowObject" | "ignore";
} | {
  mode: "custom";
  customCompare: (itemA?: T[K], itemB?: T[K]) => boolean;
}};

export class CompareUtilities {
  /** if one value is null, and the other isn't, then they aren't the same. 
   * Returns true if they're the same, false if different.
  */
  static compareItemsNull(itemA?: any, itemB?: any){
    return ((itemA == null) === (itemB == null));
  };

  static isBothNull(itemA: any, itemB: any){
    return ((itemA == null) && (itemB == null));
  };

  static compareArraySimple(itemA: Array<any>, itemB: Array<any>){
    if(CompareUtilities.isBothNull(itemA, itemB)) return true;

    return (
      CompareUtilities.compareItemsNull(itemA, itemB) && 
      (itemA?.length === itemB?.length)
    );
  };

  static shallowCompareObject<T extends Object>(itemA: T, itemB: T): boolean {
    if(CompareUtilities.isBothNull(itemA, itemB)) return true;
    if(!CompareUtilities.compareItemsNull(itemA, itemB)) return false;

    let key: keyof T; 
    for (key in itemA) {
      // skip objects
      if(typeof itemA[key] === 'object'){
        continue;
      };

      if ((itemA[key] !== itemB[key])) {
        return false;
      };
    };

    return true;
  };

  static compareObject<T extends Object>(
    propertyMap: ComparisonConfig<T>,
    oldItem: T, 
    newItem: T
  ): boolean {
    if(CompareUtilities.isBothNull(oldItem, newItem)) return true;
    if(!CompareUtilities.compareItemsNull(oldItem, newItem)) return false;

    let key: keyof T;
    for(key in oldItem){
      const config = propertyMap[key];

      switch (config?.mode) {
        case 'shallow':
          if(oldItem[key] !== newItem[key]) return false;
          break;

        case 'custom':
          // @ts-ignore
          if(!config.customCompare(oldItem[key], newItem[key])) return false;
          break;

        case 'shallowObject':
          if(!CompareUtilities.shallowCompareObject(oldItem, newItem)) return false;
          break;

        case 'ignore':
          break;
      };
    };

    return true;
  };
};