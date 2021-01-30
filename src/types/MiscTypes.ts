/** Object returned by `Image.resolveAssetSource()` */
export type ImageResolvedAssetSource = {
  height: number;
  width: number;
  scale: number;
  uri: string;
};

/** `UIOffset: A structure that specifies an amount to offset a position. */
export type Offset = {
  vertical  ?: Number;
  horizontal?: Number;
};

/** Blur styles available for blur effect objects. */
export type BlurEffectStyle =
  // -----------------*
  // Adaptable Styles |
  // -----------------*
  /** An adaptable blur effect that creates the appearance of an ultra-thin material. */
  | 'systemUltraThinMaterial'
  /** An adaptable blur effect that creates the appearance of a thin material. */
  | 'systemThinMaterial'
  /** An adaptable blur effect that creates the appearance of a material with normal thickness. */
  | 'systemMaterial'
  /** An adaptable blur effect that creates the appearance of a material that is thicker than normal. */
  | 'systemThickMaterial'
  /** An adaptable blur effect that creates the appearance of the system chrome. */
  | 'systemChromeMaterial'
  
  // -------------*
  // Light Styles |
  // -------------*
  /** A blur effect that creates the appearance of an ultra-thin material and is always light. */
  | 'systemUltraThinMaterialLight'
  /** A blur effect that creates the appearance of a thin material and is always light. */
  | 'systemThinMaterialLight'
  /** A blur effect that creates the appearance of a material with normal thickness and is always light. */
  | 'systemMaterialLight'
  /** A blur effect that creates the appearance of a material that is thicker than normal and is always light. */
  | 'systemThickMaterialLight'
  /** A blur effect that creates the appearance of the system chrome and is always light. */
  | 'systemChromeMaterialLight'
   
  // ------------*
  // Dark Styles |
  // ------------*
  /** A blur effect that creates the appearance of an ultra-thin material and is always dark. */
  | 'systemChromeMaterialDark'
  /** A blur effect that creates the appearance of a thin material and is always dark. */
  | 'systemMaterialDark'
  /** A blur effect that creates the appearance of a material with normal thickness and is always dark. */
  | 'systemThickMaterialDark'
  /** A blur effect that creates the appearance of a material that is thicker than normal and is always dark. */
  | 'systemThinMaterialDark'
  /** A blur effect that creates the appearance of the system chrome and is always dark. */
  | 'systemUltraThinMaterialDark'

  // ------------------*
  // Additional Styles |
  // ------------------*
  /** The area of the view is lighter than the underlying view. */
  | 'extraLight'
  /** The area of the view is the same approximate lightness of the underlying view. */
  | 'light'
  /** The area of the view is darker than the underlying view. */
  | 'dark'
  /** The area of the view is even more dark than the underlying view. */
  | 'extraDark'
  /** A regular blur style that adapts to the user interface style. */
  | 'regular'
  /** A blur style for making content more prominent that adapts to the user interface style. */
  | 'prominent'