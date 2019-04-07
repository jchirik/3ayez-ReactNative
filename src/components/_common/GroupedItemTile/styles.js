import { StyleSheet, Platform } from 'react-native';
import colors from '../../../theme/colors';
const Image_HEIGHT_RATIO = '57%';

const styles = StyleSheet.create({
  constainer: {
    backgroundColor: colors.white,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: colors.warmGrey,
        shadowOpacity: 0.25,
        shadowRadius: 5
      },
      android: {
        elevation: 2
      }
    }),
    flex: 1
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1
  },
  itemCellContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    zIndex: 100,
    paddingVertical: 8
  },
  itemImageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: Image_HEIGHT_RATIO,
    width: '100%'
  },
  descriptionText: { textAlign: 'center', paddingHorizontal: 15 }
});

export default styles;
