import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  STATUS_BAR_HEIGHT
} from '../../Helpers.js';

const back_icon = require('../../../assets/images_v2/Common/back.png');

const BackButton = ({
  color = '#2DD38F',
  onPress = Actions.pop,
  style
}) => {

  return (
      <TouchableOpacity
        style={[styles.backButton, style]}
        onPress={onPress}
      >
        <Image
          source={back_icon}
          style={{ width: 24, height: 24, tintColor: color }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
  );
};

const styles = {
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export { BackButton };
