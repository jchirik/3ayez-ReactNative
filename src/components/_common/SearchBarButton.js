import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { strings, translate } from '../../i18n';
import { AyezText } from '.';
import { Actions } from 'react-native-router-flux';
import colors from '../../theme/colors';
import images from '../../theme/images';
import Camera from 'react-native-camera';

import { sceneKeys, navigateTo } from '../../router';

class SearchBarButton extends React.Component {
  render() {
    const {
      style,
      width = '70%',
      displayName = '',
      fullName = ''
    } = this.props;
    let placeHolder = '';
    if (fullName !== '') {
      placeHolder = translate(fullName);
    } else if (displayName !== '') {
      placeHolder = strings('StoreSearch.placeholder', {
        seller_name: translate(displayName)
      });
    }
    return (
      <TouchableOpacity
        style={[styles.searchBar, { width }, style]}
        onPress={() => {
          navigateTo(sceneKeys.storeSearch);
        }}
      >
        <Image
          source={images.magnifying2Icon}
          resizeMode={'contain'}
          style={styles.searchBarImage}
        />
        <AyezText regular numberOfLines={1} style={styles.searchBarText}>
          {placeHolder}
        </AyezText>
        <TouchableOpacity
          onPress={() => {
            navigateTo(sceneKeys.BarcodeScanner);
          }}
        >
          <Image
            source={images.barcodeImage}
            resizeMode={'contain'}
            style={styles.barcodeImage}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = {
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.borderGrey,
    height: 40,
    width: '70%',
    borderRadius: 5
  },
  barcodeImage: {
    height: 22,
    width: 22,
    marginVertical: 6,
    marginRight: 12,
    marginLeft: 20,
    tintColor: colors.black
  },
  searchBarImage: {
    height: 20,
    width: 20,
    marginLeft: 12,
    marginRight: 5,
    tintColor: colors.borderGrey
  },
  searchBarText: {
    flex: 1,
    fontSize: 12,
    color: colors.steel
  }
};

export { SearchBarButton };
