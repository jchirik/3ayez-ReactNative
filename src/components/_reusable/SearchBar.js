import React from 'react';
import { Image, TextInput, TouchableOpacity, View, I18nManager } from 'react-native';

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
  onQueryDidChange,
  onSubmitEditing
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
          tintColor: 'black'
        }}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
  if (searchQuery === '') {
    clearButton = <View style={{ width: 20 }} />;
  }

  const input = (
    <TextInput
      ref={c => reference(c)}
      style={[
        styles.searchPlaceholderText,
        {
          color: 'black',
          textAlign: (I18nManager.isRTL ? 'right' : 'left'),
         }]}
      placeholder={placeholder}
      onFocus={onFocus}
      placeholderTextColor={'#8e8e93'}
      value={searchQuery}
      onChangeText={text => onQueryDidChange(text)}
      autoCapitalize={'none'}
      underlineColorAndroid="transparent"
      blurOnSubmit={true}
      returnKeyType="search"
      onSubmitEditing={onSubmitEditing}
    />
  );

  const searchImage = (
    <Image
      source={icon}
      style={{
        width: 22,
        height: 22,
        tintColor: color
      }}
    />
  );

  return (
    <View style={[styles.bar, containerStyle]}>
      {searchImage}
      {input}
    </View>
  );
};

const styles = {
  bar: {
    height: 40,
    padding: 10,
    paddingTop: 4,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  searchPlaceholderText: {
    flex: 1,
    position: 'relative',
    fontSize: 12,
    marginLeft: 8,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    letterSpacing: 0.28,
    fontFamily: 'Poppins-Regular',
    padding: 0
  }
};

export { SearchBar };
