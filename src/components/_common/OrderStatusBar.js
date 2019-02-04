import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import {
  AYEZ_GREEN,
  STATUS_BAR_HEIGHT
} from '../../Helpers.js';


const status_bar_truck = require('../../../assets/images_v2/OrderTracker/status_bar_truck.png');

import { AyezText, RTLImage } from '../_common';
import { strings, translate } from '../../i18n.js';


class OrderStatusBar extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      orders
    } = this.props;

    if (orders.length > 0) {
      // track your current order

      let onPress = () => Actions.orderTracker({ order_id: orders[0].id });
      let text = strings('OrderStatusBar.trackOrder');
      if (orders.length > 1) {
        onPress = () => Actions.orderHistory();
        text = strings('OrderStatusBar.multipleOrders');
      }

      return (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: AYEZ_GREEN,
              paddingTop: STATUS_BAR_HEIGHT + 6,
              marginBottom: 4,
              paddingBottom: 11,
              shadowColor: '#000',
              shadowOffset: { width: -1, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
            }}
            onPress={() => onPress()}
          >
              <AyezText semibold color={'white'} size={15}>{text}</AyezText>
              <RTLImage
                source={status_bar_truck}
                style={{ width: 24, height: 24, marginLeft: 10 }}
                resizeMode={'contain'}
              />
          </TouchableOpacity>
      );
    }

    return (
      <View style={{height: STATUS_BAR_HEIGHT}} />
    );

  }
}


const mapStateToProps = ({ OngoingOrders }) => {
  const { orders } = OngoingOrders;
  return {
    orders
  };
};


export default connect(mapStateToProps, null )(OrderStatusBar);
