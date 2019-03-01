import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

import images from '../../theme/images'

import { AyezText } from '.';

export default class Incrementer extends PureComponent {
  render() {
    const {
      fullscreen,
      style,
      quantityText,
      maxReached,
      color,
      onIncrement,
      onDecrement
    } = this.props;

    const buttonDimension = fullscreen ? 12 : 6;
    return (
      <View
        style={{
          ...styles.mainContainer,
          padding: fullscreen ? 7 : 0,
          ...style
        }}
      >
        <TouchableOpacity style={styles.iconContainer} onPress={onDecrement}>
          <Image
            source={images.minusIcon}
            style={{
              tintColor: color,
              width: buttonDimension,
              height: buttonDimension
            }}
          />
        </TouchableOpacity>

        <AyezText
          medium
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={0.5}
          style={styles.incrementText}
          allowFontScaling={false}
        >
          {quantityText}
        </AyezText>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onIncrement}
          disabled={maxReached}
        >
          <Image
            source={images.plusIcon}
            style={{
              tintColor: maxReached ? '#CECECE' : color,
              width: buttonDimension,
              height: buttonDimension
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  mainContainer: {
    height: 26,
    margin: 2,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'stretch',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5
  },
  addItemText: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center'
  },
  incrementText: {
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center'
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center'
  }
};
