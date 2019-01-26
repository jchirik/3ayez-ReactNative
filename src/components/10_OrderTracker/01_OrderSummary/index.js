
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
  parseTimestamp,


  paymentIcon,
  AYEZ_GREEN
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
  BottomChoiceSelection
} from '../../_common';

import { SummarySection } from './SummarySection';


class OrderSummary extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cancelConfirm: false
    };
  }

  // 1. Order Number
  renderOrderNumber() {
    const { order_number } = this.props;
    return (
      <AyezText bold size={30}>Order #{order_number}</AyezText>
    )
  }

  // 2. Seller
  renderSeller() {
    const { seller } = this.props;
    return (
      <AyezText medium>{translate(seller.display_name)}</AyezText>
    )
  }

  // 3. Status
  renderStatus() {
    const {
      status,
      timeslot,
      is_timeslot_ongoing
    } = this.props;

    let statusText = '-'
    if (status === 0) {
      if (is_timeslot_ongoing) { statusText = 'Awaiting Store' }
      else if (Date.now() < timeslot.start) { statusText = 'Scheduled' }
    } else if (status <= 50) {
      statusText = 'Preparing in Store';
    } else if (status < 100) {
      statusText = 'Assigning Driver';
    } else if (status < 200) {
      statusText = 'On the way';
    } else if (status === 200) {
      statusText = 'Complete';
    } else if (status === 300) {
      statusText = 'Cancelled';
    } else if (status === 400) {
      statusText = 'Rejected by Store';
    }
    return (
      <AyezText medium>Status: {statusText}</AyezText>
    )
  }

  // 4. Address
  renderAddress() {
    if (!this.props.address) { return null; }
    const { street, building, floor, apt, area, region } = this.props.address;
    return (
      <SummarySection>
        <AyezText regular color={AYEZ_GREEN} size={15}>ADDRESS</AyezText>
        <AyezText medium>{street}</AyezText>
        <AyezText medium>{translate(area)} {region}</AyezText>
        <AyezText medium>Building {building}</AyezText>
        <AyezText medium>Floor {floor}</AyezText>
        <AyezText medium>Apt {apt}</AyezText>
      </SummarySection>
    );
  }

  // 5. Delivery Time
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
      <SummarySection>
        <AyezText regular color={AYEZ_GREEN} size={15}>DELIVERY TIME</AyezText>
        <AyezText medium>{dateString}</AyezText>
        <AyezText medium>{timeString}</AyezText>
      </SummarySection>
    );
  }

  // 6. Payment
  renderPayment() {
    const { payment_method, auto_total } = this.props;

    if (!payment_method) { return null; }

    let payment_text = 'Cash';
    if (payment_method.type === 'CREDIT') {
      payment_text = `**** ${payment_method.last4}`;
    }
    const payment_image = paymentIcon(payment_method.brand, payment_method.type);

    return (
      <SummarySection>
        <AyezText regular color={AYEZ_GREEN} size={15}>PAYMENT</AyezText>
        <View>
          <AyezText medium>{(parseFloat(auto_total) ? parseFloat(auto_total).toFixed(2) : '-')} EGP</AyezText>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={payment_image}
              style={{
                width: 30,
                height: 20
               }}
              resizeMode={'contain'}
              />
            <AyezText regular style={{ alignSelf: 'center', marginLeft: 6 }}>{payment_text}</AyezText>
          </View>
        </View>
      </SummarySection>
    );
  }

  // 7. Items
  renderItems() {
    const { items, items_loading } = this.props;
    if (items_loading) {
      return (
        <ActivityIndicator size="small" style={{ margin: 20, height: 40 }} />
      )
    }
    const basketItems = items.map(item => (
      <View>
        <AyezText regular>{translate(item)}</AyezText>
      </View>
    ));
    return (
      <SummarySection>
        <AyezText regular color={AYEZ_GREEN} size={15}>ORDER ITEMS</AyezText>
        { basketItems }
      </SummarySection>
    );
  }

  // 8. summary
  renderSummary() {
    const {
      delivery_fee,
      tip,
      coupon,
      auto_item_total,
      auto_total
    } = this.props;

    return (
      <SummarySection>
        <AyezText regular color={AYEZ_GREEN} size={15}>SUMMARY</AyezText>
        <View>
          <AyezText medium>Subtotal: {(parseFloat(auto_item_total) ? parseFloat(auto_item_total).toFixed(2) : '-')} EGP</AyezText>
          <AyezText medium>Delivery: {(parseFloat(delivery_fee) ? parseFloat(delivery_fee).toFixed(2) : '-')} EGP</AyezText>
          <AyezText medium>Tip: {(parseFloat(tip) ? parseFloat(tip).toFixed(2) : '0.00')} EGP</AyezText>
          <AyezText medium>Coupon: {(coupon && parseFloat(coupon.amount) ? `${parseFloat(coupon.amount).toFixed(2)} EGP` : '-')}</AyezText>
          <AyezText medium>Total: {(parseFloat(auto_total) ? parseFloat(auto_total).toFixed(2) : '-')} EGP</AyezText>
        </View>
      </SummarySection>
    );
  }



  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAFCFD' }}>
        <Header title='Order Summary' blackStyle />
        <ScrollView>
          <SummarySection>
            { this.renderOrderNumber() }
            { this.renderSeller() }
            { this.renderStatus() }
          </SummarySection>
          { this.renderAddress() }
          { this.renderTimeslot() }
          { this.renderPayment() }
          { this.renderItems() }
          { this.renderSummary() }


          <BlockButton
            onPress={() => Actions.supportChat()}
            text={'SUPPORT'}
            style={{
              marginTop: 20,
              marginLeft: 30,
              marginRight: 30
            }}
            />
          { (this.props.status < 200) ? (
            <BlockButton
              onPress={() => this.setState({ cancelConfirm: true })}
              text={'CANCEL YOUR ORDER'}
              color={'#E64E47'}
              style={{
                marginTop: 20,
                marginLeft: 30,
                marginRight: 30
              }}
              />
            ) : null }
          <View style={{ height: 40 }} />
        </ScrollView>

        <BottomChoiceSelection
          isVisible={this.state.cancelConfirm}
          onClose={() => this.setState({ cancelConfirm: false })}
          title='Are you sure you want to cancel?'
          backgroundColor='#E64E47'
          buttons={[
            { text: 'Yes, sure', action: () => this.props.markOrderCancelled(this.props.id) },
            { text: 'No, cancel', action: () => console.log('closing') }
          ]}
        />
      </View>
    );
  }
}


const mapStateToProps = ({ OrderTracker }) => {

  const {
    id,
    items,
    order_number,
    seller,
    status,
    status_log,
    payment_method,
    address,
    timeslot,
    timestamp,
    notes,

    delivery_fee,
    tip,
    coupon,
    auto_item_total,
    auto_total,

    is_timeslot_ongoing,

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
    address,
    timeslot,
    timestamp,
    notes,

    delivery_fee,
    tip,
    coupon,
    auto_item_total,
    auto_total,

    is_timeslot_ongoing,

    items_loading
   };
 };

export default connect(mapStateToProps,
  {
    markOrderCustomerReceived,
    markOrderCancelled
  }
)(OrderSummary);
