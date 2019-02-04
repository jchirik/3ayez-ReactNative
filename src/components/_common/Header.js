import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  STATUS_BAR_HEIGHT,
  AYEZ_GREEN
} from '../../Helpers.js';
import { BackButton } from './BackButton';
import AyezText from './AyezText';

const Header = ({
  title = 'Title',
  hasBackButton = true,
  color=AYEZ_GREEN,
  onBackButtonPress,
  blackStyle = false,
  rightButton = null // { text, image_source, onPress }
}) => {

  // left and right header bar dimensions are 48x48
  let leftElement = (
    <View style={{ width: 48, height: 48 }} />
  )
  let rightElement = (
    <View style={{ width: 48, height: 48 }} />
  )

  // hasBackButton
  if (hasBackButton) {
    leftElement = (
      <BackButton
        onPress={onBackButtonPress}
        color={color}
      />
    );
  }

  // rightButton
  if (rightButton) {
    const { text, image_source, onPress } = rightButton;
    rightElement = (
      <TouchableOpacity
        style={{ height: 48, marginRight: 12, justifyContent: 'flex-end', alignItems: 'center' }}
        onPress={() => onPress()}
      >
        <Image
          source={image_source}
          style={{ tintColor: color, width: 24, height: 24}}
          resizeMode={'contain'}
        />
        <AyezText medium color={color} size={10}>{text}</AyezText>
      </TouchableOpacity>
    )
  }

  // blackStyle
  let textStyle = {
    fontSize: 16,
    alignSelf: 'center',
    color
  }
  if (blackStyle) {
    textStyle = {
      fontSize: 18,
      alignSelf: 'flex-start'
    }
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
        borderColor: (blackStyle ? '#F7F7F7' : '#EAEAEA'),
        backgroundColor: 'transparent'
      }}
    >
      {leftElement}
      <View style={{ flex: 1, marginLeft: 10, marginRight: 10 }}>
        <AyezText
          medium={!blackStyle}
          semibold={blackStyle}
          style={textStyle}>{title}</AyezText>
      </View>
      {rightElement}
    </View>
  );
};

export { Header };
