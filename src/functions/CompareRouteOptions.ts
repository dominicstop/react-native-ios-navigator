
import { CompareUtilities, ComparisonConfig } from './CompareUtilities';
import { CompareNavBarBackItemConfig, CompareNavBarItemsConfig } from './CompareNavBarItemConfig';
import { CompareImageConfig } from './CompareImageConfig';

import type { RouteTransitionPushConfig, RouteTransitionPopConfig } from "../types/NavigationCommands";
import type { NavBarAppearance, NavBarAppearanceCombinedConfig, NavBarAppearanceConfig, NavBarAppearanceLegacyConfig } from '../types/NavBarAppearanceConfig';
import type { RouteOptions } from "../types/RouteOptions";
import { compareColor } from './CompareMisc';


// Note: These functions are used to compare objects and decide whether or not to
// to trigger an update or re-render, so it has to be fast.
// Of course, we can use `deepCompare` and `JSON.stringify` to compare two objects,
// but using `&&` ("short-circuit" eval.) will return early once a comparison is false,
// which is a lot faster than serializing an entire object into a string and then 
// comparing them (it also doesn't preserve order, meaning that the comparisons for
// deeply nested objects might be wrong sometimes).
// This is a ugly brute force approach, and there might be other ways to do this, but
// it'll do for now.


export class CompareRouteTransitionPushConfig {
  static propertyMap: ComparisonConfig<RouteTransitionPushConfig> = {
    // shallow compare
    type    : { mode: 'shallow' },
    duration: { mode: 'shallow' },
  };

  static compare<T extends RouteTransitionPushConfig>(oldItem: T, newItem: T){
    return CompareUtilities.compareObject(this.propertyMap, oldItem, newItem);
  };

  static unwrapAndCompare<T extends RouteTransitionPushConfig>(
    oldItem: T | null | undefined, 
    newItem: T | null | undefined
  ){
    if((oldItem == null) && (newItem == null)) return true;
    if((oldItem == null) || (newItem == null)) return false;

    return this.compare(oldItem, newItem);
  };
};

export class CompareRouteTransitionPopConfig {
  static propertyMap: ComparisonConfig<RouteTransitionPopConfig> = {
    // shallow compare
    type    : { mode: 'shallow' },
    duration: { mode: 'shallow' },
  };

  static compare(oldItem: RouteTransitionPopConfig, newItem: RouteTransitionPopConfig){
    return CompareUtilities.compareObject(CompareRouteTransitionPopConfig.propertyMap, oldItem, newItem);
  };

  static unwrapAndCompare<T extends RouteTransitionPopConfig>(
    oldItem: T | null | undefined, 
    newItem: T | null | undefined
  ){
    if((oldItem == null) && (newItem == null)) return true;
    if((oldItem == null) || (newItem == null)) return false;

    return this.compare(oldItem, newItem);
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

    backIndicatorImage: {
      mode: 'custom',
      customCompare: CompareImageConfig.compare,
    },
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

  static compare<T extends NavBarAppearance>(oldItem: T, newItem: T){
    return CompareUtilities.compareObject(this.propertyMap, oldItem, newItem, true);;
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

  static compare<T extends NavBarAppearanceConfig>(oldItem: T, newItem: T){
    return CompareUtilities.compareObject(this.propertyMap, oldItem, newItem, true);
  };
};

export class CompareLegacyAppearanceConfig {
  static propertyMap: ComparisonConfig<NavBarAppearanceLegacyConfig> = {
    // shallow compare 
    barStyle    : { mode: 'shallow' },
    navBarPreset: { mode: 'shallow' },

    // shallow object compare
    barTintColor            : { mode: 'shallowObject' },
    titleTextAttributes     : { mode: 'shallowObject' },
    largeTitleTextAttributes: { mode: 'shallowObject' },

    backgroundImage                : { mode: 'deep' },
    titleVerticalPositionAdjustment: { mode: 'deep' },

    // custom compare
    backIndicatorImage: {
      mode: 'custom',
      customCompare: CompareImageConfig.compare,
    },
    shadowImage: {
      mode: 'custom',
      customCompare: CompareImageConfig.compare,
    },
    tintColor : { 
      mode: 'custom', 
      customCompare: compareColor,
    },
  };

  static compare<T extends NavBarAppearanceLegacyConfig>(oldItem: T, newItem: T){
    return CompareUtilities.compareObject(this.propertyMap, oldItem, newItem, true);
  };
};

export class CompareNavBarAppearanceCombinedConfig {

  static compare<T extends NavBarAppearanceCombinedConfig>(oldItem: T, newItem: T){
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
    automaticallyAddHorizontalSafeAreaInsets  : { mode: 'shallow' },

    routeContainerStyle: {
      mode: 'shallowObject',
    },
    searchBarConfig: {
      mode: 'shallowObject',
    },

    transitionConfigPush: {
      mode: 'custom',
      customCompare: CompareRouteTransitionPushConfig.compare,
    },

    // custom compare
    navBarAppearanceOverride: {
      mode: 'custom',
      customCompare: CompareNavBarAppearanceCombinedConfig.compare,
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
      customCompare: CompareNavBarBackItemConfig.compare,
    },
  };

  static compare<T extends RouteOptions>(oldItem: T, newItem: T){
    if((oldItem == null) && (newItem == null)) return true;
    if((oldItem == null) || (newItem == null)) return false;

    return CompareUtilities.compareObject(this.propertyMap, oldItem, newItem);
  };

  static unwrapAndCompare<T extends RouteOptions>(
    oldItem: T | null | undefined, 
    newItem: T | null | undefined
  ){
    if((oldItem == null) && (newItem == null)) return true;
    if((oldItem == null) || (newItem == null)) return false;

    return this.compare(oldItem, newItem);
  };
};