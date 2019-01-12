import React from 'react';
import {
  Text,
  TextInput,
  View
} from 'react-native';

const InputField = ({
  style,
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  editable=true
}) => {
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      autoCorrect={false}
      style={[ styles.inputStyle, style ]}
      onSubmitEditing={onSubmitEditing}
      autoCapitalize={'none'}
      underlineColorAndroid='transparent'
      editable={editable}
      autoFocus
    />
  );
};

const styles = {
  inputStyle: {
    color: 'black',
    height: 40,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
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
