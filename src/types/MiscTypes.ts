export type Point = {
  x: number;
  y: number;
};

type PointPreset = 
  | 'top' | 'bottom' | 'left' | 'right'
  | 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight';

/** Object returned by `Image.resolveAssetSource()` */
export type ImageResolvedAssetSource = {
  height: number;
  width: number;
  scale: number;
  uri: string;
};

export type ImageRectConfig = {
  width: number;
  height: number;
  fillColor: string;
  borderRadius?: number;
};

export type ImageGradientConfig = Partial<Pick<ImageRectConfig, 
  | 'width'
  | 'height'
  | 'borderRadius'
>> & {
  /* An array defining the color of each gradient stop. */
  colors: Array<string>;
  /* Defines the location of each gradient stop. */
  locations?: Array<number>;
  /* The start point of the gradient when drawn in the layer’s coordinate space. */
  startPoint?: Point | PointPreset;
  /* The end point of the gradient when drawn in the layer’s coordinate space. */
  endPoint?: Point | PointPreset;
  /* Style of gradient drawn by the layer. Defaults to axial. */
  type?: 'axial' | 'conic' | 'radial'
};

/** Object return by `DynamicColorIOS` */
export type DynamicColor = {
  dynamic: {
    dark: string;
    light: string;
  };
};

/** `UIOffset: A structure that specifies an amount to offset a position. */
export type Offset = {
  vertical  ?: Number;
  horizontal?: Number;
};

export enum ImageTypes {
  IMAGE_ASSET    = 'IMAGE_ASSET'   ,
  IMAGE_SYSTEM   = 'IMAGE_SYSTEM'  ,
  IMAGE_REQUIRE  = 'IMAGE_REQUIRE' ,
  IMAGE_EMPTY    = 'IMAGE_EMPTY'   ,
  IMAGE_RECT     = 'IMAGE_RECT'    ,
  IMAGE_GRADIENT = 'IMAGE_GRADIENT',
};

export type ImageItemConfig = {
  type: ImageTypes.IMAGE_ASSET | "IMAGE_ASSET";
  /** The corresponding key of asset item in the asset catalog */
  imageValue: string;
} | {
  type: ImageTypes.IMAGE_SYSTEM | "IMAGE_SYSTEM";
  /** The key/name of the SF Symbols system icon */
  imageValue: string;
} | {
  type: ImageTypes.IMAGE_REQUIRE | "IMAGE_REQUIRE";
  /** Object returned by `Image.resolveAssetSource()` */
  imageValue: ImageResolvedAssetSource;
} | {
  type: ImageTypes.IMAGE_EMPTY | "IMAGE_EMPTY";
} | {
  type: ImageTypes.IMAGE_RECT | "IMAGE_RECT";
  imageValue: ImageRectConfig;
} | {
  type: ImageTypes.IMAGE_GRADIENT | "IMAGE_GRADIENT";
  imageValue: ImageGradientConfig;
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
  | 'prominent';

/** Constants to specify metrics to use for appearance. */
export type BarMetrics = 
  /** Specifies default metrics for the device */
  | 'default'
  /** Specifies metrics when using the phone idiom */
  | 'compact'
  /** Specifies default metrics for the device for bars with the prompt property, such as UINavigationBar and UISearchBar. */
  | 'defaultPrompt'
  /** Specifies metrics for bars with the prompt property when using the phone idiom, such as UINavigationBar and UISearchBar. */
  | 'compactPrompt';

export type ControlState = 
  /* The normal, or default state of a control—that is, enabled but neither selected nor highlighted. */
  | 'normal'
  /* Highlighted state of a control. */
  | 'highlighted'
  /* Disabled state of a control. */
  | 'disabled'
  /* Selected state of a control. */
  | 'selected'
  /* Focused state of a control. */
  | 'focused';

export type EdgeInsets = {
    top   : number;
    bottom: number;
    left  : number;
    right : number;
};

export type Rect = {
    x     : number;
    y     : number;
    height: number;
    width : number;
};

export type ReturnKeyType =
  /** Specifies that the visible title of the Return key is return. */
  | 'default'
  /** Specifies that the visible title of the Return key is Go. */
  | 'go'
  /** Specifies that the visible title of the Return key is Google. */
  | 'google'
  /** Specifies that the visible title of the Return key is Join. */
  | 'join'
  /** Specifies that the visible title of the Return key is Next. */
  | 'next'
  /** Specifies that the visible title of the Return key is Route. */
  | 'route'
  /** Specifies that the visible title of the Return key is Search. */
  | 'search'
  /** Specifies that the visible title of the Return key is Send. */
  | 'send'
  /** Specifies that the visible title of the Return key is Yahoo. */
  | 'yahoo'
  /** Specifies that the visible title of the Return key is Done. */
  | 'done'
  /** Specifies that the visible title of the Return key is Emergency Call. */
  | 'emergencyCall'
  /** Specifies that the visible title of the Return key is Continue. */
  | 'continue'