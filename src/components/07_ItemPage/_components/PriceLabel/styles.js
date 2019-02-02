import { StyleSheet } from 'react-native';
import colors from '../../../../theme/colors';

export default StyleSheet.create({
  previousPrice: {
    fontSize: 15,
    color: colors.black,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginRight: 8,
    backgroundColor: colors.transparent
  },
  priceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 2,
    backgroundColor: colors.transparent
  },
  mainPrice: {
    fontSize: 13,
    lineHeight: 22,
    color: colors.black,
    backgroundColor: colors.transparent
  }
});
