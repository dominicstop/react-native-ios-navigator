import type { TextStyle, TextStyleIOS } from "react-native";
import type { BlurEffectStyle, DynamicColor, ImageItemConfig, Offset } from "./MiscTypes";


/** `UIBarStyle`: Defines the stylistic appearance of different types of views */
type BarStyle = 'default' | 'black';

type NavBarAppearanceBaseConfig = 
  /** Configures the bar appearance object with default background and shadow values. */
  | 'defaultBackground'
  /** Configures the bar appearance object with a set of opaque colors that are appropriate for the current theme. */
  | 'opaqueBackground'
  /** Configures the bar appearance object with a transparent background and no shadow. */
  | 'transparentBackground';

export type NavBarPreset = 'none' | 'noShadow' | 'clearBackground';

// TODO
type BarButtonItemAppearanceConfig = {
};

/** A UIBarAppearance object contains the common traits shared by navigation bars, tab bars, and toolbars. */
type BarAppearance = {
  /** Sets which default values to use fot setting the Navbar appearance properties  */
  baseConfig?: NavBarAppearanceBaseConfig;

  // Background Appearance
  /** The blur effect to apply to the bar's background. The blur effect provides the base layer for the bar's appearance, and it determines how much of the underlying content is visible. UIKit applies the `backgroundColor` and `backgroundImage` on top of this effect. */
  backgroundEffect?: BlurEffectStyle;
  /** The background color of the bar. */
  backgroundColor?: string | DynamicColor;

  // Shadow Appearance
  /** The color to apply to the bar's custom or default shadow. */
  shadowColor?: string | DynamicColor;
};

/** `UINavigationBarAppearance` - An object for customizing the appearance of a navigation bar. */
type NavBarAppearance = BarAppearance & {
  // Title Config
  /** String attributes to apply to the text of a standard-size title. */
  titleTextAttributes?: TextStyle & TextStyleIOS;
  
  /** String attributes to apply to the text of a large-size title. */
  largeTitleTextAttributes?: TextStyle & TextStyleIOS;
  
  /** The distance, in points, by which to offset the title horizontally and vertically. */
  titlePositionAdjustment?: Offset;
};

type NavBarAppearanceConfigBase = {
  /** Preset configs for setting the appearance of the navigation bar */
  navBarPreset?: NavBarPreset;
};

/**Legacy Customizations - Customize appearance information directly on the navigation bar object. */
export type NavBarAppearanceLegacyConfig = NavBarAppearanceConfigBase & {
  mode: 'legacy';

  /** The navigation bar style that specifies its appearance. */
  barStyle?: BarStyle;

  /** Display attributes for the bar’s title text. */
  titleTextAttributes?: TextStyle & TextStyleIOS;

  /** Display attributes for the bar's large title text. */
  largeTitleTextAttributes?: TextStyle & TextStyleIOS;

  /** Sets the title’s vertical position adjustment for `default` bar metrics. */
  titleVerticalPositionAdjustment?: number;

  /** The tint color to apply to the navigation items and bar button items. */
  tintColor?: string | DynamicColor;

  /** The tint color to apply to the navigation bar background. */
  barTintColor?: string | DynamicColor;

  /** The image shown beside the back button. */
  backIndicatorImage?: ImageItemConfig;

  /** Sets the background image for the default metric. */
  backgroundImage?: ImageItemConfig;
};

export type NavBarAppearanceConfig = NavBarAppearanceConfigBase & {
  mode: 'appearance';

  /** The appearance settings for a standard-height navigation bar. */
  standardAppearance?: NavBarAppearance;
  /** The appearance settings for a compact-height navigation bar. */
  compactAppearance?: NavBarAppearance;
  /** The appearance settings to use when the edge of any scroll-able content reaches the matching edge of the navigation bar. */
  scrollEdgeAppearance?: NavBarAppearance;
};