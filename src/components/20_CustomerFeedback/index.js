import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  FlatList,
  BackHandler
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  setStoreRating,
  setAyezRating,
  resetCustomerFeedback,
  fetchFeedbackSeller,
  submitCustomerFeedback
} from '../../actions';
import {
  Header,
  BlockButton,
  CloseButton,
  AyezText,
  LoadingOverlay
} from '../_common';

import {
  strings,
  translate
} from '../../i18n.js';

import {
  StarRating
} from './StarRating.js';

import {
  AYEZ_GREEN,
  AYEZ_BACKGROUND_COLOR,
  STATUS_BAR_HEIGHT
} from '../../Helpers.js';

const square_logo_icon = require('../../../assets/images_v2/Common/square_logo.png');
const header_image = require('../../../assets/images_v2/CustomerFeedback/header_image.png');


class CustomerFeedback extends Component {

  componentDidMount() {
    this.props.resetCustomerFeedback();
    this.props.fetchFeedbackSeller(this.props.order.seller.id);
  }

  submitCustomerFeedback() {
    const { order, store_rating, ayez_rating } = this.props;
    this.props.submitCustomerFeedback(
      order.id,
      { store_rating, ayez_rating }
    );
  }

  closeCustomerFeedback() {
    this.props.submitCustomerFeedback(
      this.props.order.id,
      { store_rating: null, ayez_rating: null }
    );
  }

  renderSellerReview() {
    let seller_image = (
      <ActivityIndicator size="small" style={{ width: 60, height: 60, margin: 6 }}/>
    )
    if (!this.props.seller_loading) {
      seller_image = (
        <Image
          style={{
            width: 60, height: 60,
            margin: 6,
            borderRadius: 10
          }}
          resizeMode={'contain'}
          source={{ uri: this.props.seller.logo_url }}
        />
      )
    }
    return (
      <View style={{
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#f7f7f7',
        paddingTop: 20,
        paddingBottom: 20
      }}>
        <AyezText medium size={17}>Please rate {translate(this.props.order.seller.display_name)}</AyezText>
        { seller_image }
        <StarRating
          value={this.props.store_rating}
          onChange={({value}) => this.props.setStoreRating(value)}
        />
      </View>
    )
  }

  renderAyezReview() {
    return (
      <View style={{
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#f7f7f7',
        paddingTop: 20,
        paddingBottom: 20
      }}>
        <AyezText medium size={17}>How was the 3ayez service?</AyezText>
        <Image
          style={{
            width: 60, height: 60,
            margin: 6,
            tintColor: 'white',
            backgroundColor: AYEZ_GREEN,
            borderRadius: 10
          }}
          resizeMode={'contain'}
          source={square_logo_icon}
        />
        <StarRating
          value={this.props.ayez_rating}
          onChange={({value}) => this.props.setAyezRating(value)}
        />
      </View>
    )
  }

  render() {
    const { order } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: AYEZ_BACKGROUND_COLOR }}>

        <ScrollView style={{ flex: 1 }}>
          <View style={{ height: 140 + STATUS_BAR_HEIGHT }}>
            <Image
              style={{
                flex: 1,
                width: null
              }}
              resizeMode={'cover'}
              source={header_image}
            />
            <View style={{
              position: 'absolute',
              top: 0, right: 0,
              bottom: 0, left: 0,
              alignItems: 'center',
              paddingBottom: 24
            }}>
              <View style={{ flex: 1 }} />
              <AyezText bold
              size={24}
              color={'white'}
              >Your order has arrived!</AyezText>
              <AyezText medium
              size={14}
              color={'white'}
              >Order #{order.order_number}</AyezText>
            </View>
          </View>

          {this.renderSellerReview()}
          {this.renderAyezReview()}
        </ScrollView>

        <BlockButton
          style={{ margin: 20, marginBottom: 24 }}
          text={'SUBMIT'}
          onPress={this.submitCustomerFeedback.bind(this)}
        />
        <CloseButton onPress={this.closeCustomerFeedback.bind(this)}/>
        <LoadingOverlay isVisible={this.props.submit_loading} />
    </View>
    );
  }
}

  const mapStateToProps = ({ CustomerFeedback }) => {
    const {
      store_rating,
      ayez_rating,

      seller,
      seller_loading,

      submit_loading,
      submit_success,
      submit_error
     } = CustomerFeedback;
    return {
      store_rating,
      ayez_rating,

      seller,
      seller_loading,

      submit_loading,
      submit_success,
      submit_error
    };
  };

  export default connect(mapStateToProps,
    {
      setStoreRating,
      setAyezRating,
      resetCustomerFeedback,
      fetchFeedbackSeller,
      submitCustomerFeedback
    }
  )(CustomerFeedback);
