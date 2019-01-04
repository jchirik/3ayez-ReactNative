import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const BlockButton = ({
  onPress,
  text,
  color = '#2DD38F',
  style,
  textStyle,
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
      activeOpacity={0.85}
      disabled={deactivated}
    >
      <Text style={[styles.textStyle, { color: outline ? color : 'white' }, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
    </View>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Bold'
  },
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
