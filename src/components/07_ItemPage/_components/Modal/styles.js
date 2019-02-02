import { StyleSheet } from 'react-native';
import colors from '../../../../theme/colors';

export default StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modal: {
    backgroundColor: colors.white,
    height: 300,
    width: 335,
    alignItems: 'center',
    borderRadius: 12
  },
  image: { width: 200, height: 140, marginTop: 20 },
  confirmationContainer: {
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
    alignItems: 'center'
  },
  title: { textAlign: 'center', marginTop: 10 },
  divider: {
    width: '100%'
  },
  confirmationText: { fontSize: 16, marginTop: 15, color: colors.tealish }
});
