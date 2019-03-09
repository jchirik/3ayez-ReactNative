
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

    if (!this.props.address && (!this.props.is_loading_addresses && prevProps.is_loading_addresses)) {
      console.log('FINISHED LOADING ADDRESSES, no address so create')
      navigateTo(sceneKeys.addressCreate);
    } else if (this.props.address && (this.props.address !== prevProps.address)) {
      console.log('FINISHED LOADING ADDRESSES, select store');
      navigateTo(sceneKeys.storeSelect)
    }
  }

  render() {

    if(!this.state.isSplashShown) {
      SplashScreen.hide();
    }

    if (this.props.is_loading_addresses || !this.props.locale || !this.props.seller_id) {
      return (
        <ActivityIndicator size="small" style={{ flex: 1, backgroundColor: 'white' }} />
      );
    }
    return <StorePage />;
  }
}

const mapStateToProps = ({ Seller, Addresses, Settings, OngoingOrders }) => {
  const { id } = Seller;
  const { address, is_loading } = Addresses;
  const { review_order, feedback_order } = OngoingOrders;
  const { locale } = Settings;
  return {
    seller_id: id,
    locale,
    address,
    is_loading_addresses: is_loading,

    review_order,
    feedback_order
  };
};

export default connect(mapStateToProps, null)(Root);
