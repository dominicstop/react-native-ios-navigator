import * as React from 'react';

import { StyleSheet, View, SafeAreaView, Text, Image, Animated, StyleProp, ViewStyle } from 'react-native';
import { RouteHeaderView, NavigatorViewConstants, NavigatorUIConstantsContext, RouteViewEvents } from 'react-native-ios-navigator';

import { ImageAssets } from '../../functions/ImageCache';

import * as Colors  from '../../constants/Colors';

const { navigationBarHeight } = NavigatorViewConstants;


type RouteHeaderProps = {
  scrollY: Animated.Value;
};

type RouteHeaderState = {
  mountHeaderBGImage: boolean;
};

const ROUTE_HEADER_HEIGHT_MAX = 300;

function NavigationBarContainer(props: {
  children?: React.ReactNode;
  backgroundStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}){
  const { statusBarHeight } = React.useContext(NavigatorUIConstantsContext);

  const contentContainerStyle: ViewStyle = {
    paddingTop: statusBarHeight,
  };

  return (
    <SafeAreaView 
      style={styles.routeHeaderCollapsedContainer}
      pointerEvents={'none'}
    >
      <Animated.View style={[styles.routeHeaderCollapsedBG, props.backgroundStyle]}/>
      <View style={[styles.routeHeaderCollapsedContentContainer, contentContainerStyle]}>
        {props.children}
      </View>
    </SafeAreaView>
  );
};

const ScrollOffsets = (() => {
  const start = ROUTE_HEADER_HEIGHT_MAX;
  const end   = (navigationBarHeight + 20);

  const adj = start - end;
  
  return ({
    '0%'  : -start, 
    '25%' : -(start - (adj * 0.25)),
    '50%' : -(start - (adj * 0.50)),
    '75%' : -(start - (adj * 0.75)),
    '100%': -end, 
  });
})();

export class RouteHeader extends React.Component<RouteHeaderProps, RouteHeaderState> {
  static contextType = NavigatorUIConstantsContext;

  headerBGOpacity        : Animated.AnimatedInterpolation;
  headerLargeTitleOpacity: Animated.AnimatedInterpolation;

  headerCollapsedBGOpacity      : Animated.AnimatedInterpolation;
  headerCollapsedTitleOpacity   : Animated.AnimatedInterpolation;
  headerCollapsedTitleTranslateY: Animated.AnimatedInterpolation;

  constructor(props: RouteHeaderProps){
    super(props);

    const scrollY = props.scrollY;

    this.headerLargeTitleOpacity = scrollY.interpolate({
      inputRange: [ScrollOffsets['0%'], ScrollOffsets['50%']],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    this.headerBGOpacity = scrollY.interpolate({
      inputRange: [ScrollOffsets['50%'], ScrollOffsets['100%']],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    this.headerCollapsedBGOpacity = scrollY.interpolate({
      inputRange: [ScrollOffsets['50%'], ScrollOffsets['100%']],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    this.headerCollapsedTitleOpacity = scrollY.interpolate({
      inputRange: [ScrollOffsets['25%'], ScrollOffsets['75%']],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    this.headerCollapsedTitleTranslateY = scrollY.interpolate({
      inputRange: [ScrollOffsets['25%'], ScrollOffsets['75%']],
      outputRange: [40, 0],
      extrapolate: 'clamp',
    });

    this.state = {
      mountHeaderBGImage: false,
    };
  };

  _renderHeaderCollapsed(){
    const state = this.state;

    return(
      <React.Fragment>
        <Animated.View
          pointerEvents={'none'}
          style={[
            styles.routeHeaderExpandedBGImageContainer,
            { opacity: this.headerBGOpacity }
          ]}
        >
          {state.mountHeaderBGImage && (
            <Image
              style={styles.routeHeaderExpandedBGImage}
              source={ImageAssets.BGCoverCoffee}
              resizeMode={'cover'}
            />
          )}
        </Animated.View>
        <NavigationBarContainer backgroundStyle={{ opacity: this.headerCollapsedBGOpacity }}>
          <Animated.Text style={[styles.routeHeaderCollapsedTitle, {
            opacity: this.headerCollapsedTitleOpacity,
            transform: [{ 
              translateY: this.headerCollapsedTitleTranslateY 
            },
          ]}]}>
            {'Coffee Tunes'}
          </Animated.Text>
        </NavigationBarContainer>
      </React.Fragment>
    );
  };

  _renderHeaderExpanded(){
    return(
      <View
        style={styles.routeHeaderExpandedContainer}
        pointerEvents={'box-none'}
      >
        <Animated.Text style={[
          styles.routeHeaderExpandedLargeTitleText, 
          { opacity: this.headerLargeTitleOpacity }
        ]}>
          {'Coffee Tunes'}
        </Animated.Text>
        <View style={styles.routeHeaderPlayButtonContainer}>
          <Text style={styles.routeHeaderPlayButtonText}>
            {'▶'}
          </Text>
        </View>
      </View>
    );
  };

  render(){
    return (
      <React.Fragment>
        <RouteViewEvents
          onRouteWillPush={() => {
            this.setState({
              mountHeaderBGImage: true
            });
          }}
        />
        <RouteHeaderView
          style={styles.routeHeader}
          headerTopPadding={'statusBar'}
          config={{
            headerMode: 'resize',
            headerHeightMax: ROUTE_HEADER_HEIGHT_MAX,
            headerHeightMin: 'navigationBarWithStatusBar',
          }}
        >
          {this._renderHeaderCollapsed()}
          {this._renderHeaderExpanded()}
        </RouteHeaderView>
      </React.Fragment>
    );
  };
};

const styles = StyleSheet.create({
  routeHeader: {
  },
  routeHeaderExpandedContainer: {
    flex: 1,
  },

  routeHeaderPlayButtonContainer: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50/2,
    position: 'absolute',
    right: 0,
    bottom: -(50/2),
    backgroundColor: Colors.GREEN.A700,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  routeHeaderPlayButtonText: {
    color: 'white',
    fontSize: 26,
    marginLeft: 4,
  },
  routeHeaderExpandedBGImageContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  routeHeaderExpandedBGImage: {
    width: '100%',
    height: '100%',
  },
  routeHeaderExpandedLargeTitleText: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    margin: 10,
    fontSize: 42,
    color: 'white',
    fontWeight: '900',
  },
  
  routeHeaderCollapsedContainer: {
    position: 'absolute',
    overflow: 'visible',
    top: 0,
    left: 0,
    right: 0,
  },
  routeHeaderCollapsedBG: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.ORANGE[900],
    // shadow
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.75,
    shadowRadius: 12,
    shadowColor: "black",
  },
  routeHeaderCollapsedContentContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeHeaderCollapsedTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
  },
});