
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Platform,
  BackHandler
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  parseTimestamp,
  paymentIcon,
  AYEZ_GREEN,
  STATUS_BAR_HEIGHT
} from '../../../Helpers.js';

import {
  strings,
  translate
} from '../../../i18n.js';

import {
  Header,
  BlockButton,
  BackButton,
  AyezText,
  BottomChoiceSelection
} from '../../_common';

const reviewBackground = require('../../../../assets/images_v2/ReviewOrder/reviewBackground.png');

class ReviewBegin extends Component {

  render() {
    const {
      review_items,
      onProceed
    } = this.props;

    let imageComponents = review_items.map(item => (
      <Image
        style={{ width: 80, height: 80, marginHorizontal: 4 }}
        resizeMode={'contain'}
        source={{ uri: item.thumbnail_url }}
      />
    ))

    if (imageComponents.length > 3) {
      const overCount = imageComponents.length - 3;
      imageComponents = imageComponents.slice(0, 3);
      imageComponents.push(
        <View style={{
          marginLeft: 10,
          backgroundColor: '#FE6668',
          width: 40, height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <AyezText regular color={'white'}>+{overCount}</AyezText>
        </View>
      )
    }

    return (
        <View style={{
          flex: 1,
        }}>
          <AyezText bold
            size={26}
            style={{
            marginTop: STATUS_BAR_HEIGHT + 24,
            marginBottom: 18,
            marginLeft: 48,
            marginRight: 48
          }}>Review Required</AyezText>

          <Image
            source={reviewBackground}
            style={{
              alignSelf: 'center',
              height: 240,
              width: 340
             }}
            resizeMode={'contain'}
          />
          <View style={{ flex: 1 }} />
          <AyezText medium style={{
            marginHorizontal: 10,
            marginBottom: 24,
            textAlign: 'center'
          }}>Your order requires some action. Please revise these items and continue.</AyezText>

          <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
             }}>
            {imageComponents}
          </View>

          <View style={{ flex: 1 }} />

          <BlockButton
            text={'Take action'}
            style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
            onPress={() => this.props.onProceed()}
            />
        </View>
    );
  }
}

export default ReviewBegin;
