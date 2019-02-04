import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  AYEZ_GREEN
} from '../../Helpers.js';
import { AyezText } from '.';

const BlockButton = ({
  onPress,
  text,
  color = AYEZ_GREEN,
  style,
  textStyle = {},
  deactivated,
  outline
}) => {
  return (

    <View style={[
      styles.buttonStyle,
      style,
      { backgroundColor: ((deactivated) ? '#bababa' : color) },
      (outline ? { backgroundColor: 'white', borderColor: color, borderWidth: 1.5 } : null)
    ]}>
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'center',
        borderRadius: 4
      }}
      activeOpacity={0.5}
      disabled={deactivated}
    >
      <AyezText bold style={{ alignSelf: 'center', color: (outline ? color : 'white'), ...textStyle }}>
        {text}
      </AyezText>
    </TouchableOpacity>
    </View>
  );
};

const styles = {
  buttonStyle: {
    height: 42,
    // alignSelf: 'stretch',
    borderRadius: 6,
    // borderWidth: 1,
    // borderColor: '#007aff',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: -1, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }
};

export { BlockButton };
