import fastDeepEqual from "fast-deep-equal";
import { CompareUtilities, ComparisonConfig } from './CompareUtilities';

import type { ImageItemConfig, ImageGradientConfig, ImageRectConfig } from "../types/ImageItemConfig";
import type { Point, PointPreset } from '../types/MiscTypes';

function comparePointOrPointPreset<T extends Point | PointPreset>(oldItem: T, newItem: T){
  if(typeof oldItem === 'string'){
    return( oldItem === newItem );
  };

  return CompareUtilities.shallowCompareObject(oldItem, newItem as object);
};

export class CompareImageGradientConfig {
  static propertyMap: ComparisonConfig<ImageGradientConfig> = {
    type        : { mode: 'shallow' },
    width       : { mode: 'shallow' },
    height      : { mode: 'shallow' },
    borderRadius: { mode: 'shallow' },

    colors   : { mode: 'shallowArray' },
    locations: { mode: 'shallowArray' },

    startPoint: { 
      mode: 'custom',
      customCompare: comparePointOrPointPreset
    },
    endPoint  : { 
      mode: 'custom',
      customCompare: comparePointOrPointPreset
    },
  };
  
  static compare<T extends ImageGradientConfig>(oldItem: T, newItem: T){
    return CompareUtilities.compareObject(
      CompareImageGradientConfig.propertyMap, oldItem, newItem
    );
  };
};

export class CompareImageRectConfig {
  static propertyMap: ComparisonConfig<ImageRectConfig> = {
    width       : { mode: 'shallow' },
    height      : { mode: 'shallow' },
    fillColor   : { mode: 'shallow' },
    borderRadius: { mode: 'shallow' },
  };

  static compare<T extends ImageRectConfig>(oldItem: T, newItem: T) {
    return CompareUtilities.compareObject(this.propertyMap, oldItem, newItem);
  };
};

export class CompareImageConfig {
  static compare<T extends ImageItemConfig>(oldItem: T, newItem: T){
    if(oldItem.type !== newItem.type) return false;
    
    switch (oldItem.type) {
      case 'IMAGE_ASSET' :
      case 'IMAGE_SYSTEM':
        return (oldItem.imageValue !== (newItem as any).imageValue);

      case 'IMAGE_RECT':
        return CompareImageRectConfig.compare(oldItem as any, newItem);
        
      case 'IMAGE_GRADIENT':
        return CompareImageGradientConfig.compare(oldItem as any, newItem);

      case 'IMAGE_REQUIRE':
      default:
        return fastDeepEqual(oldItem, newItem);
    };
  };
};
