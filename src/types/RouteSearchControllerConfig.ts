import type { TextStyle } from "react-native";
import type { DynamicColor, ReturnKeyType } from "./MiscTypes";

export type UISearchBarStyle = 
  /** The search bar has the default style. */
  | 'default'
  /** The search bar has a translucent background, and the search field is opaque. */
  | 'prominent'
  /** The search bar has no background, and the search field is translucent. */
  | 'minimal';

type CustomSearchBarConfig = {
  leftIconTintColor?: string | DynamicColor;
  placeholderTextColor?: string | DynamicColor;
};

type SearchBarConfig = {
  /** The string that is displayed when there is no other text in the text field. */
  placeholder?: string;

  /** The tint color to apply to the search bar background. */
  barTintColor?: string | DynamicColor;

  /** A search bar style that specifies the search bar’s appearance. */
  searchBarStyle?: UISearchBarStyle;

  /** The tint color to apply to key elements in the search bar. */
  tintColor?: string | DynamicColor;

  /** A Boolean value that indicates whether the search bar is translucent (true) or not (false). */
  isTranslucent?: boolean;

  /** The color of the text field’s text. */
  textColor?: string | DynamicColor;

  /** Specify the text string that displays in the Return key of a keyboard. */
  returnKeyType?: ReturnKeyType;

  searchTextFieldBackgroundColor?: string | DynamicColor;
};

type SearchControllerConfig = {
  /** A Boolean value that indicates whether the app hides the integrated search bar when scrolling any underlying content. */
  hidesSearchBarWhenScrolling?: boolean;

  /** A Boolean indicating whether the underlying content is obscured during a search. */
  obscuresBackgroundDuringPresentation?: boolean;

  /**  Boolean indicating whether the navigation bar should be hidden when searching. */
  hidesNavigationBarDuringPresentation?: boolean;

  /** A Boolean indicating whether the search controller manages the visibility of the search bar’s cancel button. Requires iOS 13+ */
  automaticallyShowsCancelButton?: boolean;
};

export type RouteSearchControllerConfig = 
  CustomSearchBarConfig & SearchBarConfig & SearchControllerConfig;