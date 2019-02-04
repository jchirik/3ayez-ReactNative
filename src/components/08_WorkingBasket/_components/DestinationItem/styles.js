import { StyleSheet } from 'react-native';
import colors from '../../../../theme/colors';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 12,
    borderBottomColor: '#97979722',
    borderBottomWidth: 1
  },
  detailContainer: { flex: 1, marginRight: 20 },
  destinationTypeContainer: { flexDirection: 'row', alignItems: 'center' },

  destinationTypeImage: { width: 22, height: 22, marginLeft: 22 },
  destinationTypeTitle: {
    fontSize: 12,
    color: colors.darkGrayishRed,
    minWidth: 105
  },
  destinationName: {
    fontSize: 18,
    color: colors.darkGrayishRed
  },
  destinationAddress: {
    fontSize: 14,
    color: colors.darkGrayishRed
  },
  destinationAddressImage: {
    width: 90,
    height: 65,
    marginRight: 10
  }
});

export default styles;
