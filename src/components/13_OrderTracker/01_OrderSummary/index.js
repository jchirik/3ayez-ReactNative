import React, { Component } from 'react';
import {
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
  paymentIcon,
  formatStatusText,
  AYEZ_GREEN
} from '../../../Helpers.js';

import {
  strings,
  translate,
  formatTimestamp,
  formatDay,
  formatCurrency
} from '../../../i18n.js';


import {
  Header,
  BlockButton,
  BackButton,
  AyezText,
  BottomChoiceSelection
} from '../../_common';

import { SummarySection } from './SummarySection';
import { sceneKeys, navigateTo } from '../../../router';


class OrderSummary extends Component {

  // 1. Order Number
  renderOrderNumber() {
    const { order_number } = this.props;
    return (
      <AyezText bold size={30}>{strings('Receipt.orderNumber', { order_number })}</AyezText>
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

    const statusText = formatStatusText(status, is_timeslot_ongoing, timeslot);
    return (
      <AyezText medium>{strings('OrderSummary.statusField')} {statusText}</AyezText>
    )
  }

  // 4. Address
  renderAddress() {
    if (!this.props.address) { return null; }
    const { street, building, floor, apt, area, region } = this.props.address;
    return (
      <SummarySection>
        <AyezText regular color={AYEZ_GREEN} size={15}>{strings('OrderSummary.addressHeader')}</AyezText>
        <AyezText medium>{street}</AyezText>
        <AyezText medium>{translate(area)} {region}</AyezText>
        <AyezText medium>{strings('Address.building')} {building}</AyezText>
        <AyezText medium>{strings('Address.apt')} {apt}</AyezText>
      </SummarySection>
    );
  }

  // 5. Delivery Time
  renderTimeslot() {
    const { timeslot, timestamp } = this.props;
    let timeString = '';
    let dateString = '';
    if (timeslot && timeslot.start) {
      timeString = `${formatTimestamp(timeslot.start, 'h:mmA')} - ${formatTimestamp(timeslot.end, 'h:mmA')}`;
      dateString = formatDay(timeslot.start);
    } else {
      timeString = formatTimestamp(timestamp, 'h:mmA');
      dateString = formatDay(timestamp);
    }
    return (
      <SummarySection>
        <AyezText regular color={AYEZ_GREEN} size={15}>{strings('OrderSummary.deliveryTimeHeader')}</AyezText>
        <AyezText medium>{dateString}</AyezText>
        <AyezText medium>{timeString}</AyezText>
      </SummarySection>
    );
  }

  // 6. Payment
  renderPayment() {
    const { payment_method, auto_total } = this.props;

    if (!payment_method) { return null; }

    let payment_text = strings('PaymentMethod.cash');
    if (payment_method.type === 'CREDIT') {
      payment_text = `**** ${payment_method.last4}`;
    }
    const payment_image = paymentIcon(payment_method.brand, payment_method.type);

    return (
      <SummarySection>
        <AyezText regular color={AYEZ_GREEN} size={15}>{strings('OrderSummary.paymentHeader')}</AyezText>
        <View>
          <AyezText medium>{formatCurrency(auto_total)}</AyezText>
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
        <AyezText regular color={AYEZ_GREEN} size={15}>{strings('OrderSummary.orderItemsHeader')}</AyezText>
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
        <AyezText regular color={AYEZ_GREEN} size={15}>{strings('OrderSummary.summaryHeader')}</AyezText>
        <View>
          <AyezText medium>{strings('Receipt.subtotal')} {formatCurrency(auto_item_total)}</AyezText>
          <AyezText medium>{strings('Receipt.deliveryFee')} {formatCurrency(delivery_fee)}</AyezText>
          <AyezText medium>{strings('Receipt.tip')} {formatCurrency(tip)}</AyezText>
          {coupon ? (
            <AyezText medium>{strings('Receipt.coupon', {code: coupon.code})} {formatCurrency(coupon.amount)}</AyezText>
          ) : null}
          <AyezText medium>{strings('Receipt.total')} {formatCurrency(auto_total)}</AyezText>
        </View>
      </SummarySection>
    );
  }



  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAFCFD' }}>
        <Header title={strings('OrderSummary.orderSummary')} blackStyle />
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
            onPress={() => { 
              navigateTo(sceneKeys.orderProblem)
            }}
            text={strings('OrderTracker.problem')}
            color={'black'}
            style={{
              marginTop: 20,
              marginLeft: 30,
              marginRight: 30,
              marginBottom: 20
            }}
          />
        </ScrollView>
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

export default connect(mapStateToProps, null)(OrderSummary);
