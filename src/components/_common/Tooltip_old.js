import React, { PureComponent } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import images from '../../theme/images'

class Tooltip extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      tooltipTrack: new Animated.Value(0)
    };
  }

  // // loop the number times specified
  // Animated.loop(
  //   Animated.timing(this.state.tooltipTrack, {
  //     toValue: 200,
  //     duration: 2000,
  //     easing: Easing.linear(),
  //     useNativeDriver: true, // <-- Add this
  //   }),
  //   { iterations: duration }
  // ).start(() => {
  //     // close the tooltip
  //     Animated.timing(this.state.tooltipTrack, {
  //       toValue: 0,
  //       duration: 350,
  //       easing: Easing.elastic(1),
  //       useNativeDriver: true, // <-- Add this
  //     }).start();

  componentDidUpdate(prevProps) {
    const {
      isVisible, // whether or not the modal should be visible
      duration = 3000, // number of milliseconds seen
    } = this.props;

  if (isVisible && !prevProps.isVisible) {
    // enter animation
    const enterAnimation = Animated.timing(this.state.tooltipTrack, {
      toValue: 100,
      duration: 200,
      easing: Easing.elastic(1),
      useNativeDriver: true, // <-- Add this
    })
    // // exit animation
    const exitAnimation = Animated.timing(this.state.tooltipTrack, {
      toValue: 0,
      duration: 200,
      easing: Easing.elastic(1),
      useNativeDriver: true, // <-- Add this
    })
    Animated.stagger(duration, [enterAnimation, exitAnimation]).start();
  }
}

  render() {
    const {
      title,
      textColor = 'white',
      backgroundColor = '#F05C64',
      offsetRight = 20,
      offsetLeft = null,
      style,
      isVisible
    } = this.props;

    const tooltipScale = (this.state.tooltipTrack.interpolate({
        inputRange: [ 0, 100 ],
        outputRange: [ 0.6, 1]
      }));
    const tooltipOpacity = (this.state.tooltipTrack.interpolate({
        inputRange: [ 0, 100 ],
        outputRange: [ 0, 1 ]
      }));

    let arrowPosition = { right: offsetRight };
    if (offsetLeft) { arrowPosition = { left: offsetLeft }; }


    return (
      <Animated.View style={[
        {
        position: 'absolute',
        top: 8,
        alignItems: 'flex-end',
        opacity: isVisible ? tooltipOpacity : 0,
        transform: [ { scale: tooltipScale } ]
      }, style
      ]}
      pointerEvents="none"
      >

        <Image
          source={images.tooltipTriangle}
          style={[{
              position: 'absolute',
              width: 28,
              height: 14,
              tintColor: backgroundColor
            },
            arrowPosition
          ]}
          resizeMode={'stretch'}
        />
        <View style={
          {
          marginTop: 12,
          borderRadius: 10,
          backgroundColor,
          maxWidth: 200,
        }
        }>
          <Text style={{
            color: textColor,
            backgroundColor: 'transparent',
            fontFamily: 'BahijJanna',
            fontSize: 18,
            padding: 6,
            paddingRight: 10,
            paddingLeft: 10
          }}>{title}</Text>
        </View>
      </Animated.View>
    );

  }
}

export default connect(null, null )(Tooltip);
