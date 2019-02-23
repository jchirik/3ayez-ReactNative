import React from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  AyezText
} from '../_common';
import {
  formatCurrency
} from '../../i18n.js';

// title on the left, all other children on the right

const ReceiptRow = ({
  title,
  cost=0,
  color='#353333'
}) => {

  return (
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 4,
          paddingBottom: 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <AyezText regular style={{
          fontSize: 15, color: '#8E8E93'
        }}>{title}</AyezText>

        <AyezText bold color={color} size={15}>{formatCurrency(cost)}</AyezText>
      </View>
  );
};

export { ReceiptRow };
