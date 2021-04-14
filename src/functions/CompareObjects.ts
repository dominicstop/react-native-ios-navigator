import type { RouteTransitionPushConfig, RouteTransitionPopConfig } from "src/native_components/RNINavigatorRouteView";

import type { NavBarItemConfig, NavBarItemsConfig, NavBarBackItemConfig } from "../types/NavBarItemConfig";
import type { NavBarAppearance, NavBarAppearanceConfig } from '../types/NavBarAppearanceConfig';
import type { RouteOptions } from "../types/NavTypes";
import type { BarMetrics } from "../types/MiscTypes";


type ComparisonConfig<T> = {[K in keyof Required<T>]: {
  mode: "shallow" | "shallowObject" | "ignore";
} | {
  mode: "custom";
  customCompare: (itemA?: T[K], itemB?: T[K]) => boolean;
}};

// Note: These functions are used to compare objects and decide whether or not to
// to trigger an update or re-render, so it has to be fast.
// Of course, we can use `deepCompare` and `JSON.stringify` to compare two objects,
// but using `&&` ("short-circuit" eval.) will return early once a comparison is false,
// which is a lot faster than serializing an entire object into a string and then 
// comparing them (it also doesn't preserve order, meaning that the comparisons for
// deeply nested objects might be wrong sometimes).
// This is a ugly brute force approach, and there might be other ways to do this, but
// it'll do for now.

class HelperUtilities {
  /** if one value is null, and the other isn't, then they aren't the same. */
  static compareItemsNull(itemA?: any, itemB?: any){
    return ((itemA == null) === (itemB == null));
  };

  static isBothNull(itemA: object, itemB: object){
    return ((itemA == null) && (itemB == null));
  };

  static compareArraySimple(itemA: Array<any>, itemB: Array<any>){
    if(HelperUtilities.isBothNull(itemA, itemB)) return true;

    return (
      HelperUtilities.compareItemsNull(itemA, itemB) && 
      (itemA?.length == itemB?.length)
    );
  };

