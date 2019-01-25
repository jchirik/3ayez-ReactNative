import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../Helpers.js';

import { RTLImage } from './RTLImage';

const back_icon = require('../../../assets/images_v2/Common/back.png');

const BackButton = ({
  color = AYEZ_GREEN,
  onPress = Actions.pop,
  fixed = false,
  style
}) => {

  return (
      <TouchableOpacity
        style={[styles.backButton, (fixed ? styles.fixedButton : {}), style]}
        onPress={onPress}
      >
        <RTLImage
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
  },
  fixedButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 6,
    left: 2,
  }
};

export { BackButton };
