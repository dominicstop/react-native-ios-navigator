import type { NavigationObject, StatusBarStyle, LargeTitleDisplayMode, BackButtonDisplayMode, NavigationBarVisibilityMode } from 'react-native-ios-navigator';
import type { NavigatorTest01, NavigatorTest01State,  } from './NavigatorTest01';

import type { NavBarItemsConfig, NavBarBackItemConfig } from '../../../../src/types/NavBarItemConfig';
import type { NavBarAppearanceConfig, NavBarAppearanceCombinedConfig } from '../../../../src/types/NavBarAppearanceConfig';

import * as Colors  from '../../constants/Colors';


//#region - Types
export type ConfigItem<T> = {
  config: T;
  description: string;
};

export type Config<T> = Array<ConfigItem<T>>;

export type SharedSectionProps = {
  navigation: NavigationObject;
  parentState: NavigatorTest01State;

  requestSetState: typeof NavigatorTest01.prototype._handleRequestSetState;
};
//#endregion

//#region - Config Options
export const largeTitleDisplayModes: Array<LargeTitleDisplayMode> = 
  ['automatic', 'always', 'never'];

export const backButtonDisplayModes: Array<BackButtonDisplayMode> = 
  ['default', 'generic', 'minimal'];

export const navBarVisibilityModes: Array<NavigationBarVisibilityMode> = 
  ['default', 'visible', 'hidden'];

export const statusBarStyles: Array<StatusBarStyle> = 
  ['default', 'lightContent', 'darkContent'];
//#endregion

