import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { RouteViewPortal, RouteContentProps } from 'react-native-ios-navigator';

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


export function NavigatorTest09(props: RouteContentProps){
  const navigation = props.navigation;

  return(
    <ScrollView contentContainerStyle={styles.listContentContainer}>
      <RouteViewPortal
        routeOptions={{
          searchBarConfig: {
            placeholder: 'search'
          },
        }}
      />
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContentContainer: {
    paddingBottom: 50,
  },
});