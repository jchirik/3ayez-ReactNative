import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform
} from 'react-native';

import { strings } from '../../Helpers.js';

const removeIcon = require('../../../assets/images/remove.png');

const CouponBanner = ({ style, coupon, onApply, onRemove, mutable }) => {

    if (coupon) {
      let couponTitle = '';
      let couponSubtitle = '';

      if (coupon.type === 'percent_discount') {
        couponTitle = `%${coupon.amount*100} ${strings('CouponBanner.off')}`;

      } else if (coupon.type === 'pound_discount') {
        couponTitle = `-${coupon.amount.toFixed(2)} EGP`;
        couponSubtitle = `ج${coupon.amount} ${strings('CouponBanner.off')}`;
        if (coupon.minimum) {
          couponSubtitle += `${strings('CouponBanner.minimum')} ${coupon.minimum}ج`;
        }
      }

      return (

        <View style={[
          {
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#37CAAF'
          },
          style
        ]}>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          { mutable ? (
          <TouchableOpacity onPress={onRemove}>
            <Image
            source={removeIcon}
            style={{ width: 15, height: 15, margin: 12}}
            />
          </TouchableOpacity>
        ) : null }
          <View style={{
            marginLeft: (mutable ? 0 : 12)
          }}>
            <Text style={{
              backgroundColor:'transparent',
              lineHeight: (Platform.OS === 'ios') ? 22 : 13,
              height: 18,
              fontSize: 16,
              backgroundColor: 'transparent',
              color: 'white'
            }}>{coupon.code}</Text>
            <Text style={{
              fontSize: 16,
              lineHeight: 20,
              paddingBottom: 4, // added for android
              backgroundColor: 'transparent',
              color: 'white'
            }}>{couponSubtitle}</Text>
          </View>
        </View>

        <Text style={{
          fontSize: 18,
          color: 'white',
          marginRight: 12
        }}>{couponTitle}</Text>

        </View>
      );
    }

    if (mutable) {
    return (
      <TouchableOpacity
      onPress={onApply}
      activeOpacity={0.8}
      style={[{
        alignSelf: 'flex-end',
        backgroundColor: '#FF8B2A',
        padding: 6,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 40,
        marginRight: 12
      },
      style
      ]}>
      <Text style={{
        color: 'white',
        fontSize: 14
      }}>{strings('CouponBanner.addCoupon')}</Text>
      </TouchableOpacity>
    );
  }

  return null;
};

export default CouponBanner;