//#region - Config Items
export const navBarItemsConfigs: Config<NavBarItemsConfig> = [{
  description: 'N/A',
  config: []
}, {
  description: 'A nav bar item with `Type: TEXT`',
  config: [{
    type: 'TEXT',
    title: 'Item',
  }]
}, {
  description: "A nav bar item with `Type: TEXT` that's tinted red + horizontal offset by 10",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item',
    tintColor: 'red',
    titlePositionAdjustment: {
      default: { 
        horizontal: 10,
      }
    },
  }]
}, {
  description: "2 nav bar item with `Type: TEXT` that's tinted red and the other blue",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item A',
    tintColor: 'red',
  }, {
    type: 'TEXT',
    key: 'B',
    title: 'Item B',
    tintColor: 'blue'
  }]
}, {
  description: "3 nav bar item with `Type: TEXT` w/ `tintColor` set to red, yellow and blue",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item A',
    tintColor: 'red',
  }, {
    type: 'TEXT',
    key: 'B',
    title: 'Item B',
    tintColor: 'blue'
  }, {
    type: 'TEXT',
    key: 'C',
    title: 'Item C',
    tintColor: 'yellow'
  }]
}, {
  description: "3 nav bar item with `Type: TEXT`",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item A',
    tintColor: 'white',
    backgroundImage: {
      default: {
        controlState: 'normal',
        imageItem: {
          type: 'IMAGE_RECT',
          imageValue: {
            fillColor: 'rgba(255,0,0,0.5)',
            height: 25,
            width: 75,
            borderRadius: 10
          },
        },
      }
    }
  }, {
    type: 'TEXT',
    key: 'B',
    title: 'Item B',
    tintColor: 'white',
    backgroundImage: {
      default: {
        controlState: 'normal',
        imageItem: {
          type: 'IMAGE_RECT',
          imageValue: {
            fillColor: 'rgba(0,255,0,0.5)',
            height: 25,
            width: 75,
            borderRadius: 15
          },
        },
      },
    },
  }, {
    type: 'TEXT',
    key: 'C',
    title: 'Item C',
    tintColor: 'white',
    backgroundImage: {
      default: {
        controlState: 'normal',
        imageItem: {
          type: 'IMAGE_RECT',
          imageValue: {
            fillColor: 'rgba(0,0,255,0.5)',
            height: 25,
            width: 75,
            borderRadius: 20
          },
        },
      }
    }
  }]
}, {
  description: "3 Nav bar items with gradient bg color",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Item A',
    tintColor: 'white',
    backgroundImage: {
      default: {
        controlState: 'normal',
        imageItem: {
          type: 'IMAGE_GRADIENT',
          imageValue: {
            colors: ['red', 'blue', 'green'],
            width: 100,
            height: 50,
          }
        },
      }
    },
  }]
}, {
  description: "A nav bar item with `Type: SYSTEM_ITEM` w/ `systemItem: 'close'`",
  config: [{
    type: 'SYSTEM_ITEM',
    systemItem: 'close'
  }]
}, {
  description: "A nav bar item with `Type: SYSTEM_ITEM` w/ `systemItem: 'compose' and w/ `tintColor` set to red`",
  config: [{
    type: 'SYSTEM_ITEM',
    systemItem: 'compose',
    tintColor: 'red'
  }]
}, {
  description: "2 nav bar item with `Type: SYSTEM_ITEM` w/ `systemItem` set to 'done', and 'edit', and w/ `tintColor` set to red and blue`",
  config: [{
    type: 'SYSTEM_ITEM',
    systemItem: 'done',
    tintColor: 'red'
  }, {
    type: 'SYSTEM_ITEM',
    systemItem: 'edit',
    tintColor: 'blue'
  }]
}, {
  description: "3 nav bar items that are `Type: SYSTEM_ITEM`",
  config: [{
    type: 'SYSTEM_ITEM',
    systemItem: 'fastForward',
    tintColor: 'red',
  }, {
    type: 'SYSTEM_ITEM',
    systemItem: 'organize',
    tintColor: 'blue'
  }, {
    type: 'SYSTEM_ITEM',
    systemItem: 'pause',
    tintColor: 'orange'
  }]
}, {
  description: "3 nav bar items that are `Type: SYSTEM_ITEM`",
  config: [{
    type: 'SYSTEM_ITEM',
    systemItem: 'play',
    tintColor: 'green',
  }, {
    type: 'SYSTEM_ITEM',
    systemItem: 'redo',
    tintColor: 'pink'
  }, {
    type: 'SYSTEM_ITEM',
    systemItem: 'refresh',
    tintColor: 'yellow'
  }]
}, {
  description: "A nav bar item with `Type: SYSTEM_ITEM`, i.e. a custom right navbar right item.",
  config: [{
    type: 'CUSTOM'
  }]
}, {
  description: "A nav bar item with `Type: IMAGE_SYSTEM`, i.e. a SF Symbols icon. iOS 13+",
  config: [{
    type: 'IMAGE_SYSTEM',
    imageValue: 'trash'
  }]
}, {
  description: "A nav bar item with 2 `Type: IMAGE_SYSTEM`, i.e. SF Symbols icons. Requires iOS 13+",
  config: [{
    type: 'IMAGE_SYSTEM',
    imageValue: 'sunrise',
    tintColor: 'orange',
  }, {
    type: 'IMAGE_SYSTEM',
    imageValue: 'moon.fill',
    tintColor: 'purple',
  }]
}, {
  description: "A nav bar item with 2 `Type: IMAGE_SYSTEM`, i.e. SF Symbols icons. Requires iOS 13+",
  config: [{
    type: 'IMAGE_SYSTEM',
    imageValue: 'tv.fill',
    tintColor: 'red',
  }, {
    type: 'IMAGE_SYSTEM',
    imageValue: 'headphones',
    tintColor: 'blue',
  }, {
    type: 'IMAGE_SYSTEM',
    imageValue: 'airplane',
    tintColor: 'yellow',
  }]
}];

export const backButtonItemConfigs: Config<NavBarBackItemConfig>= [{
  description: "N/A",
  config: null,
}, {
  description: "Custom navbar back item with `Type: TEXT`",
  config: {
    type: 'TEXT',
    title: 'Custom Back'
  }
}, {
  description: "Custom navbar back item with `Type: TEXT` that's tinted 'red'",
  config: {
    type: 'TEXT',
    title: 'Back #2',
    tintColor: 'red'
  }
}, {
  description: "Custom navbar back item with `Type: SYSTEM_ITEM`",
  config: {
    type: 'SYSTEM_ITEM',
    systemItem: 'reply'
  }
}, {
  description: "Custom navbar back item with `Type: SYSTEM_ITEM` that's tinted red",
  config: {
    type: 'SYSTEM_ITEM',
    systemItem: 'rewind',
    tintColor: 'red',
  }
}, {
  description: "Custom navbar back item with `Type: IMAGE_SYSTEM`",
  config: {
    type: 'IMAGE_SYSTEM',
    imageValue: 'mic.fill',
  }
}, {
  description: "Custom navbar back item with `Type: SYSTEM_ITEM` that's tinted green",
  config: {
    type: 'IMAGE_SYSTEM',
    imageValue: 'keyboard',
  }
}, {
  description: "Custom navbar back item with `Type: IMAGE_EMPTY`",
  config: {
    type: 'IMAGE_EMPTY',
  }
}];

