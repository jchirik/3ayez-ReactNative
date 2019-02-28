
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

import call from 'react-native-phone-call';

import {
  markOrderCustomerReceived,
  markOrderCancelled
} from '../../../actions';

import {
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
import { sceneKeys, navigateTo } from '../../../router';

class OrderProblem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cancelConfirm: false
    };
  }


  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#FAFCFD' }}>
        <Header title={strings('OrderProblem.header')} blackStyle />

        <BlockButton
          onPress={() => {
            navigateTo(sceneKeys.supportChat)
          }}
          text={strings('OrderProblem.contactSupport')}
          style={{
            marginTop: 20,
            marginLeft: 30,
            marginRight: 30
          }}
          />

        { (this.props.seller.phone) ? (
          <BlockButton
            onPress={() => call({ number: this.props.seller.phone, prompt: false })}
            text={strings('OrderProblem.callStore')}
            color={'#0094ff'}
            style={{
              marginTop: 15,
              marginLeft: 30,
              marginRight: 30
            }}
            />
        ) : null }

        { (this.props.status < 100) ? (
          <BlockButton
            onPress={() => this.setState({ cancelConfirm: true })}
            text={strings('OrderProblem.cancelOrder')}
            color={'#E64E47'}
            style={{
              marginTop: 30,
              marginLeft: 30,
              marginRight: 30
            }}
            />
          ) : null }


          <BottomChoiceSelection
            isVisible={this.state.cancelConfirm}
            onClose={() => this.setState({ cancelConfirm: false })}
            title={strings('OrderProblem.cancelOrderModal')}
            backgroundColor='#E64E47'
            buttons={[
              { text: strings('OrderProblem.cancelOrderConfirm'), action: () => this.props.markOrderCancelled(this.props.id) },
              { text: strings('OrderProblem.cancelOrderCancel'), action: () => console.log('closing') }
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
)(OrderProblem);
