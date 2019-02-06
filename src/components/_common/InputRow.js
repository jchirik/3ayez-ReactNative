import React, { Component } from 'react';
import { TouchableOpacity, View, TextInput, I18nManager } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { AyezText } from '.';

import { strings, translate, FONT_MEDIUM } from '../../i18n.js';

class InputRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      title,
      value,
      onChangeText,
      placeholder,
      required=true,
      multiline=false
    } = this.props;

    let placeholderText = '';
    if (placeholder) {
      placeholderText = placeholder;
    } else if (required) {
      placeholderText = 'required';
    } else {
      placeholderText = 'optional';
    }

    return (
      <View style={{
        paddingTop: 16,
        paddingBottom: 16,
        marginLeft: 16,
        marginRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#EAEAEA',
        borderBottomWidth: 1
      }}>
        <View style={{ width: 126,
          alignItems: 'flex-start' }}>
          <AyezText semibold size={15}>{title}</AyezText>
        </View>
        <View style={{ flex: 1 }}>
        <TextInput
          style={{
            textAlign: (I18nManager.isRTL ? 'right' : 'left'),
            alignItems: 'stretch',
            paddingLeft: 12,
            fontSize: 14,
            fontFamily: FONT_MEDIUM(),
            color: 'black'
          }}
          placeholder={placeholderText}
          placeholderTextColor={'#8E8E93'}
          value={value}
          onChangeText={(text) => onChangeText(text)}
          underlineColorAndroid='transparent'
          autoCorrect={false}
          multiline={multiline}
          />
        </View>
      </View>
    )
  }
}


export default InputRow;
