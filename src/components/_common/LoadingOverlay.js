import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';

class LoadingOverlay extends Component {

  // componentDidUpdate(prevProps) {
  //   if (this.props.success && !prevProps.success) {
  //     // enter animation
  //     Animated.timing(
  //       this.state.animationTrack,
  //       {
  //         toValue: 1,
  //         duration: 200,
  //         useNativeDriver: true
  //       }
  //     ).start(() => {
  //       this.props.onComplete()
  //     });
  //   }
  // }

  render() {
    const {
      isVisible,
      opacity = 0.6
    } = this.props;
      if (!isVisible) { return null; }
      return (
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: `rgba(255, 255, 255, ${opacity})`
        }}>
          <ActivityIndicator size="small" style={{ flex: 1 }} />
        </View>
      )
  }
};

export default LoadingOverlay;
