import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import { STATUS_BAR_HEIGHT } from '../../Helpers';

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    height: 60,
    marginTop: STATUS_BAR_HEIGHT,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  headerTextContainer: { flex: 1, alignItems: 'center' },
  magnifyingImage: {
    marginRight: 20,
    width: 22,
    height: 22,
    tintColor: colors.whiteGrey
  },
  productImage: {
    marginTop: 10,
    marginBottom: 30,
    width: 100,
    height: 100,
    alignSelf: 'center'
  },
  footerContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute'
  },
  separator: {
    backgroundColor: colors.borderGrey,
    height: 1
  },
  cheapestContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    backgroundColor: colors.fadedRed,
    borderRadius: 10,
    paddingHorizontal: 8
  },
  itemListHeader: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemListHeaderImage: {
    height: 50,
    width: 50,
    marginLeft: 'auto'
  },
  itemRow: { height: 60 },
  itemRowContainer: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemRowImage: { height: 40, width: 40 },
  itemTextContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    flex: 1,
    marginLeft: 25,
    marginRight: 5
  },
  ItemIncrementer: { height: 25, width: 100, marginLeft: 'auto' },
  itemList: {
    backgroundColor: colors.white,
    marginHorizontal: 12,
    borderRadius: 10
  }
});

export default styles;
