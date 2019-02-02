import { Dimensions } from 'react-native';
import { isIPhoneX } from '../Helpers';

const { height, width } = Dimensions.get('window');
const screenWidth = width;
const screenHeight = height;

const iPhoneXHomeIndicatorMargin = isIPhoneX() ? 20 : 0;

const platform = {
  iPhoneXHomeIndicatorMargin,
  screenWidth,
  screenHeight,
};

export default platform;
