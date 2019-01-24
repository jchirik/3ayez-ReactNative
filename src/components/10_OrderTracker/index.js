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
  strings,
  localizeDN,
  parsePayment,
  parseTimestamp,
  padNumberZeros
} from '../../Helpers.js';

import {
  Header,
  BlockButton
} from '../_common';


class OrderTracker extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timerText: ''
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
        this.setState({ timerText: 'Overdue' });
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

      this.setState({ timerText })
    }, 1000);

  }

  componentWillUnmount() {
    console.log('OrderTracker unmounting')
    this.props.endListeningToOrder(); // this fires too late
    timer.clearTimeout(this);
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  }






renderStatusPath(timestamp, isFirst, isLast, height) {

  const { status } = this.props;

  // fill all the circle automatcially if the status between 100 & 200
  const shouldFillCircle = (timestamp || (status >= 100 && status <= 200));

  const topLine = (
    <View style={{
      position: 'absolute',
      left: 28,
      backgroundColor: '#20C74B',
      height: 35,
      width: 4
    }} />
  );

  const bottomLine = (
    <View style={{
      position: 'absolute',
      left: 28,
      top: 35,
      backgroundColor: '#20C74B',
      height: height-35,
      width: 4
    }} />
  );

  return (
    <View style={{ width: 60, height }}>

      {(isFirst ? null : topLine)}
      {(isLast ? null : bottomLine)}

      <View style={{
        position: 'absolute',
        top: 20,
        left: 15,
        borderRadius: 15,
        width: 30,
        height: 30,
        backgroundColor: (shouldFillCircle ? '#20C74B' : 'white'),
        borderColor: '#20C74B',
        borderWidth: 4
      }} />
    </View>
  )
}


renderLogItem(status, timestamp) {

  const height = 120;

  const isFirst = (status === 50);
  const isLast = (status === 100);

  let { dateString, timeString, ampmString } = parseTimestamp(timestamp);
  if (!timestamp) {
    dateString = '';
    timeString = '';
    ampmString = '';
  }

  return (
    <View style={{ height, borderBottomWidth: 1, borderColor: '#EDEDED', flexDirection: 'row' }}>
      <View style={{ flex: 1, paddingTop: 25 }}>
        <Text style={styles.logStatus}>{strings(`OrderStatuses.${status}`)}</Text>
      </View>

      { this.renderStatusPath(timestamp, isFirst, isLast, height) }

      <View style={{ width: 105, paddingTop: 22}}>
        <Text style={styles.dayText}>{dateString}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.timeText}>{timeString}</Text>
          <Text style={styles.AMPMText}>{ampmString}</Text>
        </View>
      </View>

    </View>
  )
}

  renderStatusLog() {
    const { status, status_log } = this.props;

    if (status === 400) {
      return (
        <View style={{ padding: 20, backgroundColor: 'red', flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={{ textAlign: 'right', color:'white', fontSize: 20,
          fontFamily: 'Poppins-Bold', }}>Cancelled by the store</Text>
        </View>
      );
    }


    if (status === 300) {
      return (
        <View style={{ padding: 20, backgroundColor: '#4f4f4f', flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={{ textAlign: 'right', color:'white', fontSize: 20,
          fontFamily: 'Poppins-Bold', }}>{strings('OrderStatuses.300')}</Text>
        </View>
      );
    }


    if (!status_log) { return (
      <ActivityIndicator size="large" style={{ margin: 20, height: 40 }} />
    ); }

    let timestamp_50 = null;
    let timestamp_90 = null;
    let timestamp_100 = null;

    status_log.forEach(logItem => {
      if (logItem.status === 50) { timestamp_50 = logItem.timestamp; }
      else if (logItem.status === 90) { timestamp_90 = logItem.timestamp; }
      else if (logItem.status === 100) { timestamp_100 = logItem.timestamp; }
    });

    return (
      <View>
        { this.renderLogItem(50, timestamp_50) }
        { this.renderLogItem(90, timestamp_90) }
        { this.renderLogItem(100, timestamp_100) }
      </View>
    );
  }

  render() {

    const {
      id,
      is_timeslot_ongoing,
      order_number,
      status,
      order_loading
    } = this.props;

    if (order_loading) {
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator size="large" style={{ height: 40, flex: 1 }} />
        </View>
      );
    }

    if (!is_timeslot_ongoing) {
      return (
        <OrderSummary />
      );
    }


    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Header
            title={order_number ? `${strings('OrderTracker.order#')}${order_number}` : '...'}
            />

          <Text>{this.state.timerText}</Text>
          <ScrollView style={{ flex: 1 }}>
            { this.renderStatusLog() }
          </ScrollView>
      </View>
    );
  }
}

// { this.renderDriverMap() }
// { this.renderCurrentStatus() }

// { this.renderCompletionButton() }


// ListHeaderComponent={this.renderHeader()}


const styles = {

  statusText: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textAlign: 'right',
    marginBottom: 5
  },


  receivedOrderButtonContainer: {
    paddingTop: 4,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderColor: '#f4f4f4',
    backgroundColor: 'white'
  },


  statusSubtitleText: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Poppins',
    color: 'white',
    textAlign: 'right'
  },

  logStatus: {
    textAlign: 'right',
    marginLeft: 25,
    marginRight: 4,
    color: 'black',
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Poppins-Bold'
  },
  dayText: {
    color: '#CDCDCD',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'Poppins-Bold'
  },
  timeText: {
    color: 'black',
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'Poppins-Bold'
  },
  AMPMText: {
    marginLeft: 3,
    color: 'black',
    fontSize: 15,
    fontFamily: 'Poppins-Bold'
  },

  notesContainer: {
    borderBottomWidth: 1,
    borderColor: '#f7f7f7'
  },
  notesText: {
    padding: 15,
    fontFamily: 'Poppins',
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },

  detailContainer: {
    borderBottomWidth: 1,
    borderColor: '#f7f7f7',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  detailTextContainer: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 15,
    marginLeft: 15,
  },
  detailTitleText: {
    marginTop: 10,
    color: 'black',
    paddingLeft: 20,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'right'
  },
  detailSubtitleText: {
    marginBottom: 10,
    color: '#7B7B7B',
    fontSize: 18,
    lineHeight: 24,
    height: 22,
    fontFamily: 'Poppins',
    textAlign: 'right'
  },
  detailImage: {
    width: 32,
    height: 32,
    marginRight: 20
  }
};

const mapStateToProps = ({ OrderTracker }) => {

  const {
    id,
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

    order_loading
  } = OrderTracker;

  return {
    id,
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

    order_loading
   };
 };
 //
 // listenToOrder,
 // endListeningToOrder,
 // markOrderCustomerShown,
 // markOrderComplete,
 // markOrderCancelled,
 // listenToDriverLocation,
 // endListeningToDriverLocation
export default connect(mapStateToProps,
  {
    listenToOrder,
    endListeningToOrder,
    markOrderCustomerReceived,
    markOrderCancelled
  }
)(OrderTracker);
