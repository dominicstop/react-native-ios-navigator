import { Platform } from 'react-native';
import type { NavBarAppearanceCombinedConfig } from '../types/NavBarAppearanceConfig';

export const iOSVersion = parseInt(Platform.Version as string, 10);

type PresetKeys = 'hidden';

export const NavBarAppearancePresets: { [k in PresetKeys]: NavBarAppearanceCombinedConfig } = {
  hidden: ((iOSVersion >= 13)? {
    mode: 'appearance',
    standardAppearance: {
      baseConfig: 'transparentBackground',
      titleTextAttributes: {
        opacity: 0,
      },
    },
    scrollEdgeAppearance: {
      baseConfig: 'transparentBackground',
      titleTextAttributes: {
        opacity: 0,
      },
    },
  } : {
    mode: 'legacy',
    navBarPreset: 'clearBackground',
    titleTextAttributes: { 
      opacity: 0,
    },
  })
};

