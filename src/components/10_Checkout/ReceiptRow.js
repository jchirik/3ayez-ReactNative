import React from 'react';
import { Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';

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
        <Text style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 15, color: '#8E8E93'
        }}>{title}</Text>

        <Text style={{
          fontFamily: 'Poppins-Bold',
          fontSize: 15, color
        }}>{cost.toFixed(2)} EGP</Text>
      </View>
  );
};

export { ReceiptRow };
