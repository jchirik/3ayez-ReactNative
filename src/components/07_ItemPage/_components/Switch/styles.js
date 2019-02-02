import { StyleSheet } from 'react-native';
import colors from '../../../../theme/colors';

export const switchTouchableOpacity = 0.9;
const tintSize = 26;
const padding = 1;
const width = 2 * (tintSize + padding);
const height = tintSize + 2 * padding;
const commonFontStyling = { fontSize: 10, marginTop: 4 };

export default (styles = StyleSheet.create({
  container: {
    width,
    height,
    borderRadius: tintSize,
    padding,
    flexDirection: 'row'
  },
  tint: {
    width: tintSize,
    height: tintSize,
    borderRadius: tintSize,
    backgroundColor: colors.white
  },
  confirmation: {
    ...commonFontStyling,
    marginLeft: -18
  },
  decline: {
    ...commonFontStyling,
    marginLeft: 7
  }
}));

export const getSwitchStyle = isOn => [
  styles.container,
  {
    backgroundColor: isOn ? colors.greenBlue : colors.fadedRed
  }
];

export const getTintStyle = isOn => [
  styles.tint,
  {
    transform: [
      {
        translateX: isOn ? tintSize : 0
      }
    ]
  }
];

export const getConfirmationStyle = isOn => [
  styles.confirmation,
  {
    color: isOn ? colors.white : 'transparent'
  }
];

export const getDeclineStyle = isOn => [
  styles.decline,
  {
    color: isOn ? 'transparent' : colors.white
  }
];
