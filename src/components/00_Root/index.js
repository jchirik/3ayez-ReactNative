
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
import AreaSelect from '../02_AreaSelect';

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

import firebase from 'react-native-firebase';

import colors from '../../theme/colors'
import images from '../../theme/images'
import { sceneKeys, navigateTo } from '../../router';



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

    // if (!this.props.saved_areas.length && !this.props.is_loading_saved_areas && prevProps.is_loading_saved_areas) {
    //   console.log('FINISHED LOADING AREAS, no address so create')
    //   setTimeout(() => {
    //     navigateTo(sceneKeys.areaCreate);
    //   }, 500);
    // } else

    // if (this.props.selected_area && (!prevProps.selected_area || (this.props.selected_area.id !== prevProps.selected_area.id))) {
    //   console.log('FINISHED CHANGING AREA, select store');
    //
    // }
  }

  render() {
    const { currentUser } = firebase.auth();

    if (!this.props.locale || !currentUser) {
      return (
        <ActivityIndicator size="small" style={{ flex: 1, backgroundColor: 'white' }} />
      );
    }
    if (!this.props.seller_id || !this.props.selected_area) {
      return <AreaSelect />;
    }
    return <StorePage />;
  }
}

const mapStateToProps = ({ Customer, Seller, Areas, Settings, OngoingOrders }) => {

  const {
    name
  } = Customer;

  const { id } = Seller;
  const { selected_area, saved_areas, is_loading_saved_areas } = Areas;
  const { review_order, feedback_order } = OngoingOrders;
  const { locale } = Settings;
  return {
    name,
    seller_id: id,
    locale,
    selected_area,
    saved_areas,
    is_loading_saved_areas,

    review_order,
    feedback_order
  };
};

export default connect(mapStateToProps, null)(Root);
