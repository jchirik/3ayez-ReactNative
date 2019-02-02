import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';

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
      <Text style={styles.savingsPercent}>-{savingsPercent}%</Text>
    </View>
  );
};
