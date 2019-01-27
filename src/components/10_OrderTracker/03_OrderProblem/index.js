
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
        <Header title='Order Problem' blackStyle />

        <BlockButton
          onPress={() => Actions.supportChat()}
          text={'CONTACT SUPPORT'}
          style={{
            marginTop: 20,
            marginLeft: 30,
            marginRight: 30
          }}
          />
        { (this.props.status < 100) ? (
          <BlockButton
            onPress={() => this.setState({ cancelConfirm: true })}
            text={'CANCEL YOUR ORDER'}
            color={'#E64E47'}
            style={{
              marginTop: 10,
              marginLeft: 30,
              marginRight: 30
            }}
            />
          ) : null }


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
)(OrderProblem);
