import { StyleSheet, Dimensions, Platform } from 'react-native';
import colors from '../../../theme/colors';

const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 88;
const SCROLL_HEIGHT = PARALLAX_HEADER_HEIGHT - STICKY_HEADER_HEIGHT;

const styles = StyleSheet.create({
  categoryCardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  categoryCard: {
    backgroundColor: colors.whiteGrey,
    width: '100%',
    height: '100%'
  },
  categoryImage: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    borderRadius: 10
  },
  categoryText: {
    position: 'absolute',
    bottom: 12,
    left: 10
  },
  categoryList: {
    flex: 1
  },
  segmented_control_view_style: {
    flex: 1,
    backgroundColor: '#FAFCFD'
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFCFD'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    width: 300,
    justifyContent: 'flex-end'
  },
  stickySectionText: {
    color: 'white',
    fontSize: 20,
    margin: 10
  },
  fixedSection: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  fixedSectionText: {
    color: '#999',
    fontSize: 20
  },
  parallaxHeader: {
    paddingTop: 12,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  },
  searchBarSectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.25)',
    height: 40,
    borderRadius: 5,
    marginTop: 10,
    marginHorizontal: 20
  },
  searchIconStyle: {
    padding: 10,
    marginVertical: 5,
    marginLeft: 20,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
    tintColor: 'rgba(0, 0, 0, 0.25)'
  },
  separatorViewStyle: { height: 0.5, backgroundColor: 'rgba(0, 0, 0, 0.15)' },
  featuredRowStyle: {
    backgroundColor: '#F2F2F2',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  sectionHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20
  },
  horizontalListViewStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)'
  },
  emptyListContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: window.width
  },
  emptyListTextStyle: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
    fontSize: 20
  },
  endOfScrollImageStyle: {
    backgroundColor: 'rgb(250, 252, 253)',
    width: '60%',
    height: 179
  },
  typeNewProductTextStyle: {
    fontSize: 14,
    fontFamily: 'Poppins-Light',
    color: '#353333',
    textAlign: 'center',
    letterSpacing: 0.35,
    fontWeight: '400'
  },
  typeNewProductSubTextStyle: {
    fontSize: 10,
    fontFamily: 'Poppins-Light',
    color: 'rgb(142, 142, 147)',
    letterSpacing: 0.24,
    fontWeight: '400'
  },
  storeImageBackGroundStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: window.width,
    height: STICKY_HEADER_HEIGHT
  },
  basketQuantityBadgeTextStyle: {
    position: 'absolute',
    height: 17,
    width: 17,
    borderRadius: 17,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    top: -10,
    right: -5
  },
  basketIconStyle: {
    position: 'absolute',
    width: 22,
    height: 22,
    top: 19,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButton: {
    position: 'absolute',
    width: 22,
    height: 22,
    top: 19,
    left: 15,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;
