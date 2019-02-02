import { StyleSheet } from 'react-native';
import { statusBarMargin } from '../../Helpers.js';
import colors from '../../theme/colors';

const styles = StyleSheet.create({
  // header components
  headerContainer: {
    borderBottomWidth: 1,
    borderColor: '#E9E9E9'
  },
  headerDetailsContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10
  },
  callButton: {
    position: 'absolute',
    top: statusBarMargin + 60,
    left: 12,
    borderRadius: 30,
    height: 45,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f5fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  callButtonText: {
    color: '#fff',
    fontSize: 15
  },

  addressContainer: {
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderColor: '#E9E9E9',
    padding: 14,
    paddingTop: 10,
    paddingBottom: 10
  },

  submitButtonContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 14,
    paddingTop: 10,
    paddingHorizontal: 20
  },

  clearOrderTextStyle: {
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 14,
    color: colors.black
  },
  emptyCartStyle: {
    fontSize: 18,
    textAlign: 'center',
    color: 'black',
    marginTop: 25,
    flex: 1
  },
  addAddress: {
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E9E9E9',
    justifyContent: 'center',
    height: 80
  },
  basketContatiner: {
    width: '100%',
    height: 60 + statusBarMargin,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backbutton: {
    position: 'absolute',
    right: 15,
    top: 5 + statusBarMargin,
    bottom: null,
    left: null,
    width: null,
    padding: 15
  },
  backIcon: {
    width: 12,
    height: 12
  },
  emptyBasket: {
    marginTop: 20,
    marginBottom: 36,
    padding: 4,
    width: 130,
    alignSelf: 'center'
  },
  emptyBasketContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyBasketTitle: {
    marginTop: 14,
    fontFamily: 'Poppins',
    fontSize: 14,
    color: '#353333'
  },
  emptyBasketSubtitle: {
    marginTop: 10,
    fontFamily: 'Poppins',
    fontSize: 10,
    color: '#8e8e93'
  },
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  },
  blurView: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  },
  opaqueBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#898989'
  },
  clearBasketTitle: {
    color: '#353333',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 13,
    marginBottom: 36
  },
  itemsList: { flex: 1, backgroundColor: 'white' },
  clearBasketContainer: { alignItems: 'center', padding: 25 },
  clearBasketImage: { width: 165, height: 164, marginBottom: 20 },
  dontClearButton: { backgroundColor: '#fe6668', marginBottom: 16 },
  clearButton: { backgroundColor: colors.greenBlue },
  minTotalTitle: { fontSize: 18, textAlign: 'center' }
});

export default styles;
