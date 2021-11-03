import * as React from 'react';

import { useNavigation, RouteSearchControllerState } from 'react-native-ios-navigator';

import { CardBody, CardTitle, CardButton, CardRowTextInput, CardRowLabelDisplay } from '../../components/ui/Card';
import { ObjectPropertyDisplay } from '../../components/ui/ObjectPropertyDisplay';
import { SpacerLine } from '../../components/ui/Spacer';

import * as Helpers from '../../functions/Helpers';


const BOOL_VALUES: Array<boolean| undefined> = 
  [undefined, false, true];

export function CommandSetRouteSearchControllerState(){
  const navigation = useNavigation();

  const textInputRef = React.useRef<CardRowTextInput>(null);
  const selectedScopeButtonIndexInputRef = React.useRef<CardRowTextInput>(null);

  const [searchControllerState, setSearchControllerState] = 
    React.useState<Partial<RouteSearchControllerState>>(undefined);

  const [showsBookmarkButtonIndex, setShowsBookmarkButtonIndex] = React.useState(0);

  const showsBookmarkButton =
    Helpers.nextItemInCyclicArray(showsBookmarkButtonIndex, BOOL_VALUES);

  const [showsCancelButtonIndex, setShowsCancelButtonIndex] = React.useState(0);

  const showsCancelButton =
    Helpers.nextItemInCyclicArray(showsCancelButtonIndex, BOOL_VALUES);

  const [showsSearchResultsButtonIndex, setShowsSearchResultsButtonIndex] = React.useState(0);

  const showsSearchResultsButton =
    Helpers.nextItemInCyclicArray(showsSearchResultsButtonIndex, BOOL_VALUES);

  const [showsScopeBarIndex, setShowsScopeBarIndex] = React.useState(0);

  const showsScopeBar =
    Helpers.nextItemInCyclicArray(showsScopeBarIndex, BOOL_VALUES);
  
  const [
    isSearchResultsButtonSelectedIndex, 
    setIsSearchResultsButtonSelectedIndex
  ] = React.useState(0);

  const isSearchResultsButtonSelected =
    Helpers.nextItemInCyclicArray(isSearchResultsButtonSelectedIndex, BOOL_VALUES);

  const [isActiveIndex, setIsActiveIndex] = React.useState(0);

  const isActive = Helpers.nextItemInCyclicArray(isActiveIndex, BOOL_VALUES);

  return (
    <CardBody>
      <CardTitle
        pillTitle={'setRouteSearchControllerState'}
        subtitle={`Trigger NavigationObject.setRouteSearchControllerState`}
      />

      <SpacerLine/>
      
      <CardTitle
        title={'Set'}
        pillTitle={'SearchBarState.text'}
        subtitle={`Set SearchBarState.text`}
        extraMarginTop={25}
      />
      <CardRowTextInput
        ref={textInputRef}
        placeholder={'Search Text...'}
      />

      <SpacerLine/>

      <CardTitle
        title={'Set'}
        pillTitle={'showsBookmarkButton'}
        subtitle={`Set SearchBarState.showsBookmarkButton`}
        extraMarginTop={25}
      />
      <CardRowLabelDisplay
        value={
          (showsBookmarkButton == null) ? 'N/A'  : 
          (showsBookmarkButton        ) ? 'true' : 'false'
        }
      />
      <CardButton
        title={'Toggle `showsBookmarkButton`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          setShowsBookmarkButtonIndex(prevIndex =>  prevIndex + 1);
        }}
      />

      <SpacerLine/>

      <CardTitle
        title={'Set'}
        pillTitle={'showsCancelButton'}
        subtitle={`Set SearchBarState.showsCancelButton`}
        extraMarginTop={25}
      />
      <CardRowLabelDisplay
        value={
          (showsCancelButton == null) ? 'N/A'  : 
          (showsCancelButton        ) ? 'true' : 'false'
        }
      />
      <CardButton
        title={'Toggle `showsCancelButton`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          setShowsCancelButtonIndex(prevIndex =>  prevIndex + 1);
        }}
      />

      <SpacerLine/>

      <CardTitle
        title={'Set'}
        pillTitle={'showsSearchResultsButton'}
        subtitle={`Set SearchBarState.showsSearchResultsButton`}
        extraMarginTop={25}
      />
      <CardRowLabelDisplay
        value={
          (showsSearchResultsButton == null) ? 'N/A'  : 
          (showsSearchResultsButton        ) ? 'true' : 'false'
        }
      />
      <CardButton
        title={'Toggle `showsSearchResultsButton`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          setShowsSearchResultsButtonIndex(prevIndex =>  prevIndex + 1);
        }}
      />

      <SpacerLine/>

      <CardTitle
        title={'Set'}
        pillTitle={'showsScopeBar'}
        subtitle={`Set SearchBarState.showsScopeBar`}
        extraMarginTop={25}
      />
      <CardRowLabelDisplay
        value={
          (showsScopeBar == null) ? 'N/A'  : 
          (showsScopeBar        ) ? 'true' : 'false'
        }
      />
      <CardButton
        title={'Toggle `showsScopeBar`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          setShowsScopeBarIndex(prevIndex =>  prevIndex + 1);
        }}
      />

      <SpacerLine/>
      
      <CardTitle
        title={'Set'}
        pillTitle={'SearchBarState.selectedScopeButtonIndex'}
        extraMarginTop={25}
      />
      <CardRowTextInput
        ref={textInputRef}
        placeholder={'selectedScopeButtonIndex...'}
      />

      <SpacerLine/>

      <CardTitle
        title={'Set'}
        pillTitle={'isSearchResultsButtonSelected'}
        subtitle={`Set SearchBarState.isSearchResultsButtonSelected`}
        extraMarginTop={25}
      />
      <CardRowLabelDisplay
        value={
          (isSearchResultsButtonSelected == null) ? 'N/A'  : 
          (isSearchResultsButtonSelected        ) ? 'true' : 'false'
        }
      />
      <CardButton
        title={'Toggle `showsScopeBar`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          setIsSearchResultsButtonSelectedIndex(prevIndex =>  prevIndex + 1);
        }}
      />

      <SpacerLine/>

      <CardTitle
        title={'Set'}
        pillTitle={'isActive'}
        subtitle={`Set SearchControllerState.isActive`}
        extraMarginTop={25}
      />
      <CardRowLabelDisplay
        value={
          (isActive == null) ? 'N/A'  : 
          (isActive        ) ? 'true' : 'false'
        }
      />
      <CardButton
        title={'Toggle `isActive`'}
        subtitle={`Cycle to the next item`}
        onPress={() => {
          setIsActiveIndex(prevIndex =>  prevIndex + 1);
        }}
      />

      <SpacerLine/>

      <CardTitle
        pillTitle={'RouteSearchControllerState'}
        subtitle={`The config that is currently applied...`}
        extraMarginTop={25}
      />
      <ObjectPropertyDisplay
        key={`config-RouteViewConstants`}
        object={searchControllerState}
      />
      <CardButton
        title={`Invoke 'setRouteSearchControllerState'`}
        subtitle={`Apply current config...`}
        onPress={async () => {
          const nextSearchControllerState: Partial<RouteSearchControllerState> = {
            text: textInputRef.current.getText(),

            showsBookmarkButton,
            showsCancelButton,
            showsSearchResultsButton,

            showsScopeBar,
            selectedScopeButtonIndex: (() => {
              try {
                return parseInt(
                  selectedScopeButtonIndexInputRef.current.getText(), 10
                );

              } catch {
                return 0;
              };
            })(),

            isSearchResultsButtonSelected,
            isActive
          };

          await navigation.setRouteSearchControllerState(nextSearchControllerState);
          setSearchControllerState(nextSearchControllerState); 
        }}
      />
    </CardBody>
  );
};