import { StyleSheet, I18nManager } from 'react-native';
import colors from '../../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFD'
  },
  verificationInstructionText: {
    fontSize: 14,
    marginTop: 22,
    marginLeft: 26,
    marginBottom: 10,
    alignSelf: 'flex-start'
  },
  confirmButton: {
    marginTop: 32,
    marginLeft: 18,
    marginRight: 18,
    marginBottom: 30
  },
  digitSquare: {
    height: 64,
    width: 46,
    margin: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  digitText: { fontSize: 26 },
  verificationCodeContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center'
  },
  verificationCodeText: {
    position: 'absolute',
    color: 'transparent',
    opacity: 0,
    backgroundColor: 'transparent',
    fontSize: 1
  },
  robocalButtonContainer: { alignItems: 'center' },
  robocallWaitingText: { alignSelf: 'center' },
  loadingIndicator: { padding: 20, alignSelf: 'center' },
  robocalButton: { padding: 10 }
});

export default styles;
