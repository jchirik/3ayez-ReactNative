
import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Platform,
  BackHandler
} from 'react-native';

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  setReviewItemSubstitution
} from '../../../actions';

import {
  paymentIcon,
  AYEZ_GREEN,
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
  LoadingOverlay,
  ItemTile,
  PlaceholderFastImage,

  ItemIncrementer
} from '../../_common';

import images from '../../../theme/images'
import { sceneKeys, navigateTo } from '../../../router';
import ZendeskChatNativeModule from '../../../ZendeskChat/ZendeskChatNativeModule';

class QuantityChangePage extends Component {

  render() {
    const {
      item,
      index,
      review_items,
      onProceed,
      onBack,

      substitution_items,
      substitution_items_loading
    } = this.props;

    let isOutOfStock = (item.quantity === 0);

    return (
        <View style={{
          flex: 1,
          backgroundColor: 'white'
        }}>
          <Header
            title={strings('OrderReview.reviewItemHeader', { index: index+1, total: review_items.length})}
            blackStyle
            onBackButtonPress={() => {
              if (this.state.quantity > 0) {
                this.setState({ quantity: 0 })
              } else {
                onBack()
              }
            }}
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

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 2,
            borderRadius: 10,
            borderColor: 'red',
            margin: 10,
            padding: 14
          }}>
            <PlaceholderFastImage
              style={{ width: 60, height: 60 }}
              resizeMode={'contain'}
              source={{ uri: item.thumbnail_url }}
            />

            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <AyezText regular>{translate(item)}</AyezText>
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 22 }}>
            <AyezText regular style={{
              marginVertical: 12
            }}>{strings('OrderReview.quantityChangeInstruction')}</AyezText>

            <AyezText medium color={'#888888'}>{strings('OrderReview.requestedQuantity', { quantity: item.original_quantity })}</AyezText>
            <AyezText medium size={16} style={{ marginTop: 5}}>{strings('OrderReview.availableQuantity', { quantity: item.quantity })}</AyezText>

          </View>
          <View style={{ flex: 1 }} />
          <BlockButton
            text={strings('Common.OK')}
            style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
            onPress={() => {
              this.props.onProceed()
            }}
          />

          <LoadingOverlay isVisible={substitution_items_loading} />
        </View>
    );
  }
}




  const mapStateToProps = ({ ReviewOrder, Customer: {name, phone} }) => {

    const {
      substitution_items,
      substitution_items_loading
    } = ReviewOrder;

    return {
      substitution_items,
      substitution_items_loading,
      name, 
      phone
    };
  };



  export default connect(mapStateToProps, {
    setReviewItemSubstitution
  })(QuantityChangePage);
