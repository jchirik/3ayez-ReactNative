import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  statusBarMargin
} from '../../Helpers.js';

const backArrow = require('../../../assets/images/back_arrow.png');
const closeX = require('../../../assets/images/close_x.png');
const closeXCircled = require('../../../assets/images/close_x_circled.png');

const BackButton = ({
  color = 'black',
  onPress = Actions.pop,
  type = 'back',
  style
}) => {

  if (type === 'backArrow') {
    return (
      <TouchableOpacity
        style={[styles.backButton, style]}
        onPress={onPress}
      >
        <Image
          source={backArrow}
          style={{ width: 28, height: 28, tintColor: color }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    );
  } else if (type === 'cross_circled') {
    return (
      <TouchableOpacity
        style={{ ...styles.backButton, ...style, right: 10 }}
        onPress={onPress}
      >
        <Image
          source={closeXCircled}
          style={{ width: 35, height: 35 }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    );
  }


  return (
    <TouchableOpacity
      style={[styles.crossButton, style]}
      onPress={onPress}
    >
      <Image
        source={closeX}
        style={{ width: 20, height: 20 }}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
};

const styles = {
  backButton: {
    position: 'absolute',
    width: 40,
    height: 46,
    top: statusBarMargin,
    right: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  crossButton: {
    position: 'absolute',
    width: 42,
    height: 45,
    top: statusBarMargin,
    right: 5,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export { BackButton };
