import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
const plusIcon = require('../../../assets/images/incr_plus.png');
const minusIcon = require('../../../assets/images/incr_minus.png');

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
            source={minusIcon}
            style={{
              tintColor: color,
              width: buttonDimension,
              height: buttonDimension
            }}
          />
        </TouchableOpacity>

        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          minimumFontScale={0.5}
          style={styles.incrementText}
        >
          {quantityText}
        </Text>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={onIncrement}
          disabled={maxReached}
        >
          <Image
            source={plusIcon}
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
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    alignSelf: 'center',
    color: 'black'
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center'
  }
};
