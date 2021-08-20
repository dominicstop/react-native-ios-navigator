import type { NativePushPopOptions } from "../native_modules/RNINavigatorViewModule";

type RouteTransitionConfigBase = {
  duration?: number;
};

export enum RouteTransitionTypesEnum {
  Default        = "Default",
  CrossFade      = "CrossFade",
  SlideLeft      = "SlideLeft",
  SlideUp        = "SlideUp",
  GlideUp        = "GlideUp",
  ZoomFade       = "ZoomFade",
  FlipHorizontal = "FlipHorizontal",
  FlipVertical   = "FlipVertical",
};

export type RouteTransitionTypes = keyof typeof RouteTransitionTypesEnum;

export type RouteTransitionConfig = RouteTransitionConfigBase & {
  type: RouteTransitionTypesEnum | RouteTransitionTypes;
};

export type NavCommandPushOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionConfig;
};

export type NavCommandPopOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionConfig;
};