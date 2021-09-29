import type { TextStyle } from "react-native";

import type { Offset } from './MiscTypes';
import type { ImageItemConfig } from './ImageItemConfig';


export type BarButtonItemStates = 'normal' | 'disabled' | 'highlighted' | 'focused';

  /** `UIBarButtonItem.Style` */
export type BarButtonItemStyles = 'plain' | 'done';

/** UIBarButtonItemStateAppearance */
type BarButtonItemStateAppearance = {
  titleTextAttributes?: TextStyle;
  titlePositionAdjustment?: Offset;

  backgroundImage?: ImageItemConfig;
  backgroundImagePositionAdjustment?: Offset;
};

type BarButtonItemAppearanceStates = {
  [key in BarButtonItemStates]?: BarButtonItemStateAppearance
};

type BarButtonItemAppearanceBase = {
  style: BarButtonItemStyles;
};

/** Used to create a `UIBarButtonItemAppearance` object */
export type BarButtonItemAppearance = 
  BarButtonItemAppearanceBase & BarButtonItemAppearanceStates;