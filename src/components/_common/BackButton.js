import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../Helpers.js';
import { RTLImage } from './RTLImage';
import images from '../../theme/images'
import { navigateBack } from '../../router/index.js';

const BackButton = ({
  color = AYEZ_GREEN,
  onPress = navigateBack,
  fixed = false,
  style
}) => {

  return (
      <TouchableOpacity
        style={[styles.backButton, (fixed ? styles.fixedButton : {}), style]}
        onPress={onPress}
      >
        <RTLImage
          source={images.backIcon}
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
