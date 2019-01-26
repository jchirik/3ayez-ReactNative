// import _ from 'lodash';
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

const timer = require('react-native-timer');

import { connect } from 'react-redux';
// import call from 'react-native-phone-call';
import { Actions } from 'react-native-router-flux';

import OrderSummary from './01_OrderSummary';

import {
  listenToOrder,
  endListeningToOrder,
  markOrderCustomerReceived,
  markOrderCancelled
} from '../../actions';

  // markOrderCustomerShown,

import {
  parsePayment,
  parseTimestamp,
  padNumberZeros,
  AYEZ_GREEN
} from '../../Helpers.js';

import {
  strings,
  translate
} from '../../i18n.js';


import {
  Header,
  BlockButton,
  AyezText
} from '../_common';

import { StatusLog } from './StatusLog'

const order_summary_icon = require('../../../assets/images_v2/OrderTracker/order_summary.png');



class OrderTracker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timerText: '',
      timerTextLoading: true
    };
  }


  componentDidMount() {
    // should trigger a driver tracking screen if available too,
    // IFF status between 100 & 200, and driver_id exists
    // get items_array from the subcollection too
    this.props.listenToOrder(this.props.order_id);

    // this.props.markOrderCustomerShown(this.props.order_id);
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);


    timer.setInterval(this, 'hideMsg', () => {
      let timerEnd = 0;
      if (this.props.timeslot && this.props.timeslot.start) {
        timerEnd = (this.props.timeslot.start + this.props.timeslot.end)/2;
      }
      const remainingTime = timerEnd - Date.now();
      if (remainingTime < 0) {
        this.setState({ timerText: '', timerTextLoading: false });
        return;
      }
      let seconds = Math.round(remainingTime/1000);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      seconds = seconds % 60;
      minutes = minutes % 60;
      let timerText = `${minutes}:${padNumberZeros(seconds, 2)}`;

      if (hours > 0) {
        timerText = `${hours}:${padNumberZeros(minutes, 2)}:${padNumberZeros(seconds, 2)}`;
      }
      this.setState({ timerText, timerTextLoading: false })
    }, 1000);
  }

  componentWillUnmount() {
    console.log('OrderTracker unmounting')
    this.props.endListeningToOrder(this.props.order_id);
    timer.clearTimeout(this);
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  }

  renderTimer() {

    const {
      status,
      driver_id
    } = this.props;

    if (this.state.timerTextLoading) {
      return <ActivityIndicator size="small" style={{ margin: 20 }} />
    }

    if (driver_id && (status >= 100)) {
      return (
        <BlockButton
          onPress={() => Actions.driverTracker({ driver_id })}
          text={'TRACK ORDER'}
          style={{
            marginTop: 20,
            marginBottom: 20,
            marginLeft: 30,
            marginRight: 30
          }}
          />
      )
    }

    if (!this.state.timerText) { return null; }
    return (
      <View style={{
        marginTop: 20,
        marginBottom: 20,
        width: 200,
        height: 200,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E6E6E6',
        borderRadius: 100
      }}>
        <AyezText bold size={34} color={AYEZ_GREEN}>{this.state.timerText}</AyezText>
      </View>
    );
  }

  render() {

    const {
      id,
      seller,
      is_timeslot_ongoing,
      order_number,
      status,
      status_log,
      order_loading
    } = this.props;

    if (order_loading || !order_number) {
      return <ActivityIndicator size="large" style={{ flex: 1, backgroundColor: '#FAFCFD' }} />;
    }

    if (!is_timeslot_ongoing || status >= 200) {
      return (
        <OrderSummary />
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#FAFCFD' }}>
          <Header
            title={'Track Your Order'}
            blackStyle
            rightButton={{
              text: 'Summary',
              image_source: order_summary_icon,
              onPress: () => Actions.orderSummary()
            }}
            />
          <ScrollView style={{ flex: 1 }}>
            {this.renderTimer()}
            <StatusLog status_log={status_log} seller={seller} />
          </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ OrderTracker }) => {

  const {
    id,
    seller,
    items,
    order_number,
    status,
    status_log,
    payment_method,
    auto_total,
    address,
    timeslot,
    timestamp,
    notes,
    is_timeslot_ongoing,
    driver_id,

    order_loading
  } = OrderTracker;

  return {
    id,
    seller,
    items,
    order_number,
    status,
    status_log,
    payment_method,
    auto_total,
    address,
    timeslot,
    timestamp,
    notes,
    is_timeslot_ongoing,
    driver_id,

    order_loading
   };
 };

export default connect(mapStateToProps,
  {
    listenToOrder,
    endListeningToOrder,
    markOrderCustomerReceived,
    markOrderCancelled
  }
)(OrderTracker);
