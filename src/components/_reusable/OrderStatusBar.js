import React, { PureComponent } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { statusBarMargin, strings } from '../../Helpers.js';

class OrderStatusBar extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      activeOrders
    } = this.props;

    console.log(activeOrders[0])

    if (activeOrders.length === 1) {
      // track your current order
      return (
          <TouchableOpacity style={{
            backgroundColor: '#09c16c',
            paddingTop: statusBarMargin,
            marginBottom: 5
          }}
            onLayout={this.props.onLayout}
            onPress={() => Actions.tracker({ orderID: activeOrders[0].id })}
          >
            <Text style={{
              margin: 5,
              marginBottom: 8,
              fontSize: 19,
              fontFamily: 'BahijJanna-Bold',
              textAlign: 'center',
              color: 'white'
            }}>لمتابعة اخر اوردر</Text>
          </TouchableOpacity>
      );
    } else if (activeOrders.length > 1) {
      // track your current order
      return (
          <TouchableOpacity style={{
            backgroundColor: '#09c16c',
            paddingTop: statusBarMargin,
            marginBottom: 5
          }}
            onLayout={this.props.onLayout}
            onPress={() => Actions.orderHistory()}
          >
            <Text style={{
              margin: 5,
              marginBottom: 8,
              fontSize: 19,
              fontFamily: 'BahijJanna-Bold',
              textAlign: 'center',
              color: 'white'
            }}>{strings('Settings.orderHistory')}</Text>
          </TouchableOpacity>
      );
    }

    return (
      <View style={{height: statusBarMargin}} />
    );

  }
}


const mapStateToProps = ({ PlacedOrders }) => {
  const { activeOrders } = PlacedOrders;
  return {
    activeOrders
  };
};


export default connect(mapStateToProps, null )(OrderStatusBar);
