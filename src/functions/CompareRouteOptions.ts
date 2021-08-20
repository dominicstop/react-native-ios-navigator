
import { CompareUtilities, ComparisonConfig } from './CompareUtilities';
import { CompareNavBarBackItemConfig, CompareNavBarItemsConfig } from './CompareNavBarItemConfig';
import { CompareNavBarAppearanceCombinedConfig } from './CompareNavBarAppearanceCombinedConfig';

import type { RouteTransitionConfig } from "../types/NavigationCommands";
import type { RouteOptions } from "../types/RouteOptions";
import type { Nullish } from '../types/UtilityTypes';


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
  static propertyMap: ComparisonConfig<RouteTransitionConfig> = {
    // shallow compare
    type    : { mode: 'shallow' },
    duration: { mode: 'shallow' },
  };

  static compare<T extends RouteTransitionConfig>(oldItem: T, newItem: T){
    return CompareUtilities.compareObject(
      CompareRouteTransitionPushConfig.propertyMap, oldItem, newItem
    );
  };

  static unwrapAndCompare<T extends RouteTransitionConfig>(
    oldItem: Nullish<T>,
    newItem: Nullish<T>
  ){
    if((oldItem == null) && (newItem == null)) return true;
    if((oldItem == null) || (newItem == null)) return false;

    return this.compare(oldItem, newItem);
  };
};

export class CompareRouteTransitionPopConfig {
  static propertyMap: ComparisonConfig<RouteTransitionConfig> = {
    // shallow compare
    type    : { mode: 'shallow' },
    duration: { mode: 'shallow' },
  };

  static compare(oldItem: RouteTransitionConfig, newItem: RouteTransitionConfig){
    return CompareUtilities.compareObject(CompareRouteTransitionPopConfig.propertyMap, oldItem, newItem);
  };

  static unwrapAndCompare<T extends RouteTransitionConfig>(
    oldItem: Nullish<T>,
    newItem: Nullish<T>
  ){
    if((oldItem == null) && (newItem == null)) return true;
    if((oldItem == null) || (newItem == null)) return false;

    return this.compare(oldItem, newItem);
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
    oldItem: Nullish<T>,
    newItem: Nullish<T>
  ){
    if((oldItem == null) && (newItem == null)) return true;
    if((oldItem == null) || (newItem == null)) return false;

    return this.compare(oldItem, newItem);
  };
};