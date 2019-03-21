import React from 'react';
import { View, TextInput, TouchableOpacity, I18nManager } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {
  STATUS_BAR_HEIGHT
} from '../../Helpers.js';
import { FONT_REGULAR } from '../../i18n.js';
import { RTLImage } from '.';
import images from '../../theme/images'

const SearchBar = ({
  value,
  onChangeText,
  placeholder = '',
  autoFocus = true
}) => {

  let clearSearchButton = null;
  if (value) {
    clearSearchButton = (
      <TouchableOpacity
        style={{
          alignSelf: 'stretch',
          width: 36,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => onChangeText('')}
      >
      <RTLImage
        source={images.searchClearIcon}
        style={{
          width: 20,
          height: 20
         }}
        resizeMode={'contain'}
      />
      </TouchableOpacity>
    )
  }

  return (
    <View style={{
      height: 36,
      borderRadius: 8,
      backgroundColor: '#EDEEF0',
      margin: 10,
      flexDirection: 'row',
      alignItems: 'center'
    }}>
    <RTLImage
      source={images.magnifyingIcon}
      style={{
        width: 20,
        height: 20,
        tintColor: '#8E8E93',
        marginLeft: 12
       }}
      resizeMode={'contain'}
    />
      <TextInput
        style={{
          flex: 1,
          alignSelf: 'stretch',
          textAlign: (I18nManager.isRTL ? 'right' : 'left'),
          padding: 0,
          paddingLeft: 12,
          fontSize: 14,
          fontFamily: FONT_REGULAR(),
          fontWeight: "300",
        }}
        placeholder={placeholder}
        placeholderTextColor={'#8E8E93'}
        value={value}
        onChangeText={(query) => onChangeText(query)}
        autoCapitalize={'none'}
        underlineColorAndroid='transparent'
        autoCorrect={false}
        autoFocus={autoFocus}
        />
      { clearSearchButton }
    </View>
  )
};

export { SearchBar };
