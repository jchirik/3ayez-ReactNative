
import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  SectionList,
  Platform,
  BackHandler
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  parseTimestamp,


  paymentIcon,
  AYEZ_GREEN,
  AYEZ_BACKGROUND_COLOR
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
  BottomChoiceSelection,
  ItemRow
} from '../../_common';


class ReviewSummary extends Component {


  renderItem({ item, index, section }) {
    console.log(section)
    if (section === 2) {
      return (
        <View style={{ opacity: 0.2 }}>
          <ItemRow item={item} />
        </View>
      )
    }
    return <ItemRow item={item} />;
  }

  renderSectionHeader({ section }) {
    return (
      <View style={{
        paddingLeft: 20,
        paddingTop: 14,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderColor: '#F2F2F2',
        backgroundColor: AYEZ_BACKGROUND_COLOR
      }}>
        <AyezText semibold size={16}>{section.title}</AyezText>
      </View>
    );
  }

  render() {

    const {
      items,
      substitutions,
      onProceed,
      onBack
    } = this.props;

    return (
      <View style={{
        flex: 1
      }}>
      <Header
        title={`Review`}
        blackStyle
        onBackButtonPress={() => onBack()}
        />

        <SectionList
          style={{ flex: 1 }}
          removeClippedSubviews
          renderItem={this.renderItem.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          sections={[
            { title: 'New Items', data: substitutions.filter(item => item) },
            { title: 'Existing', data: items.filter(item => (item.quantity > 0)) },
            { title: 'Removed', data: items.filter(item => (item.quantity === 0)) }
          ]}
          keyExtractor={(item, index) => index.toString()}
        />

        <BlockButton
          text={'Send to Store'}
          style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
          onPress={() => this.props.onProceed()}
          />
      </View>
    );
  }
}

export default ReviewSummary;
