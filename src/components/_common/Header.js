import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  STATUS_BAR_HEIGHT
} from '../../Helpers.js';
import { BackButton } from './BackButton';
import { strings } from '../../Helpers.js';

const Header = ({
  title = 'Title',
  hasBackButton = true,
  color='#2DD38F',
  onBackButtonPress
}) => {

  // left and right header bar dimensions are 48x48
  let leftElement = (
    <View style={{ width: 48, height: 48 }} />
  )
  let rightElement = (
    <View style={{ width: 48, height: 48 }} />
  )

  if (hasBackButton) {
    leftElement = (
      <BackButton
        onPress={onBackButtonPress}
        color={color}
      />
    );
  }

  return (
    <View
      style={{
        alignSelf: 'stretch',
        marginTop: STATUS_BAR_HEIGHT + 6,
        paddingBottom: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#EAEAEA',
        backgroundColor: 'transparent'
      }}
    >
      {leftElement}
      
      <Text style={{
        fontSize: 16,
        color,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium'
      }}>{title}</Text>

      {rightElement}
    </View>
  );
};

export { Header };
