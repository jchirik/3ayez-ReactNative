import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import colors from '../../../../theme/colors';
import {
  AyezText
} from '../../../_common';
import { strings, formatCurrency } from '../../../../i18n.js';

export default ({ price, promotion_price, item }) => {
  let mainPriceText = '-';
  let previousPriceText = '';
  let savingsText = '';
  if (price !== null) {
    mainPriceText = formatCurrency(price);
    if (promotion_price !== null) {
      mainPriceText = formatCurrency(promotion_price);
      previousPriceText = formatCurrency(price);
      const savingsAmount = price - promotion_price;
      if (savingsAmount !== 0) {
        savingsText = strings('Items.savingsText', { savings: formatCurrency(savingsAmount) });
      }
    }
  }

  if (item.incr && item.unit) {
    mainPriceText += ` / ${item.incr}${item.unit}`;
  } else if (item.incr && item.incr !== 1) {
    mainPriceText += ` / ${item.incr}`;
  }

  return (
    <View>
      {savingsText ? (
        <AyezText regular size={14} color={colors.fadedRed}>{savingsText}</AyezText>
      ) : null }
      <View style={styles.priceContainer}>
        <AyezText medium size={16} style={{
          textDecorationLine: 'line-through',
          textDecorationStyle: 'solid',
          marginRight: 7
        }}>{previousPriceText}</AyezText>
        <AyezText medium size={16}>{mainPriceText}</AyezText>
      </View>
    </View>
  );
};
