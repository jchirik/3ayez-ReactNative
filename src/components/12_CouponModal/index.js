import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
   Image,
   ActivityIndicator,
   TouchableOpacity,
   SectionList,
   KeyboardAvoidingView,
   Platform,
   BackHandler,
   AsyncStorage
 } from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import {
  Header,
  BlockButton,
  InputField,
  SubtleButton,
  LoadingOverlay,
  AyezText
} from '../_common';

const coupon_shape = require('../../../assets/images_v2/CouponModal/coupon_shape.png');
const invalid_coupon = require('../../../assets/images_v2/CouponModal/invalid_coupon.png');

import {
  applyCoupon,
  resetCoupon
} from '../../actions';

class CouponModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      code: ''
    };
  }

  componentDidMount() {
    this.setState({ code: '' });
  }

  applyCoupon() {
    if (!this.state.code) { return; }
    this.props.applyCoupon(this.state.code)
  }

  resetCoupon() {
    this.setState({ code: '' });
    this.props.resetCoupon()
  }

  renderCouponError() {
    const { error } = this.props;
    let error_description = 'Oops, invalid coupon!'

    if (error === 'FIRSTTIMEONLY') {
      error_description = 'For new users only';
    } else if (error === 'ALREADYUSED') {
      error_description = 'Already used';
    }

    return (
      <View style={{
        width: 335,
        backgroundColor: 'white',
        borderRadius: 14
      }}>
        <Image
          source={invalid_coupon}
          style={{
            marginTop: 10,
            height: 180,
           }}
          resizeMode={'contain'}
        />
        <AyezText bold style={{
          marginTop: 14,
          textAlign: 'center',
          fontSize: 18
        }}>{error_description}</AyezText>
        <AyezText light style={{
          marginTop: 10,
          marginLeft: 48,
          marginRight: 48,
          textAlign: 'center',
          fontSize: 15,
          color: '#8E8E93'
        }}>Please revise the coupon entered and continue</AyezText>
        <BlockButton
          text={'Reenter Coupon'}
          style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
          onPress={this.resetCoupon.bind(this)}
          />
        <SubtleButton
          text={'Close'}
          onPress={()=> Actions.pop()}
        />
      </View>
    )
  }

  renderCouponEntry() {
    return (
      <View style={{
        width: 335,
        height: 318
      }}>
        <Image
          source={coupon_shape}
          style={{
            position: 'absolute',
            width: 335,
            height: 318,
           }}
          resizeMode={'contain'}
        />
        <AyezText bold style={{
          marginTop: 40,
          textAlign: 'center',
          fontSize: 18
        }}>Submit Coupon</AyezText>
        <AyezText light style={{
          marginTop: 14,
          textAlign: 'center',
          fontSize: 15,
          color: '#8E8E93'
        }}>Apply coupon code for discounts</AyezText>

        <View style={{ flex: 1 }} />

        <View style={{
          marginLeft: 24,
          marginRight: 24
        }}>
          <InputField
            style={{
              marginBottom: 20
            }}
            value={this.state.code}
            onChangeText={(code) => this.setState({ code })}
            onSubmitEditing={this.applyCoupon.bind(this)}
            placeholder={'write your coupon code here'}
            editable={!this.props.is_loading}
          />
          <BlockButton
            text={'SUBMIT'}
            style={{ marginBottom: 24 }}
            onPress={this.applyCoupon.bind(this)}
            />
          <LoadingOverlay isVisible={this.props.is_loading} />
        </View>
      </View>
    )
  }

  renderCouponApplied() {
    const { coupon } = this.props;
    return (
      <View style={{
        width: 335,
        backgroundColor: 'white',
        borderRadius: 14
      }}>
        <AyezText bold style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: 18
        }}>{coupon.code} accepted!</AyezText>
        <AyezText light style={{
          marginTop: 10,
          marginLeft: 48,
          marginRight: 48,
          textAlign: 'center',
          fontSize: 15,
          color: '#8E8E93'
        }}>{coupon.amount.toFixed(2)} EGP off your order</AyezText>
        <BlockButton
          text={'OK'}
          style={{ marginLeft: 24, marginRight: 24, marginTop: 20 }}
          onPress={()=> Actions.pop()}
          />
        <SubtleButton
          text={'Remove Coupon'}
          onPress={this.resetCoupon.bind(this)}
        />
      </View>
    )
  }

  render() {

    let couponComponent = this.renderCouponEntry();

    if (this.props.coupon) {
      couponComponent = this.renderCouponApplied();
    }
    if (this.props.error && this.props.error !== 'BADCONNECTION') {
      couponComponent = this.renderCouponError();
    }

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: `rgba(0, 0, 0, 0.6)`,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TouchableOpacity
          onPress={() => Actions.pop()}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        { couponComponent }
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({ Coupon }) => {
  const {
    coupon,
    is_loading,
    error
  } = Coupon;
  return {
    coupon,
    is_loading,
    error
  };
};

export default connect(mapStateToProps, {
  applyCoupon,
  resetCoupon
})(CouponModal);
