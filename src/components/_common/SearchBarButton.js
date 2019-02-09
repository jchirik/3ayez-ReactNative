import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { strings, translate } from '../../i18n';
import { AyezText } from '.'
import { Actions } from 'react-native-router-flux';
import colors from '../../theme/colors';
import searchBarImage from '../../../assets/images_v2/search.png';

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
      placeHolder = strings('StoreSearch.placeholder', { seller_name: translate(displayName) });
    }
    return (
      <TouchableOpacity
        style={[styles.searchBar, { width }, style]}
        onPress={() => {
          Actions.storeSearch();
        }}
      >
          <Image
            source={searchBarImage}
            resizeMode={'contain'}
            style={styles.searchBarImage}
            />
          <AyezText regular numberOfLines={1} style={styles.searchBarText}>
            {placeHolder}
          </AyezText>
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
    borderRadius: 5,
    paddingRight: 40
  },
  searchBarImage: {
    height: 28,
    width: 28,
    marginLeft: 5,
    marginRight: 4,
    tintColor: colors.borderGrey
  },
  searchBarText: {
    fontSize: 12,
    color: colors.steel
  }
};

export { SearchBarButton };
