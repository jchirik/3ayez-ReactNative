
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


class SubstitutionPage extends Component {

  render() {
    const {
      item,
      index,
      review_items,
      onProceed,
      onBack
    } = this.props;

    return (
        <View style={{
          backgroundColor: 'white'
        }}>
          <Header
            title={`Missing Item (${index}/${review_items.length})`}
            blackStyle
            onBackButtonPress={() => onBack()}
            />

          <AyezText bold style={{
            marginTop: 14,
            textAlign: 'center',
            fontSize: 18
          }}>Please sub for this item</AyezText>


          <Image
            style={{ width: 120, height: 120 }}
            resizeMode={'contain'}
            source={{ uri: item.thumbnail_url }}
          />

          <AyezText bold style={{
            marginTop: 14,
            textAlign: 'center',
            fontSize: 18
          }}>{translate(item.display_name)}</AyezText>

          <BlockButton
            text={'Skip this item'}
            style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
            onPress={() => this.props.onProceed()}
          />
        </View>
    );
  }
}

export default SubstitutionPage;
