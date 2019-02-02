import { StyleSheet } from 'react-native';
import colors from '../../../../theme/colors';

export const trackColor = colors.whiteGrey;
export const tintColor = colors.greenBlue;

export default StyleSheet.create({
  trackStyle: {
    backgroundColor: trackColor,
    height: 3,
  },
  thumpStyle: {
    width: 15,
    height: 15,
  },
  itemsStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export const getItemStyle = (value, item) => {
  if (value < -0.5) {
    value = -1;
  } else if (value >= -0.5 && value <= 0.5) {
    value = 0;
  } else {
    value = 1;
  }
  if (value == item) {
    return { color: colors.greenBlue, width: 70, textAlign: 'center' };
  } else {
    return { color: colors.black, width: 70, textAlign: 'center' };
  }
};
