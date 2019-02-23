import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { STATUS_BAR_HEIGHT } from '../../Helpers.js';

const filter = require('../../../assets/images_v2/filter.png');

const FilterButton = ({ color = 'black', onPress = undefined, style }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Image
      source={filter}
      style={{ width: 22, height: 22, tintColor: color }}
      resizeMode={'contain'}
    />
  </TouchableOpacity>
);

const styles = {
  button: {
    position: 'absolute',
    width: 40,
    top: STATUS_BAR_HEIGHT + 5,
    bottom: 0,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export { FilterButton };
