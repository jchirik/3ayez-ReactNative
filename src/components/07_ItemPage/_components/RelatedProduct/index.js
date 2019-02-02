import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import styles, { activeOpacity } from './styles';
import FastImage from 'react-native-fast-image';

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
    <Text style={styles.price}>{price}</Text>
    <Text style={styles.name}>{name}</Text>
  </TouchableOpacity>
);
