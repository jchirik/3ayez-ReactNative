import * as React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import StoreHeader from './StoreHeader';
import colors from '../../../theme/colors';

export const PARALLAX_HEADER_HEIGHT = 193;
const noop = () => {};
// credits to https://github.com/iyegoroff/react-native-collapsible-header-views
export class CollapsibleHeaderScrollView extends React.Component {
  constructor(props) {
    super(props);
    this.scrollAnim = new Animated.Value(0);
    this.offsetAnim = new Animated.Value(0);
    this.scrollValue = 0;
    this.offsetValue = 0;
    this.clampedScrollValue = 0;
    this.scrollEndTimer = 0;
    this.onScrollEndDrag = event => {
      const { onScrollEndDrag = noop, disableHeaderSnap } = this.props;
      if (!disableHeaderSnap) {
        this.scrollEndTimer = setTimeout(this.onMomentumScrollEnd, 250);
      }
      onScrollEndDrag(event);
    };
    this.onMomentumScrollBegin = event => {
      const { onMomentumScrollBegin = noop, disableHeaderSnap } = this.props;
      if (!disableHeaderSnap) {
        clearTimeout(this.scrollEndTimer);
      }
      onMomentumScrollBegin(event);
    };
    this.onMomentumScrollEnd = event => {
      const {
        statusBarHeight,
        onMomentumScrollEnd = noop,
        headerHeight,
        disableHeaderSnap
      } = this.props;
      if (!disableHeaderSnap) {
        this.moveHeader(
          this.scrollValue > headerHeight &&
            this.clampedScrollValue > (headerHeight - statusBarHeight) / 2
            ? this.offsetValue + headerHeight
            : this.offsetValue - headerHeight
        );
      }
      onMomentumScrollEnd(event);
    };
    this.interpolatedHeaderTranslation = (from, to) => {
      const { headerHeight, statusBarHeight } = this.props;
      return this.clampedScroll.interpolate({
        inputRange: [0, headerHeight - statusBarHeight],
        outputRange: [from, to],
        extrapolate: 'clamp'
      });
    };
    const { headerHeight, statusBarHeight } = props;
    this.initAnimations(headerHeight, statusBarHeight);
  }
  initAnimations(headerHeight, statusBarHeight) {
    this.scrollAnim.addListener(({ value }) => {
      const diff = value - this.scrollValue;
      this.scrollValue = value;
      this.clampedScrollValue = Math.min(
        Math.max(this.clampedScrollValue + diff, 0),
        headerHeight - statusBarHeight
      );
    });
    this.offsetAnim.addListener(({ value }) => {
      this.offsetValue = value;
    });
    this.clampedScroll = Animated.diffClamp(
      Animated.add(
        this.scrollAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolateLeft: 'clamp'
        }),
        this.offsetAnim
      ),
      0,
      headerHeight - statusBarHeight
    );
    this.headerTranslation = this.clampedScroll.interpolate({
      inputRange: [0, headerHeight - statusBarHeight],
      outputRange: [0, -(headerHeight - statusBarHeight)],
      extrapolate: 'clamp'
    });
    this.currentHeaderHeight = headerHeight;
    this.currentStatusBarHeight = statusBarHeight;
  }
  cleanupAnimations() {
    this.scrollAnim.removeAllListeners();
    this.offsetAnim.removeAllListeners();
    clearTimeout(this.scrollEndTimer);
    if (this.headerSnap) {
      this.headerSnap.stop();
    }
  }
  resetAnimations(headerHeight, statusBarHeight) {
    if (
      this.currentHeaderHeight !== headerHeight ||
      this.currentStatusBarHeight !== statusBarHeight
    ) {
      this.cleanupAnimations();
      this.initAnimations(headerHeight, statusBarHeight);
    }
  }
  componentWillUnmount() {
    this.cleanupAnimations();
  }
  render() {
    const {
      statusBarHeight,
      tabBarHeight,
      contentContainerStyle,
      headerHeight,
      onScroll,
      displayName,
      logo_url,
      location_text,
      cover_url,
      color,
      Tabs
    } = this.props;
    this.resetAnimations(headerHeight, statusBarHeight);
    const styles = style;
    return (
      <View style={styles.fill}>
        <Animated.ScrollView
          bounces={false}
          overScrollMode={'never'}
          scrollEventThrottle={1}
          {...this.props}
          contentContainerStyle={[contentContainerStyle, {
            paddingTop: PARALLAX_HEADER_HEIGHT + tabBarHeight
          }]}
          onMomentumScrollBegin={this.onMomentumScrollBegin}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          onScrollEndDrag={this.onScrollEndDrag}
          onScroll={event => {
            const { y } = event.nativeEvent.contentOffset;
            const diff = y - this.scrollValue;
            if (diff >= 0 && y >= headerHeight - statusBarHeight) {
              this.scrollAnim.setValue(headerHeight - statusBarHeight);
              return;
            }
            Animated.event(
              [{ nativeEvent: { contentOffset: { y: this.scrollAnim } } }],
              { listener: onScroll }
            )(event);
          }}
        />
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ translateY: this.headerTranslation }],
              height: PARALLAX_HEADER_HEIGHT + tabBarHeight
            }
          ]}
        >
          <StoreHeader
            interpolatedHeaderTranslation={this.interpolatedHeaderTranslation}
            displayName={displayName}
            logo_url={logo_url}
            location_text={location_text}
            cover_url={cover_url}
            color={color}
          >
            {Tabs}
          </StoreHeader>
        </Animated.View>
      </View>
    );
  }
  static isAnimationConfig(options) {
    return options && options.animated !== undefined;
  }
  moveHeader(toValue, animated = true) {
    if (this.headerSnap) {
      this.headerSnap.stop();
    }
    if (animated) {
      this.headerSnap = Animated.timing(this.offsetAnim, {
        toValue,
        duration: this.props.headerAnimationDuration
      });
      this.headerSnap.start();
    } else {
      this.offsetAnim.setValue(toValue);
    }
  }
}
CollapsibleHeaderScrollView.defaultProps = {
  statusBarHeight: 0,
  disableHeaderMomentum: false,
  headerMomentumDuration: 350,
  headerContainerBackgroundColor: 'white'
};

const style = StyleSheet.create({
  fill: {
    flex: 1
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0
  }
});
