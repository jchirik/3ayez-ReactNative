import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import { StyleSheet, Platform } from 'react-native';
import { STATUS_BAR_HEIGHT } from '../../Helpers';

export default StyleSheet.create({
  screenContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    resizeMode: 'cover',
    backgroundColor: colors.white
  },
  container: { flex: 1, backgroundColor: colors.white },
  searchBarContainer: {
    paddingTop: STATUS_BAR_HEIGHT,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.paleGrey
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '4%',
    height: 40,
    marginRight: '3%'
  },
  backButtonImage: { width: 28, height: 28, tintColor: colors.greenBlue },
  headerContainer: {
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: colors.borderGrey,
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowOffset: {
          width: 0,
          height: 0
        }
      },
      android: {
        borderTopColor: 'transparent',
        borderWidth: 0.5,
        borderColor: colors.borderGrey
      }
    })
  },
  categoryList: {
    height: 56,
    backgroundColor: colors.paleGrey
  },
  categoryListContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noItemAvailableText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center'
  },
  subcategoryItemsFooter: { flex: 1, height: 100 },
  activityIndecator: { height: 40, flex: 1, marginTop: 100 },
  categoryItemText: {
    marginHorizontal: 5,
    flex: 1,
    color: colors.greenBlue,
    fontWeight: '300',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0.24,
    color: colors.greenBlue
  },
  categoryItemContainer: {
    height: 29,
    minWidth: 97,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderColor: colors.greenBlue,
    borderWidth: 1
  },
  tinyPhoto: { height: 70, width: 70 },
  subcategoryContainer: {
    height: 200,
    backgroundColor: colors.white,
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: colors.borderGrey,
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowOffset: {
          width: 0,
          height: 0
        }
      },
      android: {
        elevation: 1,
        borderWidth: 0.5,
        borderColor: colors.borderGrey
      }
    })
  },
  tinyPhotoColumn: {
    width: '100%',
    marginTop: 30,
    margin: 20,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between'
  },
  subcategoryContainerShadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.borderGrey,
        shadowOpacity: 1,
        shadowRadius: 0.5,
        shadowOffset: {
          width: 0,
          height: 0
        }
      }
    })
  },
  subcategoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 68,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: colors.borderGrey,
        shadowOpacity: 1,
        shadowRadius: 1,
        shadowOffset: {
          width: 0,
          height: 0
        }
      }
    }),
    backgroundColor: colors.paleGrey,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20
  },
  viewCorridorContainer: { position: 'absolute', right: 0 },
  viewCorridorText: {
    color: colors.greenBlue,
    marginRight: 20
  },
  subcategoryHeaderText: {
    lineHeight: 41,
    letterSpacing: 0.33,
    color: colors.steel
  },
  basketButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginLeft: '3.5%',
    marginRight: '7.5%'
  },
  basketButtonImage: { width: 28, height: 28, tintColor: colors.greenBlue }
});
