import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import styles, { activeOpacity } from './styles';
import FastImage from 'react-native-fast-image';
import {
  AyezText
} from '../../../_common';

export default ({ image_url, price, name, onPress }) => (
  <TouchableOpacity
    style={styles.container}
    activeOpacity={activeOpacity}
    onPress={onPress}
  >
    <FastImage
      style={styles.image}
      source={{ uri: image_url }}
      resizeMode={'contain'}
    />
    <AyezText medium size={15}>{price}</AyezText>
    <AyezText extralight size={11}>{name}</AyezText>
  </TouchableOpacity>
);
