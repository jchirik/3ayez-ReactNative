import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { AyezText } from '.';

// title on the left, all other children on the right

const Row = ({
  title,
  onPress,
  style,
  disabled=false,
  children
}) => {

  return (
      <TouchableOpacity
        style={{
          flex: 1,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
          paddingBottom: 14,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: '#f7f7f7',
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'flex-end',
          ...style
        }}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <AyezText regular size={15} color={'#8E8E93'}
          style={{
            marginRight: 20,
            maxWidth: 160
        }}>{title}</AyezText>
        <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
          {children}
        </View>
      </TouchableOpacity>
  );
};

export { Row };
