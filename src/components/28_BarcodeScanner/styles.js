import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

const styles = StyleSheet.create({
  blockButtonText: { fontSize: 20 },
  blockButton: {
    width: '90%',
    marginVertical: 20
  },
  barcodeView: {
    margin: 10,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center'
  },
  barcodeImage: {
    height: 25,
    width: 25,
    tintColor: colors.black,
    marginHorizontal: 10
  },
  barcodeText: {
    fontSize: 20,
    color: colors.steel
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.borderGrey
  },
  container: {
    flex: 1
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  overlay: {
    position: 'absolute',
    padding: 10,
    right: 0,
    left: 0,
    alignItems: 'center'
  },
  topOverlay: {
    top: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  bottomOverlay: {
    bottom: 0,
    height: 80,
    backgroundColor: colors.whiteGrey,
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBarText: {
    fontSize: 12,
    color: colors.steel
  }
});

export default styles;
