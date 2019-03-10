
/*

This is the root page of the entire app (after March '19 restructuring).
Run initial app functions here


*/


import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import FBSDK from 'react-native-fbsdk';

import StorePage from './StorePage';
import {
  AyezText,
  OrderStatusBar
} from '../_common';

import {
  AYEZ_GREEN,
  AYEZ_BACKGROUND_COLOR,
  STATUS_BAR_HEIGHT,
  isIPhoneX
} from '../../Helpers.js';

import {
  strings,
  translate
} from '../../i18n.js';

import colors from '../../theme/colors'
import images from '../../theme/images'
import { sceneKeys, navigateTo } from '../../router';

import {
  selectAddress
} from '../../actions';


class Root extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    console.log('Homepage mounted')
    console.log('FBSDK', FBSDK)
    console.log('AppEventsLogger', FBSDK.AppEventsLogger)
    let that = this;
  }

  componentDidUpdate(prevProps) {

    // MOVE THIS (later)
    // if addresses stop loading && addresses has 0 length
      // open create address
    // otherwise, open address selection

    if (this.props.review_order && !prevProps.review_order) {
      navigateTo(sceneKeys.orderReview, { order: this.props.review_order });
    }

    if (this.props.feedback_order && !prevProps.feedback_order) {
      navigateTo(sceneKeys.customerFeedback, { order: this.props.feedback_order });
    }

    if (!this.props.addresses.length && !this.props.is_loading_addresses && prevProps.is_loading_addresses) {
      console.log('FINISHED LOADING ADDRESSES, no address so create')
      setTimeout(() => {
        navigateTo(sceneKeys.addressCreate);
      }, 500);
    } else if (this.props.address && (!prevProps.address || (this.props.address.id !== prevProps.address.id))) {
      console.log('FINISHED LOADING ADDRESSES, select store');
      navigateTo(sceneKeys.storeSelect)
    }
  }

  render() {

    if (!this.props.locale || this.props.is_loading_addresses || !this.props.addresses.length) {
      return (
        <ActivityIndicator size="small" style={{ flex: 1, backgroundColor: 'white' }} />
      );
    }

    if (!this.props.seller_id || !this.props.address) {
      const addressComponents = this.props.addresses.slice(0, 3).map(address => (
        <TouchableOpacity
          key={address.id}
          style={{
            marginHorizontal: 10,
            marginTop: 10,
            borderRadius: 6,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: AYEZ_GREEN
           }}
         onPress={() => {
           this.props.selectAddress(address);
         }}
         >
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            <AyezText bold style={{
              color: 'white'
            }}>{address.street}</AyezText>
            <AyezText medium style={{
              color: 'white'
            }}>{strings('Address.detail', { building: address.building, apt: address.apt })}</AyezText>
          </View>
        </TouchableOpacity>
      ));

      return (
        <View style={{
          backgroundColor: colors.paleGrey,
          paddingTop: STATUS_BAR_HEIGHT + 20,
          alignItems: 'center',
          flex: 1
         }}>
         <AyezText medium size={16}>Welcome back {this.props.name}!</AyezText>
         <AyezText regular size={16} style={{ marginTop: 5, marginBottom: 6 }}>Please select your location</AyezText>
          {addressComponents}
          <TouchableOpacity
            style={{
              marginTop: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
             }}
           onPress={() => navigateTo(sceneKeys.addressCreate)}
           >
            <AyezText medium>+ New Address</AyezText>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />
          <AyezText medium color={'red'} style={{ marginBottom: 14 }}>Logout</AyezText>
        </View>
      )
    }

    return <StorePage />;
  }
}

const mapStateToProps = ({ Customer, Seller, Addresses, Settings, OngoingOrders }) => {

  const {
    name
  } = Customer;

  const { id } = Seller;
  const { address, addresses, is_loading } = Addresses;
  const { review_order, feedback_order } = OngoingOrders;
  const { locale } = Settings;
  return {
    name,
    seller_id: id,
    locale,
    address,
    addresses,
    is_loading_addresses: is_loading,

    review_order,
    feedback_order
  };
};

export default connect(mapStateToProps, {
  selectAddress
})(Root);
