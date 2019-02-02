import React from 'react';
import { View } from 'react-native';
import styles from './styles';

export default (Divider = props => (
  <View style={[styles.divider, props.style]} />
));
