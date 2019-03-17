import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Image,
  Animated
} from 'react-native';
import images from '../../theme/images'

class AnimatedCheckmarkOverlay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animatedCheck: new Animated.Value(0)
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.basket_quantity < this.props.basket_quantity) {

      this.state.animatedCheck.setValue(0);
      Animated.timing(
        this.state.animatedCheck, // The value to drive
        {
          toValue: 1, // Animate to final value of 1
          duration: 500,
          useNativeDriver: true
        }
      ).start();
    }
  }

  render() {
    const opacity = (this.state.animatedCheck.interpolate({
      inputRange: [ 0, 0.1, 0.9, 1],
      outputRange: [ 0, 1, 1, 0]
    }));
    const scale = (this.state.animatedCheck.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [1, 2, 1.5]
    }));
    return (
      <View
        style={{
          height: 160,
          bottom: 0,
          left: 0,
          right: 0,
          position:'absolute',
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        pointerEvents="none"
      >
        <Animated.Image
          source={images.animatedCheckmark}
          style={{
            width: 80,
            height: 80,
            transform: [{ scaleX: scale }, { scaleY: scale }],
            opacity
          }}
          resizeMode={'contain'}
        />
      </View>
    );
  }
}

const mapStateToProps = ({ Seller, Baskets }) => {
  const basket = Baskets.baskets[Seller.id] || {};
  const { basket_quantity } = basket;
  return {
    basket_quantity
  };
};

export default connect(mapStateToProps, null)(AnimatedCheckmarkOverlay);
