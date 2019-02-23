import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  modalBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute'
  },
  whitePanel: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 14
  },
  smallButtonContainer: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    padding: 2,
    paddingLeft: 9,
    paddingRight: 9
  },
  smallButtonText: {
    fontSize: 18
  },
  buttonsContainer: { marginHorizontal: 24, marginBottom: 12, marginTop: 36 }
});

export default styles;