  static shallowCompareObject<T extends Object>(itemA: T, itemB: T){
    if(HelperUtilities.isBothNull(itemA, itemB)) return true;
    if(!HelperUtilities.compareItemsNull(itemA, itemB)) return false;

    let key: keyof T; 
    for (key in itemA) {
      if ((itemA[key] && itemB[key] == null) || (itemA[key] !== itemB[key])) {
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
    if(HelperUtilities.isBothNull(oldItem, newItem)) return true;
    if(!HelperUtilities.compareItemsNull(oldItem, newItem)) return false;

    let key: keyof T;
    for(key in oldItem){
      const config = propertyMap[key];

      // value does not exist on newItem, not equal
      if(oldItem[key] && newItem[key] == null) return false;

      switch (config?.mode) {
        case 'shallow':
          if(oldItem[key] !== newItem[key]) return false;
          break;

        case 'custom':
          // @ts-ignore
          if(!config.customCompare(oldItem[key], newItem[key])) return false;
          break;

        case 'shallowObject':
          if(!HelperUtilities.shallowCompareObject(oldItem, newItem)) return false;
          break;

        case 'ignore':
          break;
      };
    };

    return true;
  };
};

export class CompareNavBarItemConfig {
  static propertyMap: ComparisonConfig<NavBarItemConfig> = {
    // shallow compare 
    key  : { mode: 'shallow' },
    type : { mode: 'shallow' },
    width: { mode: 'shallow' },

    barButtonItemStyle: { mode: 'shallow' },

    // shallow compare object
    tintColor      : { mode: 'shallowObject' },
    possibleTitles : { mode: 'shallowObject' },

    // custom compare
    titlePositionAdjustment: {
      mode: 'custom',
      customCompare: CompareNavBarItemConfig.compareTitlePositionAdjustment,
    },
    backgroundImage: {
      mode: 'custom',
      customCompare: CompareNavBarItemConfig.compareBackgroundImage,
    },
  };

  private static compareTitlePositionAdjustment(
    oldItem: NavBarItemConfig['titlePositionAdjustment'], 
    newItem: NavBarItemConfig['titlePositionAdjustment']
  ): boolean {
    if(!HelperUtilities.shallowCompareObject(oldItem, newItem)){
      return false;
    };

    let key: keyof typeof oldItem;
    for (key in oldItem) {
      // compare each Offset object
      if(!HelperUtilities.shallowCompareObject(oldItem[key], newItem[key])){
        return false;
      };
    };

    return true;
  };

  private static compareBackgroundImage(
    oldItem: NavBarItemConfig['backgroundImage'], 
    newItem: NavBarItemConfig['backgroundImage']
  ): boolean {
    if(!HelperUtilities.shallowCompareObject(oldItem, newItem)){
      return false;
    };

    let key: keyof typeof oldItem;
    for (key in oldItem) {
      // compare each background image
      if(!HelperUtilities.shallowCompareObject(oldItem[key], newItem[key])){
        return false;
      };
    };

    return true;
  };

  static compare(oldItem?: NavBarItemConfig, newItem?: NavBarItemConfig){
    return (
      HelperUtilities.compareObject(CompareNavBarItemConfig.propertyMap, oldItem, newItem) &&

      // @ts-ignore
      // compare `SupportedImageTypes`
      oldItem.imageValue === newItem.imageValue && // @ts-ignore
      // compare `NavBarItemConfigBase`
      oldItem.title      === newItem.title      && // @ts-ignore 
      oldItem.systemItem === newItem.systemItem 
    );
  };
};

export class CompareNavBarButtonBackItemConfig {
  static propertyMap: ComparisonConfig<NavBarBackItemConfig> = {
    ...CompareNavBarItemConfig.propertyMap,
    applyToPrevBackConfig: { mode: 'shallow' },
  };

  static compare(oldItem?: NavBarBackItemConfig, newItem?: NavBarBackItemConfig){
    return (
      // @ts-ignore
      // compare `SupportedImageTypes`
      oldItem.imageValue === newItem.imageValue && // @ts-ignore
      // compare `NavBarItemConfigBase`
      oldItem.title      === newItem.title      && // @ts-ignore 
      oldItem.systemItem === newItem.systemItem &&

      HelperUtilities.compareObject(CompareNavBarButtonBackItemConfig.propertyMap, oldItem, newItem)
    );
  };
};

export class CompareNavBarItemsConfig {
  static compare(oldItem?: NavBarItemsConfig, newItem?: NavBarItemsConfig){
    if(!HelperUtilities.compareArraySimple(oldItem, newItem)) return false;

    for (let i = 0; i < oldItem?.length ?? 0; i++) {
      if(oldItem[i] !== newItem[i]){
        return false;

      } else if(!CompareNavBarItemConfig.compare(
        oldItem[i] as NavBarItemConfig, 
        newItem[i] as NavBarItemConfig
      )){
        return false;
      };
    };

    return true;
  };
};

export class CompareRouteTransitionPushConfig {
  static propertyMap: ComparisonConfig<RouteTransitionPushConfig> = {
    // shallow compare
    type    : { mode: 'shallow' },
    duration: { mode: 'shallow' },
  };

  static compare(oldItem?: RouteTransitionPushConfig, newItem?: RouteTransitionPushConfig){
    return HelperUtilities.compareObject(CompareRouteTransitionPushConfig.propertyMap, oldItem, newItem);
  };
};

export class CompareRouteTransitionPopConfig {
  static propertyMap: ComparisonConfig<RouteTransitionPopConfig> = {
    // shallow compare
    type    : { mode: 'shallow' },
    duration: { mode: 'shallow' },
  };

  static compare(oldItem?: RouteTransitionPopConfig, newItem?: RouteTransitionPopConfig){
    return HelperUtilities.compareObject(CompareRouteTransitionPopConfig.propertyMap, oldItem, newItem);
  };
};

export class CompareAppearanceConfig {
  static propertyMap:  ComparisonConfig<NavBarAppearance> = {
    // shallow compare
    baseConfig             : { mode: 'shallow' },
    backgroundEffect       : { mode: 'shallow' },
    backgroundColor        : { mode: 'shallow' },
    shadowColor            : { mode: 'shallow' },
    titlePositionAdjustment: { mode: 'shallow' },

    // shallow compare object
    backgroundImage         : { mode: 'shallowObject' },
    titleTextAttributes     : { mode: 'shallowObject' },
    largeTitleTextAttributes: { mode: 'shallowObject' },
    backIndicatorImage      : { mode: 'shallowObject' },
  };

  static compare(oldItem?: NavBarAppearance, newItem?: NavBarAppearance){
    return HelperUtilities.compareObject(CompareAppearanceConfig.propertyMap, oldItem, newItem);
  };
};

export class CompareNavBarAppearanceOverride {
  static propertyMap: ComparisonConfig<NavBarAppearanceConfig> = {
    // shallow compare 
    navBarPreset: { mode: 'shallow' },
    // custom compare
    standardAppearance: {
      mode: 'custom',
      customCompare: CompareAppearanceConfig.compare,
    },
    compactAppearance: {
      mode: 'custom',
      customCompare: CompareAppearanceConfig.compare,
    },
    scrollEdgeAppearance: {
      mode: 'custom',
      customCompare: CompareAppearanceConfig.compare,
    },
  };

  static compare(oldItem?: NavBarAppearanceConfig, newItem?: NavBarAppearanceConfig){
    return HelperUtilities.compareObject(CompareNavBarAppearanceOverride.propertyMap, oldItem, newItem);
  };
};

export class CompareRouteOptions {
  static propertyMap: ComparisonConfig<RouteOptions> = {
    // shallow compare 
    routeTitle                   : { mode: 'shallow' },
    prompt                       : { mode: 'shallow' },
    largeTitleDisplayMode        : { mode: 'shallow' },
    hidesBackButton              : { mode: 'shallow' },
    backButtonTitle              : { mode: 'shallow' },
    backButtonDisplayMode        : { mode: 'shallow' },
    leftItemsSupplementBackButton: { mode: 'shallow' },

    // custom compare
    navBarAppearanceOverride: {
      mode: 'custom',
      customCompare: CompareNavBarAppearanceOverride.compare,
    },
    transitionConfigPush: {
      mode: 'custom',
      customCompare: CompareRouteTransitionPushConfig.compare,
    },
    transitionConfigPop: {
      mode: 'custom',
      customCompare: CompareRouteTransitionPopConfig.compare,
    },
    navBarButtonLeftItemsConfig: {
      mode: 'custom',
      customCompare: CompareNavBarItemsConfig.compare,
    },
    navBarButtonRightItemsConfig: {
      mode: 'custom',
      customCompare: CompareNavBarItemsConfig.compare,
    },
    navBarButtonBackItemConfig: {
      mode: 'custom',
      customCompare: CompareNavBarButtonBackItemConfig.compare,
    },
  };

  static compare(oldItem?: RouteOptions, newItem?: RouteOptions){
    return HelperUtilities.compareObject(CompareRouteOptions.propertyMap, oldItem, newItem);
  };
};