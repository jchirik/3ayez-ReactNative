import React from 'react';
import { Image, TextInput, TouchableOpacity, View } from 'react-native';

const exitIcon = require('../../../assets/images/exit.png');
const searchIcon = require('../../../assets/images/magnifying_glass.png');

const SearchBar = ({
  reference,
  containerStyle,
  icon = searchIcon,
  color = 'black',
  placeholder,
  onFocus,
  searchQuery,
  onQueryDidChange
}) => {

  let clearButton = (
    <TouchableOpacity
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20
      }}
      onPress={() => onQueryDidChange('')}
    >
    <Image
      source={exitIcon}
      style={{
        width: 16,
        height: 16,
        tintColor: 'black',
      }}
      resizeMode={'contain'}
    />
    </TouchableOpacity>
  )
  if (searchQuery === '') { clearButton = (<View style={{width: 20}} />); }


  const input = (
    <TextInput
      ref={(c) => reference(c)}
      style={[styles.searchPlaceholderText, { color }]}
      placeholder={placeholder}
      onFocus={onFocus}
      placeholderTextColor={'#cecece'}
      value={searchQuery}
      onChangeText={(text) => onQueryDidChange(text)}
      autoCapitalize={'none'}
      underlineColorAndroid='transparent'
      blurOnSubmit={false}
    />
  );

  const searchImage = (
    <Image
        source={icon}
        style={{
          width: 18,
          height: 18,
          tintColor: color
        }}
    />
  );



  return (
    <View style={[styles.bar, containerStyle]}>
      {clearButton}
      {input}
      {searchImage}
    </View>
  );
};


const styles = {
  bar: {
    height: 48,
    padding: 10,
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
searchPlaceholderText: {
  flex: 1,
  position: 'relative',
  fontSize: 20,
  marginRight: 8,
  padding: 0, // added for android
  alignSelf: 'stretch',
  backgroundColor: 'transparent',
  textAlign: 'right'
}
};

export { SearchBar };
