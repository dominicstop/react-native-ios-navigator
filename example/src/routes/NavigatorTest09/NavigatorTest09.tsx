import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { SearchBarConfigBarTintColor } from './SearchBarConfigBarTintColor';
import { SearchBarConfigPlaceholder } from './SearchBarConfigPlaceholder';
import { SearchBarConfigBarStyle } from './SearchBarConfigBarStyle';
import { SearchBarConfigTintColor } from './SearchBarConfigTintColor';
import { SearchBarConfigIsTranslucent } from './SearchBarConfigIsTranslucent';
import { SearchBarConfigTextColor } from './SearchBarConfigTextColor';
import { SearchBarConfigReturnKeyType } from './SearchBarConfigReturnKeyType';
import { SearchBarConfigSearchTextFieldBackgroundColor } from './SearchBarConfigSearchTextFieldBackgroundColor';

import { SearchControllerConfigHidesSearchBarWhenScrolling } from './SearchControllerConfigHidesSearchBarWhenScrolling';
import { SearchControllerConfigObscuresBackgroundDuringPresentation } from './SearchControllerConfigObscuresBackgroundDuringPresentation';
import { SearchControllerConfigHidesNavigationBarDuringPresentation } from './SearchControllerConfigHidesNavigationBarDuringPresentation';
import { SearchControllerConfigAutomaticallyShowsCancelButton } from './SearchControllerConfigAutomaticallyShowsCancelButton';

import { CustomSearchBarConfigLeftIconTintColor } from './CustomSearchBarConfigLeftIconTintColor';
import { CustomSearchBarConfigPlaceholderTextColor } from './CustomSearchBarConfigPlaceholderTextColor';
import { CommandGetRouteSearchControllerState } from './CommandGetRouteSearchControllerState';


export function NavigatorTest09(){
  return(
    <ScrollView contentContainerStyle={styles.listContentContainer}>
      <SearchBarConfigPlaceholder/>
      <SearchBarConfigBarTintColor/>
      <SearchBarConfigBarStyle/>
      <SearchBarConfigTintColor/>
      <SearchBarConfigIsTranslucent/>
      <SearchBarConfigTextColor/>
      <SearchBarConfigReturnKeyType/>
      <SearchBarConfigSearchTextFieldBackgroundColor/>

      <SearchControllerConfigHidesSearchBarWhenScrolling/>
      <SearchControllerConfigObscuresBackgroundDuringPresentation/>
      <SearchControllerConfigHidesNavigationBarDuringPresentation/>
      <SearchControllerConfigAutomaticallyShowsCancelButton/>

      <CustomSearchBarConfigLeftIconTintColor/>
      <CustomSearchBarConfigPlaceholderTextColor/>

      <CommandGetRouteSearchControllerState/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    paddingBottom: 50,
  },
});