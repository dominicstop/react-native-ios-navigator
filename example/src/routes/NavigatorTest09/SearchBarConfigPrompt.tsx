import * as React from 'react';

import { useNavigation } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardRowTextInput, CardButton } from '../../components/ui/Card';

export function SearchBarConfigPrompt(){
  const textInputRef = React.useRef<CardRowTextInput>(null);

  const navigation = useNavigation();

  return (
    <CardBody>
      <CardTitle
        title={'Set'}
        pillTitle={'prompt'}
        subtitle={`Set the SearchBarConfig.prompt text`}
      />
      <CardRowTextInput
        ref={textInputRef}
        placeholder={'Prompt Text...'}
      />
      <CardButton
        title={`Update 'prompt'`}
        subtitle={`Set the search bar's prompt text`}
        onPress={() => {
          const routeOptions = navigation.routeOptions;

          navigation.setRouteOptions({
            searchBarConfig: {
              ...routeOptions.searchBarConfig,
              prompt: textInputRef.current.getText(),
            },
          });
        }}
      />
    </CardBody>
  );
};