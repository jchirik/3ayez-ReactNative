
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


class ReviewSummary extends Component {

  render() {

    const {
      items,
      substitutions,
      onProceed,
      onBack
    } = this.props;

    return (
      <View style={{
        backgroundColor: 'white'
      }}>
      <Header
        title={`Review`}
        blackStyle
        onBackButtonPress={() => onBack()}
        />
        <AyezText bold style={{
          marginTop: 14,
          textAlign: 'center',
          fontSize: 18
        }}>-</AyezText>

        <BlockButton
          text={'CONFIRM'}
          style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
          onPress={() => this.props.onProceed()}
          />
      </View>
    );
  }
}

export default ReviewSummary;
