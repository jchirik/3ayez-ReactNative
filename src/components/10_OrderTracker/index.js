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
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { connect } from 'react-redux';
// import call from 'react-native-phone-call';
import { Actions } from 'react-native-router-flux';

import {
  listenToOrder,
  endListeningToOrder,
  markOrderComplete,
  markOrderCancelled
} from '../../actions';

  // markOrderCustomerShown,

import {
  strings,
  localizeDN,
  parsePayment,
  parseTimestamp
} from '../../Helpers.js';

import {
  Header,
  BlockButton,
  ItemCell
} from '../_reusable';

const carIcon = require('../../../assets/images/car.png');

const clockIcon = require('../../../assets/images/clock.png');
const houseIcon = require('../../../assets/images/house.png');


class OrderTracker extends Component {


  componentDidMount() {
    // should trigger a driver tracking screen if available too,
    // IFF status between 100 & 200, and driver_id exists
    // get items_array from the subcollection too
    this.props.listenToOrder(this.props.order_id);

    this.props.markOrderCustomerShown(this.props.order_id);
    BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  componentWillUnmount() {
    this.props.endListeningToOrder();
    BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    Actions.pop(); // Android back press
    return true;
  }

    // componentDidUpdate(prevProps) {
    //   if (this.props.order && this.props.order !== prevProps.order) {
    //     const { order } = this.props;
    //     // if (order.show_customer_receipt) { }
    //       // location is updated every time user selects a location search result
    //       // or opts to use current location
    //     if (order.status < 200) {
    //       this.props.listenToDriverLocation(order.shipment_id);
    //     }
    //   }
    // }



  // componentWillUnmount() {
  //   this.props.endListeningToDriverLocation();
  // }

  // renderCurrentStatus() {
  //   if (!this.props.order.status_log) {
  //     return null;
  //   }
  //   const lastStatusObj = this.props.order.status_log.slice(-1)[0];
  //   if (lastStatusObj && statusDictionary[lastStatusObj.status]) {
  //     let { text, color } = statusDictionary[lastStatusObj.status];
  //     const timestamp = lastStatusObj.timestamp;
  //
  //     const { timeString, ampmString } = parseTimestamp(timestamp);
  //
  //     const { issue, status } = this.props.order;
  //     let optionalSubtitle = null;
  //     if (issue && status > 200) {
  //       text = issue.header;
  //       optionalSubtitle = (
  //         <Text style={styles.statusSubtitleText}>{issue.detail}</Text>
  //       );
  //     }
  //
  //     return (
  //       <View style={{
  //         flexDirection: 'column',
  //         alignItems: 'flex-end',
  //         marginTop: 8,
  //         paddingTop: 10,
  //         paddingBottom: 12,
  //         paddingLeft: 20,
  //         paddingRight: 26,
  //         backgroundColor: color
  //       }}>
  //         <Text style={styles.statusText}>{text}</Text>
  //         { optionalSubtitle }
  //         <Text style={{
  //           fontSize: 17,
  //           lineHeight: 21,
  //           fontFamily: 'BahijJanna-Bold',
  //           color: '#00000088'
  //         }}>{timeString} {ampmString}</Text>
  //       </View>
  //     );
  //   }
  //
  //   return null;
  // }

  renderPayment() {
    const { payment_method, auto_total } = this.props.order;
    const { text, icon } = parsePayment(payment_method);

    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailTextContainer}>
          <Text style={styles.detailTitleText}>{(parseFloat(auto_total) ? parseFloat(auto_total).toFixed(2) : '-')} EGP</Text>
          <Text style={styles.detailSubtitleText}>{text}</Text>
        </View>
        <Image
          source={icon}
          style={styles.detailImage}
          resizeMode={'contain'}
        />
      </View>
    );
  }

  renderAddress() {
    const { street, building, floor, apt, area } = this.props.order.address;
    const addressHeader = `${street} ${building} - ${floor} - ${apt}`;
    let addressArea = '';
    if (area && area.display_name) { addressArea = localizeDN(area.display_name); }
    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailTextContainer}>
          <Text style={styles.detailTitleText}>{addressHeader}</Text>
          <Text style={styles.detailSubtitleText}>{addressArea}</Text>
        </View>
        <Image
          source={houseIcon}
          style={styles.detailImage}
          resizeMode={'contain'}
        />
      </View>
    );
  }


  renderTimeslot() {

    const { order } = this.props;
    let timeString = '';
    let dateString = '';

    if (order.timeslot && order.timeslot.start) {
      const timeslotStart = parseTimestamp(order.timeslot.start);
      const timeslotEnd = parseTimestamp(order.timeslot.end);
      timeString = `${timeslotStart.timeString}${timeslotStart.ampmString} - ${timeslotEnd.timeString}${timeslotEnd.ampmString}`;
      dateString = `${timeslotStart.dateString}`;
    } else {
      const timestamp = parseTimestamp(order.timestamp);
      timeString = `${timestamp.timeString}${timestamp.ampmString}`;
      dateString = `${timestamp.dateString}`;
    }


    return (
      <View style={styles.detailContainer}>
        <View style={styles.detailTextContainer}>
          <Text style={styles.detailTitleText}>{timeString}</Text>
          <Text style={styles.detailSubtitleText}>{dateString}</Text>
        </View>
        <Image
          source={clockIcon}
          style={styles.detailImage}
          resizeMode={'contain'}
        />
      </View>
    );
  }


