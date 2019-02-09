import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { AyezText } from '.';

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
      text,
      isVisible,
      opacity = 0.7
    } = this.props;
      if (!isVisible) { return null; }
      return (
        <View style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          elevation: 1000,
          backgroundColor: `rgba(255, 255, 255, ${opacity})`,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {text ? (
            <AyezText regular style={{ marginBottom: 10 }}>{text}</AyezText>
          ) : null}
          <ActivityIndicator size="small" />
        </View>
      )
  }
};

export default LoadingOverlay;
