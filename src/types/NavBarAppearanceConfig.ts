import type { TextStyle } from "react-native";

import type { BlurEffectStyle, DynamicColor, Offset, BarMetrics } from "./MiscTypes";
import type { ImageItemConfig } from "./ImageItemConfig";
import type { BarButtonItemAppearance } from "./BarButtonItemAppearance";


/** `UIBarStyle`: Defines the stylistic appearance of different types of views */
type BarStyle = 'default' | 'black';

// TODO (014): Rename to `NavBarAppearanceBaseConfigType` and export
type NavBarAppearanceBaseConfig = 
  /** Configures the bar appearance object with default background and shadow values. */
  | 'defaultBackground'
  /** Configures the bar appearance object with a set of opaque colors that are appropriate for the current theme. */
  | 'opaqueBackground'
  /** Configures the bar appearance object with a transparent background and no shadow. */
  | 'transparentBackground';

export type NavBarPreset = 'none' | 'noShadow' | 'clearBackground';

/** Options to specify how a view adjusts its content when its size changes. */
export type ViewContentMode = 
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'redraw'
  | 'scaleAspectFill'
  | 'scaleToFill'
  | 'scaleAspectFit';

/** A UIBarAppearance object contains the common traits shared by navigation bars, tab bars, and toolbars. */
type BarAppearance = {
  /** Sets which default values to use fot setting the Navbar appearance properties  */
  baseConfig?: NavBarAppearanceBaseConfig;

  // Background Appearance
  /** The blur effect to apply to the bar's background. The blur effect provides the base layer for the bar's appearance, and it determines how much of the underlying content is visible. UIKit applies the `backgroundColor` and `backgroundImage` on top of this effect. */
  backgroundEffect?: BlurEffectStyle;

  /** The background color of the bar. */
  backgroundColor?: string | DynamicColor;

  /** The image to display on top of the bar's background color. */
  backgroundImage?: ImageItemConfig;

  /** the content mode to use when displaying the bar's background image. */
  backgroundImageContentMode?: ViewContentMode;

  // Shadow Appearance
  /** The color to apply to the bar's custom or default shadow. */
  shadowColor?: string | DynamicColor;

  shadowImage?: ImageItemConfig;
};

/** `UINavigationBarAppearance` - An object for customizing the appearance of a navigation bar. */
export type NavBarAppearance = BarAppearance & {

  /** String attributes to apply to the text of a standard-size title. */
  titleTextAttributes?: TextStyle;
  
  /** String attributes to apply to the text of a large-size title. */
  largeTitleTextAttributes?: TextStyle;

  /** The distance, in points, by which to offset the title horizontally and vertically. */
  titlePositionAdjustment?: Offset;

  /** The image to display on the leading edge of the back button. */
  backIndicatorImage?: ImageItemConfig;

  /** The appearance attributes for plain bar button items in the navigation bar. */
  buttonAppearance?: BarButtonItemAppearance;

  /** The appearance attributes for the back button. */
  backButtonAppearance?: BarButtonItemAppearance;

  /** The appearance attributes for Done buttons. */
  doneButtonAppearance?: BarButtonItemAppearance;
};

type NavBarAppearanceConfigBase = {
  /** Preset configs for setting the appearance of the navigation bar */
  navBarPreset?: NavBarPreset;
};

/** 
 * Legacy Customizations
 * Customize appearance information directly on the navigation bar object
 * (i.e. using the "old" pre-iOS 13 API).
 * */
export type NavBarAppearanceLegacyConfig = NavBarAppearanceConfigBase & {

  /** The navigation bar style that specifies its appearance. */
  barStyle?: BarStyle;

  /** Display attributes for the bar’s title text. */
  titleTextAttributes?: TextStyle;

  /** Display attributes for the bar's large title text. */
  largeTitleTextAttributes?: TextStyle;

  /** Sets the title’s vertical position adjustment for the given bar metrics. */
  titleVerticalPositionAdjustment?: { [key in BarMetrics]?: number };

  /** The tint color to apply to the navigation items and bar button items. */
  tintColor?: string | DynamicColor;

  /** The tint color to apply to the navigation bar background. */
  barTintColor?: string | DynamicColor;

  /** The image shown beside the back button. */
  backIndicatorImage?: ImageItemConfig;

  /** Sets the background image for the given metric. */
  backgroundImage?: { [key in BarMetrics]?: ImageItemConfig };

  /** The shadow image to be used for the navigation bar. */
  shadowImage?: ImageItemConfig;
};

export type NavBarAppearanceConfig = NavBarAppearanceConfigBase & {

  /** The appearance settings for a standard-height navigation bar. */
  standardAppearance?: NavBarAppearance;

  /** The appearance settings for a compact-height navigation bar. */
  compactAppearance?: NavBarAppearance;
  
  /** The appearance settings to use when the edge of any scroll-able content reaches the matching edge of the navigation bar. */
  scrollEdgeAppearance?: NavBarAppearance;
};

export type NavBarAppearanceCombinedConfig = ((
  NavBarAppearanceConfig & {
    mode: 'appearance';
  }
) | (
  NavBarAppearanceLegacyConfig & {
    mode: 'legacy';
  }
));