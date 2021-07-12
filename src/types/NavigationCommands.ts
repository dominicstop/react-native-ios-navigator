import type { NativePushPopOptions } from "../native_modules/RNINavigatorViewModule";

type RouteTransitionConfigBase = {
  duration?: number;
};

export type RouteTransitionPushTypes = 
  "DefaultPush" | "FadePush" | "SlideLeftPush" | "SlideUpPush" | "GlideUpPush";

export type RouteTransitionPopTypes = 
  "DefaultPop" | "FadePop" | "SlideLeftPop" | "SlideUpPop" | "GlideUpPop";

export type RouteTransitionPushConfig = RouteTransitionConfigBase & {
  type: RouteTransitionPushTypes;
};

export type RouteTransitionPopConfig = RouteTransitionConfigBase & {
  type: RouteTransitionPopTypes;
};

export type NavCommandPushOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPushConfig;
};

export type NavCommandPopOptions = NativePushPopOptions & {
  transitionConfig?: RouteTransitionPopConfig;
};