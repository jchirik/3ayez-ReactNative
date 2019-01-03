import React from 'react';
import {
  Text,
  TextInput,
  View
} from 'react-native';


const InputField = ({ style, textStyle, value, onChangeText, onSubmitEditing, emoji }) => {
  return (
    <View style={[ styles.inputRow, style ]}>
      <TextInput
        onChangeText={onChangeText}
        value={value}
        autoCorrect={false}
        style={[ styles.inputStyle, textStyle ]}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize={'none'}
        underlineColorAndroid='transparent'
        autoFocus
        blurOnSubmit={false}
      />
      <Text style={{
        fontSize: 24,
        marginRight: 12,
        marginLeft: 8
      }}>{emoji}</Text>
    </View>
  );
};

const styles = {
  inputStyle: {
    color: '#000',
    padding: 0,
    alignSelf: 'stretch',
    fontSize: 24,
    flex: 1,
    textAlign: 'right'
  },
  inputRow: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    height: 52,
    borderWidth: 1,
    borderColor: '#0094ff',
    borderRadius: 5
  },
};

export { InputField };
