type ImageResolvedAssetSource = {
  height: number;
  width: number;
  scale: number;
  uri: string;
};

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

type NavBarItemConfigBase = {
  type: "TEXT";
  title: string;
} | {
  type: "SYSTEM_ITEM";
  /** Defines system-supplied images for bar button items. */
  systemItem: BarButtonItemSystemItem;
} | {
  type: "IMAGE_ASSET";
  /** The corresponding key of asset item in the asset catalog */
  imageValue: string;
} | {
  type: "IMAGE_SYSTEM";
  /** The key/name of the SF Symbols system icon */
  imageValue: string;
} | {
  type: "IMAGE_REQUIRE",
  imageValue: ImageResolvedAssetSource,
};

type NavBarItemConfigCustomBase = {
  type: "CUSTOM";
};

type NavBarItemConfigShared = {
  /** Used for `onPressBarButtonItem` to distinguish item triggered the event */
  key?: String;
  /** The tint color to apply to the button item. */
  tintColor?: string;
  /** Specifies the style of an item. Default is 'plain'. */
  barButtonItemStyle?: 'plain' | 'done';
  /** The set of possible titles to display on the bar button. */
  possibleTitles?: Array<string>;
  /** The width of the item. */
  width?: number;
};

type ArrayWithOneElement<T> = { 0: T } & Array<T>;

export type NavBarBackItemConfig = 
  (NavBarItemConfigBase | NavBarItemConfigCustomBase) &
  NavBarItemConfigShared

export type NavBarItemConfig = 
  (NavBarItemConfigBase | NavBarItemConfigCustomBase) & 
  NavBarItemConfigShared;

export type NavBarItemsConfig = 
 | Array<NavBarItemConfig>
 | ArrayWithOneElement<NavBarItemConfig>;
