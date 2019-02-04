import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { strings, translate } from '../../i18n';
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
      <View style={[styles.searchBar, { width }, style]}>
        <Image source={searchBarImage} style={styles.searchBarImage} />
        <TouchableOpacity
          style={styles.container}
          onPress={() => {
            Actions.storeSearch();
          }}
        >
          <Text numberOfLines={1} style={styles.searchBarText}>
            {placeHolder}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: { flex: 1, backgroundColor: colors.white, marginRight: 5 },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.borderGrey,
    height: 40,
    width: '70%',
    borderRadius: 5,
  },
  searchBarImage: {
    marginVertical: 20,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
    tintColor: colors.borderGrey
  },
  searchBarText: {
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 12,
    marginRight: 5,
    lineHeight: 41,
    color: colors.steel
  },
  basketButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginLeft: '3.5%',
    marginRight: '7.5%'
  }
};

export { SearchBarButton };
