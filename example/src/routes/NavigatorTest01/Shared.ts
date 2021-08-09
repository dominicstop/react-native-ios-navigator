import type { NavigationObject, StatusBarStyle, LargeTitleDisplayMode, BackButtonDisplayMode, NavigationBarVisibilityMode } from 'react-native-ios-navigator';
import type { NavigatorTest01, NavigatorTest01State,  } from './NavigatorTest01';

import type { NavBarItemsConfig, NavBarBackItemConfig } from '../../../../src/types/NavBarItemConfig';
import type { NavBarAppearanceConfig, NavBarAppearanceCombinedConfig } from '../../../../src/types/NavBarAppearanceConfig';

import * as Colors  from '../../constants/Colors';
import * as Helpers from '../../functions/Helpers';


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
  description: "Nav bar item w/ linear gradient bg color",
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
  description: "Nav bar item w/ vertical linear gradient bg color + border radius",
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
            colors: ['red', 'blue'],
            width: 80,
            height: 30,
            borderRadius: 30/2,
            startPoint: 'top',
            endPoint: 'bottom'
          }
        },
      }
    },
  }]
}, {
  description: "Nav bar item w/ radial gradient bg color + border radius #2",
  config: [{
    type: 'TEXT',
    key: 'A',
    title: 'Hello',
    tintColor: 'white',
    backgroundImage: {
      default: {
        controlState: 'normal',
        imageItem: {
          type: 'IMAGE_GRADIENT',
          imageValue: {
            colors: ['red', 'blue'],
            width: 80,
            height: 30,
            type: 'radial',
            borderRadius: 30/2,
            startPoint: { x: 0.5, y: 0.5 },
            endPoint: { x: 1.0, y: 1.0 }
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

/** Appearance mode */
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
        fontStyle: 'italic',
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
        textDecorationLine: 'underline',
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
      largeTitleTextAttributes: {
        fontSize: 32,
        fontFamily: 'TimesNewRomanPS-ItalicMT',
      },
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
      titleTextAttributes: {
        fontSize: 18,
        color: 'white',
        textDecorationLine: 'underline',
      },
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
      titleTextAttributes: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        fontStyle: 'italic',
      },
      largeTitleTextAttributes: {
        fontSize: 26,
        color: 'white',
        fontWeight: 'bold',
      },
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
}, {
  description: "Shadow Image Test #2",
  config: {
    standardAppearance: {
      backgroundEffect: 'systemUltraThinMaterial',
      backgroundColor: Helpers.hexToRGBA(Colors.BLUE.A100, 0.5),
      titleTextAttributes: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        fontStyle: 'italic',
      },
      largeTitleTextAttributes: {
        fontSize: 28,
        color: 'white',
        fontWeight: '500',
        fontStyle: 'italic',
      },
      shadowImage: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: [
            Helpers.hexToRGBA(Colors.BLUE.A100, 0.25),
            'rgba(0,0,0,0)'
          ],
          startPoint: 'top',
          endPoint: 'bottom',
          height: 100,
          width: 100,
        }
      },
    }
  },
}];

/** Legacy mode */
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
      fontFamily: 'Georgia',
    },
    largeTitleTextAttributes: {
      fontSize: 32,
      fontFamily: 'Georgia-BoldItalic',
      color: 'red',
    },
  },
}, {
  description: 'Gradient BG test',
  config: {
    mode: 'legacy',
    tintColor: 'white',
    titleTextAttributes: {
      fontSize: 24,
      color: 'cyan',
      fontStyle: 'italic',
      fontWeight: '500',
    },
    largeTitleTextAttributes: {
      fontSize: 32,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      color: 'blue',
    },
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
    tintColor: 'white',
    titleTextAttributes: {
      color: 'white',
    },
    largeTitleTextAttributes: {
      fontSize: 24,
      textDecorationLine: 'line-through',
      color: 'green',
    },
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
    tintColor: 'white',
    titleTextAttributes: {
      color: 'white',
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    largeTitleTextAttributes: {
      fontSize: 36,
      fontWeight: '200',
      color: 'black',
    },
    backgroundImage: {
      default: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['red', 'blue', 'green'],
          startPoint: 'top',
          endPoint: 'bottom'
        }
      }
    }
  },
}, {
  description: 'Radial gradient BG test 4',
  config: {
    mode: 'legacy',
    tintColor: 'white',
    largeTitleTextAttributes: {
      fontSize: 32,
      fontFamily: 'Futura-CondensedExtraBold',
      color: 'red',
      backgroundColor: 'blue',
    },
    titleTextAttributes: {
      fontFamily: 'MarkerFelt-Thin',
      fontSize: 22,
    },
    backgroundImage: {
      default: {
        type: 'IMAGE_GRADIENT',
        imageValue: {
          colors: ['red', 'orange', 'yellow'],
          type: 'radial',
          startPoint: { x: 0.5, y: 0.5 },
          endPoint: { x: 1.0, y: 1.0 }
        }
      }
    }
  }
}, {
  description: 'Shadow Test',
  config: {
    mode: 'legacy',
    largeTitleTextAttributes: {
      fontSize: 32,
      color: 'yellow',

    },
    shadowImage: {
      type: 'IMAGE_GRADIENT',
      imageValue: {
        colors: ['rgba(255,0,0,0.5)', 'rgba(0,0,0,0)'],
        startPoint: 'top',
        endPoint: 'bottom',
      }
    }
  }
}, {
  description: 'Shadow Test #2',
  config: {
    mode: 'legacy',
    shadowImage: {
      type: 'IMAGE_GRADIENT',
      imageValue: {
        colors: ['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)'],
        startPoint: 'top',
        endPoint: 'bottom',
      }
    }
  }
}, {
  description: 'Shadow Test #3',
  config: {
    mode: 'legacy',
    shadowImage: {
      type: 'IMAGE_GRADIENT',
      imageValue: {
        colors: ['rgba(255,0,0,0.3)','rgba(0,255,0,0.2)', 'rgba(0,0,255,0.1)', 'rgba(0,0,0,0)'],
        startPoint: 'top',
        endPoint: 'bottom',
      }
    }
  }
}, {
  description: 'Shadow Test #4',
  config: {
    mode: 'legacy',
    // Note: When setting a shadow, a custom BG image must be set
    // for it to take effect...
    // * Link: https://developer.apple.com/documentation/uikit/uinavigationbar/1624963-shadowimage
    //
    // Also, it turns out weird things happen if you modify
    // the bg image w/o providing a `backgroundImage` 
    // (e.g. the size of the shadow not updating)
    backgroundImage: {
      default: {
        type: 'IMAGE_RECT',
        imageValue: {
          fillColor: 'white',
          width: 100,
          height: 100,
        }
      }
    },
    shadowImage: {
      type: 'IMAGE_RECT',
      imageValue: {
        fillColor: 'blue',
        width: 100,
        height: 1,
      }
    }
  }
}];
//#endregion
