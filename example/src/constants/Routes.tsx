import * as React from 'react';

import type { NavRoutesConfigMap } from 'react-native-ios-navigator';

import { HomeRoute } from '../routes/HomeRoute';

import { NavigatorShowcase01 } from '../routes/NavigatorShowcase01';
import { NavigatorShowcase02 } from '../routes/NavigatorShowcase02';

import { NavigatorExample01 } from '../routes/NavigatorExample01';

import { NavigatorTest01 } from '../routes/NavigatorTest01';
import { NavigatorTest02 } from '../routes/NavigatorTest02';
import { NavigatorTest03 } from '../routes/NavigatorTest03';
import { NavigatorTest04 } from '../routes/NavigatorTest04';
import { NavigatorTest05 } from '../routes/NavigatorTest05';
import { NavigatorTest06 } from '../routes/NavigatorTest06';
import { NavigatorTest07 } from '../routes/NavigatorTest07';

import { NavigatorDemo01 } from '../routes/NavigatorDemo01';
import { NavigatorDemo02 } from '../routes/NavigatorDemo02';

import { RouteViewPortalExample01 } from '../routes/RouteViewPortalExample01';

import { NavigatorTest08 } from '../routes/NavigatorTest08';

import * as Colors  from '../constants/Colors';
import * as Helpers from '../functions/Helpers';


export const RouteKeys = {
  Home: 'Home',
  NavigatorExample01: 'NavigatorExample01',

  NavigatorTest01: 'NavigatorTest01',
  NavigatorTest02: 'NavigatorTest02',
  NavigatorTest03: 'NavigatorTest03',
  NavigatorTest04: 'NavigatorTest04',
  NavigatorTest05: 'NavigatorTest05',
  NavigatorTest06: 'NavigatorTest06',
  NavigatorTest07: 'NavigatorTest07',
  NavigatorTest08: 'NavigatorTest08',

  NavigatorDemo01: 'NavigatorDemo01',
  NavigatorDemo02: 'NavigatorDemo02',

  NavigatorShowcase01: 'NavigatorShowcase01',
  NavigatorShowcase02: 'NavigatorShowcase02',

  RouteViewPortalExample01: 'RouteViewPortalExample01',
};

export const ROUTES: NavRoutesConfigMap = {
  [RouteKeys.Home]: {
    routeOptionsDefault: {
      routeTitle: "Home",
      searchBarConfig: {
        placeholder: "Search Routes",
        returnKeyType: 'done',
        obscuresBackgroundDuringPresentation: false,
        hidesSearchBarWhenScrolling: true,
        textColor: {
          dynamic: {
            light: Colors.PURPLE.A700,
            dark : Colors.PURPLE[100],
          }
        },
        tintColor: {
          dynamic: {
            light: Colors.PURPLE.A700,
            dark : Colors.PURPLE[100],
          }
        },
        leftIconTintColor: {
          dynamic: {
            light: Colors.PURPLE.A700,
            dark : Colors.PURPLE[100],
          }
        },
        placeholderTextColor: Colors.PURPLE[300],
        searchTextFieldBackgroundColor: Helpers.hexToRGBA(Colors.PURPLE.A100, 0.1),
      },
    },
    renderRoute: () => (
      <HomeRoute/>
    ),
  }, 
  [RouteKeys.NavigatorShowcase01]:{
    routeOptionsDefault: {
      statusBarStyle: 'lightContent',
    },
    renderRoute: () => (
      <NavigatorShowcase01/>
    ),
  }, 
  [RouteKeys.NavigatorShowcase02]: {
    routeOptionsDefault: {
      statusBarStyle: 'lightContent',
    },
    renderRoute: () => (
      <NavigatorShowcase02/>
    ),
  }, 
  [RouteKeys.NavigatorExample01]: {
    renderRoute: () => (
      <NavigatorExample01/>
    ),
  },
  [RouteKeys.NavigatorTest01]: {
    renderRoute: () => (
      <NavigatorTest01/>
    ),
  }, 
  [RouteKeys.NavigatorTest02]: {
    renderRoute: () => (
      <NavigatorTest02/>
    ),
  }, 
  [RouteKeys.NavigatorTest03]: {
    renderRoute: () => (
      <NavigatorTest03/>
    ),
  }, 
  [RouteKeys.NavigatorTest04]: {
    renderRoute: () => (
      <NavigatorTest04/>
    ),
  },
  [RouteKeys.NavigatorTest05]: {
    renderRoute: () => (
      <NavigatorTest05/>
    ),
  },
  [RouteKeys.NavigatorTest06]: {
    renderRoute: () => (
      <NavigatorTest06/>
    ),
  },
  [RouteKeys.NavigatorTest07]: {
    renderRoute: () => (
      <NavigatorTest07/>
    ),
  },
  [RouteKeys.NavigatorTest08]: {
    routeOptionsDefault: {
      largeTitleDisplayMode: 'never',
    },
    renderRoute: () => (
      <NavigatorTest08/>
    ),
  },
  [RouteKeys.NavigatorDemo01]: {
    routeOptionsDefault: {
      largeTitleDisplayMode: 'never',
    },
    renderRoute: () => (
      <NavigatorDemo01/>
    ),
  }, 
  [RouteKeys.NavigatorDemo02]: {
    routeOptionsDefault: {
      largeTitleDisplayMode: 'never',
    },
    renderRoute: () => (
      <NavigatorDemo02
        triggerPop={null}
      />
    ),
  },
  [RouteKeys.RouteViewPortalExample01]: {
    renderRoute: () => (
      <RouteViewPortalExample01/>
    ),
  }
};