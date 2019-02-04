import React from 'react';
import { View } from 'react-native';
import styles from './styles';

import {
  AyezText
} from '../../../_common';

export default ({ price, promotionPrice }) => {
  if (
    price === null ||
    price === undefined ||
    promotionPrice === null ||
    promotionPrice === undefined
  ) {
    return null;
  }

  const savingsPercent = Math.round(((price - promotionPrice) * 100) / price);
  if (savingsPercent === 0) {
    return null;
  }

  return (
    <View style={styles.savingsPercentContainer} pointerEvents={'none'}>
      <AyezText regular style={styles.savingsPercent}>-{savingsPercent}%</AyezText>
    </View>
  );
};
