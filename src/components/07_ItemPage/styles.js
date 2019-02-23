import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import { statusBarMargin } from '../../Helpers.js';

export default StyleSheet.create({
  divider: {
    marginTop: 30,
    marginBottom: 10
  },
  addButton: {
    marginTop: 12
  },
  container: { flex: 1, backgroundColor: colors.white },
  itemImageStyle: {
    width: 120,
    height: 120,
    margin: 20
  },
  additionalInstructionsContainer: {
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  additionalInstructionsText: { color: colors.black, fontSize: 15 },
  additionalInstructionsTextInputStyle: { fontSize: 15 },
  callMeContainer: {
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  callMeTextStyle: { color: 'black', fontSize: 15 },
  shareIconStyle: {
    position: 'absolute',
    right: 23,
    top: statusBarMargin + 10,
    width: 16,
    height: 23
  },
  relatedProductsText: {
    marginLeft: 15
  },
  relatedProducts: {
    marginTop: 50
  }
});

export const additionalInstructionsTextInputPlaceholderColor = colors.steel;
