import type { DynamicColor, ImageItemConfig, BarMetrics, ControlState, Offset } from "./MiscTypes";

//#region - BarButtonItemSystemItem
type BarButtonItemSystemItem =
  /** The system Done button, localized. */
  | "done"
  /** The system Cancel button, localized. */
  | "cancel"
  /** The system Edit button, localized. */
  | "edit"
  /** The system Save button, localized. */
  | "save"
  /** The system plus button containing an icon of a plus sign. */
  | "add"
  /** Blank space to add between other items. The space is distributed equally between the other items. Other item properties are ignored when this value is set. */
  | "flexibleSpace"
  /** Blank space to add between other items. Only the width property is used when this value is set. */
  | "fixedSpace"
  /** The system compose button. */
  | "compose"
  /** The system reply button. */
  | "reply"
  /** The system action button. */
  | "action"
  /** The system organize button. */
  | "organize"
  /** The system bookmarks button. */
  | "bookmarks"
  /** The system search button. */
  | "search"
  /** The system refresh button. */
  | "refresh"
  /** The system stop button. */
  | "stop"
  /** The system camera button. */
  | "camera"
  /** The system trash button. */
  | "trash"
  /** The system play button. */
  | "play"
  /** The system pause button. */
  | "pause"
  /** The system rewind button. */
  | "rewind"
  /** The system fast forward button. */
  | "fastForward"
  /** The system undo button. */
  | "undo"
  /** The system redo button. */
  | "redo"
  /** The system close button. */
  | "close"
//#endregion

type NavBarItemConfigBase = ImageItemConfig | {
  type: "TEXT";
  title: string;
} | {
  type: "SYSTEM_ITEM";
  /** Defines system-supplied images for bar button items. */
  systemItem: BarButtonItemSystemItem;
};

type NavBarItemConfigCustomBase = {
  type: "CUSTOM";
};

type BarButtonItemStyle = 
  /** Glows when tapped. The default item style. */
  | 'plain'
  /** The style for a done button—for example, a button that completes some task and returns to the previous view. */
  | 'done';

/** Specifies the style of an item. */
type NavBarItemConfigShared = {
  /** Used for `onPressBarButtonItem` to distinguish item triggered the event */
  key?: String;

  /** The tint color to apply to the button item. */
  tintColor?: string | DynamicColor;

  /** Specifies the style of an item. Default is 'plain'. */
  barButtonItemStyle?: BarButtonItemStyle;

  /** The set of possible titles to display on the bar button. */
  possibleTitles?: Array<string>;

  /** The width of the item. */
  width?: number;

  /** Sets the background image for a specified state and bar metrics. */
  backgroundImage?: { 
    [key in BarMetrics]?: {
      imageItem: ImageItemConfig;
      controlState: ControlState;
      barButtonItemStyle?: BarButtonItemStyle;
    };
  };

  /** Sets the title offset for specified bar metrics. **/
  titlePositionAdjustment?: {
    [key in BarMetrics]?: Offset;
  };

  /** Sets the background vertical position offset for specified bar metrics. **/
  // backgroundVerticalPositionAdjustment?: {
  //   [key in BarMetrics]?: number
  // };
};

type NavBarBackItemConfigBase = {
  /** 
   * The `NavBarBackItemConfig` by default, is applied to the next route, as such setting
   * the config will not affect the current route's back item.
   * 
   * This flag indicates whether or not this config will be applied to the prev. route's
   * back item. */
  applyToPrevBackConfig?: boolean;
};

type ArrayWithOneElement<T> = { 0: T } & Array<T>;

export type NavBarBackItemConfig =
  & NavBarBackItemConfigBase 
  & NavBarItemConfigBase
  & NavBarItemConfigShared

export type NavBarItemConfig = 
  & NavBarItemConfigBase  
  & NavBarItemConfigShared;

export type NavBarItemsConfig = 
  | Array<NavBarItemConfig>
  | ArrayWithOneElement<NavBarItemConfigCustomBase>;