renderCompletionButton() {
  const { status_log, status, id, timestamp } = this.props.order;

  // not visible if the order is already complete or hasnt been finalized
  if (!status_log || status >= 200) { return null; }
  // not visible if the status < 100 and it hasnt been an hour yet
  if (timestamp + 2700000 > Date.now()) { return null; }

  return (

    <View style={styles.receivedOrderButtonContainer}>
      <TouchableOpacity
        style={{
          backgroundColor: '#00C36C',
          marginTop: 10,
          height: 50, width: 240, borderRadius: 60,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: -1, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        }}
        onPress={() => { this.props.markOrderComplete(id); }}
      >

      <Text style={{
        color: 'white',
        fontFamily: 'BahijJanna-Bold',
        fontSize: 19
      }}>{strings('OrderTracker.receivedOrderButton')}</Text>

      </TouchableOpacity>
    </View>
  );
}

renderDriverMap() {

  const { order, driver_location, rotation } = this.props;

  // or if status < 150
  if (!driver_location || order.status < 100 || order.status >= 200) { return null; }

  const carImage = (
    <Image source={carIcon} style={{ width: 40, height: 20 }} />
  );

  return (
    <MapView
      ref={map => { this.map = map }}
      style={{ height: 200, marginTop: 5 }}
      showsUserLocation
      provider={PROVIDER_GOOGLE}
      initialRegion={{
        latitude: driver_location.lat,
        longitude: driver_location.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}
    >
      <Marker
      coordinate={{
        latitude: driver_location.lat,
        longitude: driver_location.lng
      }}
      rotation={rotation}
      >{carImage}</Marker>
    </MapView>
  );
}



renderSectionHeader(text) {
  return (
    <View style={{
      marginTop: 12,
      height: 32,
      backgroundColor: '#FAFAFA',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }}>
      <Text style={{
        color: 'black',
        fontSize: 18,
        marginRight: 20,
        fontFamily: 'BahijJanna-Bold'
      }}>{text}</Text>
    </View>
  )
}


renderNotes() {
  const { notes } = this.props.order;
  if (!notes) { return null; }
  return (
    <View style={styles.notesContainer}>
      <Text style={styles.notesText}>{notes}</Text>
    </View>
  );
}


// "OrderStatuses": {
//   "50": "Order seen by store",
//   "90": "Order approved by store",
//   "100": "استلم السائق طلبك",
//
//   "0": "تم إرسال السوبرماركت",
//   "150": "لقد وصل طلبك",
//   "200": "تم اكتمال الطلب",
//   "300": "تم إلغاء الطلب",
//   "400": "لقد رفض السوبرماركت طلبك"
// },
// "OrderTracker": {
//   "problem": "ايه المشكلة؟",
//   "itemsHeader": "Items",
//   "detailsHeader": "Delivery Details",
//   "order#": "Order #",
renderReceipt() {

  const { items_array } = this.props.order;
  const basketItems = items_array.map(item => (
    <ItemCell
      item={item}
      seller={this.props.order.seller}
    />
  ));
  return (
    <View>
      { this.renderSectionHeader(strings('OrderTracker.itemsHeader')) }
      { basketItems }
      { this.renderNotes() }
    </View>
  );
}


renderStatusPath(timestamp, isFirst, isLast, height) {

  const { order } = this.props;

  // fill all the circle automatcially if the status between 100 & 200
  const shouldFillCircle = (timestamp || (order.status >= 100 && order.status <= 200));

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
    const { status, issue, status_log } = this.props.order;

    if (status === 400) {
      return (
        <View style={{ padding: 20, backgroundColor: 'red', flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={{ textAlign: 'right', color:'white', fontSize: 20,
          fontFamily: 'BahijJanna-Bold', }}>{issue.header}</Text>
        </View>
      );
    }


    if (status === 300) {
      return (
        <View style={{ padding: 20, backgroundColor: '#4f4f4f', flexDirection: 'column', justifyContent: 'center'}}>
          <Text style={{ textAlign: 'right', color:'white', fontSize: 20,
          fontFamily: 'BahijJanna-Bold', }}>{strings('OrderStatuses.300')}</Text>
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

    const { order } = this.props;

    if (!order) {
      return (
        <View style={{ flex: 1 }}>
          <ActivityIndicator size="large" style={{ height: 40, flex: 1 }} />
        </View>
      );
    }

    const { order_number } = order;
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Header
            title={order_number ? `${strings('OrderTracker.order#')}${order_number}` : '...'}
            />
          <ScrollView style={{ flex: 1 }}>
            { this.renderStatusLog() }

            { this.renderCompletionButton() }

            <View style={{ marginBottom: 5 }}>
              { this.renderSectionHeader(strings('OrderTracker.detailsHeader')) }
              { this.renderPayment() }
              { this.renderAddress() }
              { this.renderTimeslot() }
            </View>

            { this.renderReceipt() }

            <BlockButton
              onPress={() => Actions.supportChat()}
              style={{ margin: 20, marginTop: 40, marginBottom: 10, height: 60 }}
              text={strings('OrderTracker.problem')}
              color='black'
            />

            { (order.status >= 100) ? null : (
              <BlockButton
                onPress={() => this.props.markOrderCancelled(order.id)}
                style={{ margin: 20, marginTop: 0, marginBottom: 30, height: 60 }}
                text={strings('OrderTracker.cancelOrder')}
                color='#4f4f4f'
              />
            )}
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
    fontFamily: 'BahijJanna-Bold',
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
    fontFamily: 'BahijJanna',
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
    fontFamily: 'BahijJanna-Bold'
  },
  dayText: {
    color: '#CDCDCD',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'BahijJanna-Bold'
  },
  timeText: {
    color: 'black',
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'BahijJanna-Bold'
  },
  AMPMText: {
    marginLeft: 3,
    color: 'black',
    fontSize: 15,
    fontFamily: 'BahijJanna-Bold'
  },

  notesContainer: {
    borderBottomWidth: 1,
    borderColor: '#f7f7f7'
  },
  notesText: {
    padding: 15,
    fontFamily: 'BahijJanna',
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
    fontFamily: 'BahijJanna-Bold',
    textAlign: 'right'
  },
  detailSubtitleText: {
    marginBottom: 10,
    color: '#7B7B7B',
    fontSize: 18,
    lineHeight: 24,
    height: 22,
    fontFamily: 'BahijJanna',
    textAlign: 'right'
  },
  detailImage: {
    width: 32,
    height: 32,
    marginRight: 20
  }
};

const mapStateToProps = ({ OrderTrack, DriverLocation, CurrentSeller }) => {

  const {
    order
  } = OrderTrack;

  const {
    driver_location,
    rotation
  } = DriverLocation;

  const { phone } = CurrentSeller;

  console.log(order);
  return {
    sellerPhone: phone,
    order,
    driver_location,
    rotation
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

  }
)(OrderTracker);
