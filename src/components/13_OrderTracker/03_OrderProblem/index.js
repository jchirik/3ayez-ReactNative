
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
  AYEZ_GREEN,
  ZOPIM_ACCOUNT_KEY
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

import { sceneKeys, navigateTo, navigateBack } from '../../../router';
import zendesk from '../../../ZendeskChat/ZendeskChatNativeModule';

class OrderProblem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cancelConfirm: false
    };
    BackHandler.addEventListener("hardwareBackPress", this.onAndroidBackPress);
  }

  onBackPress() {
    navigateBack();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.onAndroidBackPress);
  }

  onAndroidBackPress = () => {
    this.onBackPress();
    return true;
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAFCFD" }}>
        <Header
          title={strings("OrderProblem.header")}
          blackStyle
          onBackButtonPress={this.onBackPress.bind(this)}
        />

        <BlockButton
          onPress={() => {
            zendesk.start({
              [zendesk.ZOPIM_ACCOUNT_KEY]: ZOPIM_ACCOUNT_KEY,
              [zendesk.VISITOR_NAME]: this.props.name || 'Client',
              [zendesk.VISITOR_PHONE_NUMBER]: this.props.phone || ''
            });
          }}
          text={strings("OrderProblem.contactSupport")}
          style={{
            marginTop: 20,
            marginLeft: 30,
            marginRight: 30
          }}
        />

        {this.props.seller.phone ? (
          <BlockButton
            onPress={() =>
              call({ number: this.props.seller.phone, prompt: false })
            }
            text={strings("OrderProblem.callStore")}
            color={"#0094ff"}
            style={{
              marginTop: 15,
              marginLeft: 30,
              marginRight: 30
            }}
          />
        ) : null}

        {this.props.status < 100 ? (
          <BlockButton
            onPress={() => this.setState({ cancelConfirm: true })}
            text={strings("OrderProblem.cancelOrder")}
            color={"#E64E47"}
            style={{
              marginTop: 30,
              marginLeft: 30,
              marginRight: 30
            }}
          />
        ) : null}

        <BottomChoiceSelection
          isVisible={this.state.cancelConfirm}
          onClose={() => this.setState({ cancelConfirm: false })}
          title={strings("OrderProblem.cancelOrderModal")}
          backgroundColor="#E64E47"
          buttons={[
            {
              text: strings("OrderProblem.cancelOrderConfirm"),
              action: () => this.props.markOrderCancelled(this.props.id)
            },
            {
              text: strings("OrderProblem.cancelOrderCancel"),
              action: () => console.log("closing")
            }
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
