import colors from '../../theme/colors';
import fonts from '../../theme/fonts';
import { StyleSheet, Platform } from 'react-native';
import { statusBarMargin } from '../../Helpers';

export default StyleSheet.create({
  headerContainer: { marginTop: 14, marginLeft: 20 },
  container: {
    flex: 1,
    backgroundColor: colors.paleGrey,
    justifyContent: 'space-between'
  },
  header: { height: 242 + statusBarMargin, paddingTop: statusBarMargin },
  headerTitle: {
    width: 168,
    opacity: 0.9,
    fontFamily: fonts.poppinsSemiBold,
    fontSize: 11,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 32,
    letterSpacing: 0.7,
    color: colors.white,
    opacity: 0.9
  },
  headerMessage: {
    width: 176,
    fontFamily: fonts.poppinsMedium,
    fontSize: 22,
    fontWeight: '500',
    fontStyle: 'normal',
    lineHeight: 26,
    letterSpacing: 0.4,
    color: colors.white
  },
  divider: {
    marginTop: 58
  },
  addButton: {
    marginTop: 12
  },
  incrementButton: {
    marginTop: 12,
    marginBottom: 12,
    elevation: 0,
    borderWidth: 1,
    width: 174,
    height: 48,
    borderRadius: 12,
    borderColor: colors.warmGrey
  },
  addButtonTextStyle: {
    color: colors.white
  },
  footerStyle: {
    height: 140
  },
  footerButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  inputProductContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  productNameInputLabel: {
    marginLeft: 20,
    width: 170,
    height: 41,
    fontSize: 14,
    lineHeight: 41,
    letterSpacing: 0.17,
    color: colors.black,
    fontFamily: fonts.poppinsMedium
  },
  productDetailsInputLabel: {
    marginLeft: 20,
    width: 170,
    height: 41,
    fontSize: 14,
    lineHeight: 41,
    letterSpacing: 0.17,
    color: colors.black,
    fontFamily: fonts.poppinsMedium
  },
  additionalInstructionsTextInputStyle: {
    flex: 1,
    marginRight: 20,
    fontSize: 12
  },
  productDescriptionDivider: {
    marginTop: 31
  },
  tabContainerStyle: { height: 60, backgroundColor: colors.paleGrey },
  activeTabStyle: { backgroundColor: colors.paleGrey },
  tabStyle: {
    backgroundColor: colors.paleGrey,
    borderWidth: 0,
    borderColor: 'transparent'
  },
  tabTextStyle: {
    fontSize: 14,
    color: colors.steel,
    fontFamily: 'Poppins-Light',
    fontWeight: '400'
  },
  activeTextTabStyle: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'Poppins-Light',
    fontWeight: '400'
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 29 + statusBarMargin,
    right: 20
  },
  closeButtonImage: {
    width: 28,
    height: 28
  },
  bottomIndicator: {
    height: 3,
    backgroundColor: colors.greenBlue,
    marginTop: -3.5
  }
});

export const TIPlaceholderColor = colors.steel;
