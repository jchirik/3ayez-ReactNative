import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import { StyleSheet, Platform } from 'react-native';
import { STATUS_BAR_HEIGHT } from '../../Helpers';
import platform from '../../utils/platform';

export default StyleSheet.create({
  itemCell: {
    flex: 1,
    marginTop: platform.screenHeight * 0.01,
    marginBottom: platform.screenHeight * 0.01,
    justifyContent: 'space-between'
  },
  container: { flex: 1, backgroundColor: colors.paleGrey },
  headerContainer: {
    height: 60,
    marginTop: STATUS_BAR_HEIGHT,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.paleGrey
  },
  backButton: {
    marginHorizontal: 10,
    position: 'relative',
    top: null,
    bottom: null,
    right: null,
    left: null,
    alignSelf: 'stretch'
  },
  headerCategoryText: { fontSize: 18, marginBottom: 5 },
  headerBackText: { fontSize: 14 },
  magnifyingImage: {
    marginRight: 20,
    width: 22,
    height: 22,
    tintColor: '#2dd38f'
  },
  emptyComponentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: window.width
  },
  emptyComponentText: {
    color: 'black',
    fontSize: 20
  }
});
