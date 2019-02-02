import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { BackButton } from '../../../_reusable';
import styles from './styles';

export default class ItemImageView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: this.props.imageUrl }}
          style={styles.image}
          resizeMode={'contain'}
        />
        <BackButton type={'chevronRight'} />
      </View>
    );
  }
}
