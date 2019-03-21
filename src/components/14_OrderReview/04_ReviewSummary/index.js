
import React, { Component } from 'react';
import {
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

  paymentIcon,
  AYEZ_GREEN,
  AYEZ_BACKGROUND_COLOR,
  ZOPIM_ACCOUNT_KEY
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


import images from '../../../theme/images'
import { sceneKeys, navigateTo } from '../../../router';
import ZendeskChatNativeModule from '../../../ZendeskChat/ZendeskChatNativeModule.js';

class ReviewSummary extends Component {


  renderItem({ item, index, section }) {
    if (section.key === 'removed') {
      return (
        <ItemRow item={item} invalid />
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
        backgroundColor: AYEZ_BACKGROUND_COLOR,
        alignItems: 'flex-start'
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

    const sections = [];

    const newItems = substitutions.filter(item => item);
    if (newItems.length) {
      sections.push(
        { key: 'new', title: strings('OrderReview.newItems'), data: newItems }
      )
    }
    const existingItems = items.filter(item => (item.quantity > 0));
    if (existingItems.length) {
      sections.push(
        { key: 'existing', title: strings('OrderReview.existingItems'), data: existingItems }
      )
    }
    const removedItems = items.filter(item => (item.quantity === 0));
    if (removedItems.length) {
      sections.push(
        { key: 'removed', title: strings('OrderReview.removedItems'), data: removedItems }
      )
    }

    return (
      <View style={{
        flex: 1
      }}>
      <Header
        title={strings('OrderReview.reviewSummaryHeader')}
        blackStyle
        onBackButtonPress={() => onBack()}
        rightButton={{
          text: strings('Support.header').toUpperCase(),
          image_source: images.supportIcon,
          onPress: () => {
            ZendeskChatNativeModule.start({
                  [ZendeskChatNativeModule.ZOPIM_ACCOUNT_KEY]: ZOPIM_ACCOUNT_KEY,
                  [ZendeskChatNativeModule.VISITOR_NAME]: this.props.name || 'Client',
                  [ZendeskChatNativeModule.VISITOR_PHONE_NUMBER]: this.props.phone || ''
                })
          }
        }}
        />

        <SectionList
          style={{ flex: 1 }}
          removeClippedSubviews
          renderItem={this.renderItem.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          sections={sections}
          keyExtractor={(item, index) => index.toString()}
        />

        <BlockButton
          text={strings('Checkout.sendOrder')}
          style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
          onPress={() => this.props.onProceed()}
          />
      </View>
    );
  }
}

export default connect(({ Customer: {name, phone} }) => {
  return {
    name, 
    phone
  };
}, {})(ReviewSummary);
