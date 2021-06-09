import { Platform } from 'react-native';
import type { NavBarAppearanceCombinedConfig } from 'react-native-ios-navigator';


export const iOSVersion = parseInt(Platform.Version as string, 10);


export const navBarAppearanceConfigHidden: NavBarAppearanceCombinedConfig = ((iOSVersion >= 13)? {
  mode: 'appearance',
  standardAppearance: {
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
});