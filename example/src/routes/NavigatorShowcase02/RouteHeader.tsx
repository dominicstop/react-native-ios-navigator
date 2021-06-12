import * as React from 'react';

import { StyleSheet, View, SafeAreaView, Text, Image, Animated, StyleProp, ViewStyle } from 'react-native';
import { RouteHeaderView, NavigatorUIConstantsContext } from 'react-native-ios-navigator';

import { SCROLL_OFFSETS, UI_CONSTANTS, ASSETS } from './Constants';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

type RouteHeaderProps = {
  scrollY: Animated.Value;
};

function HeaderCollapsedContainer(props: {
  children?: React.ReactNode;
  backgroundStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  contentContainerStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
}){
  const { statusBarHeight } = React.useContext(NavigatorUIConstantsContext);

  const contentContainerStyle: ViewStyle = {
    paddingTop: statusBarHeight,
  };

  return (
    <SafeAreaView 
      style={styles.headerCollapsedSafeArea}
      pointerEvents={'none'}
    >
      <Animated.View style={[styles.headerCollapsedBG, props.backgroundStyle]}/>
      <Animated.View style={[
        styles.headerCollapsedContentContainer, 
        contentContainerStyle, 
        props.contentContainerStyle
      ]}>
        {props.children}
      </Animated.View>
    </SafeAreaView>
  );
};

export class RouteHeader extends React.Component<RouteHeaderProps> {
  static contextType = NavigatorUIConstantsContext;

  context!: React.ContextType<typeof NavigatorUIConstantsContext>;

  headerBGBlurredOpacity: Animated.AnimatedInterpolation;

  headerCollapsedBG: Animated.AnimatedInterpolation;
  headerCollapsedContainerTranslateY: Animated.AnimatedInterpolation;
  
  headerProfileSafeAreaScale: Animated.AnimatedInterpolation;
  headerProfileSafeAreaZIndex: Animated.AnimatedInterpolation;
  headerProfileSafeAreaTranslateY: Animated.AnimatedInterpolation;

  constructor(props: RouteHeaderProps){
    super(props);

    const scrollY = props.scrollY;

    const profileTitleOffset = 
      (SCROLL_OFFSETS['100%'] + UI_CONSTANTS.listHeaderTopPadding + 30);

    this.headerBGBlurredOpacity = scrollY.interpolate({
      inputRange: [SCROLL_OFFSETS['-50%'], SCROLL_OFFSETS['0%'], SCROLL_OFFSETS['100%'], profileTitleOffset],
      outputRange: [1, 0, 0, 1],
      extrapolate: 'clamp',
    });

    this.headerCollapsedBG = scrollY.interpolate({
      inputRange: [SCROLL_OFFSETS['100%'], profileTitleOffset],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    this.headerCollapsedContainerTranslateY = scrollY.interpolate({
      inputRange: [SCROLL_OFFSETS['100%'], profileTitleOffset],
      outputRange: [100, 0],
      extrapolate: 'clamp',
    });

    this.headerProfileSafeAreaTranslateY = scrollY.interpolate({
      inputRange: [SCROLL_OFFSETS['0%'], SCROLL_OFFSETS['25%'], SCROLL_OFFSETS['150%']],
      outputRange: [
        0, 
        (UI_CONSTANTS.routeHeaderHeight / 7),
        -(UI_CONSTANTS.routeHeaderHeight / 5.5),
      ],
      extrapolate: 'clamp',
    });

    this.headerProfileSafeAreaScale = scrollY.interpolate({
      inputRange: [SCROLL_OFFSETS['0%'], SCROLL_OFFSETS['25%']],
      outputRange: [1, 0.65],
      extrapolate: 'clamp',
    });

    // profile above header -> profile behind header
    this.headerProfileSafeAreaZIndex = scrollY.interpolate({
      inputRange: [SCROLL_OFFSETS['24%'], SCROLL_OFFSETS['25%']],
      outputRange: [30, 10],
      extrapolate: 'clamp',
    });
  };

  _renderHeaderBG(){
    return(
      <View
        pointerEvents={'none'}
        style={styles.headerExpandedBGImageContainer}
      >
        <Animated.Image
          style={styles.headerExpandedBGImage}
          source={ASSETS.headerBG}
          resizeMode={'cover'}
        />
        <Animated.Image
          style={[styles.headerExpandedBGImage, {
            opacity: this.headerBGBlurredOpacity
          }]}
          source={ASSETS.headerBG}
          resizeMode={'cover'}
          blurRadius={15}
        />
      </View>
    );
  };

  _renderProfile(){
    return(
      <AnimatedSafeAreaView style={[styles.headerProfileSafeArea, {
        zIndex: this.headerProfileSafeAreaZIndex,
        transform: [{
          translateY: this.headerProfileSafeAreaTranslateY
        }]
      }]}>
        <Animated.View style={[styles.headerProfileContainer, {
          transform: [{ 
            scale: this.headerProfileSafeAreaScale 
          }]
        }]}>
          <Image
            style={styles.headerProfileImage}
            source={ASSETS.headerProfile}
          />
        </Animated.View>
      </AnimatedSafeAreaView>
    );
  };

  _renderCollapsedContent(){
    return(
      <HeaderCollapsedContainer
        backgroundStyle={{
          opacity: this.headerCollapsedBG
        }}
        contentContainerStyle={{
          transform: [{
            translateY: this.headerCollapsedContainerTranslateY
          }]
        }}
      >
        <Text style={styles.headerCollapsedNameText}>
          {'Dominic Go'}
        </Text>
        <Text style={styles.headerCollapsedCountText}>
          {'250 Posts'}
        </Text>
      </HeaderCollapsedContainer>
    );
  };

  render(){
    return (
      <RouteHeaderView
        style={styles.routeHeader}
        headerTopPadding={'statusBar'}
        config={{
          headerMode: 'resize',
          headerHeightMax: UI_CONSTANTS.routeHeaderHeight,
          headerHeightMin: 'navigationBarWithStatusBar',
        }}
      >
        {this._renderHeaderBG()}
        {this._renderProfile()}
        {this._renderCollapsedContent()}
      </RouteHeaderView>
    );
  };
};

const styles = StyleSheet.create({
  routeHeader: {
  },

  headerProfileSafeArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
    zIndex: 30,
  },
  headerProfileContainer: {
    width: UI_CONSTANTS.profileSize,
    aspectRatio: 1,
    borderRadius: (UI_CONSTANTS.profileSize/2),
    marginBottom: -(UI_CONSTANTS.profileSize/2),
    backgroundColor: 'white',
    marginLeft: 12,
    overflow: 'hidden',
    borderColor: 'black',
    borderWidth: 4,
  },
  headerProfileImage: {
    width: '100%',
    height: '100%',
  },

  headerExpandedBGImageContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  headerExpandedBGImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  headerCollapsedSafeArea: {
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 40,
  },
  headerCollapsedBG: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  headerCollapsedContentContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCollapsedNameText: {
    fontWeight: '700',
    color: 'white',
  },
  headerCollapsedCountText: {
    color: 'white',
  },
});