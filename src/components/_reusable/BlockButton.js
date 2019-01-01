import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const BlockButton = ({
  onPress,
  text,
  color = '#0094ff',
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
    fontSize: 18
  },
  buttonStyle: {
    height: 44,
    // alignSelf: 'stretch',
    borderRadius: 4,
    // borderWidth: 1,
    // borderColor: '#007aff',
    justifyContent: 'center',
    marginLeft: 7,
    marginRight: 7,
    shadowColor: '#000',
    shadowOffset: { width: -1, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  }
};

export { BlockButton };
