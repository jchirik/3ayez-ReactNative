
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

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  markOrderCustomerReceived,
  markOrderCancelled
} from '../../../actions';

import {
  strings,
  localizeDN,
  parsePayment,
  parseTimestamp
} from '../../../Helpers.js';

import {
  Header,
  BlockButton,
  BackButton
} from '../../_common';


class OrderSummary extends Component {

  renderPayment() {
    const { payment_method, auto_total } = this.props;
    return (
      <View>
        <Text>Payment method</Text>
        <View>
          <Image
            source={null}
            resizeMode={'contain'}
          />
          <Text>{(parseFloat(auto_total) ? parseFloat(auto_total).toFixed(2) : '-')} EGP</Text>
        </View>
      </View>
    );
  }

  renderAddress() {
    if (!this.props.address) { return null; }
    const { street, building, floor, apt, area, region } = this.props.address;
    // const addressHeader = `${street}`;
    // let addressArea = '';
    // if (area && area.display_name) { addressArea = localizeDN(area.display_name); }
    return (
      <View>
        <Text>{street}</Text>
        <Text>{(area && area.display_name) ? `${area.display_name.ar}, ` : ''}{region}</Text>
        <Text>Building {building}</Text>
        <Text>Floor {floor}</Text>
        <Text>Apt {apt}</Text>
      </View>
    );
  }


  renderTimeslot() {

    const { timeslot, timestamp } = this.props;
    let timeString = '';
    let dateString = '';

    if (timeslot && timeslot.start) {
      const timeslotStart = parseTimestamp(timeslot.start);
      const timeslotEnd = parseTimestamp(timeslot.end);
      timeString = `${timeslotStart.timeString}${timeslotStart.ampmString} - ${timeslotEnd.timeString}${timeslotEnd.ampmString}`;
      dateString = `${timeslotStart.dateString}`;
    } else {
      const timestamp = parseTimestamp(timestamp);
      timeString = `${timestamp.timeString}${timestamp.ampmString}`;
      dateString = `${timestamp.dateString}`;
    }

    return (
      <View>
        <Text>Delivery time</Text>
        <Text>{timeString}</Text>
        <Text>{dateString}</Text>
      </View>
    );
  }

renderItems() {

  const { items, items_loading } = this.props;

  if (items_loading) {
    return (
      <ActivityIndicator size="small" style={{ margin: 20, height: 40 }} />
    )
  }

  const basketItems = items.map(item => (
    <View>
      <Text>{item.title_arab}</Text>
    </View>
  ));

  return (
    <View>
      <Text>Order items</Text>
      { basketItems }
    </View>
  );
}



  render() {

    const {
      id,
      order_number,
      seller,
      status,
      items_loading
    } = this.props;

    return (
      <View style={{ flex: 1, backgroundColor: '#FAFCFD' }}>
        <Text>Review your order</Text>
        <Text>Order #{order_number}</Text>
        <Text>{seller.display_name ? seller.display_name.ar : ''}</Text>
        <Text>Status: Scheduled</Text>
        { this.renderAddress() }
        { this.renderTimeslot() }
        { this.renderPayment() }
        { this.renderItems() }

        <BackButton fixed />
      </View>
    );
  }
}





          // <ScrollView style={{ flex: 1 }}>
          //
          //   <View style={{ marginBottom: 5 }}>
          //     { this.renderSectionHeader(strings('OrderTracker.detailsHeader')) }
          //
          //
          //
          //   </View>
          //
          //
          //
          //   <BlockButton
          //     onPress={() => Actions.supportChat()}
          //     style={{ margin: 20, marginTop: 40, marginBottom: 10, height: 60 }}
          //     text={strings('OrderTracker.problem')}
          //     color='black'
          //   />
          //
          //   { (status >= 100) ? null : (
          //     <BlockButton
          //       onPress={() => this.props.markOrderCancelled(id)}
          //       style={{ margin: 20, marginTop: 0, marginBottom: 30, height: 60 }}
          //       text={strings('OrderTracker.cancelOrder')}
          //       color='#4f4f4f'
          //     />
          //   )}
          // </ScrollView>

const mapStateToProps = ({ OrderTracker }) => {

  const {
    id,
    items,
    order_number,
    seller,
    status,
    status_log,
    payment_method,
    auto_total,
    address,
    timeslot,
    timestamp,
    notes,

    items_loading
  } = OrderTracker;

  return {
    id,
    items,
    order_number,
    seller,
    status,
    status_log,
    payment_method,
    auto_total,
    address,
    timeslot,
    timestamp,
    notes,

    items_loading
   };
 };

export default connect(mapStateToProps,
  {
    markOrderCustomerReceived,
    markOrderCancelled
  }
)(OrderSummary);
