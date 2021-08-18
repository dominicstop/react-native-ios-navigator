import type { NativePushPopOptions } from "../native_modules/RNINavigatorViewModule";

type RouteTransitionConfigBase = {
  duration?: number;
};

export enum RouteTransitionPushTypesEnum {
  DefaultPush        = "DefaultPush",
  FadePush           = "FadePush",
  SlideLeftPush      = "SlideLeftPush",
  SlideUpPush        = "SlideUpPush",
  GlideUpPush        = "GlideUpPush",
  ZoomFadePush       = "ZoomFadePush",
  FlipHorizontalPush = "FlipHorizontalPush",
  FlipVerticalPush   = "FlipVerticalPush",
};

export enum RouteTransitionPopTypesEnum {
  DefaultPop        = "DefaultPop",
  FadePop           = "FadePop",
  SlideLeftPop      = "SlideLeftPop",
  SlideUpPop        = "SlideUpPop",
  GlideUpPop        = "GlideUpPop",
  ZoomFadePop       = "ZoomFadePop",
  FlipHorizontalPop = "FlipHorizontalPop",
  FlipVerticalPop   = "FlipVerticalPop",
};

export type RouteTransitionPushTypes = keyof typeof RouteTransitionPushTypesEnum;

export type RouteTransitionPopTypes = keyof typeof RouteTransitionPopTypesEnum;

export type RouteTransitionPushConfig = RouteTransitionConfigBase & {
  type: RouteTransitionPushTypesEnum | RouteTransitionPushTypes;
};

export type RouteTransitionPopConfig = RouteTransitionConfigBase & {
  type: RouteTransitionPopTypesEnum | RouteTransitionPopTypes;
};

export type NavCommandPushOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPushConfig;
};

export type NavCommandPopOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPopConfig;
};