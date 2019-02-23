import React from 'react';
import { View } from 'react-native';

const SummarySection = ({
  children
}) => {
  return (
    <View
      style={{
        alignSelf: 'stretch',
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 18,
        paddingRight: 18,
        borderBottomWidth: 1,
        borderColor: '#EAEAEA',
        backgroundColor: 'transparent'
      }}
    >
      {children}
    </View>
  );
};

export { SummarySection };