export const navBarAppearanceConfigs: Config<NavBarAppearanceConfig> = [{
  description: "N/A",
  config: null,
}, {
  description: "Red BG w/ white title",
  config: {
    standardAppearance: {
      backgroundColor: Colors.RED.A700,
      largeTitleTextAttributes: {
        fontSize: 32,
        color: 'white',
        fontWeight: '500',
      },
      titleTextAttributes: {
        color: 'white',
        fontSize: 20,
      },
    }
  }
}, {
  description: "...",
  config: {
    standardAppearance: {
      backgroundColor: 'rgba(0,0,255,0.25)',
      backgroundEffect: 'light',
      largeTitleTextAttributes: {
        fontSize: 32,
        color: 'white',
        fontWeight: '800',
      },
      titleTextAttributes: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
      },
      backIndicatorImage: {
        type: 'IMAGE_SYSTEM',
        imageValue: 'trash'
      },
      shadowColor: 'rgba(0,0,0,0)'
    }
  }
}, {
  description: "...",
  config: {
    standardAppearance: {
      backgroundColor: 'rgba(0,255,0,0.25)',
      backgroundEffect: 'systemUltraThinMaterial',
      largeTitleTextAttributes: {
        fontSize: 24,
        color: 'black',
        fontStyle: 'italic',
      },
      titleTextAttributes: {
        color: 'black',
        fontSize: 16,
        fontStyle: 'italic',
      },
      backIndicatorImage: {
        type: 'IMAGE_SYSTEM',
        imageValue: 'arrow.left'
      },
    }
  },
}, {
  description: "Gradient Test #1",
  config: {
    standardAppearance: {
      backgroundImage: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['red', 'rgba(0,0,255,0.5)'],
          startPoint: 'left',
          endPoint: 'right',
        }
      }
    }
  },
}, {
  description: "Gradient Test #2",
  config: {
    standardAppearance: {
      backgroundEffect: 'systemUltraThinMaterial',
      backgroundImage: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['rgba(255,0,0,0.5)', 'rgba(0,0,255,0.5)'],
          startPoint: 'right',
          endPoint: 'left',
        }
      }
    }
  },
}, {
  description: "Gradient Test #3",
  config: {
    standardAppearance: {
      backgroundImageContentMode: 'scaleAspectFill',
      backgroundImage: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['rgba(255,0,0,0.5)', 'rgba(0,255,0,0.25)'],
          startPoint: 'left',
          endPoint: 'right',
          width: 50,
          height: 50,
        }
      }
    }
  },
}, {
  description: "Shadow Image Test #1",
  config: {
    standardAppearance: {
      backgroundEffect: 'systemUltraThinMaterial',
      backgroundColor: Colors.PURPLE.A100,
      shadowImage: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)'],
          startPoint: 'top',
          endPoint: 'bottom',
          height: 100,
          width: 100,
        }
      },
    }
  },
}];

export const navBarAppearanceLegacyConfigs: Config<NavBarAppearanceCombinedConfig> = [{
  description: 'N/A',
  config: null,
}, {
  description: 'Simple Test',
  config: {
    mode: 'legacy',
    barTintColor: 'red',
    titleTextAttributes: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  },
}, {
  description: 'Gradient BG test',
  config: {
    mode: 'legacy',
    backgroundImage: {
      default: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['red', 'blue'],
          startPoint: 'top',
          endPoint: 'bottom'
        }
      }
    }
  },
}, {
  description: 'Gradient BG test 2',
  config: {
    mode: 'legacy',
    backgroundImage: {
      default: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['red', 'blue', 'green'],
          startPoint: 'left',
          endPoint: 'right'
        }
      }
    }
  },
}, {
  description: 'Gradient BG test 3',
  config: {
    mode: 'legacy',
    backgroundImage: {
      default: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['red', 'blue', 'green'],
          startPoint: 'right',
          endPoint: 'left'
        }
      }
    }
  },
}];
//#endregion
