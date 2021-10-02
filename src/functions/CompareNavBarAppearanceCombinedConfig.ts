
import { CompareUtilities, ComparisonConfig } from './CompareUtilities';
import { CompareImageConfig } from './CompareImageConfig';
import { compareColor, CompareOffset } from './CompareMisc';

import type { NavBarAppearance, NavBarAppearanceCombinedConfig, NavBarAppearanceConfig, NavBarAppearanceLegacyConfig } from '../types/NavBarAppearanceConfig';
import type { BarButtonItemAppearance, BarButtonItemStateAppearance } from '../types/BarButtonItemAppearance';


export class CompareBarButtonItemStateAppearance {
  static propertyMap: ComparisonConfig<BarButtonItemStateAppearance> = {
    titleTextAttributes: { mode: 'deep' },

    titlePositionAdjustment: { 
      mode: 'custom',
      customCompare: CompareOffset.compare,
    },
    backgroundImagePositionAdjustment: { 
      mode: 'custom',
      customCompare: CompareOffset.compare,
    },
    backgroundImage: {
      mode: 'custom',
      customCompare: CompareImageConfig.compare,
    },
  };

  static compare<T extends BarButtonItemStateAppearance>(oldItem: T, newItem: T){
    return CompareUtilities.compareObject(
      CompareBarButtonItemStateAppearance.propertyMap, oldItem, newItem, true
    );
  };
};

export class CompareBarButtonItemAppearance {
  static propertyMap:  ComparisonConfig<BarButtonItemAppearance> = {
    style: { mode: 'shallow' },

    normal: {
      mode: 'custom',
      customCompare: CompareBarButtonItemStateAppearance.compare,
    },
    disabled: {
      mode: 'custom',
      customCompare: CompareBarButtonItemStateAppearance.compare,
    },
    highlighted: {
      mode: 'custom',
      customCompare: CompareBarButtonItemStateAppearance.compare,
    },
    focused: {
      mode: 'custom',
      customCompare: CompareBarButtonItemStateAppearance.compare,
    },
  };
  static compare<T extends BarButtonItemAppearance>(oldItem: T, newItem: T){
    return CompareUtilities.compareObject(
      CompareBarButtonItemAppearance.propertyMap, oldItem, newItem, true
    );;
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

    // custom compare
    backIndicatorImage: {
      mode: 'custom',
      customCompare: CompareImageConfig.compare,
    },
    backgroundImage: {
      mode: 'custom',
      customCompare: CompareImageConfig.compare,
    },
    shadowImage: {
      mode: 'custom',
      customCompare: CompareImageConfig.compare,
    },
    buttonAppearance: {
      mode: 'custom',
      customCompare: CompareBarButtonItemAppearance.compare,
    },
    backButtonAppearance: {
      mode: 'custom',
      customCompare: CompareBarButtonItemAppearance.compare,
    },
    doneButtonAppearance: {
      mode: 'custom',
      customCompare: CompareBarButtonItemAppearance.compare,
    },
  };

  static compare<T extends NavBarAppearance>(oldItem: T, newItem: T){
    return CompareUtilities.compareObject(
      CompareNavBarAppearance.propertyMap, oldItem, newItem, true
    );;
  };
};

export class CompareNavBarAppearanceConfig {
  static propertyMap: ComparisonConfig<NavBarAppearanceConfig> = {
    // shallow compare 
    navBarPreset: { mode: 'shallow' },
    useStandardAppearanceAsDefault: { mode: 'shallow' },

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
    compactScrollEdgeAppearance: {
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
    return CompareUtilities.compareObject(
      CompareLegacyAppearanceConfig.propertyMap, oldItem, newItem, true
    );
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