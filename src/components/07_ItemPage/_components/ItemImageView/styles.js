import { StyleSheet } from 'react-native';
import colors from '../../../../theme/colors';
import { getScreenDimensions } from '../.././../../Helpers';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center'
  },
  image: { width: getScreenDimensions().width - 100, flex: 1 }
});
