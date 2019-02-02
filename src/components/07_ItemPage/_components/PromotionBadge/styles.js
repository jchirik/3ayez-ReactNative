import { StyleSheet } from 'react-native';
import colors from '../../../../theme/colors';

export default StyleSheet.create({
  savingsPercentContainer: {
    position: 'absolute',
    top: 10,
    left: 20,
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: colors.fadedRed,
    justifyContent: 'center'
  },
  savingsPercent: {
    fontSize: 20,
    color: 'white',
    backgroundColor: colors.transparent
  }
});
