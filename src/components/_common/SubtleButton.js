import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  AYEZ_GREEN
} from '../../Helpers.js';
import { AyezText } from '.';

const SubtleButton = ({
  onPress,
  text,
  color = AYEZ_GREEN,
  style,
  textStyle
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonStyle,
        style
      ]}>
      <AyezText light size={13} color={color} style={[
        styles.textStyle,
        textStyle
      ]}>{text}</AyezText>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    padding: 16,
    textDecorationLine: 'underline'
  },
  buttonStyle: {
    alignSelf: 'center'
  }
};

export { SubtleButton };
