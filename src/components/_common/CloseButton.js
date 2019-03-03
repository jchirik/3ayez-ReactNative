import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../Helpers.js';

import images from '../../theme/images'
import { navigateBack } from '../../router/index.js';

const CloseButton = ({
  onPress = navigateBack,
  fixed = true,
  style
}) => {
  return (
      <TouchableOpacity
        style={[styles.closeButton, (fixed ? styles.fixedButton : {}), style]}
        onPress={onPress}
      >
        <Image
          source={images.closeIcon}
          style={{ width: 32, height: 32 }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
  );
};

const styles = {
  closeButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fixedButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 6,
    right: 4,
  }
};

export { CloseButton };
