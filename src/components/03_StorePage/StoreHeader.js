import React, { Component } from 'react';
import { View, Image, Animated, Text } from 'react-native';
import { SearchBarButton } from '../_reusable';
import { AyezText } from '../_common';
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
            position: 'absolute',
            height: PARALLAX_HEADER_HEIGHT,
            width: '100%',
            opacity: 0.8
          }}
          source={require('./storeImage.jpg')}
          resizeMode="cover"
        />

        <Animated.View style={[
          disappearingAnimation,
          { backgroundColor: 'white',
            borderRadius: 12, paddingVertical: 3,
            paddingHorizontal: 9 }
        ]}>
          <AyezText color={'black'} semibold>{translate(displayName)}</AyezText>
        </Animated.View>

        <Animated.Image
          style={[styles.store_logo, disappearingAnimation]}
          resizeMode={'contain'}
          source={{
            uri: logo_url
          }}
        />
        <Animated.View
          style={[
            {
              width: window.width - 70,
              flexDirection: 'row',
              justifyContent: 'space-between'
            },
            disappearingAnimation
          ]}
        >
          <Text style={styles.sectionTitleText}>
            {delivery_time} mins. of scheduled delivery
          </Text>
          <Text style={styles.sectionTitleText}>Delivery: {delivery_fee}</Text>
        </Animated.View>

        <AnimatedSearchBarButton
          style={{ marginTop: 5 }}
          width={interpolatedHeaderTranslation('90%', '70%')}
          displayName={displayName}
        />
        {children}
      </Animated.View>
    );
  }
}
