import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  AYEZ_GREEN
} from '../../Helpers.js';

import AyezText from './AyezText';

const BlockUnderButton = ({
  onPress,
  text,
  style,
  textStyle
}) => {
  return (
    <TouchableOpacity
        onPress={onPress}
        style={{
          paddingTop: 16,
          paddingBottom: 16,
          marginBottom: 20,
          marginTop: 5,
          ...style
        }}
      >
      <AyezText bold size={14} style={{
        textAlign: 'center',
        ...textStyle
      }}>
        {text}
      </AyezText>
     </TouchableOpacity>
  );
};

export { BlockUnderButton };
