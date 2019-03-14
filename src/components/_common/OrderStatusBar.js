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

import images from '../../theme/images'

import { AyezText, RTLImage } from '../_common';
import { strings, translate } from '../../i18n.js';
import { sceneKeys, navigateTo } from '../../router';


class OrderStatusBar extends PureComponent {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      orders
    } = this.props;

    if ( orders.length > 0 &&  orders.some( order => order.status != 300)) {
      // track your current order
      let onPress = () => {
        navigateTo(sceneKeys.orderTracker, { order_id: orders[0].id })
      }
      let text = strings('OrderStatusBar.trackOrder');
      if (orders.length > 1) {
        onPress = () => {
          navigateTo(sceneKeys.orderHistory);
        }
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
              paddingBottom: 11,
              shadowColor: '#000',
              shadowOffset: { width: -1, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
              zIndex: 10
            }}
            onPress={() => onPress()}
          >
              <AyezText semibold color={'white'} size={15}>{text}</AyezText>
              <RTLImage
                source={images.orderTrackerTruck}
                style={{ width: 24, height: 24, marginLeft: 10 }}
                resizeMode={'contain'}
              />
          </TouchableOpacity>
      );
    }

    return (
      <View style={{
        backgroundColor: this.props.color || '#444444',
        height: STATUS_BAR_HEIGHT
      }} />
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
