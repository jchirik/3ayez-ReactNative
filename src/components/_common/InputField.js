import React from 'react';
import {
  TextInput,
  View,
  I18nManager
} from 'react-native';

import { FONT_REGULAR } from '../../i18n.js';

const InputField = (props) => {
  return (
    <TextInput
      {...props}
      autoCorrect={false}
      style={[ styles.inputStyle, props.style || {} ]}
      autoCapitalize={'none'}
      underlineColorAndroid='transparent'
      autoFocus
    />
  );
};

const styles = {
  inputStyle: {
    color: 'black',
    height: 40,
    fontSize: 13,
    fontFamily: FONT_REGULAR(),
    fontWeight: "300",
    textAlign: (I18nManager.isRTL ? 'right' : 'left'),
    backgroundColor: 'white',
    borderRadius: 8,
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  }
};

export { InputField };
