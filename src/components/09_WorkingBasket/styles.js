import { StyleSheet } from 'react-native';
import { STATUS_BAR_HEIGHT, isIPhoneX } from '../../Helpers.js';
import colors from '../../theme/colors';

const styles = StyleSheet.create({
  // header components
  headerContainer: {
    borderBottomWidth: 1,
    borderColor: '#E9E9E9'
  },
  headerDetailsContainer: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10
  },
  callButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + 60,
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
    paddingBottom: isIPhoneX() ? 30 : 14,
    paddingTop: 10,
    paddingHorizontal: 20,
  },

  clearOrderTextStyle: {
    textAlign: 'center',
  },
  emptyCartStyle: {
    fontSize: 18,
    textAlign: 'center',
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
  basketContainer: {
    width: '100%',
    height: 60 + STATUS_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backbutton: {
    position: 'absolute',
    right: 15,
    top: 5 + STATUS_BAR_HEIGHT,
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
    marginTop: 16,
    fontSize: 15,
    color: '#353333'
  },
  emptyBasketSubtitle: {
    marginTop: 4,
    fontSize: 12,
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
    backgroundColor: '#e7e7e7'
  },
  clearBasketTitle: {
    color: '#353333',
    textAlign: 'center',
    width: 200,
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
