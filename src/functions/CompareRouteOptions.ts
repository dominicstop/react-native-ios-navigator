
import { CompareUtilities, ComparisonConfig } from './CompareUtilities';

import type { RouteTransitionPushConfig, RouteTransitionPopConfig } from "src/native_components/RNINavigatorRouteView";

import type { NavBarItemConfig, NavBarItemsConfig, NavBarBackItemConfig } from "../types/NavBarItemConfig";
import type { NavBarAppearance, NavBarAppearanceCombinedConfig, NavBarAppearanceConfig, NavBarAppearanceLegacyConfig } from '../types/NavBarAppearanceConfig';
import type { RouteOptions } from "../types/RouteOptions";
import type { ImageItemConfig } from "../types/MiscTypes";


// Note: These functions are used to compare objects and decide whether or not to
// to trigger an update or re-render, so it has to be fast.
// Of course, we can use `deepCompare` and `JSON.stringify` to compare two objects,
// but using `&&` ("short-circuit" eval.) will return early once a comparison is false,
// which is a lot faster than serializing an entire object into a string and then 
// comparing them (it also doesn't preserve order, meaning that the comparisons for
// deeply nested objects might be wrong sometimes).
// This is a ugly brute force approach, and there might be other ways to do this, but
// it'll do for now.


