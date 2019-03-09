
/*

This is the root page of the entire app (after March '19 restructuring).
Run initial app functions here


*/


import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen'

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
  isIPhoneX,
  SPLASH_SCREEN_TIME_OUT
} from '../../Helpers.js';

import {
  strings,
  translate
} from '../../i18n.js';

import images from '../../theme/images'
import { sceneKeys, navigateTo } from '../../router';

import {
  selectAddress
} from '../../actions';


class Root extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isSplashShown: true
    }
  }

  componentDidMount() {

    console.log('Homepage mounted')
    console.log('FBSDK', FBSDK)
    console.log('AppEventsLogger', FBSDK.AppEventsLogger)
    let that = this;
    setTimeout(function(){that.setState({ isSplashShown: false })}, SPLASH_SCREEN_TIME_OUT);
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
      }, 1000);
    } else if (this.props.address && (!prevProps.address || (this.props.address.id !== prevProps.address.id))) {
      console.log('FINISHED LOADING ADDRESSES, select store');
      navigateTo(sceneKeys.storeSelect)
    }
  }

  render() {

    if(!this.state.isSplashShown) {
      SplashScreen.hide();
    }

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
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 8,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.25)',
            paddingHorizontal: 20
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
        <View>
        <AyezText>Please select one of your addresses</AyezText>
        {addressComponents}
        </View>
      )
    }

    return <StorePage />;
  }
}

const mapStateToProps = ({ Seller, Addresses, Settings, OngoingOrders }) => {
  const { id } = Seller;
  const { address, addresses, is_loading } = Addresses;
  const { review_order, feedback_order } = OngoingOrders;
  const { locale } = Settings;
  return {
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
