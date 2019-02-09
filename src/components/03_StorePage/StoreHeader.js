import React, { Component } from 'react';
import { View, Image, Animated } from 'react-native';
import { AyezText, SearchBarButton } from '../_common';
import styles from './styles';

import {
  strings,
  translate
} from '../../i18n.js';


import { PARALLAX_HEADER_HEIGHT } from './CollapsibleHeaderScrollView';
const AnimatedSearchBarButton = Animated.createAnimatedComponent(SearchBarButton);

export default class StoreHeader extends Component {
  render() {
    const {
      displayName,
      interpolatedHeaderTranslation,
      children,
      logo_url,
      cover_url,
      delivery_time,
      delivery_fee
    } = this.props;
    const disappearingAnimation = {
      opacity: interpolatedHeaderTranslation(1, 0)
    };
    return (
      <Animated.View key="parallax-header" style={styles.parallaxHeader}>
        <View
          style={{
            position: 'absolute',
            height: PARALLAX_HEADER_HEIGHT,
            width: '100%',
            backgroundColor: 'black'
          }}
        />
        <Image
          style={{
            backgroundColor: '#f7f7f7',
            position: 'absolute',
            height: PARALLAX_HEADER_HEIGHT,
            width: '100%',
            opacity: 0.8
          }}
          source={{ uri: cover_url }}
          resizeMode="cover"
        />

        <Animated.View style={{
          ...disappearingAnimation,
          alignItems: 'center'
        }}>
          <Image
            style={styles.store_logo}
            resizeMode={'contain'}
            source={{
              uri: logo_url
            }}
          />
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            alignItems: 'center',
            paddingHorizontal: 30,
            paddingVertical: 4,
            borderRadius: 6
          }}>
            <AyezText color={'white'} semibold size={13}>{translate(displayName)}</AyezText>
            <AyezText light color={'white'} size={12}>
              {strings('StoreSelect.deliveryTime', { delivery_time })}
            </AyezText>
          </View>
        </Animated.View>


        <AnimatedSearchBarButton
          style={{ marginTop: 15 }}
          width={interpolatedHeaderTranslation('90%', '70%')}
          displayName={displayName}
        />
        {children}
      </Animated.View>
    );
  }
}
