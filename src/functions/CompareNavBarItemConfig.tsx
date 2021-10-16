
import { CompareUtilities, ComparisonConfig } from './CompareUtilities';
import { compareColor } from './CompareMisc';

import type { NavBarItemConfig, NavBarItemsConfig, NavBarBackItemConfig, NavBarItemConfigBase, NavBarItemConfigShared } from "../types/NavBarItemConfig";

class CompareNavBarItemConfigBase {
  static compare<T extends NavBarItemConfigBase>(oldItem: T, newItem: T) {
    if(oldItem.type !== newItem.type) return false;

    switch (oldItem.type) {
      case 'SYSTEM_ITEM':
        if(oldItem.systemItem !== (newItem as any).systemItem) return false;
        break;

      case 'TEXT':
        if(oldItem.title !== (newItem as any).title) return false;
        break;

      case 'FIXED_SPACE':
        if(oldItem.width !== (newItem as any).width) return false;
        break;

      // compare `SupportedImageTypes`
      case 'IMAGE_ASSET' :
      case 'IMAGE_SYSTEM':
        if(oldItem.imageValue !== (newItem as any).imageValue) return false;
        break;
    };

    return true;
  };
};

class CompareNavBarItemConfigShared {
  static propertyMap: ComparisonConfig<NavBarItemConfigShared> = {
    // shallow compare
    key: { mode: 'shallow' },
    width: { mode: 'shallow' },
    barButtonItemStyle: { mode: 'shallow' },

    tintColor: { 
      mode: 'custom',
      customCompare: compareColor,
    },

    possibleTitles: { mode: 'shallowArray' },
  };
  
  static compare<T extends NavBarItemConfigShared>(oldItem: T, newItem: T) {
    return CompareUtilities.compareObject(CompareNavBarItemConfigShared.propertyMap, oldItem, newItem, true);
  };
};

export class CompareNavBarItemConfig {
  static compare<T extends NavBarItemConfig>(oldItem: T, newItem: T){
    return(
      CompareNavBarItemConfigBase  .compare(oldItem, newItem) &&
      CompareNavBarItemConfigShared.compare(oldItem, newItem) &&

      CompareUtilities.unwrapAndShallowCompareObject(oldItem.backgroundImage        , newItem.backgroundImage        ) &&
      CompareUtilities.unwrapAndShallowCompareObject(oldItem.titlePositionAdjustment, newItem.titlePositionAdjustment)
    );
  };
};

export class CompareNavBarBackItemConfig {
  static compare<T extends NavBarBackItemConfig>(oldItem: T, newItem: T){
    return(
      CompareNavBarItemConfigBase  .compare(oldItem, newItem) &&
      CompareNavBarItemConfigShared.compare(oldItem, newItem) 
    );
  };
};

export class CompareNavBarItemsConfig {
  static compare<T extends NavBarItemsConfig>(oldItem: T, newItem: T){

    // array size is different, `oldNavBarItem` !== `newBavBarItem`
    if(oldItem.length !== newItem.length) return false;

    for (let i = 0; i < oldItem.length; i++) {
      const oldNavBarItem = oldItem[i];
      const newBavBarItem = newItem[i];

      if((oldNavBarItem == null) && (newBavBarItem == null)){
        // both items are null/undefined, skip...
        continue;

      } else if ((oldNavBarItem == null) || (newBavBarItem == null)){
        // one of the items are null/undefined, `oldNavBarItem` !== `newBavBarItem`
        return false;

      } else if(oldNavBarItem.type === 'CUSTOM' || newBavBarItem.type === 'CUSTOM'){
        if(oldNavBarItem.type !== newBavBarItem.type) return false;
        
      } else if(!CompareNavBarItemConfig.compare(
        oldNavBarItem, newBavBarItem as NavBarItemConfig
      )){
        return false;
      };
    };

    return true;
  };
};