export class CompareImageConfig {
  static compare(oldItem?: ImageItemConfig, newItem?: ImageItemConfig){
    if(CompareUtilities.isBothNull(oldItem, newItem)) return true;
    if(!CompareUtilities.compareItemsNull(oldItem, newItem)) return false;

    if(oldItem.type !== newItem.type) return false;
    
    switch (oldItem.type) {
      case 'IMAGE_ASSET' :
      case 'IMAGE_SYSTEM':
        return (oldItem.imageValue !== (newItem as any).imageValue);

      case 'IMAGE_REQUIRE':
      case 'IMAGE_RECT':
      case 'IMAGE_GRADIENT':
        return CompareUtilities.shallowCompareObject(oldItem.imageValue, (newItem as any).imageValue);
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
    if(!CompareUtilities.shallowCompareObject(oldItem, newItem)){
      return false;
    };

    let key: keyof typeof oldItem;
    for (key in oldItem) {
      // compare each Offset object
      if(!CompareUtilities.shallowCompareObject(oldItem[key], newItem[key])){
        return false;
      };
    };

    return true;
  };

  private static compareBackgroundImage(
    oldItem: NavBarItemConfig['backgroundImage'], 
    newItem: NavBarItemConfig['backgroundImage']
  ): boolean {
    if(!CompareUtilities.shallowCompareObject(oldItem, newItem)){
      return false;
    };

    let key: keyof typeof oldItem;
    for (key in oldItem) {
      // compare each background image
      if(!CompareUtilities.shallowCompareObject(oldItem[key], newItem[key])){
        return false;
      };
    };

    return true;
  };

  static compare(oldItem?: NavBarItemConfig, newItem?: NavBarItemConfig){
    return (
      CompareUtilities.compareObject(CompareNavBarItemConfig.propertyMap, oldItem, newItem) &&

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
  };

  static compare(oldItem?: NavBarBackItemConfig, newItem?: NavBarBackItemConfig){
    if(CompareUtilities.isBothNull(oldItem, newItem)) return true;
    if(!CompareUtilities.compareItemsNull(oldItem, newItem)) return false;

    return (
      // @ts-ignore
      // compare `SupportedImageTypes`
      oldItem.imageValue === newItem.imageValue && // @ts-ignore
      // compare `NavBarItemConfigBase`
      oldItem.title      === newItem.title      && // @ts-ignore 
      oldItem.systemItem === newItem.systemItem &&

      CompareUtilities.compareObject(CompareNavBarButtonBackItemConfig.propertyMap, oldItem, newItem)
    );
  };
};

export class CompareNavBarItemsConfig {
  static compare(oldItem?: NavBarItemsConfig, newItem?: NavBarItemsConfig){
    if(!CompareUtilities.compareArraySimple(oldItem, newItem)) return false;

    for (let i = 0; i < oldItem?.length ?? 0; i++) {
      const oldNavBarItem = oldItem[i];
      const newBavBarItem = newItem[i];

      if(CompareUtilities.isBothNull(oldNavBarItem, newBavBarItem)){
        return true;

      } else if (!CompareUtilities.compareItemsNull(oldNavBarItem, newBavBarItem)){
        return false;
        
      } else if(!CompareNavBarItemConfig.compare(
        oldNavBarItem as NavBarItemConfig, 
        newBavBarItem as NavBarItemConfig
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
    return CompareUtilities.compareObject(CompareRouteTransitionPushConfig.propertyMap, oldItem, newItem);
  };
};

export class CompareRouteTransitionPopConfig {
  static propertyMap: ComparisonConfig<RouteTransitionPopConfig> = {
    // shallow compare
    type    : { mode: 'shallow' },
    duration: { mode: 'shallow' },
  };

  static compare(oldItem?: RouteTransitionPopConfig, newItem?: RouteTransitionPopConfig){
    return CompareUtilities.compareObject(CompareRouteTransitionPopConfig.propertyMap, oldItem, newItem);
  };
};

export class CompareNavBarAppearance {
  static propertyMap:  ComparisonConfig<NavBarAppearance> = {
    // shallow compare
    baseConfig                : { mode: 'shallow' },
    backgroundEffect          : { mode: 'shallow' },
    backgroundColor           : { mode: 'shallow' },
    backgroundImageContentMode: { mode: 'shallow' },
    shadowColor               : { mode: 'shallow' },
    titlePositionAdjustment   : { mode: 'shallow' },

    // shallow compare object
    titleTextAttributes     : { mode: 'shallowObject' },
    largeTitleTextAttributes: { mode: 'shallowObject' },
    backIndicatorImage      : { mode: 'shallowObject' },

    // custom compare
    backgroundImage: {
      mode: 'custom',
      customCompare: CompareImageConfig.compare,
    },
    shadowImage: {
      mode: 'custom',
      customCompare: CompareImageConfig.compare,
    },
  };

  static compare(oldItem?: NavBarAppearance, newItem?: NavBarAppearance){
    return CompareUtilities.compareObject(CompareNavBarAppearance.propertyMap, oldItem, newItem);;
  };
};

export class CompareNavBarAppearanceConfig {
  static propertyMap: ComparisonConfig<NavBarAppearanceConfig> = {
    // shallow compare 
    navBarPreset: { mode: 'shallow' },
    // custom compare
    standardAppearance: {
      mode: 'custom',
      customCompare: CompareNavBarAppearance.compare,
    },
    compactAppearance: {
      mode: 'custom',
      customCompare: CompareNavBarAppearance.compare,
    },
    scrollEdgeAppearance: {
      mode: 'custom',
      customCompare: CompareNavBarAppearance.compare,
    },
  };

  static compare(oldItem?: NavBarAppearanceConfig, newItem?: NavBarAppearanceConfig){
    return CompareUtilities.compareObject(CompareNavBarAppearanceConfig.propertyMap, oldItem, newItem);
  };
};

export class CompareLegacyAppearanceConfig {
  static propertyMap: ComparisonConfig<NavBarAppearanceLegacyConfig> = {
    // shallow compare 
    barStyle    : { mode: 'shallow' },
    navBarPreset: { mode: 'shallow' },

    // shallow object compare
    tintColor               : { mode: 'shallowObject'  },
    barTintColor            : { mode: 'shallowObject'  },
    backIndicatorImage      : { mode: 'shallowObject'  },
    titleTextAttributes     : { mode: 'shallowObject'  },
    largeTitleTextAttributes: { mode: 'shallowObject'  },

    // custom compare
    backgroundImage: {
      mode: 'custom',
      customCompare: CompareLegacyAppearanceConfig.compareBackgroundImage,
    },
    shadowImage: {
      mode: 'custom',
      customCompare: CompareImageConfig.compare,
    },
    titleVerticalPositionAdjustment: {
      mode: 'custom',
      customCompare: CompareLegacyAppearanceConfig.compareTitleVerticalPositionAdjustment
    },
  };

  static compareBackgroundImage(
    oldItem?: NavBarAppearanceLegacyConfig['backgroundImage'], 
    newItem?: NavBarAppearanceLegacyConfig['backgroundImage']
  ){
    if(CompareUtilities.isBothNull(oldItem, newItem)) return true;
    if(!CompareUtilities.compareItemsNull(oldItem, newItem)) return false;

    return (
      CompareImageConfig.compare(oldItem.default      , newItem.default      ) &&
      CompareImageConfig.compare(oldItem.defaultPrompt, newItem.defaultPrompt) &&
      CompareImageConfig.compare(oldItem.compact      , newItem.compact      ) &&
      CompareImageConfig.compare(oldItem.compactPrompt, newItem.compactPrompt) 
    );
  };

  static compareTitleVerticalPositionAdjustment(
    oldItem?: NavBarAppearanceLegacyConfig['titleVerticalPositionAdjustment'], 
    newItem?: NavBarAppearanceLegacyConfig['titleVerticalPositionAdjustment']
  ){
    if(CompareUtilities.isBothNull(oldItem, newItem)) return true;
    if(!CompareUtilities.compareItemsNull(oldItem, newItem)) return false;

    return (
      CompareUtilities.shallowCompareObject(oldItem.default      , newItem.default      ) &&
      CompareUtilities.shallowCompareObject(oldItem.defaultPrompt, newItem.defaultPrompt) &&
      CompareUtilities.shallowCompareObject(oldItem.compact      , newItem.compact      ) &&
      CompareUtilities.shallowCompareObject(oldItem.compactPrompt, newItem.compactPrompt) 
    );
  };

  static compare(oldItem?: NavBarAppearanceLegacyConfig, newItem?: NavBarAppearanceLegacyConfig){
    return CompareUtilities.compareObject(CompareLegacyAppearanceConfig.propertyMap, oldItem, newItem);
  };
};

export class CompareNavBarAppearanceCombinedConfig {
  static compare(oldItem?: NavBarAppearanceCombinedConfig, newItem?: NavBarAppearanceCombinedConfig){
    if(CompareUtilities.isBothNull(oldItem, newItem)) return true;
    if(!CompareUtilities.compareItemsNull(oldItem, newItem)) return false;

    return (
      oldItem.mode         === newItem.mode         &&
      oldItem.navBarPreset === newItem.navBarPreset && (
        oldItem.mode === 'legacy'
          ? CompareLegacyAppearanceConfig.compare(oldItem, newItem)
          : CompareNavBarAppearanceConfig.compare(oldItem, newItem)
      )
    );
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
    navigationBarVisibility      : { mode: 'shallow' },
    statusBarStyle               : { mode: 'shallow' },

    applyBackButtonConfigToCurrentRoute       : { mode: 'shallow' },
    allowTouchEventsToPassThroughNavigationBar: { mode: 'shallow' },

    // shallow object
    routeContainerStyle: {
      mode: 'shallowObject',
    },
    searchBarConfig: {
      mode: 'shallowObject',
    },

    // custom compare
    navBarAppearanceOverride: {
      mode: 'custom',
      customCompare: CompareNavBarAppearanceCombinedConfig.compare,
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
    return CompareUtilities.compareObject(CompareRouteOptions.propertyMap, oldItem, newItem);
  };
};