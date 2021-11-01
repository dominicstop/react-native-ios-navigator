import * as React from 'react';

import { useNavigation } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardRowTextInput, CardButton } from '../../components/ui/Card';

export function SearchBarConfigPlaceholder(){
  const textInputRef = React.useRef<CardRowTextInput>(null);

  const navigation = useNavigation();

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'placeholder'}
        subtitle={`Set the SearchBarConfig.placeholder text`}
      />
      <CardRowTextInput
        ref={textInputRef}
        placeholder={'Search Placeholder...'}
      />
      <CardButton
        title={`Update 'placeholder'`}
        subtitle={`Set the search bar's placeholder text`}
        onPress={() => {
          const routeOptions = navigation.routeOptions;

          navigation.setRouteOptions({
            searchBarConfig: {
              ...routeOptions.searchBarConfig,
              placeholder: textInputRef.current.getText(),
            },
          });
        }}
      />
    </CardBody>
  );
};