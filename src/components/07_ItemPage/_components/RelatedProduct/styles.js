import { StyleSheet } from 'react-native';
import colors from '../../../../theme/colors';
import fonts from '../../../../theme/fonts';

export const activeOpacity = 0.9;

export default StyleSheet.create({
  container: {
    height: 250,
    marginLeft: 20,
    marginRight: 5,
    width: 110
  },
  image: {
    height: 150,
    width: '100%'
  },
  price: {
    fontFamily: fonts.poppinsMedium,
    color: colors.black,
    fontSize: 15
  },
  name: {
    fontFamily: fonts.poppinsExtraLight,
    color: colors.black,
    fontSize: 11
  }
});
