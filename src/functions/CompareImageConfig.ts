import fastDeepEqual from "fast-deep-equal";
import { CompareUtilities, ComparisonConfig } from './CompareUtilities';
import { compareColor } from './CompareMisc';

import type { ImageItemConfig, ImageGradientConfig, ImageRectConfig, ImageSystemConfig, UIImageConfig } from "../types/ImageItemConfig";
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

export class CompareImageSystemConfig {
  static propertyMap: ComparisonConfig<ImageSystemConfig> = {
    systemName       : { mode: 'shallow' },
    pointSize        : { mode: 'shallow' },
    weight           : { mode: 'shallow' },
    scale            : { mode: 'shallow' },
    hierarchicalColor: { mode: 'shallow' },

    paletteColors: { mode: 'shallowArray' },
  };

  static compare<T extends ImageSystemConfig>(oldItem: T, newItem: T) {
    return CompareUtilities.compareObject(this.propertyMap, oldItem, newItem);
  };
};

export class CompareUIImageConfig {
  static propertyMap: ComparisonConfig<UIImageConfig> = {
    renderingMode: { mode: 'shallow' },

    tint: { 
      mode: 'custom',
      customCompare: compareColor,
    },
  };

  static compare<T extends UIImageConfig>(oldItem: T, newItem: T){
    return CompareUtilities.compareObject(
      CompareUIImageConfig.propertyMap, oldItem, newItem, true
    );;
  };
};

export class CompareImageConfig {
  static compare<T extends ImageItemConfig>(oldItem: T, newItem: T){
    if(oldItem.type !== newItem.type) return false;

    switch (oldItem.type) {
      case 'IMAGE_REQUIRE': return (
        CompareUIImageConfig.compare(
          oldItem.imageOptions, 
          (newItem as any).imageOptions
        ) ||
        fastDeepEqual(
          oldItem.imageValue,
          (newItem as any).imageOptions
        )
      );

      case 'IMAGE_ASSET' : return (
        CompareUIImageConfig.compare(
          oldItem.imageOptions, 
          (newItem as any).imageOptions
        ) ||
        (oldItem.imageValue === (newItem as any).imageValue) 
      );

      case 'IMAGE_SYSTEM': return (
        CompareUIImageConfig.compare(
          oldItem.imageOptions, 
          (newItem as any).imageOptions
        ) ||
        CompareImageSystemConfig.compare(
          oldItem.imageValue,
          (newItem as any).imageValue
        )
      );

      case 'IMAGE_RECT':
        return CompareImageRectConfig.compare(
          oldItem.imageValue,
          (newItem as any).imageValue
        );
        
      case 'IMAGE_GRADIENT':
        return CompareImageGradientConfig.compare(
          oldItem.imageValue,
          (newItem as any).imageValue
        );

      default:
        return fastDeepEqual(oldItem, newItem);
    };
  };
};
