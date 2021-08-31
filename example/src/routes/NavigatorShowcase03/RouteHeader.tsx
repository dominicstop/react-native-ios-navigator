
import * as React from 'react';
import { StyleSheet, Animated, Easing, Dimensions } from 'react-native';

import { RouteHeaderView } from 'react-native-ios-navigator';

import { RouteHeaderTabs } from './RouteHeaderTabs';
import { ItemTypesMenu, onChangeSelectedItemTypeIndex } from './ItemTypesMenu';
import { UI_CONSTANTS } from './Constants';


type RouteHeaderProps = {
  onChangeSelectedItemTypeIndex: onChangeSelectedItemTypeIndex;
  selectedItemTypeIndex: number | null;
  isMenuExpanded: boolean;
};

const windowHeight = Dimensions.get('window').height;

const RANGE = {
  start: 0,
  end  : 100,
};

export class RouteHeader extends React.Component<RouteHeaderProps> {

  menuProgress: Animated.Value;

  expandedMenuContainerHeight: Animated.AnimatedInterpolation;
  expandedMenuContainerOpacity: Animated.AnimatedInterpolation;
  expandedMenuShadowOverlayOpacity: Animated.AnimatedInterpolation;

  constructor(props){
    super(props);

    const menuProgress = new Animated.Value(0);
    this.menuProgress = menuProgress;

    this.expandedMenuContainerHeight = menuProgress.interpolate({
      inputRange: [RANGE.start, RANGE.end],
      outputRange: [0, UI_CONSTANTS.menuExpandedHeight],
      easing: Easing.ease,
    });

    this.expandedMenuContainerOpacity = menuProgress.interpolate({
      inputRange: [RANGE.start, (RANGE.end / 2)],
      outputRange: [0, 1],
      easing: Easing.ease,
    });

    this.expandedMenuShadowOverlayOpacity = menuProgress.interpolate({
      inputRange: [RANGE.start, RANGE.end],
      outputRange: [0, 1],
      easing: Easing.ease,
    });
  };

  setMenuVisibility = async (isExpanded: boolean) => {
    const animation = Animated.timing(this.menuProgress, {
      toValue: isExpanded? RANGE.end : RANGE.start,
      duration: 300,
      useNativeDriver: false,
    });

    this.setState({isMenuExpanded: isExpanded});

    return new Promise((resolve) => {
      animation.start(resolve);
    });
  };

  render(){
    const props = this.props;

    const menuExpandedContainerStyle = {
      height: this.expandedMenuContainerHeight,
      opacity: this.expandedMenuContainerOpacity,
    };

    const shadowOverlayStyle = {
      opacity: this.expandedMenuShadowOverlayOpacity,
    };

    return (
      <RouteHeaderView
        style={styles.routeHeaderView}
        headerTopPadding={{
          preset: 'navigationBarWithStatusBar',
          offset: 0,
        }}
        config={{
          headerMode: 'fixed',
          headerHeight: {
            preset: 'navigationBarWithStatusBar',
            offset: 30,
          },
        }}
      >
        <Animated.View style={styles.rootContentContainer}>
          <Animated.View
            style={[styles.shadowOverlay, shadowOverlayStyle]}
            pointerEvents={props.isMenuExpanded? 'box-only' : 'none'}
          />
          <RouteHeaderTabs
            onChangeSelectedItemTypeIndex={props.onChangeSelectedItemTypeIndex}
            selectedItemTypeIndex={props.selectedItemTypeIndex}
          />
          <Animated.View style={[styles.menuExpandedContainer, menuExpandedContainerStyle]}>
            <ItemTypesMenu
              onChangeSelectedItemTypeIndex={props.onChangeSelectedItemTypeIndex}
              selectedItemTypeIndex={props.selectedItemTypeIndex}
            />
          </Animated.View>
        </Animated.View>
      </RouteHeaderView>
    );
  };
};

const styles = StyleSheet.create({
  routeHeaderView: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(200,200,200)',
  },
  rootContentContainer: {
    flex: 1,
  },

  menuExpandedContainer: {
    position: 'absolute',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'white',
    borderBottomColor: 'rgb(200,200,200)',
    borderBottomWidth: 1,
  },

  shadowOverlay: {
    position: 'absolute',
    width: '100%',
    top: '100%',
    height: windowHeight,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
});