import type { Point, PointPreset } from "./MiscTypes";
import type { EnumValueLiteral } from "./UtilityTypes";


/** Object returned by `Image.resolveAssetSource()` */
export type ImageResolvedAssetSource = {
  height: number;
  width: number;
  scale: number;
  uri: string;
};

export enum ImageTypes {
  IMAGE_ASSET    = 'IMAGE_ASSET'   ,
  IMAGE_SYSTEM   = 'IMAGE_SYSTEM'  ,
  IMAGE_REQUIRE  = 'IMAGE_REQUIRE' ,
  IMAGE_EMPTY    = 'IMAGE_EMPTY'   ,
  IMAGE_RECT     = 'IMAGE_RECT'    ,
  IMAGE_GRADIENT = 'IMAGE_GRADIENT',
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


export type ImageItemConfig = {
  type: EnumValueLiteral<typeof ImageTypes, 'IMAGE_ASSET'>;
  /** The corresponding key of asset item in the asset catalog */
  imageValue: string;
} | {
  type: EnumValueLiteral<typeof ImageTypes, 'IMAGE_SYSTEM'>;
  /** The key/name of the SF Symbols system icon */
  imageValue: string;
} | {
  type: EnumValueLiteral<typeof ImageTypes, 'IMAGE_REQUIRE'>;
  /** Object returned by `Image.resolveAssetSource()` */
  imageValue: ImageResolvedAssetSource;
} | {
  type: EnumValueLiteral<typeof ImageTypes, 'IMAGE_EMPTY'>;
} | {
  type: EnumValueLiteral<typeof ImageTypes, 'IMAGE_RECT'>;
  imageValue: ImageRectConfig;
} | {
  type: EnumValueLiteral<typeof ImageTypes, 'IMAGE_GRADIENT'>;
  imageValue: ImageGradientConfig;
};
