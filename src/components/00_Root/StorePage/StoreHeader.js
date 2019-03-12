import React, { Component } from 'react';
import { View, Image, Animated, TouchableOpacity } from 'react-native';
import { AyezText, SearchBarButton } from '../../_common';
import styles from './styles';

import {
  strings,
  translate
} from '../../../i18n.js';


import { sceneKeys, navigateTo, navigateBackTo } from '../../../router';

import images from '../../../theme/images'

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
      location_text
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
          <View style={{
            width: 170,
            height: 60,
            backgroundColor: 'white',
            borderRadius: 6,
            marginBottom: 10,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image
              style={{
                width: 135,
                height: 45
              }}
              resizeMode={'contain'}
              source={{
                uri: logo_url
              }}
            />
          </View>
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 4,
            borderRadius: 6,
            height: 35,
            flexDirection: 'row',
          }}>
            <AyezText normal color={'white'} size={13}>{translate(location_text) || '-'}</AyezText>
            <Image
              source={images.storeLocationPin}
              style={{
                tintColor: 'white',
                width: 14,
                height: 14,
                marginLeft: 2
              }}
              resizeMode={'contain'}
            />
          </View>
        </Animated.View>

        <AnimatedSearchBarButton
          style={{ marginTop: 15 }}
          width={interpolatedHeaderTranslation('90%', '60%')}
          displayName={displayName}
        />
        {children}
      </Animated.View>
    );
  }
}
