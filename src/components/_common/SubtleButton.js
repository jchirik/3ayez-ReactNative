import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  AYEZ_GREEN
} from '../../Helpers.js';

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
      <Text style={[
        styles.textStyle,
        { color: color },
        textStyle
      ]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    padding: 16,
    fontFamily: 'Poppins-Light',
    fontSize: 13,
    textDecorationLine: 'underline'
  },
  buttonStyle: {
    alignSelf: 'center'
  }
};

export { SubtleButton };
