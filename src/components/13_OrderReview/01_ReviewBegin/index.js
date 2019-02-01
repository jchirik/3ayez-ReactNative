
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
  AYEZ_GREEN
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


class ReviewBegin extends Component {

  render() {
    const {
      review_items,
      onProceed
    } = this.props;

    let imageComponents = review_items.map(item => (
      <Image
        style={{ width: 120, height: 120 }}
        resizeMode={'contain'}
        source={{ uri: item.thumbnail_url }}
      />
    ))

    if (imageComponents.length > 3) {
      const overCount = imageComponents.length - 3;
      imageComponents = imageComponents.slice(0, 3);
      imageComponents.push(
        <Text>+{overCount}</Text>
      )
    }

    return (
        <View style={{
          backgroundColor: 'white'
        }}>
          <Image
            source={null}
            style={{
              marginTop: 10,
              height: 180,
              backgroundColor: 'red'
             }}
            resizeMode={'contain'}
          />
          <AyezText bold style={{
            marginTop: 14,
            textAlign: 'center',
            fontSize: 18
          }}>Your order requires some action. Please revise these items and continue.</AyezText>

          <View style={{ flexDirection: 'row' }}>
            {imageComponents}
          </View>

          <BlockButton
            text={'Review your order'}
            style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
            onPress={() => this.props.onProceed()}
            />
        </View>
    );
  }
}

export default ReviewBegin;